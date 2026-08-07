'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import Carousel from './Carousel';
import ForeignEligibleBadge from './ForeignEligibleBadge';
import { Listing } from '@/lib/types';
import { useLanguage } from './LanguageProvider';
import { convertPriceToVND, localizeType, localizeDistrict, localizedAltPrefix, firstImageAltPrefix } from '@/lib/price';
import { listingFieldHref, facetUrl, FOREIGN_FACET } from '@/lib/facets';

interface Props {
  listing: Listing;
}

// A meta chip that becomes a facet link when the field maps to a facet page;
// linked chips are blue (clickable), non-linkable ones stay plain slate.
function MetaChip({ href, title, children }: { href: string | null; title?: string; children: ReactNode }) {
  const base = 'inline-flex items-center gap-1 text-xs rounded-full px-2.5 py-1 transition-colors';
  return href
    ? <Link href={href} title={title} className={`${base} text-blue-700 bg-blue-50 hover:bg-blue-100 hover:underline`}>{children}</Link>
    : <span className={`${base} text-slate-500 bg-slate-50`}>{children}</span>;
}

// Vietnamese fallback title for listings without vi_title (most rentals,
// since Sheet1 has no VI_TITLE column yet). Keeps thumbnails in language
// parity with detail pages, which already use the same fallback.
// Pattern: "Cho thuê Nhà 3 phòng ngủ tại Sơn Trà, Đà Nẵng"
function viFallbackTitle(listing: Listing): string {
  const verb  = listing.forSale ? 'Bán' : 'Cho thuê';
  const type  = listing.type ? localizeType(listing.type, 'vi') : 'Bất động sản';
  const beds  = listing.bedrooms ? ` ${listing.bedrooms} phòng ngủ` : '';
  const place = listing.district
    ? `${localizeDistrict(listing.district, 'vi')}, Đà Nẵng`
    : 'Đà Nẵng';
  return `${verb} ${type}${beds} tại ${place}`;
}

export default function ListingCard({ listing }: Props) {
  const { lang, t } = useLanguage();
  const mode = listing.forSale ? 'sale' : 'rent';
  const displayTitle = lang === 'vi'
    ? (listing.vi_title || viFallbackTitle(listing))
    : listing.title;
  const displayPrice = (lang === 'vi' && listing.price) ? convertPriceToVND(listing.price) : listing.price;
  const altPrefix = localizedAltPrefix(
    { bedrooms: listing.bedrooms, type: listing.type, district: listing.district, forSale: listing.forSale },
    lang,
  );
  const firstAltPrefix = firstImageAltPrefix(
    { bedrooms: listing.bedrooms, type: listing.type, district: listing.district, forSale: listing.forSale, slug: listing.slug },
    lang,
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col hover:shadow-md transition-all duration-200">
      {/* Carousel */}
      <Link href={`/${lang === 'vi' ? 'vi/listing' : 'listing'}/${listing.slug}`} className="block">
        <Carousel images={listing.images} title={listing.title} altPrefix={altPrefix} firstAltPrefix={firstAltPrefix} compact />
      </Link>

      {/* Details */}
      <div className="p-4 flex flex-col flex-1">
        {/* Foreign-eligible badge (above the price for visibility) */}
        {listing.foreignEligible && (
          <div className="mb-2">
            <ForeignEligibleBadge buildingName={listing.foreignEligibleBuilding} size="sm"
              href={listing.forSale ? facetUrl('sale', lang, FOREIGN_FACET) : undefined} />
          </div>
        )}
        {/* Price */}
        <p className="text-lg font-bold text-slate-900 mb-1">
          {displayPrice || <span className="text-slate-400 text-sm font-normal">{lang === 'vi' ? 'Liên hệ để biết giá' : 'Price on request'}</span>}
        </p>

        {/* Title */}
        <Link href={`/${lang === 'vi' ? 'vi/listing' : 'listing'}/${listing.slug}`} className="text-sm text-slate-700 leading-snug line-clamp-2 mb-3 hover:text-blue-600 transition-colors">
          {displayTitle}
        </Link>

        {/* Meta — each chip links to its facet page when one exists */}
        <div className="flex flex-wrap gap-2 mt-auto">
          {listing.bedrooms && (
            <MetaChip href={listingFieldHref('bedrooms', String(listing.bedrooms), mode, lang)}
              title={lang === 'vi' ? `Xem BĐS ${listing.bedrooms} phòng ngủ` : `Browse ${listing.bedrooms}-bedroom ${mode === 'rent' ? 'rentals' : 'homes'}`}>
              🛏 {listing.bedrooms} {t.br}
            </MetaChip>
          )}
          {listing.type && (
            <MetaChip href={listingFieldHref('type', listing.type, mode, lang)}
              title={lang === 'vi' ? `Xem tất cả ${localizeType(listing.type, lang)}` : `Browse all ${localizeType(listing.type, lang)} ${mode === 'rent' ? 'rentals' : 'for sale'}`}>
              {localizeType(listing.type, lang)}
            </MetaChip>
          )}
          {listing.district && (
            <MetaChip href={listingFieldHref('district', listing.district, mode, lang)}
              title={lang === 'vi' ? `Xem BĐS tại ${localizeDistrict(listing.district, lang)}` : `Browse ${mode === 'rent' ? 'rentals' : 'listings'} in ${localizeDistrict(listing.district, lang)}`}>
              📍 {localizeDistrict(listing.district, lang)}
            </MetaChip>
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
