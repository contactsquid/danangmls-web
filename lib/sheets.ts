import { Listing } from './types';
import { detectNeighborhood } from './neighborhoods';

const SPREADSHEET_ID = '14hGuwUcb308n3h1ODyby97WqHa7uRUyyYAKMHgWnyUE';
const CSV_RENTALS   = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:csv&sheet=Sheet1`;
const CSV_FORSALE   = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:csv&sheet=For%20Sale`;

// Module-level cache: CSVs are fetched once per Node.js process (i.e. once per build).
// Both sheets exceed Next.js's 2MB fetch-cache limit so without this every statically
// generated page re-fetches the full CSV, overwhelming Google Sheets and dropping connections.
const rentalsCache: { value: string | null } = { value: null };
const forSaleCache: { value: string | null } = { value: null };

async function fetchCSV(url: string, cache: { value: string | null }): Promise<string> {
  if (cache.value !== null) return cache.value;
  const res = await fetch(url, { next: { revalidate: 3600 } });
  cache.value = await res.text();
  return cache.value;
}

// ─── Column indices for Sheet1 (Rentals) ─────────────────────────────────────
// If the sheet column order ever changes, update ONLY these constants.
const R = {
  TITLE:    0,
  TEXT:     1,
  PRICE:    2,
  DISTRICT: 3,
  BEDROOMS: 4,
  TYPE:     5,
  AGENT:    6,
  IMG1:     7,
  IMG2:     8,
  IMG3:     9,
  IMG4:     10,
  IMG5:     11,
  CONTACT:  12,
  IMG6:     18,
  IMG7:     19,
  IMG8:     20,
  IMG9:     21,
  IMG10:    22,
  POST_URL: 14,
  DATE:     15,
  MLS_URL:  17,
} as const;

// ─── Column indices for the For Sale tab ──────────────────────────────────────
const FS = {
  TITLE:    0,
  TEXT:     1,
  PRICE:    2,
  DISTRICT: 3,
  BEDROOMS: 4,
  TYPE:     5,
  AGENT:    6,
  IMG1:     7,
  IMG2:     8,
  IMG3:     9,
  IMG4:     10,
  IMG5:     11,
  IMG6:     12,
  IMG7:     13,
  IMG8:     14,
  IMG9:     15,
  IMG10:    16,
  CONTACT:  17,
  POST_URL: 19,
  DATE:     20,
  VI_TITLE: 21,
  VI_TEXT:  22,
} as const;

// ─── Valid reference data ──────────────────────────────────────────────────────
export const VALID_DISTRICTS = new Set([
  'Hai Chau', 'Thanh Khe', 'Son Tra', 'Ngu Hanh Son',
  'Lien Chieu', 'Cam Le', 'Hoi An', 'Da Nang',
]);

export const VALID_TYPES = new Set([
  'House', 'Apartment', 'Villa', 'Land', 'Office',
  'Retail', 'Townhouse', 'Studio', 'Shophouse',
]);

// ─── District normalisation ───────────────────────────────────────────────────
const DISTRICT_LIST = ['Hai Chau', 'Thanh Khe', 'Son Tra', 'Ngu Hanh Son', 'Lien Chieu', 'Cam Le', 'Hoi An'] as const;

// Vietnamese-accented → English equivalents
const DISTRICT_VN: Record<string, string> = {
  'Hải Châu': 'Hai Chau',
  'Thanh Khê': 'Thanh Khe',
  'Sơn Trà': 'Son Tra',
  'Ngũ Hành Sơn': 'Ngu Hanh Son',
  'Liên Chiểu': 'Lien Chieu',
  'Cẩm Lệ': 'Cam Le',
  'Hội An': 'Hoi An',
};

// Known sub-districts → parent district
const SUB_DISTRICTS: Record<string, string> = {
  'Hoa Vang': 'Cam Le',
  'Hoa Xuan': 'Cam Le',
  'Hoa Minh': 'Lien Chieu',
  'Hoa Khanh': 'Lien Chieu',
  'My An': 'Ngu Hanh Son',
  'An Thuong': 'Ngu Hanh Son',
};

function normalizeDistrict(raw: string): string {
  if (!raw) return 'Not Provided';
  // Exact match
  if ((DISTRICT_LIST as readonly string[]).includes(raw)) return raw;
  // English name appears anywhere in the string (e.g. "Ngu Hanh Son (note...)")
  const eng = DISTRICT_LIST.find(d => raw.includes(d));
  if (eng) return eng;
  // Vietnamese name appears anywhere
  const vn = Object.keys(DISTRICT_VN).find(k => raw.includes(k));
  if (vn) return DISTRICT_VN[vn];
  // Sub-district name appears anywhere
  const sub = Object.keys(SUB_DISTRICTS).find(k => raw.includes(k));
  if (sub) return SUB_DISTRICTS[sub];
  return 'Not Provided';
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [], field = '', inQuote = false, i = 0;
  while (i < text.length) {
    const ch = text[i];
    if (inQuote) {
      if (ch === '"' && text[i + 1] === '"') { field += '"'; i += 2; }
      else if (ch === '"') { inQuote = false; i++; }
      else { field += ch; i++; }
    } else {
      if (ch === '"') { inQuote = true; i++; }
      else if (ch === ',') { row.push(field); field = ''; i++; }
      else if (ch === '\r' && text[i + 1] === '\n') { row.push(field); field = ''; rows.push(row); row = []; i += 2; }
      else if (ch === '\n' || ch === '\r') { row.push(field); field = ''; rows.push(row); row = []; i++; }
      else { field += ch; i++; }
    }
  }
  if (field || row.length) { row.push(field); rows.push(row); }
  return rows.filter(r => r.some(c => c.trim()));
}

