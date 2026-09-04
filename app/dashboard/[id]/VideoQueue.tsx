'use client';

import { useState, useTransition } from 'react';
import { withinGrace, GRACE_MS, type ListingVideo } from '@/lib/listingVideos';
import { togglePosted } from './actions';

function Pill({
  label, done, pending, onClick,
}: { label: string; done: boolean; pending: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={pending}
      aria-pressed={done}
      className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors disabled:opacity-50 ${
        done
          ? 'bg-green-50 text-green-700 hover:bg-green-100'
          : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
      }`}
    >
      <span className="h-2 w-2 rounded-full bg-current" />
      {label} {done ? 'posted' : 'to do'}
    </button>
  );
}

export default function VideoQueue({
  dashboardId, videos,
}: { dashboardId: string; videos: ListingVideo[] }) {
  const [rows, setRows] = useState(videos);
  const [onlyTodo, setOnlyTodo] = useState(true);
  const [copied, setCopied] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  // A finished video lingers for 24h so a mistaken tick can be undone — it would
  // otherwise vanish the instant the second platform was ticked.
  const isOutstanding = (r: ListingVideo) => !(r.tiktok && r.facebook);
  const stillShown = (r: ListingVideo) => isOutstanding(r) || withinGrace(r.completed_at);
  const outstanding = rows.filter(isOutstanding);
  const list = onlyTodo ? rows.filter(stillShown) : rows;

  function dropsOffIn(completedAt: string | null): string | null {
    if (!completedAt) return null;
    const left = Date.parse(completedAt) + GRACE_MS - Date.now();
    if (!Number.isFinite(left) || left <= 0) return null;
    const h = Math.floor(left / 3600000);
    return h >= 1 ? `${h}h` : `${Math.max(1, Math.round(left / 60000))}m`;
  }

  function toggle(slug: string, platform: 'tiktok' | 'facebook', next: boolean) {
    // optimistic — the server action revalidates and corrects on failure
    setRows((rs) => rs.map((r) => (r.slug === slug ? { ...r, [platform]: next } : r)));
    startTransition(async () => {
      const res = await togglePosted(dashboardId, slug, platform, next);
      if (res.error) {
        setRows((rs) => rs.map((r) => (r.slug === slug ? { ...r, [platform]: !next } : r)));
        alert(`Could not save: ${res.error}`);
        return;
      }
      // take completed_at from the trigger rather than computing it here
      setRows((rs) => rs.map((r) => (r.slug === slug ? { ...r, completed_at: res.completedAt ?? null } : r)));
    });
  }

  async function copy(text: string, key: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      setTimeout(() => setCopied((c) => (c === key ? null : c)), 1800);
    } catch {
      alert('Copy blocked by the browser — select the caption text and copy it manually.');
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 mb-5">
        <button
          type="button"
          onClick={() => setOnlyTodo(true)}
          className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
            onlyTodo ? 'bg-blue-600 text-white font-medium' : 'bg-white text-slate-600 border border-slate-200'
          }`}
        >
          Needs posting ({outstanding.length})
        </button>
        <button
          type="button"
          onClick={() => setOnlyTodo(false)}
          className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
            !onlyTodo ? 'bg-blue-600 text-white font-medium' : 'bg-white text-slate-600 border border-slate-200'
          }`}
        >
          All ({rows.length})
        </button>
      </div>

      {list.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <p className="font-semibold text-slate-900">
            {rows.length === 0 ? 'Nothing here yet' : 'All caught up'}
          </p>
          <p className="mt-1 text-sm text-slate-500">
            {rows.length === 0
              ? 'A new video is added each morning and announced in the Telegram group.'
              : 'Everything has been posted. Finished videos stay here for 24 hours, then move to All.'}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {list.map((v) => {
            const done = v.tiktok && v.facebook;
            const meta = [v.district, v.beds && `${v.beds} bed`, v.property_type].filter(Boolean).join(' · ');
            return (
              <article
                key={v.slug}
                className="flex overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm"
              >
                <div className={`w-1.5 flex-none ${done ? 'bg-green-600' : 'bg-amber-500'}`} />
                {v.thumb_url && (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={v.thumb_url}
                    alt=""
                    className="hidden sm:block w-24 flex-none object-cover bg-slate-100"
                  />
                )}
                <div className="flex min-w-0 flex-1 flex-col gap-3 p-4">
                  <div className="flex flex-wrap items-baseline justify-between gap-3">
                    <div className="min-w-0">
                      <h2 className="font-semibold text-slate-900 leading-snug">{v.title}</h2>
                      {meta && <p className="mt-0.5 text-sm text-slate-500">{meta}</p>}
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-slate-900 tabular-nums">{v.price}</div>
                      <div className="text-xs text-slate-400 tabular-nums">{v.video_date}</div>
                    </div>
                  </div>

                  {done && dropsOffIn(v.completed_at) && (
                    <p className="text-xs text-green-700">
                      Posted everywhere — staying here for another {dropsOffIn(v.completed_at)} in case it was a mistake.
                    </p>
                  )}

                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3.5 py-1.5 text-sm font-medium text-blue-700">
                      <span className="h-2 w-2 rounded-full bg-current" />
                      YouTube {v.youtube_url ? 'live' : '—'}
                    </span>
                    <Pill label="TikTok" done={v.tiktok} pending={pending}
                      onClick={() => toggle(v.slug, 'tiktok', !v.tiktok)} />
                    <Pill label="Facebook" done={v.facebook} pending={pending}
                      onClick={() => toggle(v.slug, 'facebook', !v.facebook)} />
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => copy(v.caption ?? '', v.slug)}
                      className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
                    >
                      {copied === v.slug ? 'Caption copied' : 'Copy caption'}
                    </button>
                    {v.video_url && (
                      <a
                        href={v.video_url}
                        className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-700 hover:border-blue-600 hover:text-blue-700"
                      >
                        Download MP4
                      </a>
                    )}
                    {v.youtube_url && (
                      <a href={v.youtube_url} target="_blank" rel="noopener noreferrer"
                        className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-700 hover:border-blue-600 hover:text-blue-700">
                        YouTube
                      </a>
                    )}
                    {v.mls_url && (
                      <a href={v.mls_url} target="_blank" rel="noopener noreferrer"
                        className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-700 hover:border-blue-600 hover:text-blue-700">
                        Listing
                      </a>
                    )}
                  </div>

                  {v.caption && (
                    <details>
                      <summary className="cursor-pointer text-sm text-slate-500">Caption</summary>
                      <textarea
                        readOnly
                        value={v.caption}
                        onClick={(e) => e.currentTarget.select()}
                        className="mt-2 h-44 w-full rounded-lg border border-slate-200 bg-slate-50 p-3 font-mono text-xs leading-relaxed text-slate-700"
                      />
                    </details>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
