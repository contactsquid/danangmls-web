import Link from 'next/link';
import AgentAvatar from './AgentAvatar';
import { AGENT_COPY, agentPaths } from '@/lib/agentCopy';
import type { Lang } from '@/lib/translations';
import type { AgentProfile } from '@/lib/agents';

interface Props {
  profiles: AgentProfile[];
  counts: Map<string, number>;
  lang: Lang;
}

/** Shared body of the agent directory. The /agents and /vi/moi-gioi routes are
 *  thin wrappers around this so the markup can never drift between languages —
 *  same arrangement as ListingDetail across /listing and /vi/listing. */
export default function AgentsDirectoryView({ profiles, counts, lang }: Props) {
  const t = AGENT_COPY[lang];
  const paths = agentPaths[lang];
  // Signup is English-only for now, so both languages point at it. Pointing the
  // Vietnamese CTA at a /vi/tai-khoan/… route before that route exists shipped a
  // 404 to production once already — don't reintroduce it ahead of the pages.
  const signupHref = '/account/signup';

  // Agents with inventory first — the directory should lead with the profiles
  // that are actually useful to a buyer, and it concentrates internal link
  // equity on pages that have something to rank for.
  const sorted = [...profiles].sort(
    (a, b) => (counts.get(b.slug) ?? 0) - (counts.get(a.slug) ?? 0),
  );

  return (
    <main className="max-w-6xl w-full mx-auto px-4 sm:px-6 py-12 flex-1">
      <h1 className="text-3xl font-bold text-slate-900 mb-3">{t.directoryTitle}</h1>
      <p className="text-slate-600 leading-relaxed max-w-3xl mb-8">{t.directoryIntro}</p>

      {sorted.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
          <p className="text-slate-600">{t.emptyState}</p>
          <Link href={signupHref} className="text-blue-600 hover:underline mt-2 inline-block">
            {t.createFirst}
          </Link>
        </div>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sorted.map(agent => {
            const count = counts.get(agent.slug) ?? 0;
            const independent = !agent.workplace || agent.workplace.toLowerCase() === 'independent';
            return (
              <li key={agent.slug}>
                <Link
                  href={paths.profile(agent.slug)}
                  className="flex gap-4 items-center bg-white rounded-xl border border-slate-200 p-4 hover:border-blue-300 hover:shadow-sm transition-all h-full"
                >
                  <AgentAvatar src={agent.photo_url} name={agent.display_name} className="w-14 h-14 shrink-0" />
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900 truncate">{agent.display_name}</p>
                    <p className="text-sm text-slate-500 truncate">
                      {independent ? `${t.roleLabel} · ${t.independent}` : agent.workplace}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">{t.listingCount(count)}</p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}

      <section className="mt-12 bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-2">{t.ctaHeading}</h2>
        <p className="text-slate-600 leading-relaxed mb-4">{t.ctaBody}</p>
        <Link
          href={signupHref}
          className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
        >
          {t.ctaButton}
        </Link>
      </section>
    </main>
  );
}
