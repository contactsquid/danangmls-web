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
export async function proxy(request: NextRequest) {
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
  matcher: ['/account/:path*', '/admin/:path*', '/auth/:path*'],
};
