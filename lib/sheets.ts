import { Listing } from './types';
import { detectNeighborhood } from './neighborhoods';

const SPREADSHEET_ID = '14hGuwUcb308n3h1ODyby97WqHa7uRUyyYAKMHgWnyUE';
const CSV_RENTALS   = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:csv&sheet=Sheet1`;
const CSV_FORSALE   = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:csv&sheet=For%20Sale`;

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

function parseRows(rows: string[][]): Listing[] {
  return rows
    .filter(r => col(r, 0))
    .reverse()
    .map((r, i) => {
      const title    = col(r, 0);
      const text     = col(r, 1);
      const district = col(r, 3);
      return {
        title,
        text,
        price:        col(r, 2),
        district,
        bedrooms:     col(r, 4),
        type:         col(r, 5),
        agent:        col(r, 6),
        images:       [col(r, 7), col(r, 8), col(r, 9), col(r, 10), col(r, 11)].filter(Boolean),
        contact:      col(r, 12),
        postUrl:      col(r, 14),
        date:         col(r, 15),
        mlsUrl:       col(r, 17) || col(r, 14),
        slug:         slugify(title, col(r, 14)),
        neighborhood: detectNeighborhood(text, title, district),
        vi_title:     '',
        vi_text:      '',
      };
    });
}

export async function getListings(): Promise<Listing[]> {
  const res = await fetch(CSV_RENTALS, { next: { revalidate: 300 } });
  return parseRows(parseCSV(await res.text()).slice(1));
}

export async function getForSaleListings(): Promise<Listing[]> {
  const res = await fetch(CSV_FORSALE, { next: { revalidate: 300 } });
  const rows = parseCSV(await res.text()).slice(1);
  return rows
    .filter(r => col(r, 0))
    .map((r, i) => {
      const title    = col(r, 0);
      const text     = col(r, 1);
      const district = col(r, 3);
      // For Sale sheet has 10 images (cols 7-16), postUrl at col 19, date at col 20
      return {
        title,
        text,
        price:        col(r, 2),
        district,
        bedrooms:     col(r, 4),
        type:         col(r, 5),
        agent:        col(r, 6),
        images:       [col(r,7),col(r,8),col(r,9),col(r,10),col(r,11),col(r,12),col(r,13),col(r,14),col(r,15),col(r,16)].filter(Boolean),
        contact:      col(r, 17),
        postUrl:      col(r, 19),
        date:         col(r, 20),
        mlsUrl:       col(r, 19),
        slug:         slugify(title, col(r, 19)),
        neighborhood: detectNeighborhood(text, title, district),
        vi_title:     col(r, 21),
        vi_text:      col(r, 22),
      };
    })
    .sort((a, b) => new Date(b.date || '').getTime() - new Date(a.date || '').getTime());
}

export function getUniqueValues(listings: Listing[], key: keyof Listing): string[] {
  const values = listings
    .map(l => l[key] as string)
    .filter(Boolean)
    .flatMap(v => v.split(',').map(s => s.trim()))
    .filter(Boolean);
  return [...new Set(values)].sort();
}
