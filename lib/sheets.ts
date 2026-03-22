import { Listing } from './types';

const SPREADSHEET_ID = '14hGuwUcb308n3h1ODyby97WqHa7uRUyyYAKMHgWnyUE';
const CSV_URL = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:csv&sheet=Sheet1`;

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

function slugify(text: string, index: number): string {
  return (
    text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 60) + '-' + index
  );
}

export async function getListings(): Promise<Listing[]> {
  const res = await fetch(CSV_URL, { next: { revalidate: 1800 } });
  const text = await res.text();
  const rows = parseCSV(text).slice(1); // skip header

  return rows
    .filter(r => col(r, 0)) // must have title
    .map((r, i) => ({
      title:    col(r, 0),
      text:     col(r, 1),
      price:    col(r, 2),
      district: col(r, 3),
      bedrooms: col(r, 4),
      type:     col(r, 5),
      agent:    col(r, 6),
      images:   [col(r, 7), col(r, 8), col(r, 9), col(r, 10), col(r, 11)].filter(Boolean),
      contact:  col(r, 12),
      postUrl:  col(r, 14),
      date:     col(r, 15),
      mlsUrl:   col(r, 17) || col(r, 14), // fall back to original post URL
      slug:     slugify(col(r, 0), i),
    }));
}

export function getUniqueValues(listings: Listing[], key: keyof Listing): string[] {
  const values = listings
    .map(l => l[key] as string)
    .filter(Boolean)
    .flatMap(v => v.split(',').map(s => s.trim()))
    .filter(Boolean);
  return [...new Set(values)].sort();
}
