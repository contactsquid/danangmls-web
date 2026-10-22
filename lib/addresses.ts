// Street addresses Blake posts by hand in the Telegram group "Home MLS Details".
// ~/.openclaw/scripts/publish-home-addresses.js turns those posts into
// R2 addresses/index.json: { "<address-slug>": { address, slugs: [listing slugs, newest first], slug } }
// (`slug` = the newest, kept for the old reader).
import { canonicalType } from './propertyTypes';
import type { Listing } from './types';

const INDEX_URL = 'https://images.danang.homes/addresses/index.json';

async function loadIndex(): Promise<Record<string, unknown>> {
  try {
    const res = await fetch(INDEX_URL, { next: { revalidate: 300 } });
    if (res.ok) return (await res.json()) as Record<string, unknown>;
  } catch { /* best-effort: a miss just 404s the address page */ }
  return {};
}

/** One street address and every listing of it over time, newest first (its property history). */
export type AddressEntry = { address: string; slugs: string[] };
type RawEntry = { address?: unknown; slug?: unknown; slugs?: unknown };

/** Reads both shapes: the old { slug, address } and the history { slugs: [...], address }. */
function normalize(raw: RawEntry | undefined): AddressEntry | null {
  if (!raw || typeof raw.address !== 'string') return null;
  const slugs = Array.isArray(raw.slugs) ? raw.slugs.filter((x): x is string => typeof x === 'string')
    : typeof raw.slug === 'string' ? [raw.slug] : [];
  return slugs.length ? { address: raw.address, slugs } : null;
}

export async function getAddressEntry(addrSlug: string): Promise<AddressEntry | null> {
  return normalize((await loadIndex() as Record<string, RawEntry>)[addrSlug]);
}

/** Listing slug -> its address, so the listing page can link to the property history page. */
export async function getAddressForListing(listingSlug: string): Promise<(AddressEntry & { addrSlug: string }) | null> {
  const idx = await loadIndex() as Record<string, RawEntry>;
  for (const [addrSlug, raw] of Object.entries(idx)) {
    const e = normalize(raw);
    if (e && e.slugs.includes(listingSlug)) return { ...e, addrSlug };
  }
  return null;
}

export async function allAddressSlugs(): Promise<string[]> {
  return Object.keys(await loadIndex());
}

/** Homes live under /homedetails, land and commercial under /propertydetails. */
export function addressRoute(l: Pick<Listing, 'type' | 'forSale'>): 'homedetails' | 'propertydetails' {
  const t = canonicalType(l.type, l.forSale);
  return t === 'Land' || t === 'Commercial' ? 'propertydetails' : 'homedetails';
}
