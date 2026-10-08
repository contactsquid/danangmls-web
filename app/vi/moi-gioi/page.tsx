import type { Metadata } from 'next';
import AgentsDirectoryView from '@/components/AgentsDirectoryView';
import { getAgentProfiles, getAgentListingCounts } from '@/lib/agents';
import { agentsItemListLd } from '@/lib/schema';
import { agentAlternates } from '@/lib/agentCopy';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Môi giới bất động sản tại Đà Nẵng, Việt Nam',
  description:
    'Các môi giới bất động sản Đà Nẵng và Hội An đang đăng tin nhà, căn hộ, biệt thự cho thuê và mua bán. Xem nhà từng môi giới đang có trên DanangMLS.',
  alternates: { canonical: 'https://danangmls.com/vi/moi-gioi', ...agentAlternates('directory') },
};

export default async function ViAgentsDirectoryPage() {
  const profiles = await getAgentProfiles();
  const counts = await getAgentListingCounts(profiles);

  return (
    <div className="flex-1 bg-slate-50 flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(agentsItemListLd(profiles)) }}
      />
      <AgentsDirectoryView profiles={profiles} counts={counts} lang="vi" />
    </div>
  );
}
