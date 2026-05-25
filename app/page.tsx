import { getListings, getForSaleListings } from '@/lib/sheets';
import { getLatestVideo } from '@/lib/youtube';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import HomeHero from '@/components/HomeHero';
import LatestVideo from '@/components/LatestVideo';
import FeaturedListings from '@/components/FeaturedListings';
import FeaturedBlogs from '@/components/FeaturedBlogs';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Da Nang Real Estate Multiple Listing Service - DaNangMLS',
  description: 'Da Nang Real Estate MLS — the cleanest list of rentals and houses for sale across Da Nang and Hoi An, Vietnam. Aggregated from local agents, refreshed daily, browsable in English and Vietnamese.',
  alternates: {
    canonical: 'https://danangmls.com',
    languages: {
      en: 'https://danangmls.com',
      vi: 'https://danangmls.com/vi',
      'x-default': 'https://danangmls.com',
    },
  },
  openGraph: {
    title: 'Da Nang Real Estate Multiple Listing Service - DaNangMLS',
    description: 'The cleanest list of rentals and houses for sale across Da Nang and Hoi An. Aggregated from local agents, refreshed daily.',
    url: 'https://danangmls.com',
    type: 'website',
  },
};

export default async function HomePage() {
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
