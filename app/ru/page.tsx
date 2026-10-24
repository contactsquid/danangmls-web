import { getListings, getForSaleListings } from '@/lib/sheets';
import HomeHero from '@/components/HomeHero';
import HomeMap from '@/components/HomeMap';
import { forMap } from '@/lib/homeMap';
import FeaturedListings from '@/components/FeaturedListings';
import FeaturedBlogs from '@/components/FeaturedBlogs';
import { fetchBlogPool } from '@/lib/featuredBlogs';
import VideoTours from '@/components/VideoTours';
import { getRecentVideoTours } from '@/lib/listingVideos';
import type { Metadata } from 'next';
import { OG_DEFAULT_IMAGES } from '@/lib/ogImage';

// Grid pages render ALL listings in one page (too large to ISR-prerender:
// FALLBACK_BODY_TOO_LARGE). Keep them dynamic. force-dynamic also forces the
// shared fetchCSV back to no-store for these routes only.
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Недвижимость в Дананге — база объявлений',
  description: 'DanangMLS — самый аккуратный список жилья в аренду и на продажу в Дананге и Хойане, Вьетнам. Объявления от местных агентов, обновляются ежедневно, доступны на английском, вьетнамском, корейском и русском.',
  alternates: {
    canonical: 'https://danangmls.com/ru',
    languages: {
      en: 'https://danangmls.com',
      ru: 'https://danangmls.com/ru',
      'x-default': 'https://danangmls.com',
    },
  },
  openGraph: {
    images: OG_DEFAULT_IMAGES,
    locale: 'ru_RU',
    title: 'Недвижимость в Дананге — база объявлений | DanangMLS',
    description: 'Самый аккуратный список жилья в аренду и на продажу в Дананге. Объявления от местных агентов, обновляются ежедневно.',
    url: 'https://danangmls.com/ru',
    type: 'website',
  },
};

export default async function RUHomePage() {
  const [rentals, forSale, blogPool, videoTours] = await Promise.all([
    getListings(),
    getForSaleListings(),
    fetchBlogPool(),
    getRecentVideoTours(4).catch(() => []),
  ]);

  return (
    <div className="bg-slate-50">
      <HomeHero />
      {/* Blake 2026-10-24: the 12 newest rentals and 12 newest for sale on a map. */}
      <HomeMap rentals={forMap(rentals, 12)} forSale={forMap(forSale, 12)} rentTotal={rentals.length} saleTotal={forSale.length} />
      {/* Slice on the server — FeaturedListings only shows 3 (avoids serializing thousands). */}
      <FeaturedListings listings={rentals.slice(0, 3)} mode="rent" />
      <FeaturedListings listings={forSale.slice(0, 3)} mode="sale" />
      <FeaturedBlogs posts={blogPool} />
      <VideoTours videos={videoTours} />
    </div>
  );
}
