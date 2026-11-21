// Reads this site's listings from the shared Supabase `listings` table (migration 0003).
// Returns each row's full `data` record — exactly what getListingsFromSheet() builds, long
// descriptions included — so every page takes it unchanged. Only used when
// LISTINGS_SOURCE=supabase (see lib/sheets.ts). Anon key + RLS: anon can only SELECT listed rows.
import type { Listing } from './types';
import { CITY } from './listingSync';

const URL_BASE = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';
const PAGE = 250;                 // full records are ~4 KB each: ~1 MB a page, under the 2 MB fetch-cache cap
const TTL_MS = 5 * 60 * 1000;     // the sync runs every 10 minutes

type Kind = 'rent' | 'sale';

async function rest(path: string, extra: Record<string, string> = {}) {
  if (!URL_BASE || !KEY) throw new Error('Supabase env is not set');
  const res = await fetch(`${URL_BASE}/rest/v1/${path}`, { headers: { apikey: KEY, Authorization: `Bearer ${KEY}`, ...extra }, next: { revalidate: 300 } });
  if (!res.ok) throw new Error(`listings ${res.status}: ${(await res.text()).slice(0, 200)}`);
  return res;
}

async function load(kind: Kind): Promise<Listing[]> {
  const filter = `city=eq.${CITY}&kind=eq.${kind}&listed=eq.true`;
  const head = await rest(`listings?select=slug&${filter}&limit=1`, { Prefer: 'count=exact' });
  const total = Number((head.headers.get('content-range') || '').split('/')[1] || 0);
  const pages = Math.ceil(total / PAGE);
  const chunks = await Promise.all(Array.from({ length: pages }, (_, i) =>
    rest(`listings?select=data&${filter}&order=listed_at.desc.nullslast,slug.asc&offset=${i * PAGE}&limit=${PAGE}`)
      .then(r => r.json() as Promise<{ data: Listing | null }[]>)));
  const out = chunks.flat().map(r => r.data).filter((d): d is Listing => !!d);
  // An empty answer for a site that has listings means the table is wrong, not that the market is empty.
  if (out.length === 0) throw new Error(`no ${kind} rows for ${CITY} in Supabase`);
  return out;
}

const cache = new Map<Kind, { at: number; p: Promise<Listing[]> }>();
export function loadListingsFromDb(kind: Kind): Promise<Listing[]> {
  const hit = cache.get(kind);
  if (hit && Date.now() - hit.at < TTL_MS) return hit.p;
  const p = load(kind).catch(e => { cache.delete(kind); throw e; });
  cache.set(kind, { at: Date.now(), p });
  return p;
}
