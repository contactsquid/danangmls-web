-- 0006: fill `source` from `city` when a writer doesn't send it (the city sites' syncs
-- predate 0005). Keeps their inserts working; an explicit source always wins.
create or replace function public.listings_default_source() returns trigger language plpgsql as $$
begin
  if new.source is null then
    new.source := case new.city when 'danang' then 'danangmls' when 'saigon' then 'saigonmls' when 'hanoi' then 'hanoimls' else 'lotusmls' end;
  end if;
  return new;
end $$;
drop trigger if exists listings_default_source on public.listings;
create trigger listings_default_source before insert on public.listings for each row execute function public.listings_default_source();
