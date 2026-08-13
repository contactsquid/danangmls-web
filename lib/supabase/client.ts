'use client';

import { createBrowserClient } from '@supabase/ssr';
import { SUPABASE_ANON_KEY, SUPABASE_URL } from './config';

/** Browser-side Supabase client. Only used by the sign-up / sign-in / profile
 *  forms; every page that merely *reads* profiles does so on the server. */
export function createClient() {
  return createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}
