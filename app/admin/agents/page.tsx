import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import AdminAgentRow, { type AdminAgent } from './AdminAgentRow';
import { createClient } from '@/lib/supabase/server';
import { getOwnProfile, normalizeAgentName } from '@/lib/agents';
import { getListings, getForSaleListings } from '@/lib/sheets';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Manage Agents',
  robots: { index: false, follow: false },
};

/** One screen for moderating agent signups, so nobody needs the Supabase
 *  dashboard to do day-to-day admin. */
export default async function AdminAgentsPage() {
  const me = await getOwnProfile();
  if (!me) redirect('/account/login');
  if (!me.is_admin) redirect('/');

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('agent_profiles')
    // One string literal — see the note in lib/agents.ts on select typing.
    .select('id, slug, display_name, bio, photo_url, workplace, phone, status, is_admin, listing_agent_name, listing_agent_name_verified, created_at')
    .order('created_at', { ascending: false });

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <SiteHeader />
        <main className="max-w-4xl w-full mx-auto px-4 py-12 flex-1">
          <p className="text-red-700">Could not load agents: {error.message}</p>
        </main>
        <SiteFooter />
      </div>
    );
  }

  const rows = data ?? [];

  // Count sheet listings per claimed name — including unverified claims, since
  // that number is exactly what an admin needs to judge whether to approve one.
  const claimed = new Map<string, string[]>(); // normalized name -> profile ids
  for (const r of rows) {
    const key = normalizeAgentName(r.listing_agent_name);
    if (!key) continue;
    claimed.set(key, [...(claimed.get(key) ?? []), r.id]);
  }

  const counts = new Map<string, number>();
  if (claimed.size > 0) {
    const [rentals, forSale] = await Promise.all([getListings(), getForSaleListings()]);
    for (const listing of [...rentals, ...forSale]) {
      const ids = claimed.get(normalizeAgentName(listing.agent));
      if (!ids) continue;
      for (const id of ids) counts.set(id, (counts.get(id) ?? 0) + 1);
    }
  }

  const agents: AdminAgent[] = rows.map(r => ({
    ...r,
    status: r.status === 'suspended' ? 'suspended' : 'active',
    claimedListingCount: counts.get(r.id) ?? 0,
  }));

  const pending = agents.filter(a => a.listing_agent_name && !a.listing_agent_name_verified);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <SiteHeader />
      <main className="max-w-4xl w-full mx-auto px-4 sm:px-6 py-12 flex-1">
        <div className="flex items-baseline justify-between gap-4 flex-wrap mb-2">
          <h1 className="text-2xl font-bold text-slate-900">Manage agents</h1>
          <Link href="/account/profile" className="text-sm text-blue-600 hover:underline">
            Back to your profile
          </Link>
        </div>
        <p className="text-slate-600 text-sm mb-8">
          {agents.length} {agents.length === 1 ? 'profile' : 'profiles'}
          {pending.length > 0 && (
            <> · <strong className="text-amber-700">{pending.length} awaiting listing verification</strong></>
          )}
        </p>

        {agents.length === 0 ? (
          <p className="text-slate-600">No agent profiles yet.</p>
        ) : (
          <ul className="space-y-3">
            {agents.map(agent => <AdminAgentRow key={agent.id} agent={agent} />)}
          </ul>
        )}

        <p className="mt-8 text-xs text-slate-500 leading-relaxed">
          <strong>Verify &amp; link listings</strong> connects a profile to the properties posted
          under that name in the Google Sheet. Leave it unverified if the name does not look like
          theirs — an unverified profile shows a bio and photo but no listings.
          <br />
          <strong>Hide</strong> removes a profile from the public site but keeps the account.
          <strong> Delete</strong> removes the account permanently.
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}
