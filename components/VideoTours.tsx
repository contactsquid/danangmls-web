'use client';

import { useState } from 'react';
import type { VideoTour } from '@/lib/listingVideos';
import { useLanguage } from './LanguageProvider';
import { forLang } from '@/lib/translations';

const CHANNEL_URL = 'https://www.youtube.com/@DaNangHomes43/shorts';

// Hover (desktop) mounts a muted, looping, non-interactive YouTube preview over
// the card; a click mounts the real player with sound. 4 live iframes up front
// would be heavy, so nothing loads until the pointer arrives.
function Tour({ video, playLabel }: { video: VideoTour; playLabel: string }) {
  const [playing, setPlaying] = useState(false);
  const [hover, setHover] = useState(false);
  const thumb = video.thumbUrl || `https://i.ytimg.com/vi/${video.videoId}/hqdefault.jpg`;
  const amount = video.price?.match(/\$?\s*[\d,]+/)?.[0]?.replace(/^\$?\s*/, '$');
  const embed = `https://www.youtube.com/embed/${video.videoId}`;
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div
        className="relative aspect-[9/16] bg-white"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        {playing ? (
          <iframe
            src={`${embed}?autoplay=1&rel=0&playsinline=1`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            aria-label={`${playLabel}: ${video.title}`}
            className="absolute inset-0 w-full h-full group text-left"
          >
            {/* The stored thumb is a 380x676 card: logo band on top, photo at y 162-466 (clean of the baked-in price tag at y 468+), title below.
                The sharp photo band is cropped out and fills the top ~70% of the card (no logo/title). */}
            <span className="absolute inset-x-0 top-0 h-[70%] block overflow-hidden bg-slate-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={thumb} alt={video.title} className="absolute left-1/2 top-1/2 w-[156%] max-w-none h-auto -translate-x-1/2 -translate-y-[46.4%]" loading="lazy" />
            </span>
            {amount && (
              <span className="absolute left-3 top-[70%] -translate-y-1/2 rounded-xl bg-blue-600 px-3 py-1.5 text-xl font-extrabold leading-none text-white shadow-lg shadow-blue-600/40">
                {amount}<small className="ml-1 text-xs font-semibold opacity-85">/mo</small>
              </span>
            )}
            <span className="absolute inset-x-0 bottom-0 top-[70%] px-4 pt-6 text-sm font-semibold leading-snug text-slate-800 line-clamp-3">
              {video.title}
            </span>
            <span className="absolute right-3 top-3 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center shadow group-hover:scale-110 transition-transform">
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-red-600 ml-0.5" fill="currentColor" aria-hidden="true">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          </button>
        )}
        {hover && !playing && (
          <iframe
            src={`${embed}?autoplay=1&mute=1&controls=0&loop=1&playlist=${video.videoId}&modestbranding=1&rel=0&playsinline=1&disablekb=1`}
            title=""
            aria-hidden="true"
            tabIndex={-1}
            allow="autoplay; encrypted-media"
            className="absolute inset-0 w-full h-full pointer-events-none bg-black"
          />
        )}
      </div>
    </div>
  );
}

export default function VideoTours({ videos }: { videos: VideoTour[] }) {
  const { lang } = useLanguage();
  if (videos.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-baseline justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-900">
          {forLang({ en: 'Video Tours', vi: 'Video tham quan', ko: '비디오 투어', ru: 'Видеотуры' }, lang)}
        </h2>
        <a
          href={CHANNEL_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-blue-600 hover:text-blue-800"
        >
          {forLang({ en: 'More on YouTube →', vi: 'Xem thêm trên YouTube →', ko: 'YouTube에서 더 보기 →', ru: 'Больше на YouTube →' }, lang)}
        </a>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {videos.map(v => (
          <Tour
            key={v.videoId}
            video={v}
            playLabel={forLang({ en: 'Play video', vi: 'Phát video', ko: '동영상 재생', ru: 'Смотреть видео' }, lang)}
          />
        ))}
      </div>
    </section>
  );
}
