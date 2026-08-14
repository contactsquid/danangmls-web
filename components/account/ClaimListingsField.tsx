'use client';

import { useState, useTransition } from 'react';
import { searchClaimNamesAction } from '@/app/account/actions';
import { inputClass, labelClass, hintClass } from '@/components/account/ui';
import { ACCOUNT_COPY } from '@/lib/accountCopy';
import type { Lang } from '@/lib/translations';
import type { NameCandidate } from '@/lib/agentNameSearch';

/**
 * Claiming existing listings: search, look at your own properties, confirm.
 *
 * The previous version was a bare text box asking the agent to type the exact
 * name their listings are posted under — a string they cannot see, that often
 * carries emoji and odd spacing, with no feedback until an admin got round to
 * it. Showing three of the actual listings turns "hope you typed it right" into
 * "yes, those are mine".
 */
export default function ClaimListingsField({
  lang,
  currentName,
  verified,
}: {
  lang: Lang;
  currentName: string;
  verified: boolean;
}) {
  const t = ACCOUNT_COPY[lang];

  const [claimed, setClaimed] = useState(currentName);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<NameCandidate[] | null>(null);
  const [pending, startTransition] = useTransition();

  const search = () => {
    const q = query.trim();
    if (q.length < 2) return;
    startTransition(async () => setResults(await searchClaimNamesAction(q)));
  };

  // Already settled: the claim is approved and the listings are on the profile.
  if (claimed && verified) {
    return (
      <div>
        <span className={labelClass}>{t.listingName}</span>
        <input type="hidden" name="listing_agent_name" value={claimed} />
        <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          {t.listingClaimVerified}
        </p>
        <p className={hintClass}>{claimed}</p>
      </div>
    );
  }

  // Claimed but not yet approved.
  if (claimed) {
    return (
      <div>
        <span className={labelClass}>{t.listingName}</span>
        <input type="hidden" name="listing_agent_name" value={claimed} />
        <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">
          {t.claimPending(claimed)}
        </p>
        <button
          type="button"
          onClick={() => { setClaimed(''); setResults(null); }}
          className="mt-2 text-xs text-slate-500 hover:underline"
        >
          {t.claimChange}
        </button>
      </div>
    );
  }

  return (
    <div>
      <span className={labelClass}>{t.listingName}</span>
      <p className={`${hintClass} mb-2`}>{t.claimSearchHint}</p>
      <input type="hidden" name="listing_agent_name" value="" />

      <div className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); search(); } }}
          placeholder={t.claimSearchPlaceholder}
          className={`${inputClass} flex-1 min-w-0`}
        />
        <button
          type="button"
          onClick={search}
          disabled={pending || query.trim().length < 2}
          className="shrink-0 rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-900 disabled:opacity-50"
        >
          {pending ? t.claimSearching : t.claimSearch}
        </button>
      </div>

      {results !== null && results.length === 0 && !pending && (
        <p className="mt-3 text-sm text-slate-600">{t.claimNoResults}</p>
      )}

      {results !== null && results.length > 0 && (
        <div className="mt-4 space-y-4">
          {results.map(candidate => (
            <div key={candidate.name} className="rounded-xl border border-slate-200 p-4">
              <p className="font-medium text-slate-900">{candidate.name}</p>
              <p className="text-sm text-slate-500 mb-3">{t.claimCount(candidate.count)}</p>

              <ul className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {candidate.samples.map(s => (
                  <li key={s.slug} className="rounded-lg border border-slate-100 overflow-hidden">
                    {s.image ? (
                      // eslint-disable-next-line @next/next/no-img-element -- matches the plain <img> used across this codebase
                      <img src={s.image} alt="" className="w-full h-24 object-cover bg-slate-100" />
                    ) : (
                      <div className="w-full h-24 bg-slate-100" />
                    )}
                    <div className="p-2">
                      <p className="text-xs font-medium text-slate-800 line-clamp-2">{s.title}</p>
                      <p className="text-xs text-slate-500 mt-1">
                        {s.price}{s.district ? ` · ${s.district}` : ''}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>

              <button
                type="button"
                onClick={() => setClaimed(candidate.name)}
                className="mt-3 w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                {t.claimConfirm}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
