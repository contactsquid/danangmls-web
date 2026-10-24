import type { Listing } from './types';

/** The newest `n` listings that have a map position, without their descriptions —
 *  the pins and popups never show them, and 24 full listings in four languages
 *  would bloat the homepage HTML. */
export function forMap(listings: Listing[], n: number): Listing[] {
  return listings.filter(l => l.geo).slice(0, n)
    .map(l => ({ ...l, text: '', vi_text: '', ko_text: '', ru_text: '' }));
}
