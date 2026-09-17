// Duplicate listings are removed from the live sheet by dedupe-listings.js, which
// runs hourly and groups rentals by the MD5 of their first image's BYTES — so it
// removes the same property posted by a DIFFERENT agent as readily as one agent's
// own repost. Until 2026-09-17 those rows simply vanished: the slug left the sheet,
// nothing was archived (unlike retention expiry, which writes archive/<slug>.json),
// and the URL then rendered "Listing Not Found" at HTTP 200 — a textbook soft 404.
// At ~110 deletions a day that was ~3,300 soft-404 URLs a month, all of them pages
// Google had already spent crawl budget on.
//
// A duplicate is not an expired listing: the property is still listed, just under
// another row. So it wants a redirect to the surviving row, not an archived copy.
// One small JSON per removed slug, same shape and storage as lib/archive.ts.
const REDIRECT_BASE = 'https://images.danang.homes/redirects';

// Slug-shaped and nothing else. This value arrives from outside the app, so it is
// the one place an open redirect could be introduced: an absolute URL, a
// protocol-relative "//evil.com", or a path traversal would all otherwise be
// handed straight to permanentRedirect(). Anchoring to [a-z0-9-] rejects every
// one of those, and matches the slug alphabet slugFromMlsUrl() already enforces.
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

// A chain forms when a survivor is itself later deduped (A -> B, then B -> C).
// Following it here means Google and the visitor get a single hop to the final
// destination instead of a chain of 308s, which loses PageRank at each step.
const MAX_HOPS = 4;

type RedirectRecord = { to?: unknown };

const memo = new Map<string, string | null>();

// ── The manifest, for Proxy ───────────────────────────────────────────────────
// A page-level permanentRedirect() is NOT good enough here. Verified against a
// real build: the listing page has already begun streaming by the time the
// redirect throws, so Next emits
//   <meta id="__next-page-redirect" http-equiv="refresh" content="0;url=...">
// with HTTP **200** — for every user agent, Googlebot included (the
// htmlLimitedBots list only governs metadata streaming). A 200 is the very thing
// the soft-404 problem was, so the redirect has to happen before rendering, which
// per Next's own guidance means Proxy.
//
// Proxy runs on EVERY matched request though, and proxy.ts deliberately avoids
// adding a round-trip to public pages (this site already parses multi-MB CSVs per
// render). So Proxy reads ONE manifest of every redirect, cached in module memory
// with a TTL — no network on the hot path, O(1) lookups. This is Next's
// "redirect map" recommendation without the bloom filter, which exists only to
// avoid bundling a large file into the proxy; we fetch at runtime instead.
const MANIFEST_URL = 'https://images.danang.homes/redirects/index.json';
const MANIFEST_TTL_MS = 5 * 60 * 1000;

let manifest: Map<string, string> | null = null;
let manifestAt = 0;
let inflight: Promise<Map<string, string>> | null = null;

async function loadManifest(): Promise<Map<string, string>> {
  const now = Date.now();
  if (manifest && now - manifestAt < MANIFEST_TTL_MS) return manifest;
  // Collapse concurrent cold loads onto one fetch, same reasoning as the
  // in-flight promise sharing in lib/sheets.ts.
  if (inflight) return inflight;

  inflight = (async () => {
    const next = new Map<string, string>();
    try {
      const res = await fetch(MANIFEST_URL, { cache: 'no-store' });
      if (res.ok) {
        const j = (await res.json()) as Record<string, unknown>;
        for (const [from, to] of Object.entries(j ?? {})) {
          if (typeof to !== 'string') continue;
          const f = from.trim().toLowerCase();
          const t = to.trim().toLowerCase();
          // Same validation as the per-slug path: this file is fetched from
          // outside the app, so it is an open-redirect surface.
          if (f && t && f !== t && SLUG_RE.test(f) && SLUG_RE.test(t)) next.set(f, t);
        }
      }
      // A 404 is normal before the first duplicate is ever redirected.
      manifest = next;
      manifestAt = Date.now();
    } catch {
      // Keep whatever we had rather than dropping every redirect on one blip.
      if (!manifest) { manifest = next; manifestAt = Date.now(); }
    } finally {
      inflight = null;
    }
    return manifest ?? next;
  })();

  return inflight;
}

/**
 * Manifest lookup for Proxy, following chains so the crawler gets ONE 308 to the
 * final destination instead of a chain that leaks PageRank at every hop.
 * Returns null when `slug` has no redirect.
 */
export async function lookupRedirectSlug(slug: string): Promise<string | null> {
  const map = await loadManifest();
  if (map.size === 0) return null;
  let current = slug;
  const seen = new Set<string>([slug]);
  for (let hop = 0; hop < MAX_HOPS; hop++) {
    const next = map.get(current);
    if (!next) break;
    // A cycle means the manifest disagrees with itself — two rows each claiming
    // the other is the survivor, which real churn produces when two agents keep
    // reposting one property. Serving ANY hop from inside a cycle is an infinite
    // redirect for the visitor and the crawler, which is strictly worse than the
    // soft 404 this feature replaced. Refuse the redirect entirely and let the
    // page fall through to its archive/notFound handling.
    if (seen.has(next)) return null;
    seen.add(next);
    current = next;
  }
  return current === slug ? null : current;
}

export function redirectKey(slug: string): string {
  return `redirects/${slug}.json`;
}

/** One hop. Returns the target slug, or null if there is no redirect for `slug`. */
async function lookupOnce(slug: string): Promise<string | null> {
  if (memo.has(slug)) return memo.get(slug) ?? null;
  let to: string | null = null;
  try {
    // ~100 bytes each — nowhere near the fetch-cache size limit that silently
    // truncates the multi-MB sheet CSVs (see fetchCSV in sheets.ts).
    const res = await fetch(`${REDIRECT_BASE}/${encodeURIComponent(slug)}.json`, {
      next: { revalidate: 86400 },
    });
    if (res.ok) {
      const j = (await res.json()) as RedirectRecord;
      const raw = typeof j?.to === 'string' ? j.to.trim().toLowerCase() : '';
      // Reject anything non-slug, and a record pointing at itself — that would
      // redirect the URL to itself forever.
      if (raw && raw !== slug && SLUG_RE.test(raw)) to = raw;
    }
  } catch {
    to = null; // best-effort: a miss just falls through to the caller's notFound()
  }
  if (memo.size > 500) memo.clear();
  memo.set(slug, to);
  return to;
}

/**
 * Resolves `slug` to the slug that should be served instead, following any chain
 * to its end. Returns null when there is no redirect to make.
 *
 * `isLive` lets the caller short-circuit as soon as a hop lands on a listing that
 * is actually in the sheet — the listings array is already in memory at every call
 * site, so the common one-hop case costs a single fetch.
 */
export async function resolveListingRedirect(
  slug: string,
  isLive: (candidate: string) => boolean,
): Promise<string | null> {
  let current = slug;
  const seen = new Set<string>([slug]);

  for (let hop = 0; hop < MAX_HOPS; hop++) {
    const next = await lookupOnce(current);
    if (!next) break;
    // Same rule as the manifest path: inside a cycle, refuse the redirect rather
    // than serving a hop that points straight back. An infinite redirect is worse
    // than the soft 404 this replaced.
    if (seen.has(next)) return null;
    seen.add(next);
    current = next;
    // Landed somewhere real — no need to keep walking.
    if (isLive(current)) break;
  }

  return current === slug ? null : current;
}
