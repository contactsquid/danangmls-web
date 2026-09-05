import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import AgentProfileView from '@/components/AgentProfileView';
import { getAgentProfile, getAgentListings, isThinProfile, type AgentProfile } from '@/lib/agents';
import { agentProfileLd } from '@/lib/schema';
import { agentAlternates } from '@/lib/agentCopy';
import { socialImages } from '@/lib/ogImage';

// Sheet-backed (the listings half of this page), so the same rule as every other
// listing surface applies: keep it dynamic. See danangmls-cold-cache-fix notes —
// the CSV is far too large for Next's fetch cache, and force-cache without this
// makes the route try to prerender at build time.
export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ slug: string }>;
}

function metaDescription(profile: AgentProfile, listingCount: number): string {
  if (profile.bio.trim()) return profile.bio.trim().slice(0, 155);
  const where = profile.workplace && profile.workplace.toLowerCase() !== 'independent'
    ? ` at ${profile.workplace}`
    : '';
  const inventory = listingCount > 0
    ? ` with ${listingCount} current ${listingCount === 1 ? 'listing' : 'listings'}`
    : '';
  return `${profile.display_name}, real estate agent${where} in Da Nang, Vietnam${inventory}. Browse their properties for rent and for sale on DanangMLS.`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const profile = await getAgentProfile(slug);
  if (!profile) return { title: 'Agent not found' };

  const listings = await getAgentListings(profile);
  const canonical = `https://danangmls.com/agent/${profile.slug}`;

  return {
    title: `${profile.display_name} — Real Estate Agent in Da Nang`,
    description: metaDescription(profile, listings.length),
    alternates: { canonical, ...agentAlternates('profile', profile.slug) },
    robots: isThinProfile(profile, listings) ? { index: false, follow: true } : undefined,
    openGraph: {
      type: 'profile',
      url: canonical,
      title: `${profile.display_name} — Real Estate Agent in Da Nang`,
      description: metaDescription(profile, listings.length),
      // A profile with no photo still needs an og:image or the share card renders
      // blank. The old fallback was icon.svg, which scrapers do not render at all —
      // use the real 1200x630 default instead.
      images: socialImages(profile.photo_url, `${profile.display_name} — real estate agent, DanangMLS`),
    },
    twitter: {
      card: 'summary_large_image',
      images: socialImages(profile.photo_url, `${profile.display_name} — real estate agent, DanangMLS`),
    },
  };
}

export default async function AgentProfilePage({ params }: Props) {
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
      <AgentProfileView profile={profile} listings={listings} lang="en" />
      <SiteFooter />
    </div>
  );
}
