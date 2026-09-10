import { getForSaleListings, getUniqueValues } from '@/lib/sheets';
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
import { OG_DEFAULT_IMAGES } from '@/lib/ogImage';

// Grid pages render ALL listings in one page (too large to ISR-prerender:
// FALLBACK_BODY_TOO_LARGE). Keep them dynamic. force-dynamic also forces the
// shared fetchCSV back to no-store for these routes only.
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: '다낭 부동산 매매 | DanangMLS',
  description: '베트남 다낭과 호이안의 주택, 아파트, 빌라, 토지 매매 매물. 매일 업데이트됩니다.',
  alternates: {
    canonical: 'https://danangmls.com/ko/for-sale',
    languages: {
      en: 'https://danangmls.com/for-sale',
      ko: 'https://danangmls.com/ko/for-sale',
      'x-default': 'https://danangmls.com/for-sale',
    },
  },
  openGraph: {
    images: OG_DEFAULT_IMAGES,
    locale: 'ko_KR',
  },
};

export default async function KOForSalePage() {
  const listings = await getForSaleListings();
  const types     = getUniqueValues(listings, 'type');
  const districts = getUniqueValues(listings, 'district');
  const itemListLd = listingsItemListLd(listings, { forSale: true, vi: false });

  return (
    <div className="bg-slate-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }} />
      <PageHero mode="sale" count={listings.length} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pb-8">
        <ListingsGrid listings={toGridListings(listings).slice(0, INITIAL_GRID_LISTINGS)} types={types} districts={districts} mode="sale" deferred={{ mode: 'sale', total: listings.length }} />
      </main>
      <PopularBuildings buildings={popularBuildings(listings, 'sale', 'ko')} lang="ko" />
      <PageSeoSection mode="sale" districtImages={districtImageMap(listings)} />
      <PageFaq mode="sale" image={firstAnyImage(listings)} />
    </div>
  );
}
