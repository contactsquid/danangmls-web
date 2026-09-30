import 'server-only';
import { createHash } from 'node:crypto';
import { createAdminClient } from './supabase/server';
import { getListings, getForSaleListings } from './sheets';
import { priceLow } from './price';
import type { Listing } from './types';

// Sheet → Supabase sync for the shared `listings` table (supabase/migrations/0003).
// Approved by Blake 2026-09-30: one listings table for the whole MLS family, each city
// site syncing its own city from a cron in its own Vercel project, lotusmls reading all.
//
// It stores EXACTLY what this site shows today: the rows come from getListings() /
// getForSaleListings(), the same transform every page uses (districts, map placement,
// the R2-only photo rule, prompt-echo stripping…). So Supabase can never disagree with
// the site about what a listing is — only about when it was last synced.
//
// Safety: rows are never deleted. A listing that leaves the sheet is marked
// listed = false. And if a run sees far fewer listings than are currently listed, it
// refuses to unlist anything (a truncated or failed sheet read looks exactly like that)
// and records why in listing_sync_runs.

/** This site's city. The ONLY line that differs between the three repos' copies. */
export const CITY = 'danang' as const;

// Refuse a run that would unlist more than this share of the city's listed rows.
const MAX_UNLIST_SHARE = 0.3;
const MIN_LISTED_TO_CHECK = 50;
const BATCH = 250;

type Kind = 'rent' | 'sale';

/** What grids, maps and popups need: the listing without its long texts. Keeps the
 *  same shape as Listing so existing components take it unchanged. */
function cardOf(l: Listing): Listing {
  return { ...l, text: '', vi_text: '', ko_text: '', ru_text: '', contact: '', images: l.images.slice(0, 5) };
}

/** Postgres jsonb rejects NUL characters and lone UTF-16 surrogates (half an emoji),
 *  and a few scraped posts carry them. Strip both, everywhere in the listing. */
function clean<T>(v: T): T {
  return JSON.parse(JSON.stringify(v)
    .replace(/\\u0000/g, '')
    // JSON.stringify writes a LONE surrogate as an escape (valid pairs stay as characters),
    // so any \\udXXX escape left in its output is a broken half-emoji.
    .replace(/\\u[dD][89a-fA-F][0-9a-fA-F]{2}/g, ''));
}

function rowOf(raw: Listing, kind: Kind) {
  const l = clean(raw);
  const data = l;
  const content_hash = createHash('sha1').update(JSON.stringify(data)).digest('hex');
  const low = priceLow(l.price || '');
  return {
    city: CITY,
    kind,
    slug: l.slug,
    post_url: l.postUrl || null,
    title: l.title || '',
    price: l.price || '',
    price_usd: low > 0 ? low : null,
    district: l.district || '',
    neighborhood: l.neighborhood || '',
    bedrooms: l.bedrooms || '',
    type: l.type || '',
    agent: l.agent || '',
    image: l.images[0] ?? null,
    listed_date: l.date || '',
    lat: l.geo ? l.geo[0] : null,
    lng: l.geo ? l.geo[1] : null,
    geo_precision: l.geo ? l.geo[2] : null,
    foreign_eligible: Boolean(l.foreignEligible),
    card: cardOf(l),
    data,
    content_hash,
  };
}

export interface SyncReport {
  city: string; dryRun: boolean;
  rentSeen: number; saleSeen: number; duplicateSlugs: number;
  unchanged: number; upserted: number; unlisted: number; aborted?: string;
}

export async function syncListings({ dryRun = false } = {}): Promise<SyncReport> {
  const startedAt = new Date().toISOString();
  const db = createAdminClient();
  if (!db) throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set');

  const [rent, sale] = await Promise.all([getListings(), getForSaleListings()]);
  const report: SyncReport = { city: CITY, dryRun, rentSeen: rent.length, saleSeen: sale.length, duplicateSlugs: 0, unchanged: 0, upserted: 0, unlisted: 0 };

  // One row per slug. A rental and a sale can't share a slug in practice (the suffix
  // hashes the post URL), but if it ever happens the first one wins and it's counted.
  const rows = new Map<string, ReturnType<typeof rowOf>>();
  for (const [list, kind] of [[rent, 'rent'], [sale, 'sale']] as const) {
    for (const l of list) {
      if (!l.slug) continue;
      if (rows.has(l.slug)) { report.duplicateSlugs++; continue; }
      rows.set(l.slug, rowOf(l, kind));
    }
  }

  // What's there now (small: slug, hash, listed).
  const existing = new Map<string, { hash: string; listed: boolean }>();
  for (let from = 0; ; from += 1000) {
    const { data, error } = await db.from('listings').select('slug, content_hash, listed').eq('city', CITY).range(from, from + 999);
    if (error) throw new Error(`read existing: ${error.message}`);
    for (const r of data ?? []) existing.set(r.slug, { hash: r.content_hash, listed: r.listed });
    if (!data || data.length < 1000) break;
  }

  const now = new Date().toISOString();
  const changed = [...rows.values()].filter(r => {
    const e = existing.get(r.slug);
    return !e || e.hash !== r.content_hash || !e.listed;
  });
  report.unchanged = rows.size - changed.length;
  const toUnlist = [...existing.entries()].filter(([slug, e]) => e.listed && !rows.has(slug)).map(([slug]) => slug);
  const listedNow = [...existing.values()].filter(e => e.listed).length;

  if (listedNow >= MIN_LISTED_TO_CHECK && toUnlist.length / listedNow > MAX_UNLIST_SHARE) {
    report.aborted = `would unlist ${toUnlist.length} of ${listedNow} listed rows (sheet read ${rows.size})`;
  }

  if (!dryRun && !report.aborted) {
    for (let i = 0; i < changed.length; i += BATCH) {
      const batch = changed.slice(i, i + BATCH).map(r => ({ ...r, listed: true, last_seen: now, updated_at: now }));
      const { error } = await db.from('listings').upsert(batch, { onConflict: 'city,slug' });
      if (error) throw new Error(`upsert: ${error.message}`);
      report.upserted += batch.length;
    }
    // Small batches: PostgREST puts the IN list in the URL.
    for (let i = 0; i < toUnlist.length; i += 100) {
      const { error } = await db.from('listings').update({ listed: false, updated_at: now }).eq('city', CITY).in('slug', toUnlist.slice(i, i + 100));
      if (error) throw new Error(`unlist: ${error.message}`);
      report.unlisted += Math.min(100, toUnlist.length - i);
    }
  } else if (dryRun) {
    report.upserted = changed.length;
    report.unlisted = report.aborted ? 0 : toUnlist.length;
  }

  if (!dryRun) {
    await db.from('listing_sync_runs').insert({
      city: CITY, started_at: startedAt, finished_at: new Date().toISOString(), rent_seen: rent.length, sale_seen: sale.length,
      upserted: report.upserted, unlisted: report.unlisted, aborted: report.aborted ?? null,
    });
  }
  return report;
}
