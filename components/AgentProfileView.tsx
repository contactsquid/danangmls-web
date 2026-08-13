import Link from 'next/link';
import AgentAvatar from './AgentAvatar';
import AgentListings from './AgentListings';
import { AGENT_COPY, agentPaths } from '@/lib/agentCopy';
import type { Lang } from '@/lib/translations';
import type { AgentProfile } from '@/lib/agents';
import type { Listing } from '@/lib/types';

interface Props {
  profile: AgentProfile;
  listings: Listing[];
  lang: Lang;
}

/** Shared body of an agent profile, rendered by both /agent/<slug> and
 *  /vi/moi-gioi/<slug>. */
export default function AgentProfileView({ profile, listings, lang }: Props) {
  const t = AGENT_COPY[lang];
  const paths = agentPaths[lang];
  const independent = !profile.workplace || profile.workplace.toLowerCase() === 'independent';

  // Vietnamese renders dates as "tháng 8 năm 2026" with this locale; en-US keeps
  // the existing "August 2026".
  const joined = new Date(profile.created_at).toLocaleDateString(
    lang === 'vi' ? 'vi-VN' : 'en-US',
    { month: 'long', year: 'numeric' },
  );

  const homeHref = lang === 'vi' ? '/vi' : '/';
  const rentalsHref = lang === 'vi' ? '/vi/thue' : '/for-rent';
  const contactHref = lang === 'vi' ? '/vi/lien-he' : '/contact';

  return (
    <main className="max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 flex-1">
      <nav aria-label="Breadcrumb" className="text-sm text-slate-500 mb-6">
        <Link href={homeHref} className="hover:underline">{t.breadcrumbHome}</Link>
        <span className="mx-2">/</span>
        <Link href={paths.directory} className="hover:underline">{t.breadcrumbAgents}</Link>
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
                title={t.verifiedTooltip}
                className="inline-flex items-center gap-1 text-xs font-medium rounded-full px-2.5 py-1 text-emerald-700 bg-emerald-50"
              >
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5" aria-hidden="true">
                  <path fillRule="evenodd" d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" clipRule="evenodd" />
                </svg>
                {t.verified}
              </span>
            )}
          </div>

          <p className="text-slate-600 mt-1">
            {t.roleLabel}{independent ? ` · ${t.independent}` : <> · {profile.workplace}</>}
          </p>

          <p className="text-sm text-slate-500 mt-2">
            {t.listingCount(listings.length)}
            {' · '}{t.joined} {joined}
          </p>

          {profile.bio.trim() && (
            <p className="text-slate-600 leading-relaxed mt-4 whitespace-pre-line">{profile.bio.trim()}</p>
          )}

          {/* Every lead funnels through DanangMLS by design — the agent's own
              phone is intentionally not published here. */}
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href={contactHref}
              className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
            >
              {t.enquire}
            </Link>
            <Link
              href={rentalsHref}
              className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
              {t.browseRentals}
            </Link>
          </div>
        </div>
      </header>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">
          {listings.length > 0
            ? t.propertiesBy(profile.display_name)
            : t.noListingsFrom(profile.display_name)}
        </h2>
        <AgentListings listings={listings} agentName={profile.display_name} />
      </section>
    </main>
  );
}
