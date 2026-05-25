'use client';

import Link from 'next/link';
import { useLanguage } from './LanguageProvider';

export default function HomeHero() {
  const { lang } = useLanguage();
  const isVi = lang === 'vi';

  return (
    <div className="bg-gradient-to-br from-blue-700 to-blue-500 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20 text-center">
        <h1 className="text-3xl sm:text-5xl font-bold mb-4">
          {isVi
            ? 'Bất Động Sản Đà Nẵng - Trang Niêm Yết Bất Động Sản'
            : 'Da Nang Real Estate - Multiple Listing Service'}
        </h1>
        <p className="text-blue-100 text-base sm:text-xl max-w-3xl mx-auto mb-8">
          {isVi
            ? 'Danh sách rõ ràng nhất các bất động sản cho thuê và bán tại Đà Nẵng và Hội An. Mỗi tin đăng được xác minh, giá được kiểm tra, ảnh chụp từ chính bất động sản.'
            : 'The cleanest list of rentals and houses for sale across Da Nang and Hoi An. Every listing vetted, every price verified, every photo from the actual property.'}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href={isVi ? '/vi/thue' : '/for-rent'}
            className="bg-white text-blue-700 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
          >
            {isVi ? 'Xem nhà cho thuê' : 'Browse Rentals'}
          </Link>
          <Link
            href={isVi ? '/vi/mua-ban' : '/for-sale'}
            className="bg-blue-800 text-white border border-blue-400 px-6 py-3 rounded-lg font-semibold hover:bg-blue-900 transition-colors"
          >
            {isVi ? 'Xem nhà bán' : 'Browse For Sale'}
          </Link>
        </div>
      </div>
    </div>
  );
}
