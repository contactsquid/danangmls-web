// District x (property type | bedrooms) landing pages: /for-rent/district-2/apartment,
// /for-sale/binh-thanh/3-bedrooms. They target "apartments for rent in District 2" style
// searches (people and AI assistants). English only. A page with fewer than COMBO_MIN_INDEX
// matching listings is noindex and left out of the sitemap; with none at all it 404s.
import { resolveFacet, facetMatches, facetSlug, facetBase, type Facet, type Mode } from './facets';
import type { Lang } from './translations';
import { priceLow } from './price';
import type { Listing } from './types';

export const COMBO_MIN_INDEX = 5;
export const SITE_BASE = 'https://danangmls.com';
export const SITE_CITY_NAME = 'Da Nang';
export const SITE_BRAND = 'DanangMLS';

export interface Combo { district: string; sub: Facet }

export function resolveCombo(districtSlug: string, subSlug: string): Combo | null {
  const d = resolveFacet(districtSlug), s = resolveFacet(subSlug);
  if (!d || d.kind !== 'district') return null;
  if (!s || (s.kind !== 'type' && s.kind !== 'bedrooms')) return null;
  return { district: d.value, sub: s };
}

// vi uses its own path words and sub slugs (/vi/thue/quan-2/can-ho); ko/ru use the English ones under their prefix.
export const comboPath = (mode: Mode, c: Combo, lang: Lang = 'en') =>
  `${facetBase(mode, lang)}/${facetSlug({ kind: 'district', value: c.district }, lang)}/${facetSlug(c.sub, lang)}`;
export const comboUrl = (mode: Mode, c: Combo, lang: Lang = 'en') => SITE_BASE + comboPath(mode, c, lang);
export const comboMatches = (l: Listing, c: Combo) =>
  facetMatches(l, { kind: 'district', value: c.district }) && facetMatches(l, c.sub);

export const usd = (n: number) => '$' + Math.round(n).toLocaleString('en-US');
const PLURAL: Record<string, string> = { House: 'Houses', Apartment: 'Apartments', Villa: 'Villas', Land: 'Land', Commercial: 'Commercial Properties' };

function noun(sub: Facet): { tc: string; lc: string } {
  if (sub.kind === 'type') { const tc = PLURAL[sub.value] ?? `${sub.value}s`; return { tc, lc: tc.toLowerCase() }; }
  if (sub.value === 'studio') return { tc: 'Studio Apartments', lc: 'studio apartments' };
  return { tc: `${sub.value}-Bedroom Homes`, lc: `${sub.value}-bedroom homes` };
}

export function stats(listings: Listing[]) {
  const prices = listings.map(l => priceLow(l.price)).filter(n => n > 0).sort((a, b) => a - b);
  if (!prices.length) return null;
  const q = (p: number) => prices[Math.min(prices.length - 1, Math.floor(p * prices.length))];
  return { min: prices[0], median: q(0.5), p90: q(0.9), n: prices.length };
}

export function comboContent(mode: Mode, c: Combo, matches: Listing[]) {
  const { tc, lc } = noun(c.sub);
  const rent = mode === 'rent';
  const forX = rent ? 'for Rent' : 'for Sale', rentSale = rent ? 'for rent' : 'for sale';
  const st = stats(matches);
  const h1 = `${tc} ${forX} in ${c.district}, ${SITE_CITY_NAME}`;
  const priceBit = st ? ` From ${usd(st.min)}${rent ? '/month' : ''}, typically around ${usd(st.median)}${rent ? '/month' : ''}.` : '';
  return {
    h1, title: h1,
    subtitle: `Browse ${matches.length} ${lc} ${rentSale} in ${c.district}, ${SITE_CITY_NAME}, updated daily from local agents.`,
    description: `${matches.length} ${lc} ${rentSale} in ${c.district}, ${SITE_CITY_NAME}.${priceBit} Photos, prices and agent contact, updated daily on ${SITE_BRAND}.`,
  };
}

export function comboSeoBody(mode: Mode, c: Combo, matches: Listing[]) {
  const { tc, lc } = noun(c.sub);
  const rent = mode === 'rent';
  const rentSale = rent ? 'for rent' : 'for sale';
  const where = `${c.district}, ${SITE_CITY_NAME}`;
  const st = stats(matches);
  const per = rent ? ' per month' : '';
  const intro = [
    `${SITE_BRAND} lists **${matches.length} ${lc} ${rentSale} in ${where}**, collected from local agents and owners and refreshed daily.` +
      (st ? ` Asking prices run from **${usd(st.min)}** to **${usd(st.p90)}**${per}, with a typical listing around **${usd(st.median)}**${per} (USD; VND shown on each listing).` : ''),
    rent
      ? `Foreigners can rent in Vietnam with a passport and visa; a deposit of one to two months' rent is typical. Open a listing for the agent's contact details and enquiry form.`
      : `Foreigners can buy apartments in approved projects for up to 50 years, capped at 30% of the units in a building, and generally cannot own land outright. Open a listing for the agent's contact details and enquiry form.`,
  ];
  const faq: { q: string; a: string }[] = [
    { q: `How many ${lc} ${rentSale} in ${c.district} are listed right now?`, a: `${matches.length} at the moment, updated daily.` },
    ...(st ? [{ q: `How much do ${lc} ${rentSale} in ${c.district} cost?`, a: `Asking prices range from ${usd(st.min)} to ${usd(st.p90)}${per} (most listings), with a typical price around ${usd(st.median)}${per}. Prices are in USD at about 26,300 VND per dollar.` }] : []),
    { q: `Can foreigners ${rent ? 'rent' : 'buy'} ${lc} in ${c.district}?`, a: rent ? `Yes. Foreigners can rent any apartment, house or villa in Vietnam with a passport and visa.` : `Foreigners can buy apartments and condos in approved projects for up to 50 years (renewable once). They generally cannot own land outright.` },
  ];
  return { h2: `${tc} ${rent ? 'for Rent' : 'for Sale'} in ${c.district}`, intro, faqHeading: `${tc} ${rent ? 'for Rent' : 'for Sale'} in ${c.district}: FAQ`, faq };
}

const DISTRICT_PLACEHOLDER = /^(not provided|outside)/i;

/** Combos with at least `min` listings, for the sitemap and the internal-link block. */
export function combosWithInventory(listings: Listing[], districts: string[], min = COMBO_MIN_INDEX): Combo[] {
  const out: Combo[] = [];
  const subs: Facet[] = [
    ...['House', 'Apartment', 'Villa', 'Land', 'Commercial'].map(value => ({ kind: 'type', value }) as Facet),
    ...['studio', '1', '2', '3', '4', '5'].map(value => ({ kind: 'bedrooms', value }) as Facet),
  ];
  for (const district of districts) {
    if (DISTRICT_PLACEHOLDER.test(district)) continue;
    const inD = listings.filter(l => facetMatches(l, { kind: 'district', value: district }));
    if (inD.length < min) continue;
    for (const sub of subs) if (inD.filter(l => facetMatches(l, sub)).length >= min) out.push({ district, sub });
  }
  return out;
}
