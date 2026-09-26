# Listings Map View Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A List | Map toggle on every listings grid that places each listing as precisely as its text allows (building → street → ward → scattered-in-district) with price-tag pins that cluster and spiderfy instead of stacking.

**Architecture:** A pure placement module (`lib/geo/`) computes `geo: [lat, lng, precision]` + `geoLabel` for each listing inside `lib/sheets.ts` (server, full text), using a committed coordinates table built once by a Nominatim script. `ListingsGrid` gains a toggle and lazy-loads a client-only `ListingsMap` (Leaflet + leaflet.markercluster) fed by the grid's existing `filtered` array.

**Tech Stack:** Next.js 16 / React 19, TypeScript, Leaflet 1.9 (already installed), leaflet.markercluster 1.5.3 (new), tsx + `node:test` for unit tests (new; the repo has no test runner yet).

**Spec:** `docs/superpowers/specs/2026-09-26-listings-map-view-design.md`

## Global Constraints
- List view stays the default; map state lives in `?view=map`; canonical URLs unchanged.
- Listings with district `''` or `'Not Provided'` are never mapped.
- Placement is deterministic: same slug → same point, every render.
- No runtime geocoding, no API keys. Tiles: the CARTO light basemap already used in `components/DistrictBoundaryMap.tsx`.
- Map JS/CSS must load only when Map is selected (`next/dynamic`, `ssr: false`).
- All visitor-facing map copy exists in en/vi/ko/ru; American English.
- `lib/geo/*` uses relative imports (not `@/`) so tsx scripts/tests resolve them.
- Coordinates rounded to 5 decimals in the payload.
- Do NOT commit or deploy the pre-existing uncommitted changes in `app/about/page.tsx` and `scripts/health-check.js` — they are someone else's WIP.

---

### Task 1: Test harness + compact price tags

**Files:**
- Modify: `package.json` (devDependency `tsx`, script `test`)
- Modify: `lib/price.ts:2,6,7` (export the three rate constants)
- Create: `lib/geo/shortPrice.ts`
- Test: `lib/geo/shortPrice.test.ts`

**Interfaces:**
- Produces: `shortPrice(price: string, lang: 'en'|'vi'|'ko'|'ru'): string | null`

- [ ] **Step 1: Install tsx and add the test script**

```bash
npm install --save-dev tsx
npm pkg set scripts.test='tsx --test "lib/**/*.test.ts"'
```

- [ ] **Step 2: Export rates from `lib/price.ts`** — change `const VND_RATE`, `const KRW_RATE`, `const RUB_RATE` to `export const`.

- [ ] **Step 3: Write the failing test** `lib/geo/shortPrice.test.ts`

```ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { shortPrice } from './shortPrice';

test('english', () => {
  assert.equal(shortPrice('$650/month', 'en'), '$650');
  assert.equal(shortPrice('$1,200/month', 'en'), '$1.2k');
  assert.equal(shortPrice('$262,000', 'en'), '$262k');
  assert.equal(shortPrice('$1,250,000', 'en'), '$1.3M');
  assert.equal(shortPrice('$500-$550/month', 'en'), '$500');
});
test('vietnamese uses triệu/tỷ with a decimal comma', () => {
  assert.equal(shortPrice('$650/month', 'vi'), '17 tr');
  assert.equal(shortPrice('$262,000', 'vi'), '6,9 tỷ');
});
test('korean uses 만/억', () => {
  assert.equal(shortPrice('$650/month', 'ko'), '87만');
  assert.equal(shortPrice('$262,000', 'ko'), '3.5억');
});
test('russian uses тыс/млн', () => {
  assert.equal(shortPrice('$650/month', 'ru'), '55 тыс');
  assert.equal(shortPrice('$262,000', 'ru'), '22 млн');
});
test('no number → null', () => {
  assert.equal(shortPrice('', 'en'), null);
  assert.equal(shortPrice('(Price not specified or is negotiable)', 'en'), null);
});
```

- [ ] **Step 4: Run `npm test` — expect FAIL (module not found).**

- [ ] **Step 5: Implement** `lib/geo/shortPrice.ts`

```ts
import { VND_RATE, KRW_RATE, RUB_RATE } from '../price';

type Lang = 'en' | 'vi' | 'ko' | 'ru';

// One decimal below 10, whole numbers above: "1.2k", "262k", "6,9 tỷ", "17 tr".
function compact(n: number, decimalComma = false): string {
  const v = n >= 10 ? Math.round(n) : Math.round(n * 10) / 10;
  const s = String(v);
  return decimalComma ? s.replace('.', ',') : s;
}

/** The price as a map pin label: the low end of the listing's USD price, shortened
 *  and converted to the page language's currency. Null when the price has no number. */
export function shortPrice(price: string, lang: Lang): string | null {
  const m = price.match(/\$\s*([\d,]+(?:\.\d+)?)/);
  if (!m) return null;
  const usd = parseFloat(m[1].replace(/,/g, ''));
  if (!isFinite(usd) || usd <= 0) return null;

  if (lang === 'vi') {
    const vnd = usd * VND_RATE;
    return vnd >= 1e9 ? `${compact(vnd / 1e9, true)} tỷ` : `${compact(vnd / 1e6, true)} tr`;
  }
  if (lang === 'ko') {
    const krw = usd * KRW_RATE;
    return krw >= 1e8 ? `${compact(krw / 1e8)}억` : `${Math.round(krw / 1e4)}만`;
  }
  if (lang === 'ru') {
    const rub = usd * RUB_RATE;
    return rub >= 1e6 ? `${compact(rub / 1e6, true)} млн` : `${Math.round(rub / 1e3)} тыс`;
  }
  if (usd >= 1e6) return `$${compact(usd / 1e6)}M`;
  if (usd >= 1e3) return `$${compact(usd / 1e3)}k`;
  return `$${Math.round(usd)}`;
}
```

