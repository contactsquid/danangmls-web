'use client';

import { usePathname } from 'next/navigation';
import ListingsGrid from '@/components/ListingsGrid';
import type { Listing } from '@/lib/types';
import { getUniqueValues } from '@/lib/sheets';

const COPY = {
  en: {
    h1: '404: Page Not Found',
    body: (mode: 'rent' | 'sale') =>
      mode === 'sale'
        ? "This property is no longer available. The Da Nang property market moves quickly — use the search below to find your next home."
        : "This property is no longer available. The Da Nang rental market moves quickly — use the search below to find your next home.",
    heading: (mode: 'rent' | 'sale') =>
      mode === 'sale' ? 'Browse current properties for sale' : 'Browse current rentals',
  },
  vi: {
    h1: '404: Không tìm thấy trang',
    body: (mode: 'rent' | 'sale') =>
      mode === 'sale'
        ? 'Bất động sản này không còn có sẵn. Thị trường bất động sản Đà Nẵng thay đổi nhanh — hãy sử dụng ô tìm kiếm bên dưới để tìm ngôi nhà của bạn.'
        : 'Bất động sản này không còn có sẵn. Thị trường cho thuê Đà Nẵng thay đổi nhanh — hãy sử dụng ô tìm kiếm bên dưới để tìm ngôi nhà tiếp theo của bạn.',
    heading: (mode: 'rent' | 'sale') =>
      mode === 'sale' ? 'Xem các bất động sản đang bán' : 'Xem các nhà cho thuê hiện có',
  },
};

interface Props {
  rentals:  Listing[];
  forSale:  Listing[];
}

export default function NotFoundContent({ rentals, forSale }: Props) {
  const pathname = usePathname() ?? '';
  const isVi     = pathname.startsWith('/vi');
  const slug     = pathname.split('/').pop() ?? '';
  // Heuristic: AI-generated for-sale titles almost always contain "for-sale"
  // in the slugified prefix. Vietnamese for-sale URLs may also be hit by users
  // who typed an English slug, so we check both. Worst-case the user lands on
  // the wrong grid and can navigate via the header — not a hard error.
  const isForSale = /(^|-)for-sale(-|$)/i.test(slug);
  const mode: 'rent' | 'sale' = isForSale ? 'sale' : 'rent';
  const t        = isVi ? COPY.vi : COPY.en;

  const listings  = mode === 'sale' ? forSale : rentals;
  const types     = getUniqueValues(listings, 'type');
  const districts = getUniqueValues(listings, 'district');

  return (
    <>
      <div className="bg-gradient-to-br from-blue-700 to-blue-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">{t.h1}</h1>
          <p className="text-blue-100 text-base max-w-2xl">{t.body(mode)}</p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8">
        <h2 className="text-lg font-semibold text-slate-700 mb-4">{t.heading(mode)}</h2>
      </div>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pb-8">
        <ListingsGrid listings={listings} types={types} districts={districts} />
      </main>
    </>
  );
}
