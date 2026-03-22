import { getListings, getUniqueValues } from '@/lib/sheets';
import ListingsGrid from '@/components/ListingsGrid';

export default async function HomePage() {
  const listings = await getListings();
  const types     = getUniqueValues(listings, 'type');
  const districts = getUniqueValues(listings, 'district');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <span className="text-xl font-bold text-gray-900">DanangMLS</span>
            <span className="ml-2 text-sm text-gray-400">Da Nang &amp; Hoi An</span>
          </div>
          <span className="text-sm text-gray-500">{listings.length} listings</span>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <ListingsGrid listings={listings} types={types} districts={districts} />
      </main>

      {/* Footer */}
      <footer className="text-center text-xs text-gray-400 py-8">
        © {new Date().getFullYear()} DanangMLS · Updated every 30 minutes
      </footer>
    </div>
  );
}
