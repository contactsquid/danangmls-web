'use client';

import Link from 'next/link';
import Carousel from './Carousel';
import { Listing } from '@/lib/types';
import { useLanguage } from './LanguageProvider';
import { convertPriceToVND } from '@/lib/price';

interface Props {
  listing: Listing;
}

export default function ListingCard({ listing }: Props) {
  const { lang, t } = useLanguage();
  const displayTitle = (lang === 'vi' && listing.vi_title) ? listing.vi_title : listing.title;
  const displayPrice = (lang === 'vi' && listing.price) ? convertPriceToVND(listing.price) : listing.price;
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col hover:shadow-md transition-all duration-200">
      {/* Carousel */}
      <Link href={`/${lang === 'vi' ? 'vi/listing' : 'listing'}/${listing.slug}`} className="block">
        <Carousel images={listing.images} title={listing.title} compact />
      </Link>

      {/* Details */}
      <div className="p-4 flex flex-col flex-1">
        {/* Price */}
        <p className="text-lg font-bold text-slate-900 mb-1">
          {displayPrice || <span className="text-slate-400 text-sm font-normal">{lang === 'vi' ? 'Liên hệ để biết giá' : 'Price on request'}</span>}
        </p>

        {/* Title */}
        <Link href={`/${lang === 'vi' ? 'vi/listing' : 'listing'}/${listing.slug}`} className="text-sm text-slate-700 leading-snug line-clamp-2 mb-3 hover:text-blue-600 transition-colors">
          {displayTitle}
        </Link>

        {/* Meta */}
        <div className="flex flex-wrap gap-2 mt-auto">
          {listing.bedrooms && (
            <span className="inline-flex items-center gap-1 text-xs text-slate-500 bg-slate-50 rounded-full px-2.5 py-1">
              🛏 {listing.bedrooms} {t.br}
            </span>
          )}
          {listing.type && (
            <span className="inline-flex items-center gap-1 text-xs text-slate-500 bg-slate-50 rounded-full px-2.5 py-1">
              {listing.type}
            </span>
          )}
          {listing.district && (
            <span className="inline-flex items-center gap-1 text-xs text-slate-500 bg-slate-50 rounded-full px-2.5 py-1">
              📍 {listing.district}
            </span>
          )}
        </div>

        {/* View Listing */}
        <Link
          href={`/${lang === 'vi' ? 'vi/listing' : 'listing'}/${listing.slug}`}
          className="mt-3 text-center text-sm font-medium bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition-colors"
        >
          {t.viewListing}
        </Link>
      </div>
    </div>
  );
}
