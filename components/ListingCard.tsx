import Link from 'next/link';
import Carousel from './Carousel';
import { Listing } from '@/lib/types';

interface Props {
  listing: Listing;
}

export default function ListingCard({ listing }: Props) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:shadow-md transition-shadow">
      {/* Carousel */}
      <Link href={`/listing/${listing.slug}`} className="block">
        <Carousel images={listing.images} title={listing.title} compact />
      </Link>

      {/* Details */}
      <div className="p-4 flex flex-col flex-1">
        <Link href={`/listing/${listing.slug}`} className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2 mb-2 hover:underline">
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
