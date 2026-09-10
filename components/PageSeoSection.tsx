'use client';

import Link from 'next/link';
import { useLanguage } from './LanguageProvider';
import { renderInline } from '@/lib/inlineFormat';
import { facetUrl, FOREIGN_FACET, type Facet } from '@/lib/facets';
import { localizeType, localizeDistrict } from '@/lib/price';
import { forLang } from '@/lib/translations';
import { SEO_DISTRICTS, DISTRICT_HERO } from '@/lib/pageImages';

const TYPES = ['House', 'Apartment', 'Villa'];

// Chip labels, the type verb and these two headings were vi-or-English only, so
// /ko and /ru rendered them in English. The h2/intro above already come from the
// translations table, which is why only these were left showing.
const SEO_COPY = {
  en: { verbRent: 'for rent', verbSale: 'for sale', byType: 'By type', popular: 'Popular searches',
        rent: ['3-Bedroom Houses for Rent', '2-Bedroom Houses for Rent', 'Furnished Apartments for Rent', 'Villas for Rent', 'Houses for Rent in Son Tra', 'Rentals in Ngu Hanh Son'],
        sale: ['Apartments for Sale', '3-Bedroom Homes for Sale', 'Foreign-Buyer-Eligible Homes', 'Villas for Sale', 'Property for Sale in Ngu Hanh Son', 'Property for Sale in Son Tra'] },
  vi: { verbRent: 'cho thuê', verbSale: 'bán', byType: 'Theo loại hình', popular: 'Tìm kiếm phổ biến',
        rent: ['Nhà 3 phòng ngủ cho thuê', 'Nhà 2 phòng ngủ cho thuê', 'Căn hộ cho thuê', 'Biệt thự cho thuê', 'Nhà cho thuê tại Sơn Trà', 'Cho thuê tại Ngũ Hành Sơn'],
        sale: ['Căn hộ bán', 'Nhà 3 phòng ngủ bán', 'Người nước ngoài mua được', 'Biệt thự bán', 'Bán tại Ngũ Hành Sơn', 'Bán tại Sơn Trà'] },
  ko: { verbRent: '임대', verbSale: '매매', byType: '유형별', popular: '인기 검색',
        rent: ['침실 3개 주택 임대', '침실 2개 주택 임대', '가구 완비 아파트 임대', '빌라 임대', '썬짜 주택 임대', '응우한선 임대 매물'],
        sale: ['아파트 매매', '침실 3개 주택 매매', '외국인 구입 가능 주택', '빌라 매매', '응우한선 부동산 매매', '썬짜 부동산 매매'] },
  ru: { verbRent: 'в аренду', verbSale: 'на продажу', byType: 'По типу', popular: 'Популярные запросы',
        rent: ['Дома с 3 спальнями в аренду', 'Дома с 2 спальнями в аренду', 'Меблированные квартиры в аренду', 'Виллы в аренду', 'Дома в аренду в Шонче', 'Аренда в Нгуханьшоне'],
        sale: ['Квартиры на продажу', 'Дома с 3 спальнями на продажу', 'Жильё, доступное иностранцам', 'Виллы на продажу', 'Недвижимость на продажу в Нгуханьшоне', 'Недвижимость на продажу в Шонче'] },
} as const;

// Bottom-of-page SEO prose (moved down from the hero) + a district photo grid
// and type quick-links for internal linking.
export default function PageSeoSection({ mode, districtImages = {}, seoOverride }: { mode: 'rent' | 'sale'; districtImages?: Record<string, string>; seoOverride?: { h2: string; intro: string[] } }) {
  const { t, lang } = useLanguage();
  const h2    = seoOverride?.h2 ?? (mode === 'rent' ? t.rentH2 : t.saleH2);
  const h2mid = seoOverride ? '' : (mode === 'rent' ? t.rentH2mid : '');
  const h2b   = mode === 'rent' ? t.rentH2b   : t.saleH2b;
  const intro = seoOverride?.intro ?? (mode === 'rent' ? t.rentIntro : t.saleIntro);
  const c     = forLang(SEO_COPY, lang);
  const verb  = mode === 'rent' ? c.verbRent : c.verbSale;

  const chip = 'inline-flex items-center rounded-full bg-blue-50 text-blue-700 text-sm font-medium px-3 py-1.5 hover:bg-blue-100 hover:underline transition-colors';

  // Facet order is fixed; only the visible label varies by locale.
  const RENT_FACETS: Facet[] = [
    { kind: 'bedrooms', value: '3' },
    { kind: 'bedrooms', value: '2' },
    { kind: 'type', value: 'Apartment' },
    { kind: 'type', value: 'Villa' },
    { kind: 'district', value: 'Son Tra' },
    { kind: 'district', value: 'Ngu Hanh Son' },
  ];
  const SALE_FACETS: Facet[] = [
    { kind: 'type', value: 'Apartment' },
    { kind: 'bedrooms', value: '3' },
    FOREIGN_FACET,
    { kind: 'type', value: 'Villa' },
    { kind: 'district', value: 'Ngu Hanh Son' },
    { kind: 'district', value: 'Son Tra' },
  ];
  const popularSearches: { label: string; facet: Facet }[] =
    (mode === 'rent' ? c.rent : c.sale).map((label, i) => ({
      label,
      facet: (mode === 'rent' ? RENT_FACETS : SALE_FACETS)[i],
    }));

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-14">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-10">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-4">{h2}</h2>
        <div className="max-w-none text-[15px] text-slate-600 leading-7 space-y-4">
          <p>{renderInline(intro[0])}</p>
          {h2mid && <h3 className="text-lg font-semibold text-slate-700 pt-1">{h2mid}</h3>}
          {intro.slice(1).map((p, i) => <p key={i}>{renderInline(p)}</p>)}
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">{h2b}</h2>

          {/* District photo grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-6">
            {SEO_DISTRICTS.map(d => {
              const img = DISTRICT_HERO[d] ?? districtImages[d];
              const label = localizeDistrict(d, lang);
              return (
                <Link
                  key={d}
                  href={facetUrl(mode, lang, { kind: 'district', value: d })}
                  className="group relative rounded-xl overflow-hidden aspect-[4/3] bg-slate-100 shadow-sm"
                >
                  {img && (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={img}
                      alt={`${label} — ${mode === 'rent' ? 'rentals' : 'property for sale'} in Da Nang`}
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
                  <span className="absolute bottom-2 left-3 right-3 text-white font-semibold text-sm drop-shadow-md">{label}</span>
                </Link>
              );
            })}
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2">{c.byType}</p>
            <div className="flex flex-wrap gap-2">
              {TYPES.map(ty => (
                <Link key={ty} href={facetUrl(mode, lang, { kind: 'type', value: ty })} className={chip}>
                  {localizeType(ty, lang)} {verb}
                </Link>
              ))}
              {mode === 'sale' && (
                <Link href={facetUrl('sale', lang, FOREIGN_FACET)} className="inline-flex items-center rounded-full bg-emerald-50 text-emerald-700 text-sm font-medium px-3 py-1.5 hover:bg-emerald-100 hover:underline transition-colors">
                  {lang === 'vi' ? 'Người nước ngoài mua được' : 'Foreign Buyer Eligible'}
                </Link>
              )}
            </div>
          </div>

          {/* Popular searches — a real list of internal facet links */}
          <div className="mt-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2">{c.popular}</p>
            <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-1.5 list-disc pl-5 text-sm marker:text-slate-300">
              {popularSearches.map(p => (
                <li key={p.label}><Link href={facetUrl(mode, lang, p.facet)} className="text-blue-700 hover:underline">{p.label}</Link></li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
