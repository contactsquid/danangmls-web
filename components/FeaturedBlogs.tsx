'use client';

import { useState, useEffect } from 'react';
import type { FeaturedBlogPost } from '@/lib/featuredBlogs';
import { useLanguage } from './LanguageProvider';

// Pick `n` random items from a pool without mutating it (Fisher-Yates on a copy).
function pickRandom<T>(pool: T[], n: number): T[] {
  const a = [...pool];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a.slice(0, n);
}

export default function FeaturedBlogs({ posts }: { posts: FeaturedBlogPost[] }) {
  const { lang } = useLanguage();
  const isVi = lang === 'vi';

  // SSR renders the first 3 deterministically (matches server HTML → no hydration
  // mismatch); on mount we reshuffle to a random 3, so every page refresh shows a
  // fresh set and the section feels dynamic.
  const [shown, setShown] = useState<FeaturedBlogPost[]>(() => posts.slice(0, 3));
  useEffect(() => {
    setShown(pickRandom(posts, 3));
  }, [posts]);

  const blogBase = isVi ? 'https://danang.homes/vi/blog' : 'https://danang.homes/blog';

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-baseline justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-900">
          {isVi ? 'Từ blog' : 'From Our Blog'}
        </h2>
        <a
          href={isVi ? 'https://danang.homes/vi/blog' : 'https://danang.homes/blog'}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-blue-600 hover:text-blue-800"
        >
          {isVi ? 'Xem tất cả →' : 'See all →'}
        </a>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {shown.map(post => {
          const title = (isVi && post.vi_title) || post.title;
          const excerpt = (isVi && post.vi_excerpt) || post.excerpt;
          return (
            <a
              key={post.slug}
              href={`${blogBase}/${post.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="aspect-[16/9] bg-slate-100 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={post.image}
                  alt={title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="p-4">
                <p className="text-xs text-slate-500 mb-1">
                  {new Date(post.date).toLocaleDateString(isVi ? 'vi-VN' : 'en-US', {
                    year: 'numeric', month: 'long', day: 'numeric',
                  })}
                </p>
                <h3 className="text-base font-semibold text-slate-900 mb-2 line-clamp-2">{title}</h3>
                <p className="text-sm text-slate-600 line-clamp-3">{excerpt}</p>
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
}
