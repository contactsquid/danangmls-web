-- ─────────────────────────────────────────────────────────────────────────────
-- Agent listing portal — Phase 1 schema
--
-- Scope (per the product decision on 2026-08-13):
--   open signup + email verification + user-owned agent profiles + admin delete.
--
-- What lives WHERE — this is the load-bearing rule of the whole design:
--   • LISTINGS stay in the Google Sheet. Nothing here duplicates them. The site
--     keeps rendering listings exactly as it does today.
--   • THIS DATABASE holds only accounts, profiles and moderation state.
--   • A profile is joined to its listings by NAME: agent_profiles.listing_agent_name
--     is matched (case/space-insensitively) against the sheet's "Agent" column.
--
-- Why that name is NOT free-for-all: the sheet's Agent column is public data, so
-- a stranger could sign up, type a prolific agent's name and inherit their whole
-- portfolio. So the name is *claimed* by the user but only takes effect once an
-- admin sets listing_agent_name_verified. Until then the profile renders bio and
-- photo but zero listings. See public.agent_public for the enforced view.
-- ─────────────────────────────────────────────────────────────────────────────

-- ─── Slug generation ─────────────────────────────────────────────────────────
-- Profiles live at /agent/<slug>. Slugs are derived from the display name so the
-- URL reads like /agent/blake-barnett rather than an opaque id.

-- Static-route names that must never be taken by a profile slug. Next.js resolves
-- static segments before dynamic ones, so a profile slugged "signup" would simply
-- be unreachable — better to never mint it.
create or replace function public.slug_is_reserved(candidate text)
returns boolean
language sql
immutable
as $$
  select candidate = any (array[
    'account','admin','api','agent','agents','auth','login','logout','signup',
    'signin','signout','profile','dashboard','new','edit','delete','settings',
    'listing','listings','for-rent','for-sale','vi','about','contact','terms',
    'privacy-policy','sitemap','robots','favicon','_next','static','null','undefined'
  ]);
$$;

-- Lowercase, ASCII-fold, collapse everything else to single hyphens.
-- unaccent() is avoided on purpose so this needs no extension: Vietnamese names
-- simply lose their diacritics to the [^a-z0-9]+ pass, which is what we want in
-- a URL anyway ("Nguyễn Văn A" -> "nguy-n-v-n-a" is ugly, so we translate the
-- common Vietnamese vowels explicitly first).
create or replace function public.slugify(input text)
returns text
language sql
immutable
as $$
  -- lower() runs BEFORE translate() on purpose. The mapping table below only
  -- lists lowercase forms, so folding case first is what lets a name like
  -- "Đặng Thị Mai" become "dang-thi-mai" instead of losing its capitals to the
  -- [^a-z0-9] pass ("ang-thi-mai"). Both strings are 67 characters; if they ever
  -- drift apart Postgres silently *deletes* the surplus rather than erroring.
  select trim(both '-' from regexp_replace(
    translate(
      lower(coalesce(input, '')),
      'àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ',
      'aaaaaaaaaaaaaaaaaeeeeeeeeeeeiiiiiooooooooooooooooouuuuuuuuuuuyyyyyd'
    ),
    '[^a-z0-9]+', '-', 'g'
  ));
$$;

-- Returns a slug that is both non-reserved and unique, suffixing -2, -3 … on
-- collision. Falls back to "agent" when a name slugifies to nothing at all
-- (e.g. a purely non-Latin display name).
create or replace function public.unique_agent_slug(display_name text)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  base      text := public.slugify(display_name);
  candidate text;
  n         int  := 1;
begin
  if base is null or base = '' then
    base := 'agent';
  end if;
  base := left(base, 60);

  candidate := base;
  -- Reserved names and existing slugs share the same escape hatch: bump a counter.
  while public.slug_is_reserved(candidate)
     or exists (select 1 from public.agent_profiles where slug = candidate) loop
    n := n + 1;
    candidate := base || '-' || n;
  end loop;

  return candidate;
end;
$$;

