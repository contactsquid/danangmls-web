import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound, permanentRedirect } from 'next/navigation';
import { RENT_TYPES, SALE_TYPES } from '@/lib/propertyTypes';
import { getListings, getForSaleListings } from '@/lib/sheets';
import { toGridListings } from '@/lib/gridListing';
import { searchDistricts } from '@/lib/searchDistricts';
import { listingsItemListLd } from '@/lib/schema';
import { socialImages } from '@/lib/ogImage';
import { facetUrl, facetBase, type Mode } from '@/lib/facets';
import { firstAnyImage, districtImageMap } from '@/lib/pageImages';
import type { Lang } from '@/lib/translations';
import { localizeDistrict } from '@/lib/price';
import { comboContentL, comboSeoBodyL } from '@/lib/districtCombosI18n';
import { resolveCombo, comboMatches, comboContent, comboSeoBody, comboUrl, comboPath, combosWithInventory, COMBO_MIN_INDEX, SITE_BASE, SITE_BRAND, SITE_CITY_NAME } from '@/lib/districtCombos';
import ListingsGrid from '@/components/ListingsGrid';
import PageHero from '@/components/PageHero';
import PageSeoSection from '@/components/PageSeoSection';
import PageFaq from '@/components/PageFaq';

const INITIAL_GRID_LISTINGS = 48;
const fetchFor = (mode: Mode) => (mode === 'rent' ? getListings() : getForSaleListings());

const LOCALES: Lang[] = ['en', 'vi', 'ko', 'ru'];
const contentFor = (lang: Lang, mode: Mode, combo: ReturnType<typeof resolveCombo> & {}, matches: Parameters<typeof comboContent>[2]) =>
  lang === 'en' ? comboContent(mode, combo, matches) : comboContentL(lang, mode, combo, matches);
const bodyFor = (lang: Lang, mode: Mode, combo: ReturnType<typeof resolveCombo> & {}, matches: Parameters<typeof comboContent>[2]) =>
  lang === 'en' ? comboSeoBody(mode, combo, matches) : comboSeoBodyL(lang, mode, combo, matches);

export async function districtComboMetadata(mode: Mode, districtSlug: string, subSlug: string, lang: Lang = 'en'): Promise<Metadata> {
  const combo = resolveCombo(districtSlug, subSlug);
  if (!combo) return { title: 'Not Found', robots: { index: false, follow: false } };
  const matches = (await fetchFor(mode)).filter(l => comboMatches(l, combo));
  const c = contentFor(lang, mode, combo, matches);
  const url = comboUrl(mode, combo, lang);
  const languages = Object.fromEntries([...LOCALES.map(l => [l, comboUrl(mode, combo, l)]), ['x-default', comboUrl(mode, combo, 'en')]]);
  return {
    title: c.title,
    description: c.description,
    alternates: { canonical: url, languages },
    openGraph: { title: c.title, description: c.description, url, type: 'website', ...(lang === 'vi' ? { locale: 'vi_VN' } : lang === 'ko' ? { locale: 'ko_KR' } : lang === 'ru' ? { locale: 'ru_RU' } : {}), images: socialImages(undefined, c.title) },
    twitter: { card: 'summary_large_image', images: socialImages(undefined, c.title) },
    ...(matches.length < COMBO_MIN_INDEX ? { robots: { index: false, follow: true } } : {}),
  };
}

export default async function DistrictComboPage({ mode, districtSlug, subSlug, lang = 'en' }: { mode: Mode; districtSlug: string; subSlug: string; lang?: Lang }) {
  const combo = resolveCombo(districtSlug, subSlug);
  if (!combo) notFound();
  const canon = comboPath(mode, combo, lang);
  if (!canon.endsWith(`/${districtSlug.toLowerCase()}/${subSlug.toLowerCase()}`)) permanentRedirect(canon);

  const all = await fetchFor(mode);
  const matches = all.filter(l => comboMatches(l, combo));
  if (matches.length === 0) notFound();
  const c = contentFor(lang, mode, combo, matches);
  const body = bodyFor(lang, mode, combo, matches);
  const districts = searchDistricts(all);
  const siblings = combosWithInventory(all, [combo.district]).filter(x => !(x.sub.kind === combo.sub.kind && x.sub.value === combo.sub.value));
  const types = [...(mode === 'sale' ? SALE_TYPES : RENT_TYPES)];
  const districtFacet = { kind: 'district' as const, value: combo.district };
  const crumbName = (l: Lang, m: Mode) => ({ en: ['For Rent', 'For Sale'], vi: ['Cho thuê', 'Mua bán'], ko: ['임대', '매매'], ru: ['Аренда', 'Продажа'] }[l][m === 'rent' ? 0 : 1]);
  const allIn = { en: (r: string, d: string) => `All ${r} in ${d}`, vi: (_: string, d: string) => `Tất cả tin tại ${d}`, ko: (_: string, d: string) => `${d} 전체 매물`, ru: (_: string, d: string) => `Все объявления: ${d}` }[lang];
  const crumbs = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: SITE_BRAND, item: SITE_BASE },
      { '@type': 'ListItem', position: 2, name: crumbName(lang, mode), item: SITE_BASE + facetBase(mode, lang) },
      { '@type': 'ListItem', position: 3, name: localizeDistrict(combo.district, lang), item: SITE_BASE + facetUrl(mode, lang, districtFacet) },
      { '@type': 'ListItem', position: 4, name: c.h1, item: comboUrl(mode, combo, lang) },
    ],
  };
  const faqLd = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: body.faq.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) };
  const dName = localizeDistrict(combo.district, lang);
  const link = 'px-3 py-1.5 rounded-full bg-white border border-slate-200 hover:border-slate-400';

  return (
    <div className="bg-slate-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(listingsItemListLd(matches, { forSale: mode === 'sale', vi: lang === 'vi' })) }} />
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
        <nav aria-label={`More in ${dName}`} className="mt-8 flex flex-wrap gap-2 text-sm">
          <Link href={facetUrl(mode, lang, districtFacet)} className={link}>{allIn(mode === 'rent' ? 'rentals' : 'homes for sale', dName)}</Link>
          {siblings.map(s => (
            <Link key={`${s.sub.kind}${s.sub.value}`} href={comboPath(mode, s, lang)} className={link}>
              {contentFor(lang, mode, s, []).h1}
            </Link>
          ))}
        </nav>
      </main>
      <PageSeoSection mode={mode} districtImages={districtImageMap(matches)} seoOverride={{ h2: body.h2, intro: body.intro }} />
      <PageFaq mode={mode} image={firstAnyImage(matches) || firstAnyImage(all)} faqOverride={{ heading: body.faqHeading, faq: body.faq }} />
    </div>
  );
}
