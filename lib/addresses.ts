// Street addresses Blake posts by hand in the Telegram group "Home MLS Details".
// ~/.openclaw/scripts/publish-home-addresses.js turns those posts into
// R2 addresses/index.json: { "<address-slug>": { slug, address } } (slug = listing slug).
import { canonicalType } from './propertyTypes';
import type { Listing } from './types';

const INDEX_URL = 'https://images.danang.homes/addresses/index.json';

export type AddressEntry = { slug: string; address: string };

async function loadIndex(): Promise<Record<string, AddressEntry>> {
  try {
    const res = await fetch(INDEX_URL, { next: { revalidate: 300 } });
    if (res.ok) return (await res.json()) as Record<string, AddressEntry>;
  } catch { /* best-effort: a miss just 404s the address page */ }
  return {};
}

export async function getAddressEntry(addrSlug: string): Promise<AddressEntry | null> {
  const e = (await loadIndex())[addrSlug];
  return e && typeof e.slug === 'string' && typeof e.address === 'string' ? e : null;
}

/** Listing slug -> address, so the listing page can link to its address page. */
export async function getAddressForListing(listingSlug: string): Promise<(AddressEntry & { addrSlug: string }) | null> {
  const idx = await loadIndex();
  for (const [addrSlug, e] of Object.entries(idx)) if (e.slug === listingSlug) return { ...e, addrSlug };
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
