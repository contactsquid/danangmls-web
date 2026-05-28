import { getListings, getUniqueValues } from '@/lib/sheets';
import ListingsGrid from '@/components/ListingsGrid';
import SiteHeader from '@/components/SiteHeader';
import PageHero from '@/components/PageHero';
import PopularSearches from '@/components/PopularSearches';
import SiteFooter from '@/components/SiteFooter';
import type { Metadata } from 'next';

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

  return (
    <div className="min-h-screen bg-slate-50">
      <SiteHeader />
      <PageHero mode="rent" count={listings.length} />
      <PopularSearches />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pb-8">
        <ListingsGrid listings={listings} types={types} districts={districts} />
      </main>
      <SiteFooter />
    </div>
  );
}
