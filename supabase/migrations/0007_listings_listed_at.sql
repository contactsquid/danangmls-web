-- listed_at: a real timestamp to sort by (2026-10-02). listed_date is text in four shapes:
-- ISO timestamps, ISO dates, the old sheet's M/D/YYYY, and blank. Sorted as text, every
-- M/D/YYYY row ("8/9/2026") beat every ISO row ("2026-…"), so month-old Da Nang listings
-- led lotusmls.com/for-rent. Blank or unparseable dates fall back to first_seen.
create or replace function public.listing_listed_at(t text, fallback timestamptz)
returns timestamptz language plpgsql immutable as $$
declare p text[];
begin
  t := btrim(coalesce(t, ''));
  if t ~ '^\d{4}-\d{2}-\d{2}T' then return t::timestamptz; end if;
  if t ~ '^\d{4}-\d{2}-\d{2}$' then return (t || 'T00:00:00+07:00')::timestamptz; end if;
  if t ~ '^\d{1,2}/\d{1,2}/\d{4}$' then
    p := string_to_array(t, '/');   -- month/day/year (US order, as the sheet writes it)
    return make_timestamptz(p[3]::int, p[1]::int, p[2]::int, 0, 0, 0, 'Asia/Ho_Chi_Minh');
  end if;
  return fallback;
exception when others then
  return fallback;
end $$;

alter table public.listings add column if not exists listed_at timestamptz;

create or replace function public.listings_set_listed_at() returns trigger language plpgsql as $$
begin
  new.listed_at := public.listing_listed_at(new.listed_date, coalesce(new.first_seen, now()));
  return new;
end $$;

drop trigger if exists listings_listed_at on public.listings;
create trigger listings_listed_at before insert or update of listed_date, first_seen on public.listings
  for each row execute function public.listings_set_listed_at();

update public.listings set listed_at = public.listing_listed_at(listed_date, coalesce(first_seen, now()));

create index if not exists listings_kind_listed_at on public.listings (kind, listed, listed_at desc);

notify pgrst, 'reload schema';
