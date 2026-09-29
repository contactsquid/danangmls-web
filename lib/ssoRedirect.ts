// Guards for the cross-domain SSO import route (app/api/sso/import).

/** The path to land on after an SSO login: a path on THIS origin, else /account.
 *  Resolves the value the way the browser will, so "/\evil.com" (which browsers
 *  treat as "//evil.com") can't slip past a startsWith('/') check. */
export function safeLandingPath(requested: string | null, origin: string): string {
  if (!requested || !requested.startsWith('/') || requested.startsWith('//') || requested.includes('\\')) return '/account';
  try {
    const u = new URL(requested, origin);
    return u.origin === origin ? u.pathname + u.search : '/account';
  } catch {
    return '/account';
  }
}

/** The SSO handoff only ever mints magic-link tokens; refuse any other type, so a
 *  crafted link can't redeem someone's recovery/signup token as a login. */
export function ssoTokenType(t: string | null): 'magiclink' | null {
  return !t || t === 'magiclink' ? 'magiclink' : null;
}
