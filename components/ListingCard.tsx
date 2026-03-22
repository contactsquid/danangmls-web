'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Listing } from '@/lib/types';

interface Props {
  listing: Listing;
}

export default function ListingCard({ listing }: Props) {
  const [imgError, setImgError] = useState(false);
  const img = !imgError && listing.images[0] ? listing.images[0] : null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:shadow-md transition-shadow">
      {/* Clickable image */}
      <Link href={`/listing/${listing.slug}`} className="relative w-full aspect-[4/3] bg-gray-100 block">
        {img ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={img}
            alt={listing.title}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        {listing.type && (
          <span className="absolute top-2 left-2 bg-black/60 text-white text-xs font-medium px-2 py-1 rounded-full">
            {listing.type}
          </span>
        )}
      </Link>

      {/* Details */}
      <div className="p-4 flex flex-col flex-1">
        <Link href={`/listing/${listing.slug}`} className="font-semibold text-blue-700 text-sm leading-snug line-clamp-2 mb-2 hover:underline">
          {listing.title}
        </Link>

        <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-500 mb-3">
          {listing.district && <span>📍 {listing.district}</span>}
          {listing.bedrooms && <span>🛏 {listing.bedrooms} BR</span>}
        </div>

        <div className="mt-auto flex items-center justify-between">
          <span className="text-base font-bold text-gray-900">
            {listing.price || 'Price on request'}
          </span>
          <a
            href={listing.mlsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-medium bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors"
          >
            View Listing
          </a>
        </div>
      </div>
    </div>
  );
}
