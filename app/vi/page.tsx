import { getListings, getForSaleListings } from '@/lib/sheets';
import { getLatestVideo } from '@/lib/youtube';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import HomeHero from '@/components/HomeHero';
import LatestVideo from '@/components/LatestVideo';
import FeaturedListings from '@/components/FeaturedListings';
import FeaturedBlogs from '@/components/FeaturedBlogs';
import type { Metadata } from 'next';

// ISR: cache this sheet-backed page, regenerate at most every 5 min (cost control).
export const revalidate = 300;

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
    locale: 'vi_VN',
    title: 'Bất Động Sản Đà Nẵng - Trang Niêm Yết Bất Động Sản | DanangMLS',
    description: 'Danh sách rõ ràng nhất các bất động sản cho thuê và bán tại Đà Nẵng và Hội An. Tổng hợp từ các đại lý địa phương, cập nhật hàng ngày.',
    url: 'https://danangmls.com/vi',
    type: 'website',
  },
};

export default async function ViHomePage() {
  const [rentals, forSale, video] = await Promise.all([
    getListings(),
    getForSaleListings(),
    getLatestVideo(),
  ]);

  return (
    <div className="min-h-screen bg-slate-50">
      <SiteHeader />
      <HomeHero />
      <LatestVideo video={video} />
      <FeaturedListings listings={rentals} mode="rent" />
      <FeaturedListings listings={forSale} mode="sale" />
      <FeaturedBlogs />
      <SiteFooter />
    </div>
  );
}
