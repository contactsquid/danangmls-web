import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { SUPABASE_ANON_KEY, SUPABASE_URL, isSupabaseConfigured } from '@/lib/supabase/config';

// Next.js 16 renamed Middleware to Proxy; same behaviour, and it now runs on the
// Node.js runtime. Its one job here is refreshing the Supabase auth token and
// writing the rotated cookies onto the response — Server Components cannot set
// cookies, so without this sessions silently expire mid-browse.
//
// Auth *decisions* are not made here. Proxy runs before rendering and only sees
// the cookie, so it is an optimistic check at best; every protected page
// re-verifies with supabase.auth.getUser() against the auth server.
// Listing URLs whose row was removed as a duplicate. Handled here rather than in
// the page because a page-level permanentRedirect() lands as a client-side
// <meta http-equiv="refresh"> at HTTP 200 once the page has begun streaming —
// verified against a real build, for Googlebot too. Proxy runs before rendering,
// so NextResponse.redirect is a true 308. See lib/redirects.ts for why this reads
// a cached manifest instead of doing a lookup per request.
const LISTING_PATH_RE = /^\/(?:vi\/|ko\/|ru\/)?listing\/([a-z0-9-]+)\/?$/i;

async function listingRedirect(request: NextRequest): Promise<NextResponse | null> {
  const m = LISTING_PATH_RE.exec(request.nextUrl.pathname);
  if (!m) return null;
  try {
    const { lookupRedirectSlug } = await import('@/lib/redirects');
    const to = await lookupRedirectSlug(m[1].toLowerCase());
    if (!to) return null;
    const url = request.nextUrl.clone();
    // Keep the visitor in the language they were reading.
    url.pathname = request.nextUrl.pathname.replace(/\/listing\/[a-z0-9-]+\/?$/i, `/listing/${to}`);
    return NextResponse.redirect(url, 308);
  } catch {
    // Never let a redirect lookup take down a listing page — fall through and let
    // the page's own archive/notFound handling deal with it.
    return null;
  }
}

export async function proxy(request: NextRequest) {
  // Public listing routes only ever need this check, and must NOT pay for the
  // Supabase round-trip below.
  const redirected = await listingRedirect(request);
  if (redirected) return redirected;
  if (LISTING_PATH_RE.test(request.nextUrl.pathname)) return NextResponse.next();

  if (!isSupabaseConfigured) return NextResponse.next();

  let response = NextResponse.next({ request });

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        for (const { name, value } of cookiesToSet) {
          request.cookies.set(name, value);
        }
        response = NextResponse.next({ request });
        for (const { name, value, options } of cookiesToSet) {
          response.cookies.set(name, value, options);
        }
        // Responses that set auth cookies must never be cached by a CDN, or one
        // visitor's session token gets served to the next. The library hands us
        // the exact no-store headers to apply.
        for (const [key, value] of Object.entries(headers ?? {})) {
          response.headers.set(key, value);
        }
      },
    },
  });

  // Touching the user is what triggers the refresh-and-setAll cycle above.
  await supabase.auth.getUser();

  return response;
}

export const config = {
  // Deliberately NOT running on every route. This site renders listing pages by
  // parsing multi-megabyte sheet CSVs and is already latency-sensitive; adding an
  // auth round-trip to every public page view would cost more than it buys.
  // Only the signed-in surfaces need a live session, and each of them is matched
  // here, so a token can never go stale on a route that actually reads it.
  // Listing routes are matched only for the duplicate-redirect check above, which
  // costs an O(1) Map lookup against a manifest cached in module memory — no
  // per-request network, and it returns before any auth work.
  matcher: [
    '/account/:path*',
    '/admin/:path*',
    '/auth/:path*',
    '/listing/:slug',
    '/vi/listing/:slug',
    '/ko/listing/:slug',
    '/ru/listing/:slug',
  ],
};
