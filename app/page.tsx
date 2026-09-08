import { Suspense } from 'react';
import { getListings, getForSaleListings } from '@/lib/sheets';
import { getLatestVideoByLang } from '@/lib/youtube';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
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
    images: OG_DEFAULT_IMAGES,
    title: 'Da Nang Real Estate Multiple Listing Service - DaNangMLS',
    description: 'The cleanest list of rentals and houses for sale across Da Nang and Hoi An. Aggregated from local agents, refreshed daily.',
    url: 'https://danangmls.com',
    type: 'website',
  },
};

// The featured video depends on YouTube, which we do not control and which
// throttles datacenter IPs. Rendering it inside a Suspense boundary means the
// page streams without waiting on it: a slow YouTube can no longer add to TTFB,
// it just fills in a moment later. LatestVideo renders nothing when the lookup
// comes back empty, so `null` is the honest fallback.
async function LatestVideoSlot() {
  const video = await getLatestVideoByLang('en');
  return <LatestVideo video={video} />;
}

export default async function HomePage() {
  const [rentals, forSale, blogPool] = await Promise.all([
    getListings(),
    getForSaleListings(),
    fetchBlogPool(),
  ]);

  return (
    <div className="min-h-screen bg-slate-50">
      <SiteHeader />
      <HomeHero />
      <Suspense fallback={null}>
        <LatestVideoSlot />
      </Suspense>
      {/* Only 3 are shown (FeaturedListings slices to 3). Slice on the server so we
          don't serialize thousands of full listings into the homepage HTML (was 38MB). */}
      <FeaturedListings listings={rentals.slice(0, 3)} mode="rent" />
      <FeaturedListings listings={forSale.slice(0, 3)} mode="sale" />
      <FeaturedBlogs posts={blogPool} />
      <SiteFooter />
    </div>
  );
}
