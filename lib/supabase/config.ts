// Supabase connection details, in one place.
//
// Everything Supabase-backed on this site is additive: the listings site works
// exactly as before without it. So rather than throwing at import time when the
// env vars are absent (which would break `next build` and therefore every
// production deploy), we expose `isSupabaseConfigured` and let each surface
// degrade on its own terms — profile pages 404, account pages show a notice.

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';

// The publishable/anon key. Safe to expose: every table it can reach is guarded
// by row level security (see supabase/migrations/0001_agent_profiles.sql).
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

/** Absolute origin of this site, used for auth email redirect links. */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_ENV === 'production'
    ? 'https://danangmls.com'
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000');
