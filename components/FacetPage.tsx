import { getListings, getForSaleListings, getUniqueValues } from '@/lib/sheets';
import { toGridListings } from '@/lib/gridListing';
import ListingsGrid from '@/components/ListingsGrid';
import SiteHeader from '@/components/SiteHeader';
import PageHero from '@/components/PageHero';
import PageSeoSection from '@/components/PageSeoSection';
import PageFaq from '@/components/PageFaq';
import PopularBuildings from '@/components/PopularBuildings';
import SiteFooter from '@/components/SiteFooter';
import { listingsItemListLd } from '@/lib/schema';
import { resolveFacet, facetMatches, facetContent, facetInitialFilters, facetUrl, facetSlug, type Mode } from '@/lib/facets';
import { districtImageMap, firstAnyImage } from '@/lib/pageImages';
import { facetSeoBody } from '@/lib/facetSeo';
import { popularBuildings } from '@/lib/buildings';
import { notFound, permanentRedirect } from 'next/navigation';
import type { Metadata } from 'next';

const BASE = 'https://danangmls.com';

async function fetchFor(mode: Mode) {
  return mode === 'rent' ? getListings() : getForSaleListings();
}

/** Shared generateMetadata for all four facet routes. */
export async function facetMetadata(mode: Mode, lang: 'en' | 'vi', filterSlug: string): Promise<Metadata> {
  const facet = resolveFacet(filterSlug, lang);
  if (!facet) return { title: 'Not Found', robots: { index: false, follow: false } };
  const all = await fetchFor(mode);
  const filtered = all.filter(l => facetMatches(l, facet));
  const c = facetContent(facet, mode, lang, filtered.length);
  const enUrl = BASE + facetUrl(mode, 'en', facet);
  const viUrl = BASE + facetUrl(mode, 'vi', facet);
  const self = lang === 'vi' ? viUrl : enUrl;
  return {
    title: c.title,
    description: c.description,
    alternates: { canonical: self, languages: { en: enUrl, vi: viUrl, 'x-default': enUrl } },
    openGraph: { title: c.title, description: c.description, url: self, type: 'website', ...(lang === 'vi' ? { locale: 'vi_VN' } : {}) },
    // Don't index a facet page while it has no inventory (still crawlable).
    ...(filtered.length === 0 ? { robots: { index: false, follow: true } } : {}),
  };
}

/** Shared page body for all four facet routes. */
export default async function FacetPage({ mode, lang, filterSlug }: { mode: Mode; lang: 'en' | 'vi'; filterSlug: string }) {
  const facet = resolveFacet(filterSlug, lang);
  if (!facet) notFound();
  // Normalize to the canonical slug for this language (e.g. /vi/thue/house →
  // /vi/thue/nha, /for-rent/nha → /for-rent/house) so each URL is single + stable.
  const canonical = facetSlug(facet, lang);
  if (canonical !== filterSlug.toLowerCase()) permanentRedirect(facetUrl(mode, lang, facet));

  const all = await fetchFor(mode);
  const filtered = all.filter(l => facetMatches(l, facet));
  const c = facetContent(facet, mode, lang, filtered.length);
  const init = facetInitialFilters(facet);
  const body = facetSeoBody(facet, mode, lang);
  const types = getUniqueValues(all, 'type');
  const districts = getUniqueValues(all, 'district');
  const itemListLd = listingsItemListLd(filtered, { forSale: mode === 'sale', vi: lang === 'vi' });

  return (
    <div className="min-h-screen bg-slate-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }} />
      <SiteHeader />
      <PageHero mode={mode} count={filtered.length} h1Override={c.h1} subtitleOverride={c.subtitle} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pb-8">
        {/* Full listing set so every filter still works; seeded with this facet. */}
        <ListingsGrid
          listings={toGridListings(all)}
          types={types}
          districts={districts}
          mode={mode}
          initialType={init.type}
          initialDistrict={init.district}
          initialBeds={init.beds}
          initialForeign={init.foreign}
        />
      </main>
      <PopularBuildings buildings={popularBuildings(all, mode, lang)} lang={lang} />
      <PageSeoSection mode={mode} districtImages={districtImageMap(all)}
        seoOverride={body ? { h2: body.h2, intro: body.intro } : undefined} />
      <PageFaq mode={mode} image={firstAnyImage(all)}
        faqOverride={body ? { heading: body.faqHeading, faq: body.faq } : undefined} />
      <SiteFooter />
    </div>
  );
}
