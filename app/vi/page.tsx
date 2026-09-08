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
  title: 'Bất Động Sản Đà Nẵng - Trang Niêm Yết Bất Động Sản | DanangMLS',
  description: 'DanangMLS — danh sách rõ ràng nhất các bất động sản cho thuê và bán tại Đà Nẵng và Hội An, Việt Nam. Tổng hợp từ các đại lý địa phương, cập nhật hàng ngày, có thể duyệt bằng tiếng Anh và tiếng Việt.',
  alternates: {
    canonical: 'https://danangmls.com/vi',
    languages: {
      en: 'https://danangmls.com',
      vi: 'https://danangmls.com/vi',
      'x-default': 'https://danangmls.com',
    },
  },
  openGraph: {
    images: OG_DEFAULT_IMAGES,
    locale: 'vi_VN',
    title: 'Bất Động Sản Đà Nẵng - Trang Niêm Yết Bất Động Sản | DanangMLS',
    description: 'Danh sách rõ ràng nhất các bất động sản cho thuê và bán tại Đà Nẵng và Hội An. Tổng hợp từ các đại lý địa phương, cập nhật hàng ngày.',
    url: 'https://danangmls.com/vi',
    type: 'website',
  },
};

// The featured video depends on YouTube, which we do not control and which
// throttles datacenter IPs. Rendering it inside a Suspense boundary means the
// page streams without waiting on it: a slow YouTube can no longer add to TTFB,
// it just fills in a moment later. LatestVideo renders nothing when the lookup
// comes back empty, so `null` is the honest fallback.
async function LatestVideoSlot() {
  const video = await getLatestVideoByLang('vi');
  return <LatestVideo video={video} />;
}

export default async function ViHomePage() {
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
