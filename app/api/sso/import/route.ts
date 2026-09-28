import { NextResponse, type NextRequest } from 'next/server';
import type { EmailOtpType } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';

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
  const type = (searchParams.get('type') as EmailOtpType | null) ?? 'magiclink';

  // Only ever land on a path on this site — never a caller-supplied absolute
  // URL, which would make this an open redirect.
  const requestedRedirect = searchParams.get('redirect') ?? '/account';
  const redirectPath = requestedRedirect.startsWith('/') && !requestedRedirect.startsWith('//')
    ? requestedRedirect
    : '/account';

  const failOpen = () => NextResponse.redirect(`${origin}/account/login?sso=1`);

  try {
    if (!isSupabaseConfigured || !tokenHash) return failOpen();

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
