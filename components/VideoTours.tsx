'use client';

import { useState } from 'react';
import type { VideoTour } from '@/lib/listingVideos';
import { useLanguage } from './LanguageProvider';
import { forLang } from '@/lib/translations';

const CHANNEL_URL = 'https://www.youtube.com/@DaNangHomes43/shorts';

// Click-to-play: 4 live YouTube iframes would be heavy, so each card shows the
// thumbnail and only mounts the player once tapped.
function Tour({ video, playLabel }: { video: VideoTour; playLabel: string }) {
  const [playing, setPlaying] = useState(false);
  const thumb = video.thumbUrl || `https://i.ytimg.com/vi/${video.videoId}/hqdefault.jpg`;
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="relative aspect-[9/16] bg-slate-900">
        {playing ? (
          <iframe
            src={`https://www.youtube.com/embed/${video.videoId}?autoplay=1&rel=0&playsinline=1`}
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
            className="absolute inset-0 w-full h-full group"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={thumb} alt={video.title} className="w-full h-full object-cover" loading="lazy" />
            <span className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/25 transition-colors">
              <span className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                <svg viewBox="0 0 24 24" className="w-7 h-7 text-red-600 ml-0.5" fill="currentColor" aria-hidden="true">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
            </span>
          </button>
        )}
      </div>
      <h3 className="p-3 text-sm font-semibold text-slate-900 line-clamp-2">{video.title}</h3>
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
