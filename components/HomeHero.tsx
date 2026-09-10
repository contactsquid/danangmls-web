'use client';

import Link from 'next/link';
import { useLanguage } from './LanguageProvider';
import { facetBase } from '@/lib/facets';
import { forLang } from '@/lib/translations';

export default function HomeHero() {
  const { lang } = useLanguage();
  const isVi = lang === 'vi';

  return (
    <div className="bg-gradient-to-br from-blue-700 to-blue-500 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20 text-center">
        <h1 className="text-3xl sm:text-5xl font-bold mb-4">
          {forLang({
            en: 'Da Nang Real Estate - Multiple Listing Service',
            vi: 'Bất Động Sản Đà Nẵng - Trang Niêm Yết Bất Động Sản',
            ko: '다낭 부동산 - 매물 정보 서비스',
            ru: 'Недвижимость Дананга - база объявлений',
          }, lang)}
        </h1>
        <p className="text-blue-100 text-base sm:text-xl max-w-3xl mx-auto mb-8">
          {forLang({
            en: 'The cleanest list of rentals and houses for sale across Da Nang and Hoi An. Aggregated from local agents, refreshed daily, browsable in English, Vietnamese, Korean and Russian.',
            vi: 'Danh sách rõ ràng nhất các bất động sản cho thuê và bán tại Đà Nẵng và Hội An. Tổng hợp từ các đại lý địa phương, cập nhật hàng ngày, có thể duyệt bằng tiếng Anh, tiếng Việt, tiếng Hàn và tiếng Nga.',
            ko: '다낭과 호이안 전역의 임대 및 매매 매물을 가장 깔끔하게 정리한 목록입니다. 현지 중개인의 매물을 매일 업데이트하며 영어, 베트남어, 한국어, 러시아어로 볼 수 있습니다.',
            ru: 'Самый аккуратный список жилья в аренду и на продажу в Дананге и Хойане. Объявления от местных агентов, обновляются ежедневно, доступны на английском, вьетнамском, корейском и русском.',
          }, lang)}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href={facetBase('rent', lang)}
            className="bg-white text-blue-700 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
          >
            {forLang({ en: 'Browse Rentals', vi: 'Xem nhà cho thuê', ko: '임대 매물 보기', ru: 'Смотреть аренду' }, lang)}
          </Link>
          <Link
            href={facetBase('sale', lang)}
            className="bg-blue-800 text-white border border-blue-400 px-6 py-3 rounded-lg font-semibold hover:bg-blue-900 transition-colors"
          >
            {forLang({ en: 'Browse For Sale', vi: 'Xem nhà bán', ko: '매매 매물 보기', ru: 'Смотреть продажу' }, lang)}
          </Link>
        </div>
      </div>
    </div>
  );
}
