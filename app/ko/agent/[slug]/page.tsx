import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import AgentProfileView from '@/components/AgentProfileView';
import { getAgentProfile, getAgentListings, isThinProfile, type AgentProfile } from '@/lib/agents';
import { agentProfileLd } from '@/lib/schema';
import { agentAlternates } from '@/lib/agentCopy';
import { socialImages } from '@/lib/ogImage';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ slug: string }>;
}

/** Korean meta description. The agent's own bio is used verbatim when they
 *  wrote one (most Da Nang agents write in Vietnamese; translating it would be
 *  worse than leaving it). Only the generated fallback is localised. */
function metaDescription(profile: AgentProfile, listingCount: number): string {
  if (profile.bio.trim()) return profile.bio.trim().slice(0, 155);
  const where = profile.workplace && profile.workplace.toLowerCase() !== 'independent'
    ? ` ${profile.workplace} 소속`
    : '';
  const inventory = listingCount > 0 ? ` 현재 매물 ${listingCount}건.` : '';
  return `${profile.display_name} — 베트남 다낭의${where} 부동산 중개인.${inventory} DanangMLS에서 이 중개인의 임대 및 매매 매물을 확인하십시오.`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const profile = await getAgentProfile(slug);
  if (!profile) return { title: '중개인을 찾을 수 없습니다' };

  const listings = await getAgentListings(profile);
  const canonical = `https://danangmls.com/ko/agent/${profile.slug}`;
  const title = `${profile.display_name} — 다낭 부동산 중개인`;
  const imageAlt = `${profile.display_name} — 부동산 중개인, DanangMLS`;

  return {
    title,
    description: metaDescription(profile, listings.length),
    alternates: { canonical, ...agentAlternates('profile', profile.slug) },
    // Same thin-content rule as the English page — a bare profile should not be
    // indexed in every language.
    robots: isThinProfile(profile, listings) ? { index: false, follow: true } : undefined,
    openGraph: {
      type: 'profile',
      url: canonical,
      locale: 'ko_KR',
      title,
      description: metaDescription(profile, listings.length),
      images: socialImages(profile.photo_url, imageAlt),
    },
    twitter: {
      card: 'summary_large_image',
      images: socialImages(profile.photo_url, imageAlt),
    },
  };
}

export default async function KoAgentProfilePage({ params }: Props) {
  const { slug } = await params;
  const profile = await getAgentProfile(slug);
  if (!profile) notFound();

  const listings = await getAgentListings(profile);

  return (
    <div className="flex-1 bg-slate-50 flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(agentProfileLd(profile, listings.length)) }}
      />
      <AgentProfileView profile={profile} listings={listings} lang="ko" />
    </div>
  );
}