function col(row: string[], idx: number): string {
  return (row && row[idx] != null) ? String(row[idx]).trim() : '';
}

/** Extracts the slug from a stored danangmls.com URL (column R).
 *  Returns the slug string if the URL is valid, otherwise null.
 *  This makes the stored URL the single source of truth — the slug never
 *  drifts even if the title or postUrl is later edited in the sheet. */
function mlsUrlToSlug(storedUrl: string): string | null {
  if (!storedUrl) return null;
  const PREFIX = 'https://danangmls.com/listing/';
  if (!storedUrl.startsWith(PREFIX)) return null;
  const slug = storedUrl.slice(PREFIX.length).trim();
  return slug || null;
}

function slugify(text: string, postUrl: string): string {
  // Hash the postUrl so slugs are stable regardless of row order in the sheet
  let h = 0;
  for (let i = 0; i < postUrl.length; i++) {
    h = (Math.imul(31, h) + postUrl.charCodeAt(i)) >>> 0;
  }
  const suffix = h.toString(36).slice(0, 6) || '0';
  return (
    text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 60) + '-' + suffix
  );
}

/** Logs a warning to Vercel function logs when a listing has suspicious data. */
function warnIfBadData(listing: Listing, source: string) {
  if (listing.district && !VALID_DISTRICTS.has(listing.district)) {
    console.warn(`[sheets] Bad district "${listing.district}" in ${source}: "${listing.title.slice(0, 40)}"`);
  }
  if (listing.type && !VALID_TYPES.has(listing.type)) {
    console.warn(`[sheets] Bad type "${listing.type}" in ${source}: "${listing.title.slice(0, 40)}"`);
  }
}

// ─── Data fetchers ────────────────────────────────────────────────────────────
function parseRows(rows: string[][]): Listing[] {
  return rows
    .filter(r => col(r, R.TITLE))
    .reverse()
    .map(r => {
      const title    = col(r, R.TITLE);
      const text     = col(r, R.TEXT);
      const district = col(r, R.DISTRICT);
      const listing: Listing = {
        title,
        text,
        price:        col(r, R.PRICE),
        district,
        bedrooms:     col(r, R.BEDROOMS),
        type:         col(r, R.TYPE),
        agent:        col(r, R.AGENT),
        images:       [col(r, R.IMG1), col(r, R.IMG2), col(r, R.IMG3), col(r, R.IMG4), col(r, R.IMG5), col(r, R.IMG6), col(r, R.IMG7), col(r, R.IMG8), col(r, R.IMG9), col(r, R.IMG10)].filter(u => u.startsWith('http')),
        contact:      col(r, R.CONTACT),
        postUrl:      col(r, R.POST_URL),
        date:         col(r, R.DATE),
        mlsUrl:       col(r, R.MLS_URL) || col(r, R.POST_URL),
        slug:         mlsUrlToSlug(col(r, R.MLS_URL)) || slugify(title, col(r, R.POST_URL)),
        neighborhood: detectNeighborhood(text, title, district),
        vi_title:     '',
        vi_text:      '',
        forSale:      false,
      };
      warnIfBadData(listing, 'Sheet1/Rentals');
      return listing;
    });
}

export async function getListings(): Promise<Listing[]> {
  const text = await fetchCSV(CSV_RENTALS, rentalsCache);
  return parseRows(parseCSV(text).slice(1));
}

export async function getForSaleListings(): Promise<Listing[]> {
  const text = await fetchCSV(CSV_FORSALE, forSaleCache);
  const rows = parseCSV(text).slice(1);
  return rows
    .filter(r => col(r, FS.TITLE))
    .map(r => {
      const title    = col(r, FS.TITLE);
      const text     = col(r, FS.TEXT);
      const district = normalizeDistrict(col(r, FS.DISTRICT));
      const listing: Listing = {
        title,
        text,
        price:        col(r, FS.PRICE),
        district,
        bedrooms:     col(r, FS.BEDROOMS),
        type:         col(r, FS.TYPE),
        agent:        col(r, FS.AGENT),
        images:       [
          col(r, FS.IMG1),  col(r, FS.IMG2),  col(r, FS.IMG3),
          col(r, FS.IMG4),  col(r, FS.IMG5),  col(r, FS.IMG6),
          col(r, FS.IMG7),  col(r, FS.IMG8),  col(r, FS.IMG9),
          col(r, FS.IMG10),
        ].filter(u => u.startsWith('http')),
        contact:      col(r, FS.CONTACT),
        postUrl:      col(r, FS.POST_URL),
        date:         col(r, FS.DATE),
        mlsUrl:       col(r, FS.POST_URL),
        slug:         slugify(title, col(r, FS.POST_URL)),
        neighborhood: detectNeighborhood(text, title, district),
        vi_title:     col(r, FS.VI_TITLE),
        vi_text:      col(r, FS.VI_TEXT),
        forSale:      true,
      };
      warnIfBadData(listing, 'For Sale');
      return listing;
    })
    .filter(listing => {
      if (!listing.price) return true; // keep price-unknown listings
      const numeric = parseFloat(listing.price.replace(/[^0-9.]/g, ''));
      return isNaN(numeric) || numeric >= 10000;
    })
    .sort((a, b) => {
      const ta = a.date ? new Date(a.date).getTime() : 0;
      const tb = b.date ? new Date(b.date).getTime() : 0;
      return tb - ta;
    });
}

export function getUniqueValues(listings: Listing[], key: keyof Listing): string[] {
  const values = listings
    .map(l => l[key] as string)
    .filter(Boolean)
    .flatMap(v => v.split(',').map(s => s.trim()))
    .filter(Boolean);
  return [...new Set(values)].sort();
}
