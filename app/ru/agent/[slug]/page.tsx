import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import AgentProfileView from '@/components/AgentProfileView';
import { getAgentProfile, getAgentListings, isThinProfile, type AgentProfile } from '@/lib/agents';
import { agentProfileLd } from '@/lib/schema';
import { agentAlternates } from '@/lib/agentCopy';
import { ruPlural } from '@/lib/translations';
import { socialImages } from '@/lib/ogImage';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ slug: string }>;
}

/** Russian meta description. The agent's own bio is used verbatim when they
 *  wrote one (most Da Nang agents write in Vietnamese; a machine translation
 *  would be worse than the original). Only the generated fallback is localised. */
function metaDescription(profile: AgentProfile, listingCount: number): string {
  if (profile.bio.trim()) return profile.bio.trim().slice(0, 155);
  const where = profile.workplace && profile.workplace.toLowerCase() !== 'independent'
    ? ` (${profile.workplace})`
    : '';
  const inventory = listingCount > 0
    ? `, ${listingCount} ${ruPlural(listingCount, 'актуальное объявление', 'актуальных объявления', 'актуальных объявлений')}`
    : '';
  return `${profile.display_name} — агент по недвижимости${where} в Дананге, Вьетнам${inventory}. Объекты этого агента в аренду и на продажу на DanangMLS.`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const profile = await getAgentProfile(slug);
  if (!profile) return { title: 'Агент не найден' };

  const listings = await getAgentListings(profile);
  const canonical = `https://danangmls.com/ru/agent/${profile.slug}`;
  const title = `${profile.display_name} — агент по недвижимости в Дананге`;
  const imageAlt = `${profile.display_name} — агент по недвижимости, DanangMLS`;

  return {
    title,
    description: metaDescription(profile, listings.length),
    alternates: { canonical, ...agentAlternates('profile', profile.slug) },
    // Same thin-content rule as the English page — a bare profile should not be
    // indexed in every language.
    robots: isThinProfile(profile, listings) ? { index: false, follow: true } : undefined,
    openGraph: {
      type: 'profile',
      locale: 'ru_RU',
      url: canonical,
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

export default async function RuAgentProfilePage({ params }: Props) {
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
      <AgentProfileView profile={profile} listings={listings} lang="ru" />
    </div>
  );
}
