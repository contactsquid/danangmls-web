import { getForSaleListings, getUniqueValues } from '@/lib/sheets';
import ListingsGrid from '@/components/ListingsGrid';
import SiteHeader from '@/components/SiteHeader';
import PageHero from '@/components/PageHero';
import SiteFooter from '@/components/SiteFooter';
import { listingsItemListLd } from '@/lib/schema';
import type { Metadata } from 'next';

// Grid pages render ALL listings in one page (too large to ISR-prerender:
// FALLBACK_BODY_TOO_LARGE). Keep them dynamic. force-dynamic also forces the
// shared fetchCSV back to no-store for these routes only.
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Houses for Sale in Da Nang, Vietnam | Real Estate & Properties',
  description: 'Browse houses, apartments, villas, and land for sale in Da Nang and Hoi An, Vietnam. Updated daily from local agents and live listings.',
  alternates: {
    canonical: 'https://danangmls.com/for-sale',
    languages: {
      en: 'https://danangmls.com/for-sale',
      vi: 'https://danangmls.com/vi/mua-ban',
      'x-default': 'https://danangmls.com/for-sale',
    },
  },
  openGraph: {
    title: 'Houses for Sale in Da Nang, Vietnam | Real Estate & Properties',
    description: 'Browse houses, apartments, villas, and land for sale in Da Nang and Hoi An. Updated daily.',
    url: 'https://danangmls.com/for-sale',
    type: 'website',
  },
};

export default async function ForSalePage() {
  const listings = await getForSaleListings();
  const types     = getUniqueValues(listings, 'type');
  const districts = getUniqueValues(listings, 'district');
  const itemListLd = listingsItemListLd(listings, { forSale: true, vi: false });

  return (
    <div className="min-h-screen bg-slate-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }} />
      <SiteHeader />
      <PageHero mode="sale" count={listings.length} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pb-8">
        <ListingsGrid listings={listings} types={types} districts={districts} mode="sale" />
      </main>
      <SiteFooter />
    </div>
  );
}
