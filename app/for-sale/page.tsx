import { getForSaleListings, getUniqueValues } from '@/lib/sheets';
import ListingsGrid from '@/components/ListingsGrid';
import SiteHeader from '@/components/SiteHeader';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Houses for Sale in Da Nang, Vietnam',
  description: 'Browse houses, apartments, villas, and land for sale in Da Nang and Hoi An, Vietnam. Updated daily from local agents and live listings.',
};

export default async function ForSalePage() {
  const listings = await getForSaleListings();
  const types     = getUniqueValues(listings, 'type');
  const districts = getUniqueValues(listings, 'district');

  return (
    <div className="min-h-screen bg-slate-50">
      <SiteHeader />

      {/* Hero */}
      <div className="bg-gradient-to-br from-blue-700 to-blue-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">Houses for Sale in Da Nang, Vietnam</h1>
          <p className="text-blue-100 text-base max-w-2xl">
            Browse {listings.length} properties for sale in Da Nang and Hoi An — houses, apartments, villas, and land. Listings sourced daily from local agents and property managers.
          </p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <h2 className="text-lg font-semibold text-slate-700 mb-4">Properties for Sale in Da Nang &amp; Hoi An</h2>
        <ListingsGrid listings={listings} types={types} districts={districts} mode="sale" />
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
