import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import AgentProfileView from '@/components/AgentProfileView';
import { getAgentProfile, getAgentListings, isThinProfile, type AgentProfile } from '@/lib/agents';
import { agentProfileLd } from '@/lib/schema';
import { agentAlternates } from '@/lib/agentCopy';
import { socialImages } from '@/lib/ogImage';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ slug: string }>;
}

/** Vietnamese meta description. The agent's own bio is used verbatim when they
 *  wrote one — most Da Nang agents write in Vietnamese, so translating it would
 *  be worse than leaving it. Only the generated fallback is localised. */
function metaDescription(profile: AgentProfile, listingCount: number): string {
  if (profile.bio.trim()) return profile.bio.trim().slice(0, 155);
  const where = profile.workplace && profile.workplace.toLowerCase() !== 'independent'
    ? ` tại ${profile.workplace}`
    : '';
  const inventory = listingCount > 0 ? ` với ${listingCount} tin đăng hiện có` : '';
  return `${profile.display_name}, môi giới bất động sản${where} ở Đà Nẵng, Việt Nam${inventory}. Xem các bất động sản cho thuê và bán của họ trên DanangMLS.`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const profile = await getAgentProfile(slug);
  if (!profile) return { title: 'Không tìm thấy môi giới' };

  const listings = await getAgentListings(profile);
  const canonical = `https://danangmls.com/vi/moi-gioi/${profile.slug}`;

  return {
    title: `${profile.display_name} — Môi Giới Bất Động Sản tại Đà Nẵng`,
    description: metaDescription(profile, listings.length),
    alternates: { canonical, ...agentAlternates('profile', profile.slug) },
    // Same thin-content rule as the English page — a bare profile should not be
    // indexed twice over.
    robots: isThinProfile(profile, listings) ? { index: false, follow: true } : undefined,
    openGraph: {
      type: 'profile',
      url: canonical,
      title: `${profile.display_name} — Môi Giới Bất Động Sản tại Đà Nẵng`,
      description: metaDescription(profile, listings.length),
      images: socialImages(profile.photo_url, `${profile.display_name} — môi giới bất động sản, DanangMLS`),
    },
    twitter: {
      card: 'summary_large_image',
      images: socialImages(profile.photo_url, `${profile.display_name} — môi giới bất động sản, DanangMLS`),
    },
  };
}

export default async function ViAgentProfilePage({ params }: Props) {
  const { slug } = await params;
  const profile = await getAgentProfile(slug);
  if (!profile) notFound();

  const listings = await getAgentListings(profile);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <SiteHeader />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(agentProfileLd(profile, listings.length)) }}
      />
      <AgentProfileView profile={profile} listings={listings} lang="vi" />
      <SiteFooter />
    </div>
  );
}
