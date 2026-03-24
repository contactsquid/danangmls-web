'use client';

import Link from 'next/link';
import Carousel from './Carousel';
import ListingCard from './ListingCard';
import { useLanguage } from './LanguageProvider';
import type { Listing } from '@/lib/types';
import { convertPriceToVND, localizeType, localizeDistrict } from '@/lib/price';

interface Props {
  listing: Listing;
  similarListings?: Listing[];
}

export default function ListingDetail({ listing, similarListings = [] }: Props) {
  const { lang, t } = useLanguage();
  const images = listing.images.filter(Boolean);
  const displayTitle = (lang === 'vi' && listing.vi_title) ? listing.vi_title : listing.title;
  const sourceText   = (lang === 'vi' && listing.vi_text)  ? listing.vi_text  : listing.text;
  const displayPrice = (lang === 'vi' && listing.price) ? convertPriceToVND(listing.price) : listing.price;

  const cleanText = sourceText
    .split('\n')
    .filter(line => !/zalo|whatsapp|danang4homes|danang\.homes|contact information|\+84\s*\d|📞|📱|📧|🌐/i.test(line))
    .join('\n')
    .trim();

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <Link href={lang === 'vi' ? '/vi' : '/'} className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline mb-6">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        {t.backToListings}
      </Link>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <Carousel images={images} title={listing.title} />

        <div className="p-6 sm:p-8">
          {/* Price + badges */}
          <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
            <p className="text-3xl font-bold text-slate-900">
              {displayPrice || <span className="text-slate-400 text-xl font-normal">{lang === 'vi' ? 'Liên hệ để biết giá' : 'Price on request'}</span>}
            </p>
            <div className="flex flex-wrap gap-2">
              {listing.type && (
                <span className="bg-blue-50 text-blue-700 text-xs font-medium px-3 py-1 rounded-full">
                  {localizeType(listing.type, lang)}
                </span>
              )}
              {listing.bedrooms && (
                <span className="bg-slate-100 text-slate-600 text-xs font-medium px-3 py-1 rounded-full">
                  🛏 {listing.bedrooms} {t.br}
                </span>
              )}
            </div>
          </div>

          <h1 className="text-xl font-semibold text-slate-800 mb-6">{displayTitle}</h1>

          {/* Key details grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6 p-4 bg-slate-50 rounded-xl">
            {listing.district && (
              <div>
                <p className="text-xs text-slate-400 mb-1">{t.district}</p>
                <p className="font-semibold text-slate-800">📍 {localizeDistrict(listing.district, lang)}</p>
              </div>
            )}
            {listing.bedrooms && (
              <div>
                <p className="text-xs text-slate-400 mb-1">{t.bedrooms}</p>
                <p className="font-semibold text-slate-800">{listing.bedrooms} {t.bedrooms}</p>
              </div>
            )}
            {listing.agent && (
              <div>
                <p className="text-xs text-slate-400 mb-1">{t.agent}</p>
                <p className="font-semibold text-slate-800">{listing.agent}</p>
              </div>
            )}
          </div>

          {/* Contact */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-xl">
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">📞 {t.contactInfo}</h2>
            <div className="space-y-1 text-sm text-slate-700">
              <p>📱 Zalo / WhatsApp: <a href="tel:+84973747373" className="text-blue-600 hover:underline">+84 973 747 373</a></p>
              <p>📧 Email: <a href="mailto:danang4homes@gmail.com" className="text-blue-600 hover:underline">danang4homes@gmail.com</a></p>
              <p>🌐 Website: <a href="https://danang.homes" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">danang.homes</a></p>
            </div>
          </div>

          {/* Description */}
          {cleanText && (
            <div className="mb-8">
              <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">{t.description}</h2>
              <p className="text-slate-700 leading-relaxed whitespace-pre-line">{cleanText}</p>
            </div>
          )}

          {/* Agent awareness callout */}
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-900">
            <p className="font-semibold mb-1">⚠️ {lang === 'vi' ? 'Đang tìm kiếm trên Facebook?' : 'Browsing Facebook for listings?'}</p>
            <p className="leading-relaxed">
              {lang === 'vi'
                ? 'Hãy cẩn thận với các môi giới không có giấy phép. '
                : 'Be aware of the risks of using unverified agents. '}
              <a
                href="https://danang.homes/renting-in-da-nang-agents-on-facebook-vs-trusted-professionals/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold underline hover:text-amber-700"
              >
                {lang === 'vi' ? 'Đọc hướng dẫn của chúng tôi →' : 'Read our guide before you proceed →'}
              </a>
            </p>
          </div>

          {/* Hub link */}
          <div className="mt-6 pt-6 border-t border-slate-100 text-center">
            <Link
              href={listing.forSale ? (lang === 'vi' ? '/vi/mua-ban' : '/for-sale') : (lang === 'vi' ? '/vi' : '/')}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:underline"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              {listing.forSale
                ? (lang === 'vi' ? 'Xem tất cả bất động sản bán tại Đà Nẵng' : 'View more properties for sale in Da Nang')
                : (lang === 'vi' ? 'Xem tất cả bất động sản cho thuê tại Đà Nẵng' : 'View more rentals in Da Nang')}
            </Link>
          </div>
        </div>
      </div>

      {/* Similar listings */}
      {similarListings.length > 0 && (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 mt-10 mb-12">
          <h2 className="text-lg font-bold text-slate-800 mb-5">
            {lang === 'vi' ? 'Bất động sản tương tự' : 'Similar Listings'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {similarListings.map(l => (
              <ListingCard key={l.slug} listing={l} />
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
