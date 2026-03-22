import { getListings, getUniqueValues } from '@/lib/sheets';
import ListingsGrid from '@/components/ListingsGrid';
import SiteHeader from '@/components/SiteHeader';
import PageHero from '@/components/PageHero';
import SiteFooter from '@/components/SiteFooter';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Nhà Cho Thuê tại Đà Nẵng, Việt Nam | DanangMLS',
  description: 'Xem danh sách nhà, căn hộ, biệt thự cho thuê tại Đà Nẵng và Hội An. Cập nhật hàng ngày từ các đại lý bất động sản địa phương.',
  alternates: {
    canonical: 'https://danangmls.com/vi',
    languages: { en: 'https://danangmls.com' },
  },
};

export default async function ViRentPage() {
  const listings = await getListings();
  const types     = getUniqueValues(listings, 'type');
  const districts = getUniqueValues(listings, 'district');

  return (
    <div className="min-h-screen bg-slate-50">
      <SiteHeader />
      <PageHero mode="rent" count={listings.length} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pb-8">
        <ListingsGrid listings={listings} types={types} districts={districts} />
      </main>
      <SiteFooter />
    </div>
  );
}
