// Every listing a building has had on DanangMLS, past and present, for the /apartmentdetails page.
// Supabase `listings` keeps every row it ever synced (gone rows are listed=false, never deleted), so it is
// the only place that knows a building's past listings. It stores short cards without descriptions, so each
// listing's full text comes from the live sheet, else its archived copy, else the card alone.
import { getListings, getForSaleListings } from './sheets';
import { getArchivedListing } from './archive';
import { buildingMatches, type BuildingDef } from './buildingDefs';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './supabase/config';
import { unitDetails, type UnitDetails } from './unitDetails';
import type { Listing } from './types';

export type BuildingEvent = { listing: Listing; live: boolean; when: number; unit: UnitDetails };

type Row = { slug: string; kind: string; listed: boolean; listed_at: string | null; card: Listing | null };

async function supabaseRows(b: BuildingDef): Promise<Row[]> {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return [];
  const term = encodeURIComponent(`*${b.search}*`);
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/listings?source=eq.danangmls&title=ilike.${term}&select=slug,kind,listed,listed_at,card&order=listed_at.desc&limit=500`,
      { headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` }, next: { revalidate: 300 } },
    );
    return res.ok ? (await res.json()) as Row[] : [];
  } catch { return []; }
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
    const l = live.get(slug) ?? await getArchivedListing(slug) ?? bySlug.get(slug)?.card ?? null;
    if (!l) return;
    const when = Date.parse(l.date) || Date.parse(bySlug.get(slug)?.listed_at || '') || 0;
    events.push({ listing: l, live: live.has(slug), when, unit: unitDetails(l) });
  }));
  events.sort((a, b2) => b2.when - a.when);
  return { events, live: [...live.values()], all: [...rentals, ...forSale] };
}
