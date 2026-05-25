'use client';

import Link from 'next/link';
import ListingCard from './ListingCard';
import { Listing } from '@/lib/types';
import { useLanguage } from './LanguageProvider';

interface Props {
  listings: Listing[];
  mode: 'rent' | 'sale';
}

export default function FeaturedListings({ listings, mode }: Props) {
  const { lang } = useLanguage();
  const isVi = lang === 'vi';
  const featured = listings.slice(0, 3);
  if (featured.length === 0) return null;

  const headingEn = mode === 'rent' ? 'Latest Rentals' : 'Latest For Sale';
  const headingVi = mode === 'rent' ? 'Nhà cho thuê mới nhất' : 'Nhà bán mới nhất';

  const moreHrefEn = mode === 'rent' ? '/for-rent' : '/for-sale';
  const moreHrefVi = mode === 'rent' ? '/vi/thue' : '/vi/mua-ban';
  const moreHref = isVi ? moreHrefVi : moreHrefEn;

  const moreLabelEn = mode === 'rent' ? 'See all rentals →' : 'See all for sale →';
  const moreLabelVi = mode === 'rent' ? 'Xem tất cả nhà cho thuê →' : 'Xem tất cả nhà bán →';

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-baseline justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-900">
          {isVi ? headingVi : headingEn}
        </h2>
        <Link href={moreHref} className="text-sm font-medium text-blue-600 hover:text-blue-800">
          {isVi ? moreLabelVi : moreLabelEn}
        </Link>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {featured.map(listing => (
          <ListingCard key={listing.slug} listing={listing} />
        ))}
      </div>
    </section>
  );
}
