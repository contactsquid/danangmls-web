import { NextResponse, type NextRequest } from 'next/server';
import type { EmailOtpType } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';

/** Where the email link lands. Handles both shapes Supabase can send:
 *   • ?code=…                      — PKCE (the default for the SSR client)
 *   • ?token_hash=…&type=signup    — the older/templated verification link
 *  Supporting both means a customised email template cannot silently break
 *  confirmation. */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);

  const code      = searchParams.get('code');
  const tokenHash = searchParams.get('token_hash');
  const type      = searchParams.get('type') as EmailOtpType | null;

  // Only ever redirect to a path on this site — never to a caller-supplied
  // absolute URL, which would make this an open redirect.
  const requested = searchParams.get('next') ?? '/account/profile';
  const next = requested.startsWith('/') && !requested.startsWith('//')
    ? requested
    : '/account/profile';

  if (!isSupabaseConfigured) {
    return NextResponse.redirect(`${origin}/account/login?error=unavailable`);
  }

  const supabase = await createClient();

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(`${origin}${next}`);
    console.error('[auth] Code exchange failed:', error.message);
  } else if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash });
    if (!error) return NextResponse.redirect(`${origin}${next}`);
    console.error('[auth] OTP verification failed:', error.message);
  }

  return NextResponse.redirect(`${origin}/account/login?error=verification`);
}