- [ ] **Step 6: Run `npm test` — expect PASS.**

- [ ] **Step 7: Commit**

```bash
git add package.json package-lock.json lib/price.ts lib/geo/shortPrice.ts lib/geo/shortPrice.test.ts
git commit -m "Add a test runner and compact map price tags"
```

---

### Task 2: Street-name extraction

**Files:**
- Create: `lib/geo/streets.ts`
- Test: `lib/geo/streets.test.ts`

**Interfaces:**
- Produces: `extractStreet(text: string): { name: string; key: string } | null`, `normalizeName(s: string): string`

- [ ] **Step 1: Write the failing test** `lib/geo/streets.test.ts`

```ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { extractStreet, normalizeName } from './streets';

test('english "X Street"', () => {
  assert.deepEqual(extractStreet('Beautiful house on Nguyen Van Thoai Street, near beach'),
    { name: 'Nguyen Van Thoai', key: 'nguyen van thoai' });
});
test('leading stop words are stripped', () => {
  assert.deepEqual(extractStreet('Located Near Tran Cao Van St. in Thanh Khe'),
    { name: 'Tran Cao Van', key: 'tran cao van' });
});
test('numbered streets keep their number', () => {
  assert.deepEqual(extractStreet('Apartment at An Thuong 2 Street'),
    { name: 'An Thuong 2', key: 'an thuong 2' });
});
test('vietnamese "đường X"', () => {
  assert.deepEqual(extractStreet('Nhà mặt tiền đường Lê Duẩn giá tốt'),
    { name: 'Lê Duẩn', key: 'le duan' });
});
test('a street whose name starts with Duong is not mistaken for the prefix', () => {
  assert.equal(extractStreet('Near Duong Thi Xuan Quy Street')?.key, 'duong thi xuan quy');
});
test('junk is rejected', () => {
  assert.equal(extractStreet('Main Street vibes'), null);
  assert.equal(extractStreet('Price Street'), null);
  assert.equal(extractStreet('Quiet alley close to the beach'), null);
});
test('normalizeName folds diacritics and đ', () => {
  assert.equal(normalizeName('  Đống  Đa '), 'dong da');
});
```

- [ ] **Step 2: Run `npm test` — expect FAIL.**

- [ ] **Step 3: Implement** `lib/geo/streets.ts`

```ts
/** Lowercase, diacritic-free, single-spaced — the lookup key for names. */
export function normalizeName(s: string): string {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd').replace(/Đ/g, 'D')
    .toLowerCase().replace(/\s+/g, ' ').trim();
}

// Words that precede a street name in listing copy but are never part of one.
const STOP = new Set(['near', 'on', 'at', 'off', 'located', 'main', 'front', 'the', 'a',
  'big', 'quiet', 'beach', 'walking', 'private', 'frontage', 'facing', 'busy', 'wide',
  'from', 'to', 'in', 'of', 'and', 'price', 'alley', 'lane', 'beautiful', 'new', 'house',
  'villa', 'apartment', 'via', 'close']);

const TOKEN = String.raw`(?:\p{Lu}\p{Ll}*|\d{1,3})`;
// "Nguyen Van Thoai Street", "Tran Cao Van St.", "An Thuong 2 Road"
const EN = new RegExp(String.raw`((?:${TOKEN}\s+){1,5})(?:Street|St\.?|Road|Rd\.?)(?!\p{L})`, 'gu');
// "đường Lê Duẩn" — only the accented word: "Duong" alone is a common surname/street start.
const VI = new RegExp(String.raw`[đĐ]ường\s+((?:${TOKEN}(?:\s+|$)){2,5})`, 'gu');

function clean(raw: string): string | null {
  const tokens = raw.trim().split(/\s+/);
  while (tokens.length && STOP.has(tokens[0].toLowerCase())) tokens.shift();
  if (tokens.length < 2 || /^\d/.test(tokens[0])) return null;
  if (tokens.some(t => STOP.has(t.toLowerCase()))) return null;
  return tokens.join(' ');
}

/** First street name mentioned in a listing's text, or null. */
export function extractStreet(text: string): { name: string; key: string } | null {
  for (const re of [EN, VI]) {
    re.lastIndex = 0;
    for (const m of text.matchAll(re)) {
      const name = clean(m[1]);
      if (name) return { name, key: normalizeName(name) };
    }
  }
  return null;
}
```

- [ ] **Step 4: Run `npm test` — expect PASS.** If a case fails, fix the regex/stop list, not the test.

- [ ] **Step 5: Commit**

```bash
git add lib/geo/streets.ts lib/geo/streets.test.ts
git commit -m "Extract street names from listing text for map placement"
```

---

### Task 3: Geometry — seeded randomness, point-in-polygon, offsets

**Files:**
- Create: `lib/geo/geometry.ts`
- Test: `lib/geo/geometry.test.ts`

**Interfaces:**
- Produces:
  - `type LatLng = [number, number]` (lat, lng)
  - `hashSeed(s: string): number`
  - `mulberry32(seed: number): () => number`
  - `pointInGeometry(p: LatLng, g: Geometry): boolean` (Polygon | MultiPolygon, GeoJSON `[lng, lat]` order, holes respected)
  - `randomPointIn(g: Geometry, seed: number): LatLng`
  - `offsetPoint(p: LatLng, seed: number, radiusM: number): LatLng`
  - `distanceM(a: LatLng, b: LatLng): number`

- [ ] **Step 1: Write the failing test** `lib/geo/geometry.test.ts`

```ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import type { Geometry } from 'geojson';
import { hashSeed, pointInGeometry, randomPointIn, offsetPoint, distanceM } from './geometry';
import { DISTRICT_BOUNDARIES } from '../districtBoundaries';

// 1°x1° square at lng 0..1, lat 0..1 with a hole at 0.4..0.6
const square: Geometry = { type: 'Polygon', coordinates: [
  [[0, 0], [1, 0], [1, 1], [0, 1], [0, 0]],
  [[0.4, 0.4], [0.6, 0.4], [0.6, 0.6], [0.4, 0.6], [0.4, 0.4]],
] };

test('point in polygon respects holes', () => {
  assert.equal(pointInGeometry([0.2, 0.2], square), true);
  assert.equal(pointInGeometry([0.5, 0.5], square), false);
  assert.equal(pointInGeometry([1.5, 0.5], square), false);
});
test('multipolygon matches any part', () => {
  const multi: Geometry = { type: 'MultiPolygon', coordinates: [
    [[[0, 0], [1, 0], [1, 1], [0, 1], [0, 0]]],
    [[[5, 5], [6, 5], [6, 6], [5, 6], [5, 5]]],
  ] };
  assert.equal(pointInGeometry([5.5, 5.5], multi), true);
});
test('scattered points always land inside every real district', () => {
  for (const [name, g] of Object.entries(DISTRICT_BOUNDARIES)) {
    for (let i = 0; i < 200; i++) {
      const p = randomPointIn(g, hashSeed(`${name}-${i}`));
      assert.ok(pointInGeometry(p, g), `${name} #${i} outside`);
    }
  }
});
test('deterministic by seed', () => {
  const g = DISTRICT_BOUNDARIES['Son Tra'];
  assert.deepEqual(randomPointIn(g, hashSeed('abc')), randomPointIn(g, hashSeed('abc')));
  assert.notDeepEqual(randomPointIn(g, hashSeed('abc')), randomPointIn(g, hashSeed('abd')));
});
test('offsets stay within the radius and are deterministic', () => {
  const c: [number, number] = [16.06, 108.22];
  for (let i = 0; i < 200; i++) {
    const p = offsetPoint(c, hashSeed(`s${i}`), 150);
    assert.ok(distanceM(c, p) <= 151);
  }
  assert.deepEqual(offsetPoint(c, 7, 150), offsetPoint(c, 7, 150));
});
```

- [ ] **Step 2: Run `npm test` — expect FAIL.**

- [ ] **Step 3: Implement** `lib/geo/geometry.ts`

```ts
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
```

- [ ] **Step 4: Run `npm test` — expect PASS.**

- [ ] **Step 5: Commit**

```bash
git add lib/geo/geometry.ts lib/geo/geometry.test.ts
git commit -m "Add seeded point placement inside district boundaries"
```

---

### Task 4: Placement ladder

**Files:**
- Create: `lib/geo/coords.json`
- Create: `lib/geo/placement.ts`
- Test: `lib/geo/placement.test.ts`

**Interfaces:**
- Consumes: `extractStreet`, `normalizeName` (Task 2); `hashSeed`, `pointInGeometry`, `randomPointIn`, `offsetPoint`, `LatLng` (Task 3); `POPULAR_BUILDINGS` from `lib/buildingDefs.ts`; `DISTRICT_BOUNDARIES` from `lib/districtBoundaries.ts`.
- Produces:
  - `PRECISION = { building: 0, street: 1, ward: 2, district: 3 } as const`; `type Precision = 0|1|2|3`
  - `interface GeoCoords { buildings: Record<string, LatLng>; wards: Record<string, LatLng>; streets: Record<string, LatLng>; misses: string[] }`
  - Keys: buildings by `BuildingDef.name`; wards `"<District>|<normalizeName(ward)>"`; streets `"<District>|<street key>"`
  - `interface Placement { geo: [number, number, Precision]; geoLabel: string }` (geoLabel is `''` for district precision)
  - `placeListing(l: { slug: string; district: string; neighborhood: string; title: string; text: string }, coords?: GeoCoords): Placement | null`

- [ ] **Step 1: Create `lib/geo/coords.json`**

```json
{ "buildings": {}, "wards": {}, "streets": {}, "misses": [] }
```

- [ ] **Step 2: Write the failing test** `lib/geo/placement.test.ts`

```ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { placeListing, PRECISION, type GeoCoords } from './placement';
import { distanceM, pointInGeometry } from './geometry';
import { DISTRICT_BOUNDARIES } from '../districtBoundaries';

const coords: GeoCoords = {
  buildings: { 'Hiyori Garden Tower': [16.0694, 108.2345] },
  wards:     { 'Son Tra|an hai bac': [16.0745, 108.2320] },
  streets:   {
    'Son Tra|ho nghinh':  [16.0680, 108.2450],
    // Deliberately outside Son Tra: must be rejected at placement time.
    'Son Tra|bach dang':  [16.0300, 108.1500],
  },
  misses: [],
};
const base = { slug: 'x-1', district: 'Son Tra', neighborhood: '', title: 'Nice flat', text: '' };

