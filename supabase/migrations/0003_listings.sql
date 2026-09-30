-- 0003_listings.sql — the shared listings serving layer (approved by Blake 2026-09-30).
--
-- ONE table for the whole MLS family: danangmls, saigonmls and hanoimls each sync their
-- own city into it (a cron inside each site's Vercel project, running that site's own
-- lib/sheets.ts transform), and lotusmls reads every city. Google Sheets stay the intake
-- and editing layer; n8n is untouched.
--
-- Rows are never deleted by the sync: a listing that leaves its sheet is marked
-- listed = false, so a bad sheet read can't empty a site, and a returning listing keeps
-- its first_seen.

create table if not exists public.listings (
  city            text        not null check (city in ('danang', 'saigon', 'hanoi')),
  kind            text        not null check (kind in ('rent', 'sale')),
  slug            text        not null,
  post_url        text,
  title           text        not null default '',
  price           text        not null default '',
  price_usd       numeric,                          -- low end of the price, USD; null = on request
  district        text        not null default '',
  neighborhood    text        not null default '',
  bedrooms        text        not null default '',
  type            text        not null default '',
  agent           text        not null default '',
  image           text,                             -- first servable photo (cards, maps, OG)
  listed_date     text        not null default '',  -- the sheet's Date cell, as written
  lat             double precision,
  lng             double precision,
  geo_precision   smallint,
  foreign_eligible boolean    not null default false,
  card            jsonb       not null,             -- the fields grids/maps/popups need
  data            jsonb       not null,             -- the full Listing, exactly as lib/sheets.ts builds it
  content_hash    text        not null,
  listed          boolean     not null default true,
  first_seen      timestamptz not null default now(),
  last_seen       timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  primary key (city, slug)
);

create index if not exists listings_city_kind_listed_idx on public.listings (city, kind, listed);
create index if not exists listings_city_kind_district_idx on public.listings (city, kind, district) where listed;
create index if not exists listings_city_kind_type_idx on public.listings (city, kind, type) where listed;
create index if not exists listings_post_url_idx on public.listings (post_url);

alter table public.listings enable row level security;

-- Listings are public data: anyone may read LISTED rows. Nobody but the server writes.
drop policy if exists listings_public_read on public.listings;
create policy listings_public_read on public.listings for select to anon, authenticated using (listed);

-- Supabase's default privileges hand anon/authenticated TRUNCATE, TRIGGER and REFERENCES
-- on new tables; RLS does not apply to TRUNCATE. Read-only means read-only.
revoke all on public.listings from anon, authenticated;
grant select on public.listings to anon, authenticated;
-- Explicit: this project has auto-expose OFF, so service_role gets nothing implicitly
-- (the agent_profiles and listing_stats outages both came from a missing grant).
grant select, insert, update, delete on public.listings to service_role;

-- One row per sync run per city: what it saw and what it changed. Lets a parity check
-- or a monitor spot a sync that has stopped or is shrinking a city.
create table if not exists public.listing_sync_runs (
  id          bigint generated always as identity primary key,
  city        text        not null,
  started_at  timestamptz not null default now(),
  finished_at timestamptz,
  rent_seen   integer,
  sale_seen   integer,
  upserted    integer,
  unlisted    integer,
  aborted     text                                 -- why it refused to write, if it did
);
alter table public.listing_sync_runs enable row level security;
grant select, insert, update on public.listing_sync_runs to service_role;
grant usage on sequence public.listing_sync_runs_id_seq to service_role;

revoke all on public.listing_sync_runs from anon, authenticated;
