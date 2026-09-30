import { NextResponse, type NextRequest } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';

/**
 * Cross-domain SSO handoff — origin side.
 *
 * The multi-city MLS sites (danangmls.com, saigonmls.com, ...) share one
 * Supabase auth project, so the same email+password already works on both —
 * see mls-shared-agent-auth memory. What is missing is staying signed in when
 * an agent switches domains, because the session cookie is scoped to whichever
 * site issued it. This route is the origin half of the fix: given a live
 * session here, it mints a one-time magic-link token for that user and sends
 * the browser on to the other site's /api/sso/import to redeem it there.
 *
 * `return` is the URL the visitor should end up back at — required, and
 * validated against an allowlist of the network's own domains so this can
 * never be turned into an open redirect.
 *
 * Every path out of this handler is a redirect, never a thrown error or a
 * rendered page: a visitor who is not signed in here, whose service-role key
 * is missing, or who hits any other failure simply bounces back to `return`
 * with `?sso=1` appended, which is the signal that tells the other domain's
 * guard "already checked, do not loop" and it falls through to its own
 * ordinary login page.
 */
export async function GET(request: NextRequest) {
  // Every site in the MLS family (2026-09-30: HanoiMLS joined). Keep this list the same in
  // danangmls-web, saigonmls-web and hanoimls-web until lotusmls becomes the central login.
  const ALLOWED_ORIGINS = ['https://danangmls.com', 'https://saigonmls.com', 'https://hanoimls.com'];

  const { searchParams } = new URL(request.url);
  const returnParam = searchParams.get('return');

  let returnUrl: URL | null = null;
  try {
    if (returnParam) returnUrl = new URL(returnParam);
  } catch {
    returnUrl = null;
  }

  // No validated place to send the visitor back to — there is nothing safe to
  // do here, so land on this site's own login rather than follow an
  // unvalidated URL anywhere.
  if (!returnUrl || !ALLOWED_ORIGINS.includes(returnUrl.origin)) {
    return NextResponse.redirect(new URL('/account/login', request.url));
  }

  const validReturn = returnUrl;
  const bounceBack = () => {
    const url = new URL(validReturn.toString());
    url.searchParams.set('sso', '1');
    return NextResponse.redirect(url);
  };

  try {
    if (!isSupabaseConfigured) return bounceBack();

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.email) return bounceBack();

    const admin = createAdminClient();
    if (!admin) return bounceBack();

    const { data, error } = await admin.auth.admin.generateLink({
      type: 'magiclink',
      email: user.email,
    });

    const hashedToken = data?.properties?.hashed_token;
    if (error || !hashedToken) {
      if (error) console.error('[sso/export] generateLink failed:', error.message);
      return bounceBack();
    }

    const importUrl = new URL('/api/sso/import', validReturn.origin);
    importUrl.searchParams.set('token_hash', hashedToken);
    importUrl.searchParams.set('type', 'magiclink');
    importUrl.searchParams.set('redirect', validReturn.pathname + validReturn.search);

    return NextResponse.redirect(importUrl);
  } catch (err) {
    console.error('[sso/export] failed:', err);
    return bounceBack();
  }
}