test('no district → not mapped', () => {
  assert.equal(placeListing({ ...base, district: '' }, coords), null);
  assert.equal(placeListing({ ...base, district: 'Not Provided' }, coords), null);
  assert.equal(placeListing({ ...base, district: 'Atlantis' }, coords), null);
});
test('building wins', () => {
  const p = placeListing({ ...base, text: 'Studio in Hiyori, Ho Nghinh Street' }, coords)!;
  assert.equal(p.geo[2], PRECISION.building);
  assert.equal(p.geoLabel, 'Hiyori Garden Tower');
  assert.ok(distanceM([p.geo[0], p.geo[1]], [16.0694, 108.2345]) <= 31);
});
test('street next', () => {
  const p = placeListing({ ...base, text: 'House on Ho Nghinh Street' }, coords)!;
  assert.equal(p.geo[2], PRECISION.street);
  assert.equal(p.geoLabel, 'Ho Nghinh');
});
test('a street coordinate outside the district falls through', () => {
  const p = placeListing({ ...base, text: 'House on Bach Dang Street' }, coords)!;
  assert.equal(p.geo[2], PRECISION.district);
});
test('a street known only in another district is not borrowed', () => {
  const p = placeListing({ ...base, district: 'Hai Chau', text: 'House on Ho Nghinh Street' }, coords)!;
  assert.equal(p.geo[2], PRECISION.district);
});
test('ward next', () => {
  const p = placeListing({ ...base, neighborhood: 'An Hai Bac' }, coords)!;
  assert.equal(p.geo[2], PRECISION.ward);
  assert.equal(p.geoLabel, 'An Hai Bac');
});
test('district fallback is inside the district and stable', () => {
  const a = placeListing(base, coords)!;
  assert.equal(a.geo[2], PRECISION.district);
  assert.equal(a.geoLabel, '');
  assert.ok(pointInGeometry([a.geo[0], a.geo[1]], DISTRICT_BOUNDARIES['Son Tra']));
  assert.deepEqual(placeListing(base, coords), a);
});
```

- [ ] **Step 3: Run `npm test` — expect FAIL.**

- [ ] **Step 4: Implement** `lib/geo/placement.ts`

```ts
import { POPULAR_BUILDINGS } from '../buildingDefs';
import { DISTRICT_BOUNDARIES } from '../districtBoundaries';
import { extractStreet, normalizeName } from './streets';
import { hashSeed, offsetPoint, pointInGeometry, randomPointIn, type LatLng } from './geometry';
import COORDS from './coords.json';

export const PRECISION = { building: 0, street: 1, ward: 2, district: 3 } as const;
export type Precision = 0 | 1 | 2 | 3;

export interface GeoCoords {
  buildings: Record<string, LatLng>;
  wards: Record<string, LatLng>;
  streets: Record<string, LatLng>;
  /** Names the geocoder tried and could not place — skipped on re-runs. */
  misses: string[];
}

export interface Placement { geo: [number, number, Precision]; geoLabel: string }

// How far listings sharing one anchor are spread, so their pins don't sit on
// top of each other. Scaled to how big the anchor really is.
const SPREAD_M = { building: 30, street: 150, ward: 350 };

const round5 = (n: number) => Math.round(n * 1e5) / 1e5;
const place = ([lat, lng]: LatLng, p: Precision, label: string): Placement =>
  ({ geo: [round5(lat), round5(lng), p], geoLabel: label });

/** Where a listing goes on the map: the most precise location its data supports. */
export function placeListing(
  l: { slug: string; district: string; neighborhood: string; title: string; text: string },
  coords: GeoCoords = COORDS as GeoCoords,
): Placement | null {
  const boundary = DISTRICT_BOUNDARIES[l.district];
  if (!boundary) return null;            // covers '' and 'Not Provided'
  const seed = hashSeed(l.slug);
  const hay = `${l.title} ${l.text}`;

  const building = POPULAR_BUILDINGS.find(b => b.pattern.test(hay) && coords.buildings[b.name]);
  if (building) {
    return place(offsetPoint(coords.buildings[building.name], seed, SPREAD_M.building), PRECISION.building, building.name);
  }

  const street = extractStreet(hay);
  const streetAt = street && coords.streets[`${l.district}|${street.key}`];
  if (street && streetAt && pointInGeometry(streetAt, boundary)) {
    return place(offsetPoint(streetAt, seed, SPREAD_M.street), PRECISION.street, street.name);
  }

  const wardAt = l.neighborhood && coords.wards[`${l.district}|${normalizeName(l.neighborhood)}`];
  if (wardAt && pointInGeometry(wardAt, boundary)) {
    return place(offsetPoint(wardAt, seed, SPREAD_M.ward), PRECISION.ward, l.neighborhood);
  }

  return place(randomPointIn(boundary, seed), PRECISION.district, '');
}
```

- [ ] **Step 5: Run `npm test` — expect PASS.** If tsx rejects the JSON import, add `with { type: 'json' }` to the import and re-run.

- [ ] **Step 6: Commit**

```bash
git add lib/geo/coords.json lib/geo/placement.ts lib/geo/placement.test.ts
git commit -m "Place listings on the map by building, street, ward, then district"
```

---

### Task 5: Attach placement to every listing

**Files:**
- Modify: `lib/types.ts` (Listing interface)
- Modify: `lib/sheets.ts:321` and `lib/sheets.ts:411` (before each `warnIfBadData`)
- Modify: `lib/gridListing.ts` header comment (geo fields are kept)

**Interfaces:**
- Consumes: `placeListing` (Task 4)
- Produces: `Listing.geo?: [number, number, number]` (lat, lng, precision) and `Listing.geoLabel?: string` on every listing from `getListings()` / `getForSaleListings()`, carried unchanged through `toGridListing` into `/api/grid-listings`.

- [ ] **Step 1: Extend `Listing`** in `lib/types.ts`, before the closing brace:

```ts
  // Map placement, computed in lib/sheets.ts by lib/geo/placement.ts:
  // [lat, lng, precision] with precision 0 building / 1 street / 2 ward / 3 district.
  // Absent when the listing has no usable district (not mapped).
  geo?:         [number, number, number];
  geoLabel?:    string; // building / street / ward name; '' for district precision
```

- [ ] **Step 2: Wire into `lib/sheets.ts`** — add `import { placeListing } from './geo/placement';` with the other imports, and immediately before BOTH `warnIfBadData(listing, 'Sheet1/Rentals');` and `warnIfBadData(listing, 'For Sale');` add:

```ts
      Object.assign(listing, placeListing(listing) ?? {});
