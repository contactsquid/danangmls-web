import type { Geometry, Position } from 'geojson';

export type LatLng = [number, number];

/** FNV-1a — a stable 32-bit seed from a slug. */
export function hashSeed(s: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193); }
  return h >>> 0;
}

/** Small seeded PRNG so a listing lands on the same spot every render. */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// GeoJSON rings are [lng, lat]; our points are [lat, lng].
function inRing([lat, lng]: LatLng, ring: Position[]): boolean {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i], [xj, yj] = ring[j];
    if ((yi > lat) !== (yj > lat) && lng < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

function polygons(g: Geometry): Position[][][] {
  if (g.type === 'Polygon') return [g.coordinates];
  if (g.type === 'MultiPolygon') return g.coordinates;
  return [];
}

function ringArea(ring: Position[]): number {
  let a = 0;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) a += (ring[j][0] + ring[i][0]) * (ring[j][1] - ring[i][1]);
  return Math.abs(a / 2);
}

/** The largest polygon of a MultiPolygon: the mainland, without islands like Cu Lao Cham. */
export function mainPart(g: Geometry): Geometry {
  if (g.type !== 'MultiPolygon') return g;
  const biggest = g.coordinates.reduce((a, b) => (ringArea(b[0]) > ringArea(a[0]) ? b : a));
  return { type: 'Polygon', coordinates: biggest };
}

export function pointInGeometry(p: LatLng, g: Geometry): boolean {
  return polygons(g).some(([outer, ...holes]) => inRing(p, outer) && !holes.some(h => inRing(p, h)));
}

function bbox(g: Geometry) {
  let minLat = Infinity, maxLat = -Infinity, minLng = Infinity, maxLng = -Infinity;
  for (const poly of polygons(g)) for (const [lng, lat] of poly[0]) {
    minLat = Math.min(minLat, lat); maxLat = Math.max(maxLat, lat);
    minLng = Math.min(minLng, lng); maxLng = Math.max(maxLng, lng);
  }
  return { minLat, maxLat, minLng, maxLng };
}

/** A seeded point inside the geometry (rejection-sampled within its bounding box). */
export function randomPointIn(g: Geometry, seed: number): LatLng {
  const rnd = mulberry32(seed);
  const b = bbox(g);
  for (let i = 0; i < 1000; i++) {
    const p: LatLng = [b.minLat + rnd() * (b.maxLat - b.minLat), b.minLng + rnd() * (b.maxLng - b.minLng)];
    if (pointInGeometry(p, g)) return p;
  }
  const [lng, lat] = polygons(g)[0][0][0];
  return [lat, lng];
}

const M_PER_DEG = 111_320;

/** A seeded point uniformly within radiusM metres of p. */
export function offsetPoint([lat, lng]: LatLng, seed: number, radiusM: number): LatLng {
  const rnd = mulberry32(seed);
  const r = radiusM * Math.sqrt(rnd());
  const theta = 2 * Math.PI * rnd();
  return [
    lat + (r * Math.sin(theta)) / M_PER_DEG,
    lng + (r * Math.cos(theta)) / (M_PER_DEG * Math.cos((lat * Math.PI) / 180)),
  ];
}

export function distanceM(a: LatLng, b: LatLng): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b[0] - a[0]), dLng = toRad(b[1] - a[1]);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a[0])) * Math.cos(toRad(b[0])) * Math.sin(dLng / 2) ** 2;
  return 2 * 6_371_000 * Math.asin(Math.sqrt(h));
}
