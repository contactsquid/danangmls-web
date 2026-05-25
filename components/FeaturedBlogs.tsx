'use client';

import { FEATURED_BLOG_POSTS, BLOG_BASE_URL } from '@/lib/featuredBlogs';
import { useLanguage } from './LanguageProvider';

export default function FeaturedBlogs() {
  const { lang } = useLanguage();
  const isVi = lang === 'vi';

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-baseline justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-900">
          {isVi ? 'Từ blog' : 'From Our Blog'}
        </h2>
        <a
          href="https://danang.homes/blog"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-blue-600 hover:text-blue-800"
        >
          {isVi ? 'Xem tất cả →' : 'See all →'}
        </a>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {FEATURED_BLOG_POSTS.map(post => (
          <a
            key={post.slug}
            href={`${BLOG_BASE_URL}/${post.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="aspect-[16/9] bg-slate-100 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.image}
                alt={post.title}
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
              <h3 className="text-base font-semibold text-slate-900 mb-2 line-clamp-2">{post.title}</h3>
              <p className="text-sm text-slate-600 line-clamp-3">{post.excerpt}</p>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
