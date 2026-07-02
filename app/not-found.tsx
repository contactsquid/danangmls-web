import { getListings, getForSaleListings } from '@/lib/sheets';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import NotFoundContent from '@/components/NotFoundContent';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '404: Page Not Found',
  description: 'This property is no longer available. Browse current rental and for-sale listings in Da Nang and Hoi An, Vietnam.',
};

// Server component fetches both data sets; client component picks which to
// show + which language to render based on the actual URL the user landed on.
// (URL info isn't reliably available to server components for not-found pages,
//  so the client-side branch via usePathname() is the cleanest path.)
export default async function NotFound() {
  const [rentalsRes, forSaleRes] = await Promise.allSettled([
    getListings(),
    getForSaleListings(),
  ]);
  // The root not-found boundary is serialized into EVERY page's RSC flight data,
  // so passing the full sheets here bloated every page by ~40k image URLs. A 404
  // only needs a small browsable sample, so cap it hard.
  const NOT_FOUND_SAMPLE = 24;
  const rentals = rentalsRes.status === 'fulfilled' ? rentalsRes.value.slice(0, NOT_FOUND_SAMPLE) : [];
  const forSale = forSaleRes.status === 'fulfilled' ? forSaleRes.value.slice(0, NOT_FOUND_SAMPLE) : [];

  return (
    <div className="min-h-screen bg-slate-50">
      <SiteHeader />
      <NotFoundContent rentals={rentals} forSale={forSale} />
      <SiteFooter />
    </div>
  );
}
