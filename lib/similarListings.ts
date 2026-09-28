import type { Listing } from './types';
import { priceLow } from './price';

/** The "Similar Listings" row (and the pins on the listing-page map): same deal
 *  (rent/sale), then same type + district, same type elsewhere, same district any
 *  type. Listings with no price ("Price on request") are skipped (Blake, 2026-09-28).
 *  Was copied into each language's listing page; one copy now. */
export function getSimilarListings(current: Listing, all: Listing[], count = 4): Listing[] {
  const candidates = all.filter(l => l.slug !== current.slug && l.forSale === current.forSale && priceLow(l.price) > 0);
  const tier1 = candidates.filter(l => l.type === current.type && l.district === current.district);
  const tier2 = candidates.filter(l => l.type === current.type && l.district !== current.district);
  const tier3 = candidates.filter(l => l.type !== current.type && l.district === current.district);
  const results: Listing[] = [];
  for (const tier of [tier1, tier2, tier3]) {
    for (const l of tier) {
      if (results.length >= count) return results;
      results.push(l);
    }
  }
  return results;
}
