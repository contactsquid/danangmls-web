// The map shows only recent listings (Blake, 2026-09-26): rentals move fast, so
// two weeks; sales sit longer, so four. Map only — the list view, page counts and
// SEO pages keep every listing.
export const MAP_MAX_AGE_DAYS = { rent: 14, sale: 28 } as const;

/** True when a listing is recent enough for the map. Undated = age unknown = hidden. */
export function isFreshForMap(l: { date: string; forSale: boolean }, now = Date.now()): boolean {
  const t = new Date(l.date).getTime();
  if (!l.date || isNaN(t)) return false;
  return (now - t) / 864e5 <= MAP_MAX_AGE_DAYS[l.forSale ? 'sale' : 'rent'];
}
