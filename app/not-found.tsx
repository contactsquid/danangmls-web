import { getListings, getUniqueValues } from '@/lib/sheets';
import ListingsGrid from '@/components/ListingsGrid';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '404: Page Not Found',
  description: 'This property is no longer available. Browse current rental listings in Da Nang and Hoi An, Vietnam.',
};

export default async function NotFound() {
  const listings = await getListings();
  const types     = getUniqueValues(listings, 'type');
  const districts = getUniqueValues(listings, 'district');

  return (
    <div className="min-h-screen bg-slate-50">
      <SiteHeader />
      <div className="bg-gradient-to-br from-blue-700 to-blue-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">404: Page Not Found</h1>
          <p className="text-blue-100 text-base max-w-2xl">
            This property is no longer available. The rental market in Da Nang moves quickly — use the search below to find your next home.
          </p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8">
        <h2 className="text-lg font-semibold text-slate-700 mb-4">Browse current listings</h2>
      </div>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pb-8">
        <ListingsGrid listings={listings} types={types} districts={districts} />
      </main>
      <SiteFooter />
    </div>
  );
}
