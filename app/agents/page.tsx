import type { Metadata } from 'next';
import Link from 'next/link';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import AgentAvatar from '@/components/AgentAvatar';
import { getAgentProfiles, getAgentListingCounts } from '@/lib/agents';
import { agentsItemListLd } from '@/lib/schema';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Real Estate Agents in Da Nang, Vietnam',
  description:
    'Browse real estate agents listing houses, apartments, and villas for rent and for sale across Da Nang and Hoi An. See each agent’s current properties on DanangMLS.',
  alternates: { canonical: 'https://danangmls.com/agents' },
};

export default async function AgentsDirectoryPage() {
  const profiles = await getAgentProfiles();
  const counts = await getAgentListingCounts(profiles);

  // Agents with inventory first — the directory should lead with the profiles
  // that are actually useful to a buyer, and it concentrates internal link
  // equity on pages that have something to rank for.
  const sorted = [...profiles].sort(
    (a, b) => (counts.get(b.slug) ?? 0) - (counts.get(a.slug) ?? 0),
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <SiteHeader />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(agentsItemListLd(sorted)) }}
      />

      <main className="max-w-6xl w-full mx-auto px-4 sm:px-6 py-12 flex-1">
        <h1 className="text-3xl font-bold text-slate-900 mb-3">
          Real Estate Agents in Da Nang
        </h1>
        <p className="text-slate-600 leading-relaxed max-w-3xl mb-8">
          These agents list properties on DanangMLS across Da Nang and Hoi An — from beachfront
          apartments in Ngu Hanh Son and Son Tra to family houses in Hai Chau and Cam Le. Open an
          agent’s profile to see every property they currently have on the market.
        </p>

        {sorted.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
            <p className="text-slate-600">No agent profiles yet.</p>
            <Link href="/account/signup" className="text-blue-600 hover:underline mt-2 inline-block">
              Create the first agent profile
            </Link>
          </div>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sorted.map(agent => {
              const count = counts.get(agent.slug) ?? 0;
              const independent =
                !agent.workplace || agent.workplace.toLowerCase() === 'independent';
              return (
                <li key={agent.slug}>
                  <Link
                    href={`/agent/${agent.slug}`}
                    className="flex gap-4 items-center bg-white rounded-xl border border-slate-200 p-4 hover:border-blue-300 hover:shadow-sm transition-all h-full"
                  >
                    <AgentAvatar src={agent.photo_url} name={agent.display_name} className="w-14 h-14 shrink-0" />
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-900 truncate">{agent.display_name}</p>
                      <p className="text-sm text-slate-500 truncate">
                        {independent ? 'Independent agent' : agent.workplace}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {count > 0 ? `${count} active ${count === 1 ? 'listing' : 'listings'}` : 'No active listings'}
                      </p>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}

        <section className="mt-12 bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-2">Are you an agent in Da Nang?</h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            Create a free profile to showcase your properties to buyers and renters searching
            DanangMLS in English and Vietnamese.
          </p>
          <Link
            href="/account/signup"
            className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
          >
            Create your agent profile
          </Link>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
