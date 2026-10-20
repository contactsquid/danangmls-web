import type { Metadata } from 'next';
import AgentsDirectoryView from '@/components/AgentsDirectoryView';
import { getAgentProfiles, getAgentListingCounts } from '@/lib/agents';
import { agentsItemListLd } from '@/lib/schema';
import { agentAlternates } from '@/lib/agentCopy';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Агенты по недвижимости в Дананге, Вьетнам',
  description:
    'Агенты по недвижимости в Дананге и Хойане, размещающие дома, квартиры и виллы в аренду и на продажу. Посмотрите, какие объекты предлагает каждый агент на DanangMLS.',
  alternates: { canonical: 'https://danangmls.com/ru/agents', ...agentAlternates('directory') },
};

export default async function RuAgentsDirectoryPage() {
  const profiles = await getAgentProfiles();
  const counts = await getAgentListingCounts(profiles);

  return (
    <div className="flex-1 bg-slate-50 flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(agentsItemListLd(profiles)) }}
      />
      <AgentsDirectoryView profiles={profiles} counts={counts} lang="ru" />
    </div>
  );
}
