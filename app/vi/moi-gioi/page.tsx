import type { Metadata } from 'next';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import AgentsDirectoryView from '@/components/AgentsDirectoryView';
import { getAgentProfiles, getAgentListingCounts } from '@/lib/agents';
import { agentsItemListLd } from '@/lib/schema';
import { agentAlternates } from '@/lib/agentCopy';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Môi Giới Bất Động Sản tại Đà Nẵng, Việt Nam | DanangMLS',
  description:
    'Danh sách môi giới bất động sản đang đăng tin nhà, căn hộ và biệt thự cho thuê và bán tại Đà Nẵng và Hội An. Xem bất động sản hiện có của từng môi giới trên DanangMLS.',
  alternates: { canonical: 'https://danangmls.com/vi/moi-gioi', ...agentAlternates('directory') },
};

export default async function ViAgentsDirectoryPage() {
  const profiles = await getAgentProfiles();
  const counts = await getAgentListingCounts(profiles);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <SiteHeader />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(agentsItemListLd(profiles)) }}
      />
      <AgentsDirectoryView profiles={profiles} counts={counts} lang="vi" />
      <SiteFooter />
    </div>
  );
}