```

- [ ] **Step 3: Note it in `lib/gridListing.ts`** — add `geo, geoLabel (map view)` to the "Card uses" comment block. No code change: the `...l` spread already carries them.

- [ ] **Step 4: Type-check** `npx tsc --noEmit` — expect no new errors.

- [ ] **Step 5: Verify locally** — `npm run dev`, then:

```bash
curl -s "localhost:3000/api/grid-listings?mode=rent" | node -e 'const L=JSON.parse(require("fs").readFileSync(0));const c={};L.forEach(l=>{const k=l.geo?l.geo[2]:"none";c[k]=(c[k]||0)+1});console.log(c)'
```

Expected: every listing with a real district has `geo`; precision is all `3` (coords table still empty); `none` ≈ the "Not Provided" count (~569 rent).

- [ ] **Step 6: Commit**

```bash
git add lib/types.ts lib/sheets.ts lib/gridListing.ts
git commit -m "Attach map placement to every listing"
```

---

### Task 6: Build the coordinates table (one-off geocoder) + coverage report

**Files:**
- Create: `scripts/build-geo-coords.ts`
- Create: `scripts/geo-coverage.ts`
- Modify: `lib/geo/coords.json` (generated)

**Interfaces:**
- Consumes: `getListings`, `getForSaleListings` (`lib/sheets.ts`); `extractStreet`, `normalizeName`; `pointInGeometry`; `POPULAR_BUILDINGS`; `NEIGHBORHOODS`; `DISTRICT_BOUNDARIES`; `placeListing`, `GeoCoords`.
- Produces: a populated `lib/geo/coords.json` in the Task 4 key format.

- [ ] **Step 1: Write** `scripts/build-geo-coords.ts`

```ts
// One-off geocoder for the listings map. Looks up building, ward and street names
// on OpenStreetMap Nominatim and writes lib/geo/coords.json. Resumable: names
// already placed or already missed are skipped. Nominatim's policy is max 1 req/s
// with an identifying User-Agent.
//
//   npx tsx scripts/build-geo-coords.ts
import fs from 'node:fs';
import path from 'node:path';
import { getListings, getForSaleListings } from '../lib/sheets';
import { extractStreet, normalizeName } from '../lib/geo/streets';
import { pointInGeometry, type LatLng } from '../lib/geo/geometry';
import type { GeoCoords } from '../lib/geo/placement';
import { POPULAR_BUILDINGS } from '../lib/buildingDefs';
import { NEIGHBORHOODS } from '../lib/neighborhoods';
import { DISTRICT_BOUNDARIES } from '../lib/districtBoundaries';

const OUT = path.join(__dirname, '../lib/geo/coords.json');
const UA = 'danangmls.com listings map geocoder (https://danangmls.com)';
// Da Nang + Hoi An; results outside are ignored.
const VIEWBOX = '107.90,16.25,108.45,15.80';

const coords: GeoCoords = JSON.parse(fs.readFileSync(OUT, 'utf8'));
const save = () => fs.writeFileSync(OUT, JSON.stringify(coords, null, 1) + '\n');
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

