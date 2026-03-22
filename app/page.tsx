import { getListings, getUniqueValues } from '@/lib/sheets';
import ListingsGrid from '@/components/ListingsGrid';
import SiteHeader from '@/components/SiteHeader';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Houses for Rent in Da Nang, Vietnam',
  description: 'Find houses, apartments, and villas for rent in Da Nang and Hoi An, Vietnam. Browse hundreds of rental listings updated daily from local agents.',
};

export default async function HomePage() {
  const listings = await getListings();
  const types     = getUniqueValues(listings, 'type');
  const districts = getUniqueValues(listings, 'district');

  return (
    <div className="min-h-screen bg-slate-50">
      <SiteHeader />

      {/* Hero */}
      <div className="bg-gradient-to-br from-blue-700 to-blue-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">Houses for Rent in Da Nang, Vietnam</h1>
          <p className="text-blue-100 text-base max-w-2xl">
            Browse {listings.length} rental properties in Da Nang and Hoi An — apartments, houses, villas, and condos. Listings updated daily from local agents and property managers.
          </p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <h2 className="text-lg font-semibold text-slate-700 mb-4">Available Rental Properties in Da Nang &amp; Hoi An</h2>
        <ListingsGrid listings={listings} types={types} districts={districts} />
      </main>

      <footer className="border-t border-slate-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400">
          <span>© {new Date().getFullYear()} DanangMLS. All rights reserved.</span>
          <span>Updated every 30 minutes from live listings.</span>
        </div>
      </footer>
    </div>
  );
}
