# Listings map view — design

Approved by Blake 2026-09-26.

## Goal
A **List | Map** toggle on every listings grid. List stays the default. The map shows
every listing matching the current filters, placed as precisely as the listing's text
allows, without pins stacking into an unreadable pile.

## Measured starting point (live data, 2026-09-26)
| | Rentals | For Sale |
|---|---|---|
| District set (placeable) | 5,223 | 6,497 |
| District "Not Provided" (not mapped) | 569 | 670 |
| Neighborhood detected | 823 | 976 |
| Street mentioned (first 300 chars only — a floor) | ~1,070 | ~2,160 |
| Known building | 365 | 38 |
| Any sub-district signal | ~2,060 (39%) | ~2,870 (44%) |

~60% of placeable listings carry nothing finer than district, so district-level
placement is the dominant case.

## Scope
- Toggle lives in `ListingsGrid`, so it covers /for-rent, /for-sale, every facet page
  and the vi/ko/ru variants with no per-page work.
- Map input = the grid's existing `filtered` array (all matches, not the current page).
- `?view=map` in the URL; canonical is unchanged, so nothing new for Google to index.
- Map code (Leaflet + clustering) loads only when Map is chosen.

## Placement — precision ladder (first match wins)
1. **building** — `POPULAR_BUILDINGS` match → the building's coordinates.
2. **street** — street name parsed from the FULL description (server-side) → that
   street's midpoint inside the listing's district.
3. **neighborhood** — `listing.neighborhood` → ward centroid.
4. **district** — deterministic pseudo-random point inside the district polygon
   (seeded by slug; rejection-sampled against `DISTRICT_BOUNDARIES`).
5. District empty / "Not Provided" → not mapped.

Computed in `getListings()` so it can read the full text; shipped as a compact
`geo: [lat, lng, precision]` on each grid listing (~25 bytes each).

## Coordinates source
A one-off script geocodes building, ward and street names against OpenStreetMap
Nominatim (1 req/s, no key) and writes a static JSON committed to the repo. No runtime
geocoding. Every result is validated with point-in-polygon against its district
boundary; results outside it are discarded and the listing falls down the ladder.
Streets are keyed by `district|normalized street name` because names repeat across
districts. Re-run the script when new streets start appearing.

## Anti-stacking
- **Deterministic offset** from the anchor, seeded by slug, radius scaled by precision
  (building ~25 m spiral, street ~ along/near the midpoint ~150 m, neighborhood ~300 m;
  district points are already spread). The same listing always lands in the same spot.
- **Clustering** (leaflet.markercluster): tags merge into count bubbles when zoomed out;
  clicking zooms in.
- **Spiderfy** at max zoom for anything still coincident.

## Pins and popup
- Price-tag markers using the card's price formatting (`convertPrice` per language).
  Building/street/neighborhood = solid; district-only = lighter, dashed border.
- Popup: photo, price, title, beds, link to the listing, plus a precision line —
  "On <street>", "In <ward>", "At <building>", "Approximate location: <district>" —
  localized en/vi/ko/ru.

## Units
- `lib/geo/placement.ts` — pure: `placeListing(listing) → geo | null` (ladder, offsets,
  polygon sampling). No I/O.
- `lib/geo/streets.ts` — street-name extraction + normalization.
- `lib/geo/coords.json` — generated coordinates table.
- `scripts/build-geo-coords.js` — the one-off geocoder.
- `components/ListingsMap.tsx` — client-only Leaflet map, dynamically imported.
- `ListingsGrid` — toggle + URL param.

## Testing
- Unit: ladder order and fallbacks (incl. a discarded out-of-district street); district
  points always inside the polygon; same slug → same point; listings without district
  return null.
- Pre-ship: report actual per-precision counts.
- Post-ship: live check desktop + phone width, all 4 languages, filters updating pins.

## Out of scope
Real addresses from agents, draw-to-search, map-bounds filtering of the list.
