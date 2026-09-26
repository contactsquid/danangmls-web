// Captures the link-preview pictures for map-view URLs (?view=map): the live map,
// filling a 1200x630 frame, with a DanangMLS label. Writes public/og/map/<name>.jpg
// and lib/mapOgManifest.json (lib/mapPreview.ts only offers pictures listed there).
//
//   npx tsx scripts/capture-map-og.ts [https://danangmls.com]
//
// Re-run to refresh. To use a hand-made screenshot instead, save it over the same
// file name (1200x630 JPG) — it stays until the next run.
import fs from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer-core';
import { DISTRICT_BOUNDARIES } from '../lib/districtBoundaries';
import { VI_DISTRICTS } from '../lib/price';
import { districtSlug } from '../lib/facets';

const BASE = process.argv[2] || 'https://danangmls.com';
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const OUT = path.join(__dirname, '../public/og/map');
const MANIFEST = path.join(__dirname, '../lib/mapOgManifest.json');

const PATHS = { en: { rent: '/for-rent', sale: '/for-sale' }, vi: { rent: '/vi/thue', sale: '/vi/mua-ban' } } as const;
function label(lang: 'en' | 'vi', mode: 'rent' | 'sale', district?: string): string {
  if (lang === 'vi') {
    const where = district ? VI_DISTRICTS[district] ?? district : 'Đà Nẵng & Hội An';
    return `Bản đồ · ${mode === 'rent' ? 'Nhà cho thuê' : 'Nhà đất bán'} tại ${where}`;
  }
  const where = district ?? 'Da Nang & Hoi An';
  return `Map · ${mode === 'rent' ? 'Rentals' : 'Property for sale'} in ${where}`;
}

// Shoot the listings map itself at its natural size: Leaflet sizes itself once, on
// load, so stretching it afterwards leaves an untiled band. The viewport is tuned
// until the map element is exactly 1200x630 (its height is 70vh). Only
// [data-listings-map] is shot: district pages also carry a boundary map.
const MAP_CSS = `
  [data-listings-map] { border-radius: 0 !important; border: 0 !important; }
  [data-listings-map] .leaflet-control-zoom { display: none !important; }`;
const W = 1200, H = 630;

const LOGO = '<svg width="34" height="34" viewBox="0 0 28 28"><circle cx="14" cy="12" r="10" fill="#2563EB"/><circle cx="14" cy="12" r="4" fill="#fff"/><path d="M14 22 L14 28" stroke="#2563EB" stroke-width="3" stroke-linecap="round"/></svg>';

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: true });
  const files: string[] = [];
  const districts = [undefined, ...Object.keys(DISTRICT_BOUNDARIES)];
  for (const lang of ['en', 'vi'] as const) for (const mode of ['rent', 'sale'] as const) for (const district of districts) {
    const name = `${lang}-${mode}${district ? '-' + districtSlug(district) : ''}`;
    const url = `${BASE}${PATHS[lang][mode]}${district ? '/' + districtSlug(district) : ''}?view=map`;
    const page = await browser.newPage();
    await page.evaluateOnNewDocument((css: string) => {
      document.addEventListener('DOMContentLoaded', () => {
        const s = document.createElement('style'); s.textContent = css; document.head.appendChild(s);
      });
    }, MAP_CSS);
    try {
      let vw = W + 48;
      for (let attempt = 0; attempt < 3; attempt++) {
        await page.setViewport({ width: vw, height: Math.round(H / 0.7) });
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 90_000 });
        const w = await page.$eval('[data-listings-map]', el => el.getBoundingClientRect().width);
        if (Math.round(w) === W) break;
        vw += W - Math.round(w);
      }
      // The full listing set arrives after first paint and the map refits to it.
      await new Promise(r => setTimeout(r, 4000));
      const pins = await page.$$eval('[data-listings-map] .dmls-pin, [data-listings-map] .dmls-cluster', els => els.length);
      if (!pins) { console.log('skip (no recent listings)', name); await page.close(); continue; }
      await page.$eval('[data-listings-map]', (el, text, logo) => {
        const d = document.createElement('div');
        d.style.cssText = 'position:absolute;left:24px;bottom:24px;z-index:1000;display:flex;align-items:center;gap:12px;'
          + 'padding:12px 20px 12px 14px;background:#fff;border-radius:14px;box-shadow:0 4px 18px rgb(15 23 42/.22);'
          + 'font-family:var(--font-geist-sans),system-ui,sans-serif;color:#0f172a;pointer-events:none';
        d.innerHTML = logo + '<div style="display:flex;flex-direction:column;gap:2px">'
          + '<div style="font-size:22px;font-weight:700;letter-spacing:-.02em">Danang<span style="color:#2563eb">MLS</span></div>'
          + `<div style="font-size:16px;font-weight:500;color:#334155">${text}</div></div>`;
        el.appendChild(d);
      }, label(lang, mode, district), LOGO);
      await new Promise(r => setTimeout(r, 1500));   // let the last tiles land
      const el = await page.$('[data-listings-map]');
      const box = await el!.boundingBox();
      if (!box || Math.round(box.width) !== W || Math.round(box.height) !== H) throw new Error(`map is ${box?.width}x${box?.height}, not ${W}x${H}`);
      await el!.screenshot({ path: path.join(OUT, `${name}.jpg`), type: 'jpeg', quality: 82 });
      files.push(name);
      console.log('ok  ', name, `(${pins} pins/circles)`);
    } catch (e) {
      console.log('fail', name, (e as Error).message);
    }
    await page.close();
  }
  await browser.close();
  fs.writeFileSync(MANIFEST, JSON.stringify({ files: files.sort() }, null, 1) + '\n');
  console.log(`${files.length} pictures; manifest written`);
})();
