'use client';

import Link from 'next/link';
import { useLanguage } from './LanguageProvider';
import { renderInline } from '@/lib/inlineFormat';
import { facetUrl, FOREIGN_FACET, type Facet } from '@/lib/facets';
import { localizeType, localizeDistrict } from '@/lib/price';
import { SEO_DISTRICTS, DISTRICT_HERO } from '@/lib/pageImages';

const TYPES = ['House', 'Apartment', 'Villa'];

// Bottom-of-page SEO prose (moved down from the hero) + a district photo grid
// and type quick-links for internal linking.
export default function PageSeoSection({ mode, districtImages = {}, seoOverride }: { mode: 'rent' | 'sale'; districtImages?: Record<string, string>; seoOverride?: { h2: string; intro: string[] } }) {
  const { t, lang } = useLanguage();
  const h2    = seoOverride?.h2 ?? (mode === 'rent' ? t.rentH2 : t.saleH2);
  const h2mid = seoOverride ? '' : (mode === 'rent' ? t.rentH2mid : '');
  const h2b   = mode === 'rent' ? t.rentH2b   : t.saleH2b;
  const intro = seoOverride?.intro ?? (mode === 'rent' ? t.rentIntro : t.saleIntro);
  const verb  = mode === 'rent' ? (lang === 'vi' ? 'cho thuê' : 'for rent') : (lang === 'vi' ? 'bán' : 'for sale');

  const chip = 'inline-flex items-center rounded-full bg-blue-50 text-blue-700 text-sm font-medium px-3 py-1.5 hover:bg-blue-100 hover:underline transition-colors';

  const popularSearches: { label: string; facet: Facet }[] = mode === 'rent'
    ? [
        { label: lang === 'vi' ? 'Nhà 3 phòng ngủ cho thuê' : '3-Bedroom Houses for Rent', facet: { kind: 'bedrooms', value: '3' } },
        { label: lang === 'vi' ? 'Nhà 2 phòng ngủ cho thuê' : '2-Bedroom Houses for Rent', facet: { kind: 'bedrooms', value: '2' } },
        { label: lang === 'vi' ? 'Căn hộ cho thuê' : 'Furnished Apartments for Rent', facet: { kind: 'type', value: 'Apartment' } },
        { label: lang === 'vi' ? 'Biệt thự cho thuê' : 'Villas for Rent', facet: { kind: 'type', value: 'Villa' } },
        { label: lang === 'vi' ? 'Nhà cho thuê tại Sơn Trà' : 'Houses for Rent in Son Tra', facet: { kind: 'district', value: 'Son Tra' } },
        { label: lang === 'vi' ? 'Cho thuê tại Ngũ Hành Sơn' : 'Rentals in Ngu Hanh Son', facet: { kind: 'district', value: 'Ngu Hanh Son' } },
      ]
    : [
        { label: lang === 'vi' ? 'Căn hộ bán' : 'Apartments for Sale', facet: { kind: 'type', value: 'Apartment' } },
        { label: lang === 'vi' ? 'Nhà 3 phòng ngủ bán' : '3-Bedroom Homes for Sale', facet: { kind: 'bedrooms', value: '3' } },
        { label: lang === 'vi' ? 'Người nước ngoài mua được' : 'Foreign-Buyer-Eligible Homes', facet: FOREIGN_FACET },
        { label: lang === 'vi' ? 'Biệt thự bán' : 'Villas for Sale', facet: { kind: 'type', value: 'Villa' } },
        { label: lang === 'vi' ? 'Bán tại Ngũ Hành Sơn' : 'Property for Sale in Ngu Hanh Son', facet: { kind: 'district', value: 'Ngu Hanh Son' } },
        { label: lang === 'vi' ? 'Bán tại Sơn Trà' : 'Property for Sale in Son Tra', facet: { kind: 'district', value: 'Son Tra' } },
      ];

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
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2">{lang === 'vi' ? 'Theo loại hình' : 'By type'}</p>
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
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2">{lang === 'vi' ? 'Tìm kiếm phổ biến' : 'Popular searches'}</p>
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
