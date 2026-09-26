// Builds lib/geo/areas.json: the pre-2025 ward boundaries of Da Nang and Hoi An, and
// the rivers and lakes inside them. Map pins must stay inside their ward/district
// and never sit on water (Blake, 2026-09-26).
//
//   npx tsx scripts/build-geo-areas.ts
//
// Wards: GADM 4.1 level 3. OpenStreetMap only carries the MERGED wards since the
// July 2025 reform (My An is now inside a large "Phường Ngũ Hành Sơn"); GADM keeps
// the old wards, which are the names agents and renters still use. Ward edges
// follow the coast, so the sea is outside every ward by construction — but they
// run down the middle of rivers, hence the separate water layer from OSM.
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { normalizeName } from '../lib/geo/streets';

type Ring = [number, number][];                 // [lng, lat], GeoJSON order
type Poly = Ring[];                             // outer ring, then holes

const OUT = path.join(__dirname, '../lib/geo/areas.json');
const TMP = fs.mkdtempSync('/tmp/geo-areas-');
const GADM = 'https://geodata.ucdavis.edu/gadm/gadm4.1/json/gadm41_VNM_3.json.zip';
const BBOX = '15.80,107.95,16.20,108.40';
const UA = 'danangmls.com map (https://danangmls.com)';

const DISTRICTS: Record<string, string> = {
  'CẩmLệ': 'Cam Le', 'HảiChâu': 'Hai Chau', 'HòaVang': 'Hoa Vang', 'LiênChiểu': 'Lien Chieu',
  'NgũHànhSơn': 'Ngu Hanh Son', 'SơnTrà': 'Son Tra', 'ThanhKhê': 'Thanh Khe', 'HộiAn': 'Hoi An',
};

/** "HảiChâuII" -> "Hai Chau 2", "HoàHải" -> "Hoa Hai" */
function wardName(gadm: string): string {
  // Split before capitals, but keep a Roman numeral whole ("HảiChâuII", not "... I I").
  const spaced = gadm.replace(/([^\s])(?=\p{Lu})/gu, '$1 ').replace(/\bI I\b/, 'II');
  const ascii = spaced.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/Đ/g, 'D').replace(/đ/g, 'd');
  return ascii.replace(/\bII\b/, '2').replace(/\bI\b/, '1');
}

// Douglas-Peucker, in degrees. A closed ring starts and ends on the same point, so
// the base line has zero length; split it at the vertex farthest from the start and
// simplify each half.
function simplify(ring: Ring, tol: number): Ring {
  if (ring.length < 5) return ring;
  let m = 0, dm = -1;
  for (let i = 1; i < ring.length - 1; i++) { const d = Math.hypot(ring[i][0] - ring[0][0], ring[i][1] - ring[0][1]); if (d > dm) { dm = d; m = i; } }
  const a = simplifyLine(ring.slice(0, m + 1), tol), b = simplifyLine(ring.slice(m), tol);
  const out = [...a, ...b.slice(1)];
  return out.length >= 4 ? out : ring;
}

function simplifyLine(ring: Ring, tol: number): Ring {
  if (ring.length < 3) return ring;
  const keep = new Uint8Array(ring.length); keep[0] = keep[ring.length - 1] = 1;
  const stack: [number, number][] = [[0, ring.length - 1]];
  while (stack.length) {
    const [a, b] = stack.pop()!;
    let far = -1, dmax = tol;
    const [ax, ay] = ring[a], [bx, by] = ring[b];
    const len = Math.hypot(bx - ax, by - ay) || 1e-12;
    for (let i = a + 1; i < b; i++) {
      const d = Math.abs((by - ay) * ring[i][0] - (bx - ax) * ring[i][1] + bx * ay - by * ax) / len;
      if (d > dmax) { dmax = d; far = i; }
    }
    if (far > 0) { keep[far] = 1; stack.push([a, far], [far, b]); }
  }
  return ring.filter((_, i) => keep[i]);
}
const r5 = (ring: Ring): Ring => ring.map(([x, y]) => [Math.round(x * 1e5) / 1e5, Math.round(y * 1e5) / 1e5]);
const areaDeg = (ring: Ring) => { let a = 0; for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) a += (ring[j][0] + ring[i][0]) * (ring[j][1] - ring[i][1]); return Math.abs(a / 2); };
const M2_PER_DEG2 = 111_320 * 107_000;   // at Da Nang's latitude

