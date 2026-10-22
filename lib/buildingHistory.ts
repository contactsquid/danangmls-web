// Every listing a building has had on DanangMLS, past and present, for the /apartmentdetails page.
// Supabase `listings` keeps every row it ever synced (gone rows are listed=false, never deleted), so it is
// the only place that knows a building's past listings. It stores short cards without descriptions, so each
// listing's full text comes from the live sheet, else its archived copy, else the card alone.
import { getListings, getForSaleListings } from './sheets';
import { getArchivedListing } from './archive';
import { buildingMatches, type BuildingDef } from './buildingDefs';
import { createAdminClient } from './supabase/server';
import { unitDetails, type UnitDetails } from './unitDetails';
import type { Listing } from './types';

/** `page`: false when only the database card survives (an old deletion with no archive): no page to link to. */
export type BuildingEvent = { listing: Listing; live: boolean; page: boolean; when: number; unit: UnitDetails };

type Row = { slug: string; kind: string; listed: boolean; listed_at: string | null; card: Listing | null };

async function supabaseRows(b: BuildingDef): Promise<Row[]> {
  // Server-only admin client: the listing sync writes with it, so it is known to work in production.
  const db = createAdminClient();
  if (!db) return [];
  try {
    const { data, error } = await db.from('listings')
      .select('slug,kind,listed,listed_at,card')
      .eq('source', 'danangmls').ilike('title', `%${b.search}%`)
      .order('listed_at', { ascending: false }).limit(500);
    if (error) { console.error('[buildingHistory]', error.message); return []; }
    return (data ?? []) as Row[];
  } catch (err) { console.error('[buildingHistory]', err); return []; }
}

export async function getBuildingHistory(b: BuildingDef) {
  const [rows, rentals, forSale] = await Promise.all([
    supabaseRows(b),
    getListings().catch(() => [] as Listing[]),
    getForSaleListings().catch(() => [] as Listing[]),
  ]);
  const live = new Map<string, Listing>();
  for (const l of [...rentals, ...forSale]) if (buildingMatches(b, l)) live.set(l.slug, l);
  const slugs = new Set<string>([...live.keys(), ...rows.filter(r => b.pattern.test(r.card?.title || '')).map(r => r.slug)]);
  const bySlug = new Map(rows.map(r => [r.slug, r]));

  const events: BuildingEvent[] = [];
  await Promise.all([...slugs].map(async slug => {
    const archived = live.has(slug) ? null : await getArchivedListing(slug);
    const l = live.get(slug) ?? archived ?? bySlug.get(slug)?.card ?? null;
    if (!l) return;
    const when = Date.parse(l.date) || Date.parse(bySlug.get(slug)?.listed_at || '') || 0;
    events.push({ listing: l, live: live.has(slug), page: live.has(slug) || Boolean(archived), when, unit: unitDetails(l) });
  }));
  events.sort((a, b2) => b2.when - a.when);
  return { events, live: [...live.values()], all: [...rentals, ...forSale] };
}
