# Agent portal — Supabase setup

Everything in this document is one-time setup. Until it is done the agent portal
is simply dormant: `danangmls.com` builds, deploys and serves listings exactly as
before, `/agents` shows an empty state, and `/agent/<slug>` returns 404. Nothing
breaks.

## What this feature is

Agents sign up with an email address, confirm it, and get a public profile at
`/agent/<their-name>` showing their photo, bio, workplace and **their current
listings**. Admins moderate from one screen at `/admin/agents` — no Supabase
dashboard needed for day-to-day work.

**Listings stay in the Google Sheet.** Supabase holds only accounts, profiles and
moderation state. A profile is linked to listings by matching
`listing_agent_name` against the sheet's *Agent* column.

## Step 1 — create the project

1. Sign up at [supabase.com](https://supabase.com) (free tier is enough).
2. Create a project. Region **Southeast Asia (Singapore)** is closest to Da Nang.
3. Save the database password somewhere safe — it is not needed by the site, but
   it is unrecoverable.

## Step 2 — run the migration

Open the project's **SQL Editor**, paste the whole of
[`supabase/migrations/0001_agent_profiles.sql`](../supabase/migrations/0001_agent_profiles.sql),
and run it. It is idempotent, so re-running it is safe.

It creates the `agent_profiles` table, the public `agent_public` view, row level
security, the moderation triggers, and the `agent-photos` storage bucket.

## Step 3 — configure auth

**Authentication → Providers → Email**

- Enable **Confirm email**. This is the email verification the whole open-signup
  model depends on — without it anyone can sign up as anyone.

**Authentication → URL Configuration**

- Site URL: `https://danangmls.com`
- Redirect URLs — add all of these:
  - `https://danangmls.com/auth/callback`
  - `http://localhost:3000/auth/callback` (local development)
  - `https://*.vercel.app/auth/callback` (preview deploys)

> The free tier's built-in email sender is rate-limited (a handful of messages an
> hour) and its deliverability is poor — fine for testing, not for real signups.
> Before promoting the portal, set up a custom SMTP sender under
> **Project Settings → Auth → SMTP Settings**. `hello@danang.homes` already
> exists; sending from it needs the Phase 2 mailbox (see the email setup notes).

## Step 4 — set the environment variables

From **Project Settings → API**, copy the values into Vercel
(*Settings → Environment Variables*, all environments) and into a local
`.env.local` — see [`.env.local.example`](../.env.local.example).

| Variable | Value | Exposed to browser |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL | yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon / publishable key | yes |
| `SUPABASE_SERVICE_ROLE_KEY` | service_role / secret key | **no — never** |

The service-role key is only used to delete a spam account. Everything else works
without it; the admin screen's "Hide profile" action is the fallback.

Redeploy after setting them.

## Step 5 — make yourself an admin

Sign up through the site first at `/account/signup` and confirm the email. Then in
the Supabase **SQL Editor**:

```sql
update public.agent_profiles
set is_admin = true
where id = (select id from auth.users where email = 'you@example.com');
```

`/admin/agents` is now reachable, and a link to it appears on your profile page.

## How moderation works

At `/admin/agents` each profile shows three actions:

- **Verify & link listings** — connects a profile to the sheet listings posted
  under the name it claims. The screen shows how many listings that name matches
  *before* you approve, so an implausible claim is obvious. Until you approve,
  the profile renders bio and photo but **no listings**.
- **Hide profile** — removes it from the public site, keeps the account.
- **Delete** — removes the account permanently (needs the service-role key).

### Why claims need approving

The sheet's *Agent* column is public data. Without this step a stranger could
sign up, type a prolific agent's name, and inherit their entire portfolio. The
database enforces it rather than trusting the UI: the `agent_public` view serves
an unverified `listing_agent_name` as `NULL`, and a trigger blocks an agent from
verifying themselves. Changing the name after approval automatically revokes
verification.

## Security notes

- The `agent_profiles` table is **not** readable by the anonymous key. All public
  reads go through the `agent_public` view, which excludes `phone` and the admin
  flags. This matters because the anon key speaks PostgREST directly — a
  row-level "public profiles" policy would have exposed every agent's phone
  number at `/rest/v1/agent_profiles?select=phone`.
- Agents cannot grant themselves admin, un-hide a suspended profile, self-verify a
  listing claim, or change their profile URL — a `BEFORE UPDATE` trigger pins
  those columns for non-admins.
- Phone numbers are stored but never rendered publicly. Enquiries funnel through
  DanangMLS by design.

## What is not built yet

Phase 1 is profiles only. Agents cannot yet submit listings through the site —
that is Phase 2 (a direct photo-upload form writing to the sheet and R2, no
Facebook import). Also outstanding:

- Vietnamese versions of `/agents` and `/agent/<slug>` (English-only today, and
  deliberately absent from the Vietnamese footer for that reason).
- A "Listed by <agent>" link from listing cards and detail pages to the agent
  profile — a worthwhile internal-linking win, deferred because it touches the
  hot rendering path.
