import type { Metadata } from 'next';
import AgentsDirectoryView from '@/components/AgentsDirectoryView';
import { getAgentProfiles, getAgentListingCounts } from '@/lib/agents';
import { agentsItemListLd } from '@/lib/schema';
import { agentAlternates } from '@/lib/agentCopy';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: '베트남 다낭 부동산 중개인',
  description:
    '다낭과 호이안에서 임대 및 매매 주택, 아파트, 빌라 매물을 등록하는 부동산 중개인을 소개합니다. DanangMLS에서 중개인별 현재 매물을 확인하십시오.',
  alternates: { canonical: 'https://danangmls.com/ko/agents', ...agentAlternates('directory') },
};

export default async function KoAgentsDirectoryPage() {
  const profiles = await getAgentProfiles();
  const counts = await getAgentListingCounts(profiles);

  return (
    <div className="flex-1 bg-slate-50 flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(agentsItemListLd(profiles)) }}
      />
      <AgentsDirectoryView profiles={profiles} counts={counts} lang="ko" />
    </div>
  );
}