async function overpass(q: string) {
  for (let t = 1; t <= 4; t++) {
    const res = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST', headers: { 'User-Agent': UA, 'Content-Type': 'application/x-www-form-urlencoded' },
      body: 'data=' + encodeURIComponent(q),
    });
    const text = await res.text();
    if (res.ok && text.startsWith('{')) return JSON.parse(text);
    console.log(`overpass try ${t}: ${res.status}`);
    await new Promise(r => setTimeout(r, 20_000 * t));
  }
  throw new Error('overpass failed');
}

// Join a relation's member ways end-to-end into closed rings.
function stitch(ways: Ring[]): Ring[] {
  const rings: Ring[] = [];
  const pool = ways.map(w => [...w]);
  while (pool.length) {
    let ring = pool.shift()!;
    for (let grown = true; grown && !(ring.length > 3 && ring[0][0] === ring.at(-1)![0] && ring[0][1] === ring.at(-1)![1]); ) {
      grown = false;
      const end = ring.at(-1)!;
      for (let i = 0; i < pool.length; i++) {
        const w = pool[i];
        const same = (p: [number, number]) => p[0] === end[0] && p[1] === end[1];
        if (same(w[0])) { ring = ring.concat(w.slice(1)); pool.splice(i, 1); grown = true; break; }
        if (same(w.at(-1)!)) { ring = ring.concat([...w].reverse().slice(1)); pool.splice(i, 1); grown = true; break; }
      }
    }
    if (ring.length > 3) rings.push(ring);
  }
  return rings;
}

(async () => {
  // Wards
  console.log('downloading GADM wards…');
  const zip = path.join(TMP, 'gadm.zip');
  fs.writeFileSync(zip, Buffer.from(await (await fetch(GADM)).arrayBuffer()));
  const gadm = JSON.parse(execSync(`unzip -p "${zip}"`, { maxBuffer: 64 * 1024 * 1024 }).toString());
  const wards: Record<string, { district: string; name: string; geom: Poly[] }> = {};
  for (const f of gadm.features) {
    const district = DISTRICTS[f.properties.NAME_2];
    const inCity = f.properties.NAME_1 === 'ĐàNẵng' || district === 'Hoi An';
    if (!district || !inCity) continue;
    const name = wardName(f.properties.NAME_3);
    const polys: Poly[] = f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates;
    wards[`${district}|${normalizeName(name)}`] = {
      district, name,
      geom: polys.map(p => p.map(ring => r5(simplify(ring as Ring, 0.0001)))).filter(p => areaDeg(p[0]) > 0),
    };
  }
  console.log(Object.keys(wards).length, 'wards');

  // Water: closed ways + multipolygon relations. Ponds under 2 ha are dropped:
  // no listing is placed in one, and they would bloat the file.
  console.log('fetching rivers and lakes…');
  const water: Poly[] = [];
  const keepRing = (ring: Ring) => areaDeg(ring) * M2_PER_DEG2 >= 20_000;
  const ways = await overpass(`[out:json][timeout:170];(way["natural"="water"](${BBOX});way["waterway"="riverbank"](${BBOX}););out geom;`);
  for (const w of ways.elements) {
    const ring: Ring = (w.geometry ?? []).map((p: { lon: number; lat: number }) => [p.lon, p.lat]);
    if (ring.length > 3 && ring[0][0] === ring.at(-1)![0] && ring[0][1] === ring.at(-1)![1] && keepRing(ring)) water.push([r5(simplify(ring, 0.0002))]);
  }
  const rels = await overpass(`[out:json][timeout:170];(rel["natural"="water"](${BBOX});rel["waterway"="riverbank"](${BBOX}););out geom;`);
  for (const r of rels.elements) {
    const part = (role: string) => stitch(r.members.filter((m: { type: string; role: string }) => m.type === 'way' && m.role === role)
      .map((m: { geometry?: { lon: number; lat: number }[] }) => (m.geometry ?? []).map(p => [p.lon, p.lat] as [number, number])));
    const holes = part('inner');
    for (const outer of part('outer')) if (keepRing(outer)) water.push([r5(simplify(outer, 0.0002)), ...holes.map(h => r5(simplify(h, 0.0002)))]);
  }
  console.log(water.length, 'water polygons');

  fs.writeFileSync(OUT, JSON.stringify({ source: 'GADM 4.1 (wards), OpenStreetMap (water)', built: new Date().toISOString().slice(0, 10), wards, water }) + '\n');
  console.log('wrote', OUT, (fs.statSync(OUT).size / 1024).toFixed(0), 'KB');
})();
