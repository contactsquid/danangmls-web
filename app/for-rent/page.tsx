import { getListings, getUniqueValues } from '@/lib/sheets';
import { toGridListings } from '@/lib/gridListing';
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
  title: 'Apartments & Houses for Rent in Da Nang, Vietnam',
  description: 'Find houses, apartments, and villas for rent in Da Nang and Hoi An, Vietnam. Browse hundreds of rental listings updated daily from local agents.',
  alternates: {
    canonical: 'https://danangmls.com/for-rent',
    languages: {
      en: 'https://danangmls.com/for-rent',
      vi: 'https://danangmls.com/vi/thue',
      'x-default': 'https://danangmls.com/for-rent',
    },
  },
  openGraph: {
    title: 'Apartments & Houses for Rent in Da Nang, Vietnam',
    description: 'Browse hundreds of houses, apartments, and villas for rent in Da Nang and Hoi An. Updated daily.',
    url: 'https://danangmls.com/for-rent',
    type: 'website',
  },
};

export default async function ForRentPage() {
  const listings = await getListings();
  const types     = getUniqueValues(listings, 'type');
  const districts = getUniqueValues(listings, 'district');
  const itemListLd = listingsItemListLd(listings, { forSale: false, vi: false });

  return (
    <div className="min-h-screen bg-slate-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }} />
      <SiteHeader />
      <PageHero mode="rent" count={listings.length} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pb-8">
        <ListingsGrid listings={toGridListings(listings)} types={types} districts={districts} />
      </main>
      <SiteFooter />
    </div>
  );
}
