import type { Geometry } from 'geojson';
import AREAS from './areas.json';
import { normalizeName } from './streets';
import { mulberry32, pointInGeometry, type LatLng } from './geometry';

// Where a map pin may go (Blake, 2026-09-26): inside its district, inside its ward
// when we know the ward, and never on water. Boundaries: lib/geo/areas.json, built by
// scripts/build-geo-areas.ts (pre-2025 GADM wards + OSM rivers/lakes). The sea is
// outside every ward because ward edges follow the coast.

interface Area { geom: Geometry; box: [number, number, number, number] }   // minLat, maxLat, minLng, maxLng

type Poly = number[][][];
const raw = AREAS as unknown as { wards: Record<string, { district: string; name: string; geom: Poly[] }>; water: Poly[] };

function area(polys: Poly[]): Area {
  let a = Infinity, b = -Infinity, c = Infinity, d = -Infinity;
  for (const p of polys) for (const [lng, lat] of p[0]) { a = Math.min(a, lat); b = Math.max(b, lat); c = Math.min(c, lng); d = Math.max(d, lng); }
  return { geom: { type: 'MultiPolygon', coordinates: polys }, box: [a, b, c, d] };
}
const inBox = ([lat, lng]: LatLng, [a, b, c, d]: Area['box']) => lat >= a && lat <= b && lng >= c && lng <= d;
const inArea = (p: LatLng, x: Area) => inBox(p, x.box) && pointInGeometry(p, x.geom);

const WARDS = new Map(Object.entries(raw.wards).map(([k, w]) => [k, { ...w, area: area(w.geom) }]));
const DISTRICTS = new Map<string, Area>();
for (const w of WARDS.values()) {
  const polys = [...((DISTRICTS.get(w.district)?.geom as { coordinates: Poly[] } | undefined)?.coordinates ?? []), ...w.geom];
  DISTRICTS.set(w.district, area(polys));
}
const WATER = raw.water.map(p => area([p]));

// Scatter for listings known only by district skips island wards: Hoi An's wards
// include Tan Hiep (the Cham Islands, 15 km offshore), and a listing that just says
// "Hoi An" doesn't belong out there. A listing that names Tan Hiep still goes.
const ISLAND_WARDS = new Set(['Hoi An|tan hiep']);
const MAINLAND = new Map<string, Area>();
for (const [k, w] of WARDS) {
  if (ISLAND_WARDS.has(k)) continue;
  const polys = [...((MAINLAND.get(w.district)?.geom as { coordinates: Poly[] } | undefined)?.coordinates ?? []), ...w.geom];
  MAINLAND.set(w.district, area(polys));
}

export const inWater = (p: LatLng) => WATER.some(w => inArea(p, w));

/** The ward key for a listing's neighborhood in its district, or null if unknown. */
export function wardKey(district: string, neighborhood: string): string | null {
  if (!neighborhood) return null;
  const k = `${district}|${normalizeName(neighborhood)}`;
  return WARDS.has(k) ? k : null;
}

export function hasDistrict(district: string): boolean { return DISTRICTS.has(district); }

/** Which ward a point falls in, if any. */
export function wardAt(p: LatLng): string | null {
  for (const [k, w] of WARDS) if (inArea(p, w.area)) return k;
  return null;
}

/** Inside the district (and the ward, when given), and not on water. */
export function pointAllowed(p: LatLng, district: string, ward?: string | null): boolean {
  const region = ward ? WARDS.get(ward)?.area : DISTRICTS.get(district);
  return !!region && inArea(p, region) && !inWater(p);
}

/** A seeded allowed point anywhere in the ward (or district). Null if none found. */
export function randomAllowedPoint(district: string, ward: string | null, seed: number): LatLng | null {
  const region = ward ? WARDS.get(ward)?.area : MAINLAND.get(district);
  if (!region) return null;
  const rnd = mulberry32(seed);
  const [a, b, c, d] = region.box;
  for (let i = 0; i < 2000; i++) {
    const p: LatLng = [a + rnd() * (b - a), c + rnd() * (d - c)];
    if (inArea(p, region) && pointAllowed(p, district, ward)) return p;
  }
  return null;
}

/** The district's ward names, alphabetical — the neighborhood dropdown. */
export function wardNames(district: string): string[] {
  return [...WARDS.values()].filter(w => w.district === district).map(w => w.name).sort();
}

/** GeoJSON of one ward, for drawing its outline. */
export function wardGeometry(ward: string): Geometry | null { return WARDS.get(ward)?.area.geom ?? null; }
