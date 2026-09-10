import type { Listing } from './types';

// Expired listings live in R2 as one small JSON per slug, written by
// maintain-sheet.js at the moment the row leaves the live sheet.
//
// Why R2 and not another sheet tab: measured 2026-09-10, the site takes ~250 new
// listings a day at ~3.2KB each. A 90-day archive as CSV is ~69MB — larger than
// the 38MB of live CSV that already broke production. Google Sheets also caps a
// spreadsheet at 10M cells, which this pipeline would reach in ~3.6 years.
// One object per slug is O(1) to read, edge-cached, and R2 egress is free:
// ten years of history is ~2.7GB, about $0.49/year.
const ARCHIVE_BASE = 'https://images.danang.homes/archive';

// Small in-process memo so a page that looks up the same slug twice (metadata +
// render) only fetches once.
const memo = new Map<string, Listing | null>();

export function archiveKey(slug: string): string {
  return `archive/${slug}.json`;
}

export async function getArchivedListing(slug: string): Promise<Listing | null> {
  if (memo.has(slug)) return memo.get(slug) ?? null;
  // Safe to cache: these are ~3KB, nowhere near the fetch-cache size limit that
  // truncates the multi-MB sheet CSVs (see fetchCSV in sheets.ts).
  let out: Listing | null = null;
  try {
    const res = await fetch(`${ARCHIVE_BASE}/${encodeURIComponent(slug)}.json`, {
      next: { revalidate: 86400 },
    });
    if (res.ok) {
      const j = (await res.json()) as Partial<Listing>;
      // Only trust a payload that actually looks like a listing.
      if (j && typeof j.slug === 'string' && typeof j.title === 'string') {
        out = j as Listing;
      }
    }
  } catch {
    out = null; // archive is best-effort; a miss just falls through to notFound()
  }
  if (memo.size > 500) memo.clear();
  memo.set(slug, out);
  return out;
}
