-- ─────────────────────────────────────────────────────────────────────────────
-- Agent onboarding email drip — state table
--
-- Three Vietnamese emails per new agent: a welcome the moment their address is
-- confirmed, a reminder a week later, a final nudge a week after that. Reminders
-- go only to agents who still have no listing (see lib/agentDrip/run.ts).
--
-- One row per auth user, created by a trigger the moment the email is CONFIRMED
-- (not at signup — nobody is emailed at an unverified address). The sender
-- stamps each *_sent_at column with an atomic "claim" update before sending, so
-- the auth callback and the daily cron can never double-send.
--
-- Service-role only: RLS is on with no policies, so the anon/authenticated keys
-- see nothing. Only the server (SUPABASE_SERVICE_ROLE_KEY) reads or writes it.
-- ─────────────────────────────────────────────────────────────────────────────

create table if not exists public.agent_email_drip (
  user_id            uuid primary key references auth.users (id) on delete cascade,
  enrolled_at        timestamptz not null default now(),
  welcome_sent_at    timestamptz,
  reminder1_sent_at  timestamptz,
  reminder2_sent_at  timestamptz,
  -- Set once the drip is over for any reason; a stopped row is never emailed again.
  stopped_at         timestamptz,
  stop_reason        text check (stop_reason in
                       ('completed', 'listed', 'unsubscribed', 'suspended', 'admin', 'preexisting'))
);

alter table public.agent_email_drip enable row level security;

-- Auto-expose is OFF on this project, so service_role needs its grant spelled out.
grant select, insert, update, delete on public.agent_email_drip to service_role;

-- ─── Enrol on email confirmation ─────────────────────────────────────────────
create or replace function public.enrol_agent_email_drip()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.email_confirmed_at is not null then
    insert into public.agent_email_drip (user_id)
    values (new.id)
    on conflict (user_id) do nothing;
  end if;
  return new;
end;
$$;

drop trigger if exists on_auth_user_confirmed_drip_update on auth.users;
create trigger on_auth_user_confirmed_drip_update
  after update of email_confirmed_at on auth.users
  for each row
  when (old.email_confirmed_at is null and new.email_confirmed_at is not null)
  execute function public.enrol_agent_email_drip();

drop trigger if exists on_auth_user_confirmed_drip_insert on auth.users;
create trigger on_auth_user_confirmed_drip_insert
  after insert on auth.users
  for each row
  when (new.email_confirmed_at is not null)
  execute function public.enrol_agent_email_drip();

-- ─── Accounts that already exist are NOT part of the drip ────────────────────
-- Blake asked for this for agents who create an account from now on. Existing
-- accounts are recorded as stopped so nobody is emailed out of the blue.
insert into public.agent_email_drip (user_id, stopped_at, stop_reason)
select id, now(), 'preexisting' from auth.users
on conflict (user_id) do nothing;
