'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import AgentAvatar from '@/components/AgentAvatar';
import { createClient } from '@/lib/supabase/client';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { signOutAction } from '@/app/account/actions';
import { ACCOUNT_COPY, accountPaths } from '@/lib/accountCopy';
import { agentPaths } from '@/lib/agentCopy';
import type { Lang } from '@/lib/translations';

interface MenuProfile {
  slug: string;
  display_name: string;
  photo_url: string | null;
}

/**
 * Signed-in agent menu in the site header: avatar, then view/edit profile, add
 * property, sign out.
 *
 * Resolved in the browser rather than on the server, deliberately. SiteHeader
 * renders on all 22 pages including the listing grids, which are already
 * latency-sensitive; doing this server-side would put a Supabase round-trip in
 * front of every page view for every visitor. Here an anonymous visitor pays
 * nothing at all — with no auth cookie there is no session and no request — and
 * only a signed-in agent costs one small query.
 *
 * This is display only. It is never the basis for an authorisation decision:
 * every protected page re-verifies with supabase.auth.getUser() on the server.
 */
export default function AccountMenu({ lang }: { lang: Lang }) {
  const [profile, setProfile] = useState<MenuProfile | null>(null);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const t = ACCOUNT_COPY[lang];

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    let cancelled = false;

    (async () => {
      const supabase = createClient();
      // getSession() reads the cookie locally — no network call when signed out,
      // which is the common case on public pages.
      const { data: { session } } = await supabase.auth.getSession();
      if (!session || cancelled) return;

      const { data } = await supabase
        .from('agent_profiles')
        .select('slug, display_name, photo_url')
        .eq('id', session.user.id)
        .maybeSingle();

      if (!cancelled && data) setProfile(data as MenuProfile);
    })();

    return () => { cancelled = true; };
  }, []);

  // Close on outside click and on Escape, so the menu never strands itself open
  // over the page content.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  // Signed out (or still resolving): render nothing. The header keeps its
  // "Add property" button, which sends visitors through sign-in anyway.
  if (!profile) return null;

  const paths = accountPaths[lang];
  const itemClass =
    'block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors';

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={t.accountMenuLabel}
        className="flex items-center rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <AgentAvatar
          src={profile.photo_url}
          name={profile.display_name}
          className="w-9 h-9 hover:opacity-90 transition-opacity"
        />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-56 rounded-lg border border-slate-200 bg-white shadow-lg py-1 z-30"
        >
          <p className="px-4 py-2 text-xs text-slate-400 border-b border-slate-100 truncate">
            {profile.display_name}
          </p>

          <Link href={agentPaths[lang].profile(profile.slug)} role="menuitem" className={itemClass} onClick={() => setOpen(false)}>
            {t.viewProfile}
          </Link>
          <Link href={paths.profile} role="menuitem" className={itemClass} onClick={() => setOpen(false)}>
            {t.editProfile}
          </Link>
          <Link href={paths.newListing} role="menuitem" className={itemClass} onClick={() => setOpen(false)}>
            {t.addPropertyNav}
          </Link>

          {/* Sign-out goes through the server action so the httpOnly auth cookies
              are cleared server-side; clearing only the browser copy would leave
              a session the server still honours. */}
          <form action={signOutAction} className="border-t border-slate-100 mt-1 pt-1">
            <input type="hidden" name="lang" value={lang} />
            <button type="submit" role="menuitem" className={itemClass}>
              {t.signOut}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
