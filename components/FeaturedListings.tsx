'use client';

import Link from 'next/link';
import ListingCard from './ListingCard';
import { Listing } from '@/lib/types';
import { useLanguage } from './LanguageProvider';
import { facetBase } from '@/lib/facets';
import { forLang } from '@/lib/translations';

interface Props {
  listings: Listing[];
  mode: 'rent' | 'sale';
}

export default function FeaturedListings({ listings, mode }: Props) {
  const { lang } = useLanguage();
  const isVi = lang === 'vi';
  const featured = listings.slice(0, 3);
  if (featured.length === 0) return null;

  const heading = mode === 'rent'
    ? forLang({ en: 'Latest Rentals', vi: 'Nhà cho thuê mới nhất', ko: '최신 임대 매물', ru: 'Новое в аренде' }, lang)
    : forLang({ en: 'Latest For Sale', vi: 'Nhà bán mới nhất', ko: '최신 매매 매물', ru: 'Новое на продажу' }, lang);

  // every locale has its own grid path; facetBase owns that mapping
  const moreHref = facetBase(mode, lang);

  const moreLabel = mode === 'rent'
    ? forLang({ en: 'See all rentals →', vi: 'Xem tất cả nhà cho thuê →', ko: '임대 매물 전체 보기 →', ru: 'Вся аренда →' }, lang)
    : forLang({ en: 'See all for sale →', vi: 'Xem tất cả nhà bán →', ko: '매매 매물 전체 보기 →', ru: 'Всё на продажу →' }, lang);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-baseline justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-900">
          {heading}
        </h2>
        <Link href={moreHref} className="text-sm font-medium text-blue-600 hover:text-blue-800">
          {moreLabel}
        </Link>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {featured.map(listing => (
          <ListingCard key={listing.slug} listing={listing} priority />
        ))}
      </div>
    </section>
  );
}
