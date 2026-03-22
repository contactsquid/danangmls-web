import { getForSaleListings, getUniqueValues } from '@/lib/sheets';
import ListingsGrid from '@/components/ListingsGrid';
import SiteHeader from '@/components/SiteHeader';
import PageHero from '@/components/PageHero';
import SiteFooter from '@/components/SiteFooter';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Nhà Bán tại Đà Nẵng, Việt Nam | DanangMLS',
  description: 'Xem danh sách nhà, căn hộ, biệt thự và đất nền bán tại Đà Nẵng và Hội An. Cập nhật hàng ngày từ các đại lý bất động sản địa phương.',
  alternates: {
    canonical: 'https://danangmls.com/vi/mua-ban',
    languages: { en: 'https://danangmls.com/for-sale' },
  },
};

export default async function ViForSalePage() {
  const listings = await getForSaleListings();
  const types     = getUniqueValues(listings, 'type');
  const districts = getUniqueValues(listings, 'district');

  return (
    <div className="min-h-screen bg-slate-50">
      <SiteHeader />
      <PageHero mode="sale" count={listings.length} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pb-8">
        <ListingsGrid listings={listings} types={types} districts={districts} mode="sale" />
      </main>
      <SiteFooter />
    </div>
  );
}
