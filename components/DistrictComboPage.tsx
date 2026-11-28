import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound, permanentRedirect } from 'next/navigation';
import { RENT_TYPES, SALE_TYPES } from '@/lib/propertyTypes';
import { getListings, getForSaleListings } from '@/lib/sheets';
import { toGridListings } from '@/lib/gridListing';
import { searchDistricts } from '@/lib/searchDistricts';
import { listingsItemListLd } from '@/lib/schema';
import { socialImages } from '@/lib/ogImage';
import { facetUrl, type Mode } from '@/lib/facets';
import { firstAnyImage, districtImageMap } from '@/lib/pageImages';
import { resolveCombo, comboMatches, comboContent, comboSeoBody, comboUrl, comboPath, combosWithInventory, COMBO_MIN_INDEX, SITE_BASE, SITE_BRAND, SITE_CITY_NAME } from '@/lib/districtCombos';
import ListingsGrid from '@/components/ListingsGrid';
import PageHero from '@/components/PageHero';
import PageSeoSection from '@/components/PageSeoSection';
import PageFaq from '@/components/PageFaq';

const INITIAL_GRID_LISTINGS = 48;
const fetchFor = (mode: Mode) => (mode === 'rent' ? getListings() : getForSaleListings());

export async function districtComboMetadata(mode: Mode, districtSlug: string, subSlug: string): Promise<Metadata> {
  const combo = resolveCombo(districtSlug, subSlug);
  if (!combo) return { title: 'Not Found', robots: { index: false, follow: false } };
  const matches = (await fetchFor(mode)).filter(l => comboMatches(l, combo));
  const c = comboContent(mode, combo, matches);
  const url = comboUrl(mode, combo);
  return {
    title: c.title,
    description: c.description,
    alternates: { canonical: url },
    openGraph: { title: c.title, description: c.description, url, type: 'website', images: socialImages(undefined, c.title) },
    twitter: { card: 'summary_large_image', images: socialImages(undefined, c.title) },
    ...(matches.length < COMBO_MIN_INDEX ? { robots: { index: false, follow: true } } : {}),
  };
}

export default async function DistrictComboPage({ mode, districtSlug, subSlug }: { mode: Mode; districtSlug: string; subSlug: string }) {
  const combo = resolveCombo(districtSlug, subSlug);
  if (!combo) notFound();
  const canon = comboPath(mode, combo);
  if (canon.split('/').slice(2).join('/') !== `${districtSlug.toLowerCase()}/${subSlug.toLowerCase()}`) permanentRedirect(canon);

  const all = await fetchFor(mode);
  const matches = all.filter(l => comboMatches(l, combo));
  if (matches.length === 0) notFound();
  const c = comboContent(mode, combo, matches);
  const body = comboSeoBody(mode, combo, matches);
  const districts = searchDistricts(all);
  const siblings = combosWithInventory(all, [combo.district]).filter(x => !(x.sub.kind === combo.sub.kind && x.sub.value === combo.sub.value));
  const types = [...(mode === 'sale' ? SALE_TYPES : RENT_TYPES)];
  const districtFacet = { kind: 'district' as const, value: combo.district };
  const crumbs = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: SITE_BRAND, item: SITE_BASE },
      { '@type': 'ListItem', position: 2, name: mode === 'rent' ? 'For Rent' : 'For Sale', item: SITE_BASE + (mode === 'rent' ? '/for-rent' : '/for-sale') },
      { '@type': 'ListItem', position: 3, name: combo.district, item: SITE_BASE + facetUrl(mode, 'en', districtFacet) },
      { '@type': 'ListItem', position: 4, name: c.h1, item: comboUrl(mode, combo) },
    ],
  };
  const faqLd = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: body.faq.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) };
  const link = 'px-3 py-1.5 rounded-full bg-white border border-slate-200 hover:border-slate-400';

  return (
    <div className="bg-slate-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(listingsItemListLd(matches, { forSale: mode === 'sale', vi: false })) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbs) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <PageHero mode={mode} count={matches.length} h1Override={c.h1} subtitleOverride={c.subtitle} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pb-8">
        <ListingsGrid
          listings={toGridListings(matches).slice(0, INITIAL_GRID_LISTINGS)}
          deferred={{ mode, total: matches.length }}
          types={types}
          districts={districts}
          mode={mode}
          initialDistrict={combo.district}
          initialType={combo.sub.kind === 'type' ? combo.sub.value : undefined}
          initialBeds={combo.sub.kind === 'bedrooms' ? combo.sub.value : undefined}
        />
        <nav aria-label={`More in ${combo.district}`} className="mt-8 flex flex-wrap gap-2 text-sm">
          <Link href={facetUrl(mode, 'en', districtFacet)} className={link}>All {mode === 'rent' ? 'rentals' : 'homes for sale'} in {combo.district}</Link>
          {siblings.map(s => (
            <Link key={`${s.sub.kind}${s.sub.value}`} href={comboPath(mode, s)} className={link}>
              {comboContent(mode, s, []).h1.replace(`, ${SITE_CITY_NAME}`, '')}
            </Link>
          ))}
        </nav>
      </main>
      <PageSeoSection mode={mode} districtImages={districtImageMap(matches)} seoOverride={{ h2: body.h2, intro: body.intro }} />
      <PageFaq mode={mode} image={firstAnyImage(matches) || firstAnyImage(all)} faqOverride={{ heading: body.faqHeading, faq: body.faq }} />
    </div>
  );
}
