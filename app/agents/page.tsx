import type { Metadata } from 'next';
import AgentsDirectoryView from '@/components/AgentsDirectoryView';
import { getAgentProfiles, getAgentListingCounts } from '@/lib/agents';
import { agentsItemListLd } from '@/lib/schema';
import { agentAlternates } from '@/lib/agentCopy';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Real Estate Agents in Da Nang, Vietnam',
  description:
    'Browse real estate agents listing houses, apartments, and villas for rent and for sale across Da Nang and Hoi An. See each agent’s current properties on DanangMLS.',
  alternates: { canonical: 'https://danangmls.com/agents', ...agentAlternates('directory') },
};

export default async function AgentsDirectoryPage() {
  const profiles = await getAgentProfiles();
  const counts = await getAgentListingCounts(profiles);

  return (
    <div className="flex-1 bg-slate-50 flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(agentsItemListLd(profiles)) }}
      />
      <AgentsDirectoryView profiles={profiles} counts={counts} lang="en" />
    </div>
  );
}