-- ─── Profiles ────────────────────────────────────────────────────────────────
create table if not exists public.agent_profiles (
  id                          uuid primary key references auth.users (id) on delete cascade,
  slug                        text        not null unique,
  display_name                text        not null,
  bio                         text        not null default '',
  photo_url                   text,

  -- "Where they work". Most Da Nang agents are independent, so that is a
  -- first-class value rather than an empty string.
  workplace                   text        not null default 'Independent',

  -- Deliberately NOT rendered publicly in Phase 1. Listings funnel every lead to
  -- danang.homes; showing an agent phone is the one guaranteed lead leak. Stored
  -- so admins can reach the person, and so it is ready if that policy changes.
  phone                       text,

  -- Join key to the Google Sheet's "Agent" column (see file header).
  listing_agent_name          text,
  listing_agent_name_verified boolean     not null default false,

  -- 'active' profiles are public. Admins flip to 'suspended' to hide spam
  -- without destroying the auth user; hard deletes cascade from auth.users.
  status                      text        not null default 'active'
                                check (status in ('active', 'suspended')),
  is_admin                    boolean     not null default false,

  created_at                  timestamptz not null default now(),
  updated_at                  timestamptz not null default now()
);

comment on column public.agent_profiles.listing_agent_name is
  'Matched against the Google Sheet Agent column. Only honoured when listing_agent_name_verified is true.';

create index if not exists agent_profiles_status_idx on public.agent_profiles (status);
create index if not exists agent_profiles_listing_agent_idx
  on public.agent_profiles (lower(trim(listing_agent_name)))
  where listing_agent_name_verified;

-- ─── updated_at ──────────────────────────────────────────────────────────────
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists agent_profiles_touch_updated_at on public.agent_profiles;
create trigger agent_profiles_touch_updated_at
  before update on public.agent_profiles
  for each row execute function public.touch_updated_at();

-- ─── Profile row is created with the auth user ───────────────────────────────
-- Doing this in a trigger rather than from the app removes the window where a
-- verified user exists with no profile (and the retry logic that would need).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  name text := nullif(trim(coalesce(new.raw_user_meta_data ->> 'display_name', '')), '');
begin
  if name is null then
    -- Fall back to the local part of the email so the profile is never nameless.
    name := split_part(new.email, '@', 1);
  end if;

  insert into public.agent_profiles (id, slug, display_name)
  values (new.id, public.unique_agent_slug(name), name)
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ─── Admin check ─────────────────────────────────────────────────────────────
-- SECURITY DEFINER so it reads agent_profiles with RLS bypassed. A policy on
-- agent_profiles that selected from agent_profiles directly would recurse.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (select p.is_admin from public.agent_profiles p where p.id = auth.uid()),
    false
  );
$$;

-- ─── Row level security ──────────────────────────────────────────────────────
alter table public.agent_profiles enable row level security;

-- NOTE there is deliberately NO "anyone may read active profiles" policy here.
-- Such a policy grants SELECT on the whole ROW, and the anon key speaks
-- PostgREST directly — so `/rest/v1/agent_profiles?select=phone` would hand every
-- agent's private phone number to the open internet, no matter what the site's
-- own pages choose to render. Public reads go exclusively through the
-- agent_public view below, which is a fixed, phone-free projection.
drop policy if exists "active profiles are public" on public.agent_profiles;

drop policy if exists "owners read own profile" on public.agent_profiles;
create policy "owners read own profile"
  on public.agent_profiles for select
  using (auth.uid() = id);

drop policy if exists "admins read all profiles" on public.agent_profiles;
create policy "admins read all profiles"
  on public.agent_profiles for select
  using (public.is_admin());

-- Owners may edit their own profile. The privileged columns are protected by the
-- guard_privileged_columns trigger below rather than by a WITH CHECK expression:
-- a WITH CHECK that sub-selected from agent_profiles would be a policy on
-- agent_profiles querying agent_profiles, which Postgres rejects as infinite
-- recursion. A BEFORE UPDATE trigger sees OLD and NEW directly and needs no
-- subquery at all.
drop policy if exists "owners update own profile" on public.agent_profiles;
create policy "owners update own profile"
  on public.agent_profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

drop policy if exists "admins update any profile" on public.agent_profiles;
create policy "admins update any profile"
  on public.agent_profiles for update
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "admins delete profiles" on public.agent_profiles;
create policy "admins delete profiles"
  on public.agent_profiles for delete
  using (public.is_admin());

-- No INSERT policy on purpose: rows are created solely by the on_auth_user_created
-- trigger, which is SECURITY DEFINER and therefore not subject to RLS.

