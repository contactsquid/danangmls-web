'use client';

import type { YouTubeVideo } from '@/lib/youtube';
import { useLanguage } from './LanguageProvider';

interface Props {
  video: YouTubeVideo | null;
}

export default function LatestVideo({ video }: Props) {
  const { lang } = useLanguage();
  if (!video) return null;
  const isVi = lang === 'vi';

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <h2 className="text-2xl font-bold text-slate-900 mb-2">
        {isVi ? 'Video mới nhất' : 'Latest Video'}
      </h2>
      <p className="text-slate-600 mb-6">
        {isVi
          ? 'Cập nhật mới nhất từ kênh YouTube DaNangHomes43.'
          : 'Latest from the DaNangHomes43 YouTube channel.'}
      </p>

      <div className="grid lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 aspect-video bg-slate-200 rounded-xl overflow-hidden shadow-md">
          <iframe
            src={`https://www.youtube.com/embed/${video.videoId}`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="w-full h-full"
            loading="lazy"
          />
        </div>
        <div className="lg:col-span-1">
          <h3 className="text-lg font-semibold text-slate-900 mb-2">{video.title}</h3>
          <p className="text-sm text-slate-500 mb-3">
            {new Date(video.publishedAt).toLocaleDateString(isVi ? 'vi-VN' : 'en-US', {
              year: 'numeric', month: 'long', day: 'numeric',
            })}
          </p>
          <p className="text-sm text-slate-700 line-clamp-6">
            {video.description}
          </p>
          <a
            href="https://www.youtube.com/@DaNangHomes43"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-4 text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            {isVi ? '→ Xem tất cả video' : '→ See all videos on YouTube'}
          </a>
        </div>
      </div>
    </section>
  );
}
