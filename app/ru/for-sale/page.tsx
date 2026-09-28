import { getForSaleListings, getUniqueValues } from '@/lib/sheets';
import { SALE_TYPES } from '@/lib/propertyTypes';
import { toGridListings } from '@/lib/gridListing';

const INITIAL_GRID_LISTINGS = 48; // matches ListingsGrid PAGE_SIZE — the rest arrives from /api/grid-listings

import ListingsGrid from '@/components/ListingsGrid';
import PageHero from '@/components/PageHero';
import PageSeoSection from '@/components/PageSeoSection';
import PageFaq from '@/components/PageFaq';
import PopularBuildings from '@/components/PopularBuildings';
import { districtImageMap, firstAnyImage } from '@/lib/pageImages';
import { popularBuildings } from '@/lib/buildings';
import { listingsItemListLd } from '@/lib/schema';
import type { Metadata } from 'next';
import { withMapPreview } from '@/lib/mapPreview';
import { OG_DEFAULT_IMAGES } from '@/lib/ogImage';

// Grid pages render ALL listings in one page (too large to ISR-prerender:
// FALLBACK_BODY_TOO_LARGE). Keep them dynamic. force-dynamic also forces the
// shared fetchCSV back to no-store for these routes only.
export const dynamic = 'force-dynamic';

const metadata: Metadata = {
  title: 'Недвижимость на продажу в Дананге | DanangMLS',
  description: 'Дома, квартиры, виллы и участки на продажу в Дананге и Хойане. Обновляется ежедневно.',
  alternates: {
    canonical: 'https://danangmls.com/ru/for-sale',
    languages: {
      en: 'https://danangmls.com/for-sale',
      ru: 'https://danangmls.com/ru/for-sale',
      'x-default': 'https://danangmls.com/for-sale',
    },
  },
  openGraph: {
    images: OG_DEFAULT_IMAGES,
    locale: 'ru_RU',
  },
};

// A shared ?view=map link previews as a picture of the map (lib/mapPreview.ts).
export async function generateMetadata({ searchParams }: { searchParams: Promise<{ view?: string | string[] }> }): Promise<Metadata> {
  return withMapPreview(metadata, (await searchParams).view, 'ru', 'sale');
}

export default async function RUForSalePage() {
  const listings = await getForSaleListings();
  const types     = [...SALE_TYPES];   // fixed list, same as the add-listing form
  const districts = getUniqueValues(listings, 'district');
  const itemListLd = listingsItemListLd(listings, { forSale: true, vi: false });

  return (
    <div className="bg-slate-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }} />
      <PageHero mode="sale" count={listings.length} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pb-8">
        <ListingsGrid listings={toGridListings(listings).slice(0, INITIAL_GRID_LISTINGS)} types={types} districts={districts} mode="sale" deferred={{ mode: 'sale', total: listings.length }} />
      </main>
      <PopularBuildings buildings={popularBuildings(listings, 'sale', 'ru')} lang="ru" />
      <PageSeoSection mode="sale" districtImages={districtImageMap(listings)} />
      <PageFaq mode="sale" image={firstAnyImage(listings)} />
    </div>
  );
}
