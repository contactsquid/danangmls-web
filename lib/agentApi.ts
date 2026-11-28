// Machine-readable access to DaNangMLS for AI assistants (ChatGPT, Claude, Perplexity,
// Gemini and their agents). Shared by the REST feed (/api/v1/*) and the MCP endpoint (/mcp).
// Read-only. Deliberately exposes NO scraped phone numbers: contact goes through the
// listing page, which applies the site's contact rules (agentContact.ts).
import { getListings, getForSaleListings } from './sheets';
import { getAgentProfiles, getAgentListingCounts } from './agents';
import { priceLow, convertPriceToVND, VND_RATE } from './price';
import { canonicalType } from './propertyTypes';
import { DISTRICTS } from './districts';
const DISTRICT_LIST = Object.keys(DISTRICTS);
import type { Listing } from './types';

export const SITE = 'https://danangmls.com';
export const MAX_LIMIT = 50;

export interface SearchParams {
  mode?: 'rent' | 'sale';
  district?: string;
  type?: string;
  bedrooms?: number;      // exact; 0 = studio
  minBedrooms?: number;
  minPriceUsd?: number;
  maxPriceUsd?: number;
  q?: string;
  limit?: number;
  offset?: number;
}

const fold = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').toLowerCase().trim();
const bedsOf = (l: Listing): number | null => {
  const b = (l.bedrooms || '').trim().toLowerCase();
  if (!b) return null;
  if (b.startsWith('studio')) return 0;
  const n = parseInt(b, 10);
  return Number.isFinite(n) ? n : null;
};

export function publicListing(l: Listing, full = false) {
  const usd = priceLow(l.price);
  return {
    id: l.slug,
    url: `${SITE}/listing/${l.slug}`,
    title: l.title,
    mode: l.forSale ? 'sale' : 'rent',
    type: canonicalType(l.type, l.forSale) || null,
    price: l.price || null,
    priceUsd: usd || null,
    priceVnd: l.price ? convertPriceToVND(l.price) : null,
    pricePeriod: l.forSale ? 'total' : 'month',
    district: l.district || null,
    neighborhood: l.neighborhood || null,
    bedrooms: bedsOf(l),
    foreignOwnershipEligible: l.forSale ? !!l.foreignEligible : undefined,
    listedDate: l.date || null,
    images: l.images.slice(0, full ? 10 : 2),
    description: full ? l.text : (l.text || '').slice(0, 280),
    listingAgent: l.agent || null,
    contact: `Open ${SITE}/listing/${l.slug} for the agent contact and enquiry form.`,
  };
}

export async function searchListings(p: SearchParams) {
  const mode = p.mode === 'sale' ? 'sale' : 'rent';
  const all = mode === 'sale' ? await getForSaleListings() : await getListings();
  const d = p.district ? fold(p.district) : '';
  const t = p.type ? canonicalType(p.type, mode === 'sale').toLowerCase() : '';
  const q = p.q ? fold(p.q) : '';
  const hits = all.filter(l => {
    if (d && fold(l.district) !== d && !fold(l.neighborhood || '').includes(d) && !fold(l.title).includes(d)) return false;
    if (t && canonicalType(l.type, l.forSale).toLowerCase() !== t) return false;
    const b = bedsOf(l);
    if (p.bedrooms !== undefined && b !== p.bedrooms) return false;
    if (p.minBedrooms !== undefined && (b === null || b < p.minBedrooms)) return false;
    const usd = priceLow(l.price);
    if (p.minPriceUsd !== undefined && (!usd || usd < p.minPriceUsd)) return false;
    if (p.maxPriceUsd !== undefined && (!usd || usd > p.maxPriceUsd)) return false;
    if (q && !fold(`${l.title} ${l.text} ${l.neighborhood} ${l.district}`).includes(q)) return false;
    return true;
  });
  const limit = Math.min(Math.max(p.limit ?? 10, 1), MAX_LIMIT);
  const offset = Math.max(p.offset ?? 0, 0);
  return {
    city: 'Da Nang, Vietnam',
    mode,
    total: hits.length,
    offset,
    limit,
    results: hits.slice(offset, offset + limit).map(l => publicListing(l)),
    notes: `Prices are USD (VND at ${VND_RATE}/USD). Rent is per month. Browse: ${SITE}/for-${mode === 'sale' ? 'sale' : 'rent'}`,
  };
}

export async function getListingBySlug(slug: string) {
  const [r, s] = await Promise.all([getListings(), getForSaleListings()]);
  const l = [...r, ...s].find(x => x.slug === slug);
  return l ? publicListing(l, true) : null;
}

export async function listDistricts() {
  const [r, s] = await Promise.all([getListings(), getForSaleListings()]);
  const rent = new Map<string, number>(), sale = new Map<string, number>();
  for (const l of r) rent.set(l.district, (rent.get(l.district) ?? 0) + 1);
  for (const l of s) sale.set(l.district, (sale.get(l.district) ?? 0) + 1);
  return DISTRICT_LIST.map(d => ({ district: d, rentals: rent.get(d) ?? 0, forSale: sale.get(d) ?? 0 }));
}

export async function findAgents(limit = 20) {
  const { profiles, counts } = await (async () => { const all = await getAgentProfiles(); const counts = await getAgentListingCounts(all); return { profiles: all.filter(x => (counts.get(x.slug) ?? 0) > 0), counts }; })();
  return profiles
    .map(p => ({
      name: p.display_name,
      url: `${SITE}/agent/${p.slug}`,
      workplace: p.workplace || null,
      verified: p.verified,
      activeListings: counts.get(p.slug) ?? 0,
      bio: (p.bio || '').slice(0, 300) || null,
      // Present only when the agent ticked WhatsApp/Zalo, i.e. consented to publish it.
      phone: p.phone || null,
      whatsapp: p.has_whatsapp,
      zalo: p.has_zalo,
    }))
    .sort((a, b) => Number(b.verified) - Number(a.verified) || b.activeListings - a.activeListings)
    .slice(0, Math.min(Math.max(limit, 1), MAX_LIMIT));
}

const num = (v: unknown): number | undefined => {
  if (v === null || v === undefined || v === '') return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
};
export function paramsFrom(get: (k: string) => unknown): SearchParams {
  const mode = String(get('mode') ?? get('type_of_listing') ?? '').toLowerCase();
  return {
    mode: mode === 'sale' || mode === 'buy' ? 'sale' : 'rent',
    district: (get('district') as string) || undefined,
    type: (get('property_type') as string) || undefined,
    bedrooms: num(get('bedrooms')),
    minBedrooms: num(get('min_bedrooms')),
    minPriceUsd: num(get('min_price_usd')),
    maxPriceUsd: num(get('max_price_usd')),
    q: (get('q') as string) || undefined,
    limit: num(get('limit')),
    offset: num(get('offset')),
  };
}
