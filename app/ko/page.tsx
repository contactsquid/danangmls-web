import { Suspense } from 'react';
import { getListings, getForSaleListings } from '@/lib/sheets';
import { getLatestVideoByLang } from '@/lib/youtube';
import HomeHero from '@/components/HomeHero';
import LatestVideo from '@/components/LatestVideo';
import FeaturedListings from '@/components/FeaturedListings';
import FeaturedBlogs from '@/components/FeaturedBlogs';
import { fetchBlogPool } from '@/lib/featuredBlogs';
import type { Metadata } from 'next';
import { OG_DEFAULT_IMAGES } from '@/lib/ogImage';

// Grid pages render ALL listings in one page (too large to ISR-prerender:
// FALLBACK_BODY_TOO_LARGE). Keep them dynamic. force-dynamic also forces the
// shared fetchCSV back to no-store for these routes only.
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: '다낭 부동산 — 다낭 매물 정보 서비스 | DanangMLS',
  description: 'DanangMLS — 베트남 다낭과 호이안의 임대 및 매매 부동산을 가장 깔끔하게 정리한 목록. 현지 중개인의 매물을 매일 업데이트하며 영어, 베트남어, 한국어, 러시아어로 볼 수 있습니다.',
  alternates: {
    canonical: 'https://danangmls.com/ko',
    languages: {
      en: 'https://danangmls.com',
      ko: 'https://danangmls.com/ko',
      'x-default': 'https://danangmls.com',
    },
  },
  openGraph: {
    images: OG_DEFAULT_IMAGES,
    locale: 'ko_KR',
    title: 'Bất Động Sản Đà Nẵng - Trang Niêm Yết Bất Động Sản | DanangMLS',
    description: 'Danh sách rõ ràng nhất các bất động sản cho thuê và bán tại Đà Nẵng và Hội An. Tổng hợp từ các đại lý địa phương, cập nhật hàng ngày.',
    url: 'https://danangmls.com/ko',
    type: 'website',
  },
};

// The featured video depends on YouTube, which we do not control and which
// throttles datacenter IPs. Rendering it inside a Suspense boundary means the
// page streams without waiting on it: a slow YouTube can no longer add to TTFB,
// it just fills in a moment later. LatestVideo renders nothing when the lookup
// comes back empty, so `null` is the honest fallback.
async function LatestVideoSlot() {
  const video = await // The YouTube channel publishes English and Vietnamese only, so Korean and
    // Russian visitors get the English video rather than none.
    getLatestVideoByLang('en');
  return <LatestVideo video={video} />;
}

export default async function KOHomePage() {
  const [rentals, forSale, blogPool] = await Promise.all([
    getListings(),
    getForSaleListings(),
    fetchBlogPool(),
  ]);

  return (
    <div className="bg-slate-50">
      <HomeHero />
      <Suspense fallback={null}>
        <LatestVideoSlot />
      </Suspense>
      {/* Slice on the server — FeaturedListings only shows 3 (avoids serializing thousands). */}
      <FeaturedListings listings={rentals.slice(0, 3)} mode="rent" />
      <FeaturedListings listings={forSale.slice(0, 3)} mode="sale" />
      <FeaturedBlogs posts={blogPool} />
    </div>
  );
}
