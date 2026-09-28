import type { Listing } from './types';

// Values the scrapers use when they couldn't tell the district — never a search option.
const NOT_A_DISTRICT = new Set(['', 'not provided']);

/** The "All Districts" dropdown: the districts present in the listings, sorted,
 *  without "Not Provided" (Blake, 2026-09-28). */
export function searchDistricts(listings: Pick<Listing, 'district'>[]): string[] {
  const set = new Set<string>();
  for (const l of listings) {
    const d = (l.district || '').trim();
    if (!NOT_A_DISTRICT.has(d.toLowerCase())) set.add(d);
  }
  return [...set].sort();
}
