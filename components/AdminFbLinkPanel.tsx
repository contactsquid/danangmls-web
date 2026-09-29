'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { isSupabaseConfigured } from '@/lib/supabase/config';

/**
 * Admin-only panel linking back to the Facebook post a listing was scraped
 * from. Resolved in the browser, like AccountMenu — the listing pages are
 * ISR (generateStaticParams + revalidate), and touching cookies()/getUser()
 * server-side there forces per-request dynamic rendering, which 500s the
 * whole static build. Here an anonymous visitor (the overwhelming majority)
 * pays nothing; only a signed-in admin costs one small query.
 *
 * Also shown to Vy Tran (admin-verified claim on the "Vy Tran" listing name),
 * at Blake's request, so she can compare listings with the original posts.
 */
export default function AdminFbLinkPanel({ postUrl }: { postUrl: string }) {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    let cancelled = false;

    (async () => {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (!session || cancelled) return;

      const { data } = await supabase
        .from('agent_profiles')
        .select('is_admin, listing_agent_name, listing_agent_name_verified')
        .eq('id', session.user.id)
        .maybeSingle();

      const isVy = data?.listing_agent_name_verified
        && data.listing_agent_name?.trim().toLowerCase() === 'vy tran';
      if (!cancelled && (data?.is_admin || isVy)) setIsAdmin(true);
    })();

    return () => { cancelled = true; };
  }, []);

  if (!isAdmin) return null;

  return (
    <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
      <h2 className="text-sm font-semibold text-amber-700 uppercase tracking-wide mb-2">🛠 Admin only</h2>
      <a href={postUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm break-all">
        {postUrl}
      </a>
    </div>
  );
}
