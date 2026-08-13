import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import AgentListings from '@/components/AgentListings';
import AgentAvatar from '@/components/AgentAvatar';
import { getAgentProfile, getAgentListings, type AgentProfile } from '@/lib/agents';
import { agentProfileLd } from '@/lib/schema';
import type { Listing } from '@/lib/types';

// Sheet-backed (the listings half of this page), so the same rule as every other
// listing surface applies: keep it dynamic. See danangmls-cold-cache-fix notes —
// the CSV is far too large for Next's fetch cache, and force-cache without this
// makes the route try to prerender at build time.
export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ slug: string }>;
}

/** Profiles are self-serve, so the site will accumulate near-empty ones. An
 *  indexable page with no bio and no inventory is textbook thin content, and at
 *  scale it drags the whole domain down — so those get noindex,follow until the
 *  agent fills the profile in. "follow" keeps any links on it live. */
function isThin(profile: AgentProfile, listings: Listing[]): boolean {
  return listings.length === 0 && profile.bio.trim().length < 40;
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
    alternates: { canonical },
    robots: isThin(profile, listings) ? { index: false, follow: true } : undefined,
    openGraph: {
      type: 'profile',
      url: canonical,
      title: `${profile.display_name} — Real Estate Agent in Da Nang`,
      description: metaDescription(profile, listings.length),
      // A profile with no photo still needs an og:image or the share card renders
      // blank; fall back to the site mark.
      images: [{
        url: profile.photo_url || 'https://danangmls.com/icon.svg',
        alt: `${profile.display_name} — real estate agent, DanangMLS`,
      }],
    },
  };
}

export default async function AgentProfilePage({ params }: Props) {
  const { slug } = await params;
  const profile = await getAgentProfile(slug);
  if (!profile) notFound();

  const listings = await getAgentListings(profile);
  const independent = !profile.workplace || profile.workplace.toLowerCase() === 'independent';
  const joined = new Date(profile.created_at).toLocaleDateString('en-US', {
    month: 'long', year: 'numeric',
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <SiteHeader />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(agentProfileLd(profile, listings.length)) }}
      />

      <main className="max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 flex-1">
        <nav aria-label="Breadcrumb" className="text-sm text-slate-500 mb-6">
          <Link href="/" className="hover:underline">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/agents" className="hover:underline">Agents</Link>
          <span className="mx-2">/</span>
          <span className="text-slate-700">{profile.display_name}</span>
        </nav>

        <header className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-start">
          <AgentAvatar
            src={profile.photo_url}
            name={profile.display_name}
            className="w-24 h-24 sm:w-28 sm:h-28 shrink-0"
          />

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">{profile.display_name}</h1>
              {profile.verified && (
                <span
                  title="DanangMLS has confirmed this agent's listings"
                  className="inline-flex items-center gap-1 text-xs font-medium rounded-full px-2.5 py-1 text-emerald-700 bg-emerald-50"
                >
                  <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5" aria-hidden="true">
                    <path fillRule="evenodd" d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" clipRule="evenodd" />
                  </svg>
                  Verified
                </span>
              )}
            </div>

            <p className="text-slate-600 mt-1">
              Real estate agent{independent ? ' · Independent' : <> · {profile.workplace}</>}
            </p>

            <p className="text-sm text-slate-500 mt-2">
              {listings.length > 0
                ? `${listings.length} active ${listings.length === 1 ? 'listing' : 'listings'}`
                : 'No active listings'}
              {' · '}Joined {joined}
            </p>

            {profile.bio.trim() && (
              <p className="text-slate-600 leading-relaxed mt-4 whitespace-pre-line">{profile.bio.trim()}</p>
            )}

            {/* Every lead funnels through DanangMLS by design — the agent's own
                phone is intentionally not published here. */}
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
              >
                Enquire about these properties
              </Link>
              <Link
                href="/for-rent"
                className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Browse all rentals
              </Link>
            </div>
          </div>
        </header>

        <section className="mt-10">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">
            {listings.length > 0
              ? `Properties listed by ${profile.display_name}`
              : `Listings from ${profile.display_name}`}
          </h2>
          <AgentListings listings={listings} agentName={profile.display_name} />
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
