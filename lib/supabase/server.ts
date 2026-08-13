import 'server-only';

import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_ANON_KEY, SUPABASE_URL } from './config';

/** Request-scoped Supabase client that reads (and, where allowed, writes) the
 *  auth cookies. Create a fresh one per render — never hoist to module scope,
 *  or one visitor's session leaks into another's request. */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Server Components may not mutate cookies. That is fine and expected:
          // proxy.ts refreshes the session on every request, so a refresh dropped
          // here has already been persisted there.
        }
      },
    },
  });
}

/** Cookie-free client for reading public data (the agent_public view).
 *
 *  Kept separate from createClient() on purpose: touching cookies() opts a route
 *  into dynamic rendering. Public profile pages have no per-visitor content, so
 *  they read through this and stay cacheable. */
export function createPublicClient() {
  return createSupabaseClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

/** Service-role client. Bypasses row level security entirely, so it must never
 *  be constructed anywhere that could run in the browser — hence 'server-only'
 *  at the top of this module and the non-public env var name.
 *
 *  Used for exactly one thing in Phase 1: deleting a spam signup's *auth user*,
 *  which the anon key cannot do. Profile row deletion cascades from it. */
export function createAdminClient() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) return null;

  return createSupabaseClient(SUPABASE_URL, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