-- ─── Privilege-escalation guard ──────────────────────────────────────────────
-- Stops an agent from PATCHing their own row (the anon key speaks PostgREST, so
-- the update path is reachable directly, not only through our form) to grant
-- themselves admin, un-hide a suspended profile, self-verify their listing-name
-- claim, or move their profile to a different URL. Admins are exempt — that is
-- how the moderation screen does its work.
create or replace function public.guard_privileged_columns()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    new.id                          := old.id;
    new.slug                        := old.slug;
    new.is_admin                    := old.is_admin;
    new.status                      := old.status;
    new.listing_agent_name_verified := old.listing_agent_name_verified;
    new.created_at                  := old.created_at;
  end if;
  return new;
end;
$$;

drop trigger if exists agent_profiles_guard_privileged on public.agent_profiles;
create trigger agent_profiles_guard_privileged
  before update on public.agent_profiles
  for each row execute function public.guard_privileged_columns();

-- A verified claim must not survive a change to the name it was granted for,
-- or an agent could get "Some Trusted Agent" approved and then quietly retarget
-- it. Runs after the guard above, so it applies to admins too.
create or replace function public.reset_verification_on_name_change()
returns trigger
language plpgsql
as $$
begin
  if new.listing_agent_name is distinct from old.listing_agent_name
     and new.listing_agent_name_verified = old.listing_agent_name_verified then
    new.listing_agent_name_verified := false;
  end if;
  return new;
end;
$$;

drop trigger if exists agent_profiles_reset_verification on public.agent_profiles;
create trigger agent_profiles_reset_verification
  before update on public.agent_profiles
  for each row execute function public.reset_verification_on_name_change();

-- ─── Table grants ────────────────────────────────────────────────────────────
-- Supabase's default privileges usually cover this, but being explicit means the
-- migration does not depend on that project setting. RLS above is what actually
-- constrains which rows these roles can touch.
-- anon gets nothing on the base table: its only route to profile data is the
-- agent_public view. authenticated needs the table so an agent can read and edit
-- their own row (and an admin the rest) — RLS is what narrows that to the right
-- rows, and the guard trigger to the right columns.
revoke all on public.agent_profiles from anon;
grant select, update, delete on public.agent_profiles to authenticated;

-- ─── Public projection ───────────────────────────────────────────────────────
-- The site reads this view, never the table. It guarantees two things structurally
-- rather than by remembering to filter in application code:
--   1. private columns (phone, email-adjacent, admin flags) are never exposed;
--   2. an unverified listing_agent_name is served as NULL, so an unapproved claim
--      can never pull another agent's listings onto a profile page.
--
-- security_invoker is OFF (the default) on purpose. The view therefore runs with
-- its owner's rights, which is the only way it can read a table that anon has no
-- privilege on at all. That inversion is the point: the table is sealed, and this
-- view is the single, audited hole in it. Its WHERE clause supplies the row
-- filter that RLS would otherwise provide, and its column list supplies the
-- projection. Supabase's linter flags security-definer views generically — this
-- one is intentional; making it security_invoker would force us to re-open
-- SELECT on the base table and reintroduce the phone-number leak described above.
create or replace view public.agent_public as
  select
    p.slug,
    p.display_name,
    p.bio,
    p.photo_url,
    p.workplace,
    case when p.listing_agent_name_verified then p.listing_agent_name end as listing_agent_name,
    p.listing_agent_name_verified as verified,
    p.created_at
  from public.agent_profiles p
  where p.status = 'active';

-- CREATE OR REPLACE VIEW does not reset storage parameters, so an earlier
-- deployment that set security_invoker would keep it. Pin it explicitly.
alter view public.agent_public set (security_invoker = false);

grant select on public.agent_public to anon, authenticated;

-- ─── Storage: profile photos ─────────────────────────────────────────────────
insert into storage.buckets (id, name, public)
values ('agent-photos', 'agent-photos', true)
on conflict (id) do nothing;

-- Each user owns the folder named after their uid: agent-photos/<uid>/avatar.jpg
drop policy if exists "agent photos are public" on storage.objects;
create policy "agent photos are public"
  on storage.objects for select
  using (bucket_id = 'agent-photos');

drop policy if exists "users upload own agent photo" on storage.objects;
create policy "users upload own agent photo"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'agent-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "users update own agent photo" on storage.objects;
create policy "users update own agent photo"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'agent-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "users delete own agent photo" on storage.objects;
create policy "users delete own agent photo"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'agent-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
