import 'server-only';

import { readTab, readRow, updateRow, findRowByColumn } from './googleSheets';
import { CITY_SITE_DISTRICTS, DEST_LIST, destFor, destInfo, type Dest } from './crossCityRow';
import { SITE_CITY } from './cityJump';
import { formatPrice, type ListingSubmission } from './listingSubmit';
import type { Listing } from './types';

/**
 * Editing listings an agent posted into ANOTHER city's tab (Blake, 2026-11-28).
 *
 * The add form on danangmls / saigonmls / hanoimls can post to any city, so an
 * agent's listings are spread over up to ten tabs. This file finds the ones outside
 * this site's own tabs (the own tabs go through lib/sheets.ts as before) and patches
 * them in place using that tab's own column layout (lib/crossCityRow.ts).
 *
 * Ownership is the same proof as lib/myListings.ts: a photo under
 * `<site>agent-listings/<profile-slug>/`, a key each site builds server-side from the
 * signed-in profile. All four sites' folders count, because the photos sit in the
 * folder of the site that UPLOADED them, not of the tab the row landed in.
 * IDENTICAL in danangmls-web, saigonmls-web and hanoimls-web.
 */

const IMAGE_HOST = 'https://images.danang.homes';
export const PORTAL_UPLOAD_DIRS = ['agent-listings', 'saigon-agent-listings', 'hanoi-agent-listings', 'lotus-agent-listings'];

export function ownedByPortalSlug(images: string[], profileSlug: string): boolean {
  if (!profileSlug) return false;
  const prefixes = PORTAL_UPLOAD_DIRS.map(d => `${IMAGE_HOST}/${d}/${profileSlug}/`);
  return images.some(u => prefixes.some(p => u.startsWith(p)));
}

/** Tabs to scan: every destination except this site's own city (own tabs are read by sheets.ts). */
function foreignDests(): Dest[] {
  return DEST_LIST.filter(d => d !== destFor(SITE_CITY));
}

export async function getCrossCityListings(profileSlug: string): Promise<Listing[]> {
  if (!profileSlug) return [];
  const out: Listing[] = [];
  const jobs: Promise<void>[] = [];
  for (const dest of foreignDests()) {
    const info = destInfo(dest);
    for (const forSale of [false, true]) {
      const L = forSale ? info.sale : info.rent;
      jobs.push((async () => {
        let rows: string[][];
        try { rows = await readTab(L.tab, L.cols); } catch (err) { console.error(`[cross-edit] read ${L.tab} failed:`, err); return; }
        for (const r of rows.slice(1)) {
          const images = L.imageCols.map(i => r[i]).filter(Boolean);
          if (!ownedByPortalSlug(images, profileSlug)) continue;
          const mlsUrl = r[L.idx.MLS_URL] ?? '';
          const slug = mlsUrl.split('/listing/')[1]?.split(/[?#]/)[0] ?? '';
          if (!slug) continue;
          const cityKey = L.idx.CITY !== undefined ? (r[L.idx.CITY] || '') : dest;
          out.push({
            title: r[L.idx.TITLE], text: r[L.idx.TEXT], price: r[L.idx.PRICE], district: r[L.idx.DISTRICT],
            bedrooms: r[L.idx.BEDROOMS], type: r[L.idx.TYPE], agent: r[L.idx.AGENT], images,
            contact: r[L.idx.CONTACT], postUrl: r[L.idx.POST_URL], date: r[L.idx.DATE], mlsUrl, slug,
            neighborhood: '', vi_title: '', vi_text: '', ko_title: '', ko_text: '', ru_title: '', ru_text: '',
            forSale,
            crossCity: { city: cityKey, tab: L.tab, siteUrl: info.site, districts: CITY_SITE_DISTRICTS[dest] ?? null },
          });
        }
      })());
    }
  }
  await Promise.all(jobs);
  return out;
}

/** Patches an agent's listing in another city's tab. Same untouched-cells rules as the
 *  own-city edit: Post URL, MLS URL and Date never change; unknown columns survive. */
export async function updateCrossCityRow(existing: Listing, s: ListingSubmission, images: string[]): Promise<void> {
  const cc = existing.crossCity;
  if (!cc) throw new Error('not a cross-city listing');
  const info = destInfo(destFor(cc.city));
  const L = s.forSale ? info.sale : info.rent;
  if (L.tab !== cc.tab) throw new Error('tab mismatch');
  const rowNumber = await findRowByColumn(L.tab, L.postUrlCol, existing.postUrl);
  if (!rowNumber) throw new Error(`no row found for postUrl ${existing.postUrl}`);
  const row = await readRow(L.tab, rowNumber, L.cols);
  row[L.idx.TITLE] = s.title.trim() || existing.title;
  row[L.idx.TEXT] = s.description.trim();
  row[L.idx.PRICE] = formatPrice(s.priceAmount, s.priceCurrency, s.forSale);
  row[L.idx.DISTRICT] = s.district.trim();
  row[L.idx.BEDROOMS] = s.bedrooms || '';
  row[L.idx.TYPE] = s.propertyType;
  for (const i of L.imageCols) row[i] = '';
  L.imageCols.forEach((col, i) => { row[col] = images[i] ?? ''; });
  await updateRow(L.tab, rowNumber, row);
}
