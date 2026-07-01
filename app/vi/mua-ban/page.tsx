import { getForSaleListings, getUniqueValues } from '@/lib/sheets';
import ListingsGrid from '@/components/ListingsGrid';
import SiteHeader from '@/components/SiteHeader';
import PageHero from '@/components/PageHero';
import SiteFooter from '@/components/SiteFooter';
import { listingsItemListLd } from '@/lib/schema';
import type { Metadata } from 'next';

// ISR: cache this sheet-backed page, regenerate at most every 5 min (cost control).
export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Nhà Bán tại Đà Nẵng, Việt Nam | DanangMLS',
  description: 'Xem danh sách nhà, căn hộ, biệt thự và đất nền bán tại Đà Nẵng và Hội An. Cập nhật hàng ngày từ các đại lý bất động sản địa phương.',
  alternates: {
    canonical: 'https://danangmls.com/vi/mua-ban',
    languages: {
      en: 'https://danangmls.com/for-sale',
      vi: 'https://danangmls.com/vi/mua-ban',
      'x-default': 'https://danangmls.com/for-sale',
    },
  },
  openGraph: {
    locale: 'vi_VN',
  },
};

export default async function ViForSalePage() {
  const listings = await getForSaleListings();
  const types     = getUniqueValues(listings, 'type');
  const districts = getUniqueValues(listings, 'district');
  const itemListLd = listingsItemListLd(listings, { forSale: true, vi: true });

  return (
    <div className="min-h-screen bg-slate-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }} />
      <SiteHeader />
      <PageHero mode="sale" count={listings.length} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pb-8">
        <ListingsGrid listings={listings} types={types} districts={districts} mode="sale" />
      </main>
      <SiteFooter />
    </div>
  );
}
