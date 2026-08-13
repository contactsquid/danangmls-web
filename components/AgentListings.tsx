import Link from 'next/link';
import ListingCard from './ListingCard';
import { AGENT_COPY } from '@/lib/agentCopy';
import type { Lang } from '@/lib/translations';
import type { Listing } from '@/lib/types';

/** An agent's inventory, split rentals-first then sales — the two have different
 *  price semantics (per month vs outright) and reading them interleaved is
 *  confusing. Reuses the site-wide ListingCard so profiles inherit every future
 *  card improvement for free. */
export default function AgentListings({
  listings,
  agentName,
  lang = 'en',
}: {
  listings: Listing[];
  agentName: string;
  lang?: Lang;
}) {
  const t = AGENT_COPY[lang];
  const rentHref = lang === 'vi' ? '/vi/thue' : '/for-rent';
  const saleHref = lang === 'vi' ? '/vi/mua-ban' : '/for-sale';

  if (listings.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
        <p className="text-slate-600">{t.noneRightNow(agentName)}</p>
        <div className="mt-4 flex flex-wrap gap-3 justify-center">
          <Link href={rentHref} className="text-blue-600 hover:underline">{t.browseForRent}</Link>
          <span className="text-slate-300">·</span>
          <Link href={saleHref} className="text-blue-600 hover:underline">{t.browseForSale}</Link>
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
              {t.forRentHeading(rentals.length)}
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
              {t.forSaleHeading(sales.length)}
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
