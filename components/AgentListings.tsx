import Link from 'next/link';
import ListingCard from './ListingCard';
import type { Listing } from '@/lib/types';

/** An agent's inventory, split rentals-first then sales — the two have different
 *  price semantics (per month vs outright) and reading them interleaved is
 *  confusing. Reuses the site-wide ListingCard so profiles inherit every future
 *  card improvement for free. */
export default function AgentListings({
  listings,
  agentName,
}: {
  listings: Listing[];
  agentName: string;
}) {
  if (listings.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
        <p className="text-slate-600">
          {agentName} has no active listings on DanangMLS right now.
        </p>
        <div className="mt-4 flex flex-wrap gap-3 justify-center">
          <Link href="/for-rent" className="text-blue-600 hover:underline">Browse properties for rent</Link>
          <span className="text-slate-300">·</span>
          <Link href="/for-sale" className="text-blue-600 hover:underline">Browse properties for sale</Link>
        </div>
      </div>
    );
  }

  const rentals = listings.filter(l => !l.forSale);
  const sales   = listings.filter(l => l.forSale);

  return (
    <div className="space-y-10">
      {rentals.length > 0 && (
        <section>
          {sales.length > 0 && (
            <h3 className="text-base font-semibold text-slate-800 mb-3">
              For rent ({rentals.length})
            </h3>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {rentals.map(l => <ListingCard key={l.slug} listing={l} />)}
          </div>
        </section>
      )}

      {sales.length > 0 && (
        <section>
          {rentals.length > 0 && (
            <h3 className="text-base font-semibold text-slate-800 mb-3">
              For sale ({sales.length})
            </h3>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sales.map(l => <ListingCard key={l.slug} listing={l} />)}
          </div>
        </section>
      )}
    </div>
  );
}