async function search(q: string): Promise<LatLng[]> {
  const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=10&countrycodes=vn&bounded=1&viewbox=${VIEWBOX}&q=${encodeURIComponent(q)}`;
  await sleep(1100);
  const res = await fetch(url, { headers: { 'User-Agent': UA, 'Accept-Language': 'vi,en' } });
  if (!res.ok) throw new Error(`Nominatim ${res.status} for ${q}`);
  const rows = (await res.json()) as { lat: string; lon: string }[];
  return rows.map(r => [parseFloat(r.lat), parseFloat(r.lon)] as LatLng);
}

// Queried by name + city, NOT by district: Vietnam's 2025 reform removed districts
// from OSM's hierarchy, so "X, Son Tra" often finds nothing. Our own boundary
// polygon decides which result belongs to the listing's district.
const city = (district: string) => (district === 'Hoi An' ? 'Hội An' : 'Đà Nẵng');

async function lookup(key: string, q: string, district: string | null, table: Record<string, LatLng>) {
  if (table[key] || coords.misses.includes(key)) return;
  const results = await search(q);
  const g = district ? DISTRICT_BOUNDARIES[district] : null;
  const hit = g ? results.find(p => pointInGeometry(p, g)) : results[0];
  if (hit) table[key] = [Math.round(hit[0] * 1e5) / 1e5, Math.round(hit[1] * 1e5) / 1e5];
  else coords.misses.push(key);
  console.log(hit ? 'ok  ' : 'miss', key);
}

(async () => {
  let n = 0;
  const tick = () => { if (++n % 25 === 0) save(); };

  for (const b of POPULAR_BUILDINGS) { await lookup(b.name, `${b.name}, Đà Nẵng`, null, coords.buildings); tick(); }

  for (const [district, wards] of Object.entries(NEIGHBORHOODS)) {
    if (!DISTRICT_BOUNDARIES[district]) continue;
    for (const w of wards) {
      await lookup(`${district}|${normalizeName(w)}`, `${w}, ${city(district)}`, district, coords.wards); tick();
    }
  }

  const [rent, sale] = await Promise.all([getListings(), getForSaleListings()]);
  const streets = new Map<string, { name: string; district: string; count: number }>();
  for (const l of [...rent, ...sale]) {
    if (!DISTRICT_BOUNDARIES[l.district]) continue;
    const s = extractStreet(`${l.title} ${l.text}`);
    if (!s) continue;
    const key = `${l.district}|${s.key}`;
    const e = streets.get(key) ?? { name: s.name, district: l.district, count: 0 };
    e.count++; streets.set(key, e);
  }
  // Busiest streets first, so an interrupted run has already done the ones that matter.
  const ordered = [...streets.entries()].sort((a, b) => b[1].count - a[1].count);
  console.log(`${ordered.length} street/district pairs`);
  for (const [key, s] of ordered) {
    await lookup(key, `${s.name}, ${city(s.district)}`, s.district, coords.streets); tick();
  }
  save();
  console.log('done', Object.keys(coords.buildings).length, 'buildings,',
    Object.keys(coords.wards).length, 'wards,', Object.keys(coords.streets).length, 'streets,',
    coords.misses.length, 'misses');
})();
```

- [ ] **Step 2: Smoke-test on buildings only** — temporarily run it and stop after the building loop prints (Ctrl-C after ~25 lines). Check that `lib/geo/coords.json` has building entries whose coordinates are within Da Nang (lat 15.8–16.25, lng 107.9–108.45). If `lib/sheets.ts` fails to import under tsx, fix the import path issue before continuing.

- [ ] **Step 3: Full run in the background** (~1–2 s per unique name; expect roughly 20–40 minutes):

```bash
npx tsx scripts/build-geo-coords.ts > /tmp/geo-build.log 2>&1
```

- [ ] **Step 4: Spot-check 5 well-known coordinates** by opening them on openstreetmap.org (`https://www.openstreetmap.org/?mlat=LAT&mlon=LNG#map=17/LAT/LNG`): Hiyori Garden Tower, Sam Towers, Son Tra|ho nghinh, Hai Chau|bach dang, Ngu Hanh Son|nguyen van thoai. Any that is clearly wrong → delete the entry and add its key to `misses`.

- [ ] **Step 5: Write** `scripts/geo-coverage.ts`

```ts
// How many listings land at each map precision. npx tsx scripts/geo-coverage.ts
import { getListings, getForSaleListings } from '../lib/sheets';

const NAMES = ['building', 'street', 'ward', 'district'];
(async () => {
  for (const [mode, list] of [['rent', await getListings()], ['sale', await getForSaleListings()]] as const) {
    const c: Record<string, number> = { none: 0, building: 0, street: 0, ward: 0, district: 0 };
    for (const l of list) c[l.geo ? NAMES[l.geo[2]] : 'none']++;
    const mapped = list.length - c.none;
    console.log(mode, 'total', list.length, 'mapped', mapped, c,
      'finer-than-district', `${Math.round((100 * (mapped - c.district)) / Math.max(mapped, 1))}%`);
  }
})();
```

- [ ] **Step 6: Run** `npx tsx scripts/geo-coverage.ts` and record the numbers for the final report.

- [ ] **Step 7: Commit**

```bash
git add scripts/build-geo-coords.ts scripts/geo-coverage.ts lib/geo/coords.json
git commit -m "Geocode buildings, wards and streets for the listings map"
```

---

### Task 7: Map copy + ListingsMap component

**Files:**
- Modify: `package.json` (leaflet.markercluster + types)
- Modify: `lib/translations.ts` (interface `Translations` + all four language objects)
- Modify: `app/globals.css` (pin/cluster/popup styles)
- Create: `components/ListingsMap.tsx`

**Interfaces:**
- Consumes: `Listing.geo`, `Listing.geoLabel` (Task 5); `shortPrice` (Task 1); `convertPrice`, `localizeDistrict`, `localizedTitle` (`lib/price.ts`); `listingHref` (`lib/facets.ts`); `useLanguage` (`components/LanguageProvider`).
- Produces: `export default function ListingsMap({ listings }: { listings: Listing[] })`; translation keys `mapList`, `mapMap`, `mapApprox(d)`, `mapOnStreet(s)`, `mapInWard(w)`, `mapAtBuilding(b)`, `mapUnmapped(n)`.

- [ ] **Step 1: Install**

```bash
npm install leaflet.markercluster@1.5.3 && npm install --save-dev @types/leaflet.markercluster
```

- [ ] **Step 2: Add translation keys.** In the `Translations` interface:

```ts
  mapList: string;
  mapMap: string;
  mapApprox: (district: string) => string;
  mapOnStreet: (street: string) => string;
  mapInWard: (ward: string) => string;
  mapAtBuilding: (building: string) => string;
  mapUnmapped: (n: number) => string;
```

Values, one block per language object:

```ts
  // en
  mapList: 'List', mapMap: 'Map',
  mapApprox: d => `Approximate location: ${d}`,
  mapOnStreet: s => `On ${s} Street`,
  mapInWard: w => `In ${w}`,
  mapAtBuilding: b => `At ${b}`,
  mapUnmapped: n => `${n} ${n === 1 ? 'listing has' : 'listings have'} no district and ${n === 1 ? "isn't" : "aren't"} shown on the map`,
  // vi
  mapList: 'Danh sách', mapMap: 'Bản đồ',
  mapApprox: d => `Vị trí tương đối: khu vực ${d}`,
  mapOnStreet: s => `Đường ${s}`,
  mapInWard: w => `Phường ${w}`,
  mapAtBuilding: b => `Tòa ${b}`,
  mapUnmapped: n => `${n} tin chưa có quận nên không hiển thị trên bản đồ`,
  // ko
  mapList: '목록', mapMap: '지도',
  mapApprox: d => `대략적인 위치: ${d}`,
  mapOnStreet: s => `${s} 거리`,
  mapInWard: w => `${w} 지역`,
  mapAtBuilding: b => b,
  mapUnmapped: n => `구 정보가 없는 매물 ${n}개는 지도에 표시되지 않습니다`,
  // ru — ruPlural(n, one, few, many) is exported from this file
  mapList: 'Список', mapMap: 'Карта',
  mapApprox: d => `Примерное расположение: ${d}`,
  mapOnStreet: s => `Улица ${s}`,
  mapInWard: w => `Квартал ${w}`,
  mapAtBuilding: b => `Комплекс ${b}`,
  mapUnmapped: n => `${n} ${ruPlural(n, 'объявление', 'объявления', 'объявлений')} без района не ${n === 1 ? 'показано' : 'показаны'} на карте`,
```

- [ ] **Step 3: Styles** — append to `app/globals.css`:

```css
/* Listings map (components/ListingsMap.tsx) */
.dmls-pin { background: none; border: 0; }
.dmls-pin span {
  position: absolute; transform: translate(-50%, -50%); white-space: nowrap;
  padding: 2px 7px; border-radius: 9999px; font: 600 12px/1.4 system-ui, sans-serif;
  background: #fff; color: #0f172a; border: 1.5px solid #1e40af;
  box-shadow: 0 1px 3px rgb(0 0 0 / .25); cursor: pointer;
}
.dmls-pin span:hover { background: #1e40af; color: #fff; z-index: 1000; }
/* Pins placed only by district: lighter + dashed, so they don't read as an address. */
.dmls-pin.approx span { color: #475569; border: 1.5px dashed #94a3b8; background: rgb(255 255 255 / .85); }
.dmls-cluster { background: none; border: 0; }
.dmls-cluster span {
  display: flex; align-items: center; justify-content: center; width: 40px; height: 40px;
  border-radius: 9999px; background: rgb(30 64 175 / .9); color: #fff;
  font: 700 13px system-ui, sans-serif; box-shadow: 0 0 0 5px rgb(30 64 175 / .25);
}
.dmls-popup .leaflet-popup-content { margin: 0; width: 240px !important; }
.dmls-popup a { display: block; color: inherit; text-decoration: none; }
.dmls-popup img { width: 100%; height: 130px; object-fit: cover; border-radius: 12px 12px 0 0; display: block; }
.dmls-popup .b { padding: 8px 12px 10px; }
.dmls-popup .p { font-weight: 700; color: #1e40af; }
.dmls-popup .t { font-size: 13px; line-height: 1.35; margin: 2px 0 4px;
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.dmls-popup .m { font-size: 12px; color: #64748b; }
```

- [ ] **Step 4: Write** `components/ListingsMap.tsx`

```tsx
'use client';

import { useEffect, useMemo, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import type { Listing } from '@/lib/types';
import { useLanguage } from './LanguageProvider';
import { shortPrice } from '@/lib/geo/shortPrice';
import { convertPrice, localizeDistrict, localizedTitle } from '@/lib/price';
import { listingHref } from '@/lib/facets';

// Map view for ListingsGrid. Loaded with next/dynamic (ssr: false) so list-view
// visitors never download Leaflet. Placement comes precomputed on each listing
// (lib/geo/placement.ts); overlapping pins merge into clusters and spiderfy at
// max zoom.

const esc = (s: string) => s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));

export default function ListingsMap({ listings }: { listings: Listing[] }) {
  const { lang, t } = useLanguage();
  const elRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ref = useRef<{ L: any; map: any; cluster: any } | null>(null);
  // Memoised so the marker effect re-runs only when the filtered set changes.
  const mapped = useMemo(() => listings.filter(l => l.geo), [listings]);
  const unmapped = listings.length - mapped.length;

  // Map + cluster layer, created once.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const L = (await import('leaflet')).default;
      // leaflet.markercluster attaches itself to the global L.
      (window as unknown as { L: typeof L }).L = L;
      await import('leaflet.markercluster');
      if (cancelled || !elRef.current || ref.current) return;
      const map = L.map(elRef.current, { scrollWheelZoom: true }).setView([16.05, 108.22], 12);
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        subdomains: 'abcd', maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
      }).addTo(map);
      const cluster = L.markerClusterGroup({
        chunkedLoading: true, showCoverageOnHover: false, spiderfyOnMaxZoom: true, maxClusterRadius: 50,
        iconCreateFunction: (c: { getChildCount(): number }) => L.divIcon({
          html: `<span>${c.getChildCount()}</span>`, className: 'dmls-cluster', iconSize: L.point(40, 40),
        }),
      });
      map.addLayer(cluster);
      ref.current = { L, map, cluster };
      window.dispatchEvent(new Event('dmls-map-ready'));
    })();
    return () => {
      cancelled = true;
      if (ref.current) { ref.current.map.remove(); ref.current = null; }
    };
  }, []);

  // Markers, rebuilt whenever the filtered set or language changes.
  useEffect(() => {
    const draw = () => {
      if (!ref.current) return;
      const { L, map, cluster } = ref.current;
      cluster.clearLayers();
      const markers = mapped.map(l => {
        const [lat, lng, precision] = l.geo!;
        const tag = shortPrice(l.price, lang) ?? '•';
        const m = L.marker([lat, lng], {
          icon: L.divIcon({ html: `<span>${esc(tag)}</span>`, className: `dmls-pin${precision === 3 ? ' approx' : ''}`, iconSize: [0, 0] }),
          riseOnHover: true,
        });
        m.bindPopup(() => {
          const label = l.geoLabel || '';
          const loc = precision === 0 ? t.mapAtBuilding(label)
            : precision === 1 ? t.mapOnStreet(label)
            : precision === 2 ? t.mapInWard(label)
            : t.mapApprox(localizeDistrict(l.district, lang));
          const img = l.images[0] ? `<img src="${esc(l.images[0])}" alt="" loading="lazy">` : '';
          const beds = l.bedrooms ? `🛏 ${esc(l.bedrooms)} ${esc(t.br)} · ` : '';
          return `<a href="${esc(listingHref(l.slug, lang))}">${img}<div class="b">`
            + `<div class="p">${esc(l.price ? convertPrice(l.price, lang) : '')}</div>`
            + `<div class="t">${esc(localizedTitle(l, lang))}</div>`
            + `<div class="m">${beds}${esc(loc)}</div></div></a>`;
        }, { className: 'dmls-popup', maxWidth: 240, minWidth: 240 });
        return m;
      });
      cluster.addLayers(markers);
      if (markers.length) map.fitBounds(cluster.getBounds(), { padding: [30, 30], maxZoom: 15 });
    };
    draw();
    window.addEventListener('dmls-map-ready', draw);
    return () => window.removeEventListener('dmls-map-ready', draw);
  }, [mapped, lang, t]);

  return (
    <div>
      <div ref={elRef} className="w-full h-[70vh] min-h-[420px] rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 relative z-0" />
      {unmapped > 0 && <p className="text-xs text-slate-400 mt-2">{t.mapUnmapped(unmapped)}</p>}
    </div>
  );
}
```

- [ ] **Step 5: Type-check + lint** `npx tsc --noEmit && npm run lint` — expect no new errors.

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json lib/translations.ts app/globals.css components/ListingsMap.tsx
git commit -m "Add the listings map component with price-tag pins"
```

---

### Task 8: List | Map toggle in ListingsGrid

**Files:**
- Modify: `components/ListingsGrid.tsx`

**Interfaces:**
- Consumes: `ListingsMap` (Task 7), `t.mapList`, `t.mapMap`.

- [ ] **Step 1: Lazy import** — near the top of `components/ListingsGrid.tsx`:

```tsx
import dynamic from 'next/dynamic';

const ListingsMap = dynamic(() => import('./ListingsMap'), {
  ssr: false,
  loading: () => <div className="w-full h-[70vh] min-h-[420px] rounded-2xl bg-slate-100 animate-pulse" />,
});
```

- [ ] **Step 2: View state from the URL** — next to the other `useState` calls:

```tsx
  const [view, setView] = useState<'list' | 'map'>('list');
  useEffect(() => {
    try { if (new URLSearchParams(window.location.search).get('view') === 'map') setView('map'); } catch {}
  }, []);
  // ?view=map makes the map shareable. replaceState: no history entry per toggle,
  // and the canonical URL (server-rendered) is untouched.
  const chooseView = (v: 'list' | 'map') => {
    setView(v);
    try {
      const u = new URL(window.location.href);
      if (v === 'map') u.searchParams.set('view', 'map'); else u.searchParams.delete('view');
      window.history.replaceState(window.history.state, '', u);
    } catch {}
  };
```

- [ ] **Step 3: Toggle** — in the filter row, immediately before the `<span className="ml-auto text-sm text-slate-400">` count, insert:

```tsx
          <div className="inline-flex rounded-lg border border-slate-200 overflow-hidden text-sm" role="group">
            {(['list', 'map'] as const).map(v => (
              <button key={v} type="button" onClick={() => chooseView(v)} aria-pressed={view === v}
                className={`px-3 py-2 font-medium transition-colors ${view === v ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}>
                {v === 'list' ? t.mapList : t.mapMap}
              </button>
            ))}
          </div>
```

- [ ] **Step 4: Render the map** — in the results area, change the non-empty branch so map view replaces the grid + "View more":

```tsx
      ) : view === 'map' ? (
        <ListingsMap listings={filtered} />
      ) : (
        <>
          {/* existing grid + View more, unchanged */}
        </>
      )}
```

- [ ] **Step 5: Type-check + lint + build** `npx tsc --noEmit && npm run lint && npm run build` — expect success.

- [ ] **Step 6: Manual check in `npm run dev`** on `/for-rent`, `/for-sale`, `/for-rent/son-tra`, `/vi/thue`, `/ko/...`, `/ru/...` equivalents:
  - List is default; Map toggles; URL gains/loses `?view=map`; reload on `?view=map` opens the map.
  - Changing a filter redraws pins and refits.
  - Pins show short prices; district-only pins are dashed; clusters show counts and spiderfy at max zoom.
  - Popup shows photo/price/title/beds/precision line in the page language and links to the listing.
  - Browser devtools Network: no leaflet chunk requested until Map is clicked.
  - 400px-wide viewport: filters wrap, map fills width, no horizontal scroll.

- [ ] **Step 7: Commit**

```bash
git add components/ListingsGrid.tsx
git commit -m "Add a List | Map toggle to the listings grids"
```

---

### Task 9: Ship and verify live

- [ ] **Step 1: Pre-deploy hygiene** (`vercel deploy` uploads the WORKING DIRECTORY):
  - `git stash push app/about/page.tsx scripts/health-check.js -m "others' WIP"` — not ours to ship.
  - `git log --oneline origin/main..HEAD` — 5 commits by another session (447a8cb…) were unpushed at plan time. Confirm they are already live (e.g. the rental "minimum term" dropdown and phone-required signup exist on production). If they are NOT live, stop and ask Blake before deploying.

- [ ] **Step 2: Deploy**

```bash
vercel deploy --prod --yes --token "$(node -e 'console.log(require(process.env.HOME+"/.openclaw/credentials/vercel/token.json").token)')"
git push origin main
git stash pop
```

- [ ] **Step 3: Live verification** — repeat Task 8 Step 6 against https://danangmls.com, plus:
  - `curl -s https://danangmls.com/for-rent | grep -o '<link rel="canonical"[^>]*>'` unchanged; `?view=map` URL has the same canonical.
  - `/api/grid-listings?mode=rent` includes `geo` on listings.

- [ ] **Step 4: Record** — update memory (`danangmls-listings-map-view.md` + MEMORY.md line + `current_task.md`) and append to `~/.openclaw/data/coda-activity.md`, including the Task 6 coverage numbers.
