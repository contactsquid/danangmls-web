import { getListings, getUniqueValues } from '@/lib/sheets';
import ListingsGrid from '@/components/ListingsGrid';
import Logo from '@/components/Logo';

export default async function HomePage() {
  const listings = await getListings();
  const types     = getUniqueValues(listings, 'type');
  const districts = getUniqueValues(listings, 'district');

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Logo />
          <span className="text-sm text-slate-400 hidden sm:block">
            Da Nang &amp; Hoi An, Vietnam
          </span>
        </div>
      </header>

      {/* Hero */}
      <div className="bg-gradient-to-br from-blue-700 to-blue-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <h1 className="text-3xl sm:text-4xl font-bold mb-1">
            Find your home in Da Nang
          </h1>
          <p className="text-blue-100 text-base mb-0">
            {listings.length}{' '}rental properties in Da Nang &amp; Hoi An
          </p>
        </div>
      </div>

      {/* Listings */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <ListingsGrid listings={listings} types={types} districts={districts} />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400">
          <span>© {new Date().getFullYear()} DanangMLS. All rights reserved.</span>
          <span>Updated every 30 minutes from live listings.</span>
        </div>
      </footer>
    </div>
  );
}
