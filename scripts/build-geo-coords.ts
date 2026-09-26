// One-off geocoder for the listings map. Looks up building, ward and street names
// on Photon (komoot's free OpenStreetMap geocoder) and writes lib/geo/coords.json.
// Resumable: names already placed or already missed are skipped. Throttled to
// ~1 req/s out of courtesy.
//
// Why not Nominatim: openstreetmap.org (Nominatim included) resets the TLS
// connection from this office's network (checked 2026-09-26). Photon serves the
// same OSM data from komoot's servers.
//
//   npx tsx scripts/build-geo-coords.ts            # everything
//   npx tsx scripts/build-geo-coords.ts buildings  # just one stage (buildings|wards|streets)
import fs from 'node:fs';
import path from 'node:path';
import { getListings, getForSaleListings } from '../lib/sheets';
import { extractStreet, normalizeName } from '../lib/geo/streets';
import { distanceM, pointInGeometry, type LatLng } from '../lib/geo/geometry';
import type { GeoCoords } from '../lib/geo/placement';
import { POPULAR_BUILDINGS, type BuildingDef } from '../lib/buildingDefs';
import { NEIGHBORHOODS } from '../lib/neighborhoods';
import { DISTRICT_BOUNDARIES } from '../lib/districtBoundaries';

const OUT = path.join(__dirname, '../lib/geo/coords.json');
const UA = 'danangmls.com listings map geocoder (https://danangmls.com)';
// Da Nang + Hoi An; results outside are ignored.
const BBOX = '107.90,15.80,108.45,16.25';
const only = process.argv[2];

const coords: GeoCoords = JSON.parse(fs.readFileSync(OUT, 'utf8'));
const save = () => fs.writeFileSync(OUT, JSON.stringify(coords, null, 1) + '\n');
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

interface Hit { at: LatLng; name: string; osmKey: string }

async function search(q: string): Promise<Hit[]> {
  const url = `https://photon.komoot.io/api/?limit=10&bbox=${BBOX}&q=${encodeURIComponent(q)}`;
  for (let attempt = 1; ; attempt++) {
    await sleep(1100 * attempt);
    try {
      const res = await fetch(url, { headers: { 'User-Agent': UA } });
      if (!res.ok) throw new Error(`Photon ${res.status}`);
      const j = (await res.json()) as { features: { geometry: { coordinates: [number, number] }; properties: { name?: string; osm_key?: string } }[] };
      return j.features.map(f => ({
        at: [f.geometry.coordinates[1], f.geometry.coordinates[0]] as LatLng,
        name: f.properties.name ?? '',
        osmKey: f.properties.osm_key ?? '',
      }));
    } catch (e) {
      if (attempt >= 4) throw e;
      console.log(`retry ${attempt} for ${q}: ${(e as Error).message}`);
    }
  }
}

// "Đường Nguyễn Văn Thoại" -> "nguyen van thoai"
const streetKeyOf = (name: string) => normalizeName(name).replace(/^(duong|pho) /, '');

// A street must come back as a road (not "Ho Nghinh Park"); prefer the road itself
// over an alley off it ("Kiệt 227 Đường Nguyễn Văn Thoại").
function pickStreet(hits: Hit[], key: string): Hit | undefined {
  const roads = hits.filter(h => h.osmKey === 'highway');
  return roads.find(h => streetKeyOf(h.name) === key) ?? roads.find(h => normalizeName(h.name).includes(key));
}

// Queried by name + city, NOT by district: Vietnam's 2025 reform removed districts
// from OSM's hierarchy, so "X, Son Tra" often finds nothing. Our own boundary
// polygon decides which result belongs to the listing's district.
const city = (district: string) => (district === 'Hoi An' ? 'Hội An' : 'Đà Nẵng');

// Photon ranks fuzzily: "Panoma" came back as the city of Da Nang, "The Filmore" as
// the railway station, "The Song" as the Thu Bon river (sông = river), "Sam Towers"
// as Meridian Towers. A pin on the wrong landmark is worse than no pin, so a
// building only counts when the result is a building-like feature whose own name
// matches the building's listing pattern — and when every such match is in one
// place (Muong Thanh is several different hotels).
const BUILDING_KEYS = new Set(['building', 'tourism', 'landuse', 'shop', 'office', 'amenity', 'residential']);
function pickBuilding(hits: Hit[], b: BuildingDef): Hit | undefined {
  const matches = hits.filter(h => BUILDING_KEYS.has(h.osmKey)
    && (b.pattern.test(h.name) || b.pattern.test(normalizeName(h.name))));
  if (!matches.length) return undefined;
  return matches.every(m => distanceM(m.at, matches[0].at) <= 300) ? matches[0] : undefined;
}

async function lookup(key: string, q: string, district: string | null, table: Record<string, LatLng>, streetKey?: string, building?: BuildingDef) {
  if (table[key] || coords.misses.includes(key)) return;
  const g = district ? DISTRICT_BOUNDARIES[district] : null;
  const results = (await search(q)).filter(h => !g || pointInGeometry(h.at, g));
  const found = building ? pickBuilding(results, building)
    : streetKey ? pickStreet(results, streetKey) : results[0];
  const hit = found?.at;
  if (hit) table[key] = [Math.round(hit[0] * 1e5) / 1e5, Math.round(hit[1] * 1e5) / 1e5];
  else coords.misses.push(key);
  console.log(hit ? 'ok  ' : 'miss', key);
}

(async () => {
  let n = 0;
  const tick = () => { if (++n % 25 === 0) save(); };

  if (!only || only === 'buildings') {
    for (const b of POPULAR_BUILDINGS) { await lookup(b.name, `${b.name}, Đà Nẵng`, null, coords.buildings, undefined, b); tick(); }
    save();
  }

  if (!only || only === 'wards') {
    for (const [district, wards] of Object.entries(NEIGHBORHOODS)) {
      if (!DISTRICT_BOUNDARIES[district]) continue;
      for (const w of wards) {
        await lookup(`${district}|${normalizeName(w)}`, `${w}, ${city(district)}`, district, coords.wards); tick();
      }
    }
    save();
  }

  if (!only || only === 'streets') {
    const [rent, sale] = await Promise.all([getListings(), getForSaleListings()]);
    const streets = new Map<string, { name: string; key: string; district: string; count: number }>();
    for (const l of [...rent, ...sale]) {
      if (!DISTRICT_BOUNDARIES[l.district]) continue;
      const s = extractStreet(`${l.title} ${l.text}`);
      if (!s) continue;
      const key = `${l.district}|${s.key}`;
      const e = streets.get(key) ?? { name: s.name, key: s.key, district: l.district, count: 0 };
      e.count++; streets.set(key, e);
    }
    // Busiest streets first, so an interrupted run has already done the ones that matter.
    const ordered = [...streets.entries()].sort((a, b) => b[1].count - a[1].count);
    console.log(`${ordered.length} street/district pairs`);
    for (const [key, s] of ordered) {
      await lookup(key, `${s.name}, ${city(s.district)}`, s.district, coords.streets, s.key); tick();
    }
    save();
  }

  console.log('done', Object.keys(coords.buildings).length, 'buildings,',
    Object.keys(coords.wards).length, 'wards,', Object.keys(coords.streets).length, 'streets,',
    coords.misses.length, 'misses');
})();
