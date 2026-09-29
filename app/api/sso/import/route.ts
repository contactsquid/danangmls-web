import { NextResponse, type NextRequest } from 'next/server';
import type { EmailOtpType } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { safeLandingPath, ssoTokenType } from '@/lib/ssoRedirect';

/**
 * Cross-domain SSO handoff — target side, the other half of app/api/sso/export.
 *
 * Redeems the one-time token minted by the origin site and, on success, sets a
 * session on THIS domain via the same cookie-writing server client the
 * /auth/callback route already uses to exchange a signup/reset link — that is
 * what makes the visitor land here already signed in, no password re-entry.
 *
 * Every path out of this handler is a redirect, never a thrown error: a
 * missing/invalid token, a disabled Supabase config, or a verifyOtp failure
 * all fail open to the ordinary /account/login page rather than a 500.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);

  const tokenHash = searchParams.get('token_hash');
  // Only the one-time magic-link token the export route mints — never a
  // recovery/signup token, which a crafted link could otherwise redeem as a login.
  const type: EmailOtpType | null = ssoTokenType(searchParams.get('type'));

  // Only ever land on a path on this site. Resolved the way the browser will, so
  // "/\evil.com" (read as "//evil.com") can't get past (review fix 2026-09-29).
  const redirectPath = safeLandingPath(searchParams.get('redirect'), origin);

  const failOpen = () => NextResponse.redirect(`${origin}/account/login?sso=1`);

  try {
    if (!isSupabaseConfigured || !tokenHash || !type) return failOpen();

    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash });
    if (error) {
      console.error('[sso/import] verifyOtp failed:', error.message);
      return failOpen();
    }

    const landing = new URL(redirectPath, origin);
    landing.searchParams.set('sso', '1');
    return NextResponse.redirect(landing);
  } catch (err) {
    console.error('[sso/import] failed:', err);
    return failOpen();
  }
}
