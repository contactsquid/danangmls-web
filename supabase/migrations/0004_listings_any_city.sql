-- 0004: listings may belong to ANY Vietnamese city (lotusmls.com, 2026-10-01): the 25
-- scraped cities plus wherever an agent posts directly. The city is a lowercase slug.
alter table public.listings drop constraint if exists listings_city_check;
alter table public.listings add constraint listings_city_slug check (city ~ '^[a-z0-9]+(-[a-z0-9]+)*$');
create index if not exists listings_kind_listed_date_idx on public.listings (kind, listed, listed_date desc);

-- Listing counts per city for lotusmls's City autocomplete (only cities that have listings).
create or replace view public.listing_city_counts with (security_invoker = true) as
  select city, kind, count(*)::int as listings
  from public.listings where listed group by city, kind;
revoke all on public.listing_city_counts from anon, authenticated;
grant select on public.listing_city_counts to anon, authenticated, service_role;
