import { getForSaleListings, getUniqueValues } from '@/lib/sheets';
import ListingsGrid from '@/components/ListingsGrid';
import SiteHeader from '@/components/SiteHeader';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Properties For Sale in Da Nang — DanangMLS',
  description: 'Browse houses, apartments, villas and land for sale in Da Nang and Hoi An, Vietnam.',
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
          <h1 className="text-3xl sm:text-4xl font-bold mb-1">Properties for sale in Da Nang</h1>
          <p className="text-blue-100 text-base">{listings.length}{' '}properties for sale in Da Nang &amp; Hoi An</p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
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
