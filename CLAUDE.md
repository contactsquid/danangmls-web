@AGENTS.md

# danangmls.com — Da Nang (+ Hoi An) rentals and sales MLS. The original site; the others were cloned from it.

## This project
- GitHub: `contactsquid/danangmls-web` (Vercel ALSO auto-deploys on push).
- Sheet tabs: `Sheet1` (rentals), `For Sale`. Supabase source `danangmls`.
- Canonical Supabase migrations live in `supabase/migrations/` here (0001-0007).
- Agent onboarding email drip: `lib/agentDrip/` + daily Vercel cron; sender danang4homes@gmail.com (danangmls.com has no MX); Blake is Bcc'ed (DRIP_BCC).
- Agent portal: Supabase auth, `/agent/<slug>`, `/admin/agents`.

## Shared with the other city sites
- danangmls-web, saigonmls-web and hanoimls-web share most components. `components/ListingsGrid.tsx` is identical in all three,
  and `lib/cityJump.ts` differs only in `SITE_CITY`. Mirror shared changes to all three sites.
- lotusmls.com is the MASTER site with every city. The City field on the search grid sends other cities to their own
  city site (Saigon/Hanoi/Da Nang) or to lotusmls. lotusmls never links back to the city sites.
- Rentals under $1,000/month show the agent's own contact (Vy's if none); $1,000 and over show Vy (lib/agentContact.ts).

## Before you start
- Claim the folder on the shared task board before changing anything:
  `node ~/.openclaw/scripts/coda-board.js claim danangmls-web "<what>"`. If it is REFUSED, another session is working here:
  don't touch it, tell Blake. When finished: `node ~/.openclaw/scripts/coda-board.js done <id> "<result>"`.
- Several Coda sessions share this folder (office, Telegram, scheduled). Run `git status` and `git log --oneline -10` first.
  Uncommitted changes or commits you didn't make belong to another session: leave them alone and don't commit them.
- Read the tail of `~/.openclaw/data/coda-activity.md`. After notable work, append
  `- [YYYY-MM-DD HH:MM] (office|telegram|cron) <ask> -> <did>` (ICT).
- Anything sent to Blake on Telegram that is NOT meant to be built must say "review only — do not implement".

## Committing and deploying
- NEVER `git add -A` / `git add .`. Stage explicit paths, check `git diff --cached --stat`, then commit.
- Deploy with the Vercel CLI. It uploads the WORKING TREE, so set aside other sessions' uncommitted work first:
  ```
  git stash push -u -m "others-wip $(date +%F)"
  vercel deploy --prod --yes --token $(node -e 'const j=require(process.env.HOME+"/.openclaw/credentials/vercel/token.json");console.log(j.token||Object.values(j)[0])')
  git stash pop
  ```
- Commits MUST be authored `contactsquid <blake@blaremedia.net>` (set in this repo's git config). Any other author makes Vercel
  BLOCK the deploy (TEAM_ACCESS_REQUIRED) while the CLI still prints a URL. Confirm the deploy is READY, not just started.
- Then `git push origin main` (GitHub backup; see "This project").
- Verify on the LIVE site after deploying: `curl` the pages you changed. For rendered UI, take a headless Chrome screenshot:
  `"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --window-size=1280,2200 --virtual-time-budget=15000 --screenshot=out.png <url>`
- Typecheck (`npx tsc --noEmit`) and `npm test` before deploying.

## House rules
- American English in all copy (neighborhood, 3-story).
- Blake is an SEO specialist: weigh SEO in every change (titles, canonicals, alt text, og:image + twitter:image).
- Never parse env values with `cut -d:`. `vercel env pull` does NOT return sensitive vars; their sources are in `~/.openclaw/credentials/`.
- Listing data: n8n scrapers → Google Sheet `14hGuwUcb308n3h1ODyby97WqHa7uRUyyYAKMHgWnyUE` → Mac jobs (`~/.openclaw/scripts`:
  sheet-to-r2 image rehost, pin-listing-slugs, expiry, dedupe) → Supabase `listings` (project `coconhgjubqnzxbrgzhx`).
  A listing whose photos aren't yet on R2 (images.danang.homes) stays hidden, so the Mac must be on for new listings.
- Supabase `listings`: each site's sync owns only rows with its `source`; rows are never deleted, only `listed=false`.
  Sort on `listed_at` (timestamp), never on `listed_date` (mixed-format text).
- `force-cache` truncates large fetches on Vercel — use `no-store` for the big sheet CSVs.
