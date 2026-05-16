import { getForSaleListings, getUniqueValues } from '@/lib/sheets';
import ListingsGrid from '@/components/ListingsGrid';
import SiteHeader from '@/components/SiteHeader';
import PageHero from '@/components/PageHero';
import SiteFooter from '@/components/SiteFooter';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Houses for Sale in Da Nang, Vietnam',
  description: 'Browse houses, apartments, villas, and land for sale in Da Nang and Hoi An, Vietnam. Updated daily from local agents and live listings.',
  alternates: {
    canonical: 'https://danangmls.com/for-sale',
    languages: { vi: 'https://danangmls.com/vi/mua-ban' },
  },
  openGraph: {
    title: 'Houses for Sale in Da Nang, Vietnam',
    description: 'Browse houses, apartments, villas, and land for sale in Da Nang and Hoi An. Updated daily.',
    url: 'https://danangmls.com/for-sale',
    type: 'website',
  },
};

export default async function ForSalePage() {
  const listings = await getForSaleListings();
  const types     = getUniqueValues(listings, 'type');
  const districts = getUniqueValues(listings, 'district');

  return (
    <div className="min-h-screen bg-slate-50">
      <SiteHeader />
      <PageHero mode="sale" count={listings.length} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pb-8">
        <ListingsGrid listings={listings} types={types} districts={districts} mode="sale" />
      </main>
      <SiteFooter />
    </div>
  );
}
