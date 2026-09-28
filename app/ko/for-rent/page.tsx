import { getListings } from '@/lib/sheets';
import { searchDistricts } from '@/lib/searchDistricts';
import { RENT_TYPES } from '@/lib/propertyTypes';
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
import { withMapPreview } from '@/lib/mapPreview';
import { OG_DEFAULT_IMAGES } from '@/lib/ogImage';

// Grid pages render ALL listings in one page (too large to ISR-prerender:
// FALLBACK_BODY_TOO_LARGE). Keep them dynamic. force-dynamic also forces the
// shared fetchCSV back to no-store for these routes only.
export const dynamic = 'force-dynamic';

const metadata: Metadata = {
  title: '다낭 임대 주택 | DanangMLS',
  description: '베트남 다낭과 호이안의 주택, 아파트, 빌라 임대 매물. 현지 중개인이 매일 업데이트합니다.',
  alternates: {
    canonical: 'https://danangmls.com/ko/for-rent',
    languages: {
      en: 'https://danangmls.com/for-rent',
      ko: 'https://danangmls.com/ko/for-rent',
      'x-default': 'https://danangmls.com/for-rent',
    },
  },
  openGraph: {
    images: OG_DEFAULT_IMAGES,
    locale: 'ko_KR',
  },
};

// A shared ?view=map link previews as a picture of the map (lib/mapPreview.ts).
export async function generateMetadata({ searchParams }: { searchParams: Promise<{ view?: string | string[] }> }): Promise<Metadata> {
  return withMapPreview(metadata, (await searchParams).view, 'ko', 'rent');
}

export default async function KORentPage() {
  const listings = await getListings();
  const types     = [...RENT_TYPES];   // fixed list, same as the add-listing form
  const districts = searchDistricts(listings);   // no "Not Provided"
  const itemListLd = listingsItemListLd(listings, { forSale: false, vi: false });

  return (
    <div className="bg-slate-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }} />
      <PageHero mode="rent" count={listings.length} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pb-8">
        <ListingsGrid listings={toGridListings(listings).slice(0, INITIAL_GRID_LISTINGS)} types={types} districts={districts} deferred={{ mode: 'rent', total: listings.length }} />
      </main>
      <PopularBuildings buildings={popularBuildings(listings, 'rent', 'ko')} lang="ko" />
      <RentalGuide />
      <RentalOverview />
      <PageSeoSection mode="rent" districtImages={districtImageMap(listings)} />
      <PageFaq mode="rent" image={firstAnyImage(listings)} />
    </div>
  );
}
