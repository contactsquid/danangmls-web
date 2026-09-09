import { getListings, getUniqueValues } from '@/lib/sheets';
import { toGridListings } from '@/lib/gridListing';

const INITIAL_GRID_LISTINGS = 48; // matches ListingsGrid PAGE_SIZE — the rest arrives from /api/grid-listings

import ListingsGrid from '@/components/ListingsGrid';
import PageHero from '@/components/PageHero';
import PageSeoSection from '@/components/PageSeoSection';
import PageFaq from '@/components/PageFaq';
import PopularBuildings from '@/components/PopularBuildings';
import RentalGuide from '@/components/RentalGuide';
import RentalOverview from '@/components/RentalOverview';
import { districtImageMap, firstAnyImage } from '@/lib/pageImages';
import { popularBuildings } from '@/lib/buildings';
import { listingsItemListLd } from '@/lib/schema';
import type { Metadata } from 'next';
import { OG_DEFAULT_IMAGES } from '@/lib/ogImage';

// Grid pages render ALL listings in one page (too large to ISR-prerender:
// FALLBACK_BODY_TOO_LARGE). Keep them dynamic. force-dynamic also forces the
// shared fetchCSV back to no-store for these routes only.
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Аренда жилья в Дананге | DanangMLS',
  description: 'Дома, квартиры и виллы в аренду в Дананге и Хойане, Вьетнам. Обновляется ежедневно от местных агентов.',
  alternates: {
    canonical: 'https://danangmls.com/ru/for-rent',
    languages: {
      en: 'https://danangmls.com/for-rent',
      vi: 'https://danangmls.com/ru/for-rent',
      'x-default': 'https://danangmls.com/for-rent',
    },
  },
  openGraph: {
    images: OG_DEFAULT_IMAGES,
    locale: 'ru_RU',
  },
};

export default async function RURentPage() {
  const listings = await getListings();
  const types     = getUniqueValues(listings, 'type');
  const districts = getUniqueValues(listings, 'district');
  const itemListLd = listingsItemListLd(listings, { forSale: false, vi: false });

  return (
    <div className="bg-slate-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }} />
      <PageHero mode="rent" count={listings.length} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pb-8">
        <ListingsGrid listings={toGridListings(listings).slice(0, INITIAL_GRID_LISTINGS)} types={types} districts={districts} deferred={{ mode: 'rent', total: listings.length }} />
      </main>
      <PopularBuildings buildings={popularBuildings(listings, 'rent', 'ru')} lang="ru" />
      <RentalGuide />
      <RentalOverview />
      <PageSeoSection mode="rent" districtImages={districtImageMap(listings)} />
      <PageFaq mode="rent" image={firstAnyImage(listings)} />
    </div>
  );
}
