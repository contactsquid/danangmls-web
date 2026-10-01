-- 0005: which SITE owns a row (2026-10-01). Until now each city site's sync owned every
-- row of its city, so an agent posting a Hanoi listing on lotusmls.com would have been
-- unlisted by hanoimls's next sync ("not in my sheet"). Each sync now reads and unlists
-- only rows whose source is its own site.
alter table public.listings add column if not exists source text;
update public.listings set source = case city when 'danang' then 'danangmls' when 'saigon' then 'saigonmls' when 'hanoi' then 'hanoimls' else 'lotusmls' end where source is null;
alter table public.listings alter column source set not null;
alter table public.listings add constraint listings_source_check check (source in ('danangmls', 'saigonmls', 'hanoimls', 'lotusmls'));
create index if not exists listings_source_idx on public.listings (source);
