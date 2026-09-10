'use client';

import Link from 'next/link';
import Carousel from './Carousel';
import ListingCard from './ListingCard';
import ForeignEligibleBadge from './ForeignEligibleBadge';
import { useLanguage } from './LanguageProvider';
import RunningCosts from './RunningCosts';
import type { Listing } from '@/lib/types';
import { forLang } from '@/lib/translations';
import { convertPrice, localizeType, localizeDistrict, localizedAltPrefix, firstImageAltPrefix, localizedTitle, localizedText } from '@/lib/price';
import { getDistrict, districtCopy } from '@/lib/districts';
import { getListingNote } from '@/lib/listingNotes';
import { listingFieldHref, facetUrl, FOREIGN_FACET, facetBase } from '@/lib/facets';
import { relativeTime } from '@/lib/relativeTime';

interface Props {
  listing: Listing;
  similarListings?: Listing[];
  /** Slug of the agent's verified profile, resolved server-side. Undefined when
   *  the agent has no profile, which is the normal case. */
  agentSlug?: string | null;
  /** Listing has left the live sheet; page stays 200 so the indexed URL survives. */
  archived?: boolean;
}

// Vietnamese fallback title for listings without vi_title — keeps the H1
// from rendering raw English on /vi/listing/* pages. Sheet1 (rentals)
// doesn't have a VI_TITLE column yet, so most rentals hit this fallback.
// Pattern: "Cho thuê Nhà 3 phòng ngủ tại Sơn Trà, Đà Nẵng"
function viFallbackTitle(listing: Listing): string {
  const verb  = listing.forSale ? 'Bán' : 'Cho thuê';
  const type  = listing.type ? localizeType(listing.type, 'vi') : 'Bất động sản';
  const beds  = listing.bedrooms ? ` ${listing.bedrooms} phòng ngủ` : '';
  const place = listing.district
    ? `${localizeDistrict(listing.district, 'vi')}, Đà Nẵng`
    : 'Đà Nẵng';
  return `${verb} ${type}${beds} tại ${place}`;
}

// "About <district>, Da Nang" reads differently in each language, so the whole
// heading is built per locale rather than concatenated around a translated name.
function districtHeading(name: string, lang: string): string {
  if (lang === 'vi') return `Về Quận ${name}, Đà Nẵng`;
  if (lang === 'ko') return `다낭 ${name} 지역 안내`;
  if (lang === 'ru') return `О районе ${name}, Дананг`;
  return `About ${name} District, Da Nang`;
}

export default function ListingDetail({ listing, archived = false, similarListings = [], agentSlug = null }: Props) {
  const { lang, t } = useLanguage();
  const images = listing.images.filter(Boolean);
  // "Listed" date for the detail page (not on thumbnails), shown as relative
  // time ("3 days ago") instead of an absolute date. Shown in the ACTIVE
  // language only (English on EN view, Vietnamese on /vi).
  const listedDate = relativeTime(listing.date, lang);
  const displayTitle = lang === 'vi'
    ? (listing.vi_title || viFallbackTitle(listing))
    : localizedTitle(listing, lang);
  // localizedText is vi-identical (vi_text || text) and adds ko/ru.
  const sourceText   = localizedText(listing, lang);
  const displayPrice = listing.price ? convertPrice(listing.price, lang) : listing.price;

  // Type / bedrooms / district each link to their facet page (rent or sale) when
  // one exists; listingFieldHref returns null otherwise (e.g. unknown district).
  const detailMode = listing.forSale ? 'sale' : 'rent';
  const typeHref = listing.type     ? listingFieldHref('type', listing.type, detailMode, lang) : null;
  const bedsHref = listing.bedrooms ? listingFieldHref('bedrooms', String(listing.bedrooms), detailMode, lang) : null;
  const distHref = listing.district ? listingFieldHref('district', listing.district, detailMode, lang) : null;
  const browseVerb = listing.forSale
    ? forLang({ en: 'for sale', vi: 'rao bán', ko: '매매', ru: 'на продажу' }, lang)
    : forLang({ en: 'rentals', vi: 'cho thuê', ko: '임대', ru: 'в аренду' }, lang);
  const districtInfo = getDistrict(listing.district);

  const altPrefix = localizedAltPrefix(
    { bedrooms: listing.bedrooms, type: listing.type, district: listing.district, forSale: listing.forSale },
    lang,
  );
  // First photo leads with a high-volume search keyphrase (rotated per listing
  // for houses) — the image most likely indexed in Google image search.
  const firstAltPrefix = firstImageAltPrefix(
    { bedrooms: listing.bedrooms, type: listing.type, district: listing.district, forSale: listing.forSale, slug: listing.slug },
    lang,
  );

  const cleanText = sourceText
    // Strip inline contact block that may be appended without a preceding newline
    .replace(/\s*📞[\s\S]*$/, '')
    .split('\n')
    .filter(line => !/zalo|whatsapp|danang4homes|danang\.homes|contact information|\+84\s*\d|📞|📱|📧|🌐/i.test(line))
    .join('\n')
    .trim();

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {archived && (
        <div className="mb-6 p-4 bg-slate-100 border border-slate-300 rounded-xl text-sm text-slate-700">
          <p className="font-semibold mb-1">
            {forLang({
              en: 'This listing is no longer available',
              vi: 'Tin đăng này không còn khả dụng',
              ko: '이 매물은 더 이상 제공되지 않습니다',
              ru: 'Это объявление больше не актуально',
            }, lang)}
          </p>
          <p className="leading-relaxed">
            {forLang({
              en: 'It has been taken off the market. The details below are kept for reference — browse similar listings further down, or see everything currently available.',
              vi: 'Bất động sản này đã ngừng cho thuê/bán. Thông tin bên dưới được giữ lại để tham khảo — xem các tin tương tự phía dưới hoặc tất cả tin đang có.',
              ko: '이 매물은 현재 거래가 종료되었습니다. 아래 정보는 참고용으로 보관되어 있습니다. 비슷한 매물은 아래에서, 현재 가능한 매물은 전체 목록에서 확인하세요.',
              ru: 'Объект снят с рынка. Информация ниже сохранена для справки — посмотрите похожие объекты ниже или весь актуальный список.',
            }, lang)}
          </p>
        </div>
      )}
      <Link href={facetBase(listing.forSale ? 'sale' : 'rent', lang)} className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline mb-6">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        {t.backToListings}
      </Link>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <Carousel images={images} title={listing.title} altPrefix={altPrefix} firstAltPrefix={firstAltPrefix} />

        <div className="p-6 sm:p-8">
          {/* Price + badges */}
          <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
            <p className="text-3xl font-bold text-slate-900">
              {displayPrice || <span className="text-slate-400 text-xl font-normal">{forLang({ en: 'Price on request', vi: 'Liên hệ để biết giá', ko: '가격 문의', ru: 'Цена по запросу' }, lang)}</span>}
            </p>
            <div className="flex flex-wrap gap-2">
              {listing.type && (
                typeHref ? (
                  <Link
                    href={typeHref}
                    title={lang === 'vi' ? `Xem tất cả ${localizeType(listing.type, lang)} ${browseVerb}` : `Browse all ${localizeType(listing.type, lang)} ${browseVerb}`}
                    className="bg-blue-50 text-blue-700 text-xs font-medium px-3 py-1 rounded-full hover:bg-blue-100 hover:underline transition-colors"
                  >
                    {localizeType(listing.type, lang)}
                  </Link>
                ) : (
                  <span className="bg-blue-50 text-blue-700 text-xs font-medium px-3 py-1 rounded-full">
                    {localizeType(listing.type, lang)}
                  </span>
                )
              )}
              {listing.bedrooms && (
                bedsHref ? (
                  <Link
                    href={bedsHref}
                    title={lang === 'vi' ? `Xem BĐS ${listing.bedrooms} phòng ngủ ${browseVerb}` : `Browse ${listing.bedrooms}-bedroom ${browseVerb}`}
                    className="bg-slate-100 text-slate-600 text-xs font-medium px-3 py-1 rounded-full hover:bg-slate-200 hover:underline transition-colors"
                  >
                    🛏 {listing.bedrooms} {t.br}
                  </Link>
                ) : (
                  <span className="bg-slate-100 text-slate-600 text-xs font-medium px-3 py-1 rounded-full">
                    🛏 {listing.bedrooms} {t.br}
                  </span>
                )
              )}
            </div>
          </div>

          {listing.foreignEligible && (
            <div className="mb-3">
              <ForeignEligibleBadge buildingName={listing.foreignEligibleBuilding} size="md"
                href={listing.forSale ? facetUrl('sale', lang, FOREIGN_FACET) : undefined} />
            </div>
          )}
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">{displayTitle}</h1>
          {(listing.type || listing.district) && (
            <h2 className="text-base font-medium text-slate-500 mb-6">
              {[
                listing.type  ? localizeType(listing.type, lang)                             : null,
                listing.forSale ? (lang === 'vi' ? 'bán tại' : 'for sale in') : (lang === 'vi' ? 'cho thuê tại' : 'for rent in'),
                listing.district ? localizeDistrict(listing.district, lang) + ', Da Nang, Vietnam' : 'Da Nang, Vietnam',
              ].filter(Boolean).join(' ')}
            </h2>
          )}

          {/* Key details grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6 p-4 bg-slate-50 rounded-xl">
            {listing.district && (
              <div>
                <p className="text-xs text-slate-400 mb-1">{t.district}</p>
                {distHref ? (
                  <Link href={distHref} className="font-semibold text-blue-700 hover:underline">📍 {localizeDistrict(listing.district, lang)}</Link>
                ) : (
                  <p className="font-semibold text-slate-800">📍 {localizeDistrict(listing.district, lang)}</p>
                )}
              </div>
            )}
            {listing.bedrooms && (
              <div>
                <p className="text-xs text-slate-400 mb-1">{t.bedrooms}</p>
                <p className="font-semibold text-slate-800">{listing.bedrooms} {t.bedrooms}</p>
              </div>
            )}
            {listing.agent && (
              <div>
                <p className="text-xs text-slate-400 mb-1">{t.agent}</p>
                {/* Links to the agent's profile only when they have a verified
                    one. Most sheet agents never signed up, so this stays plain
                    text for the majority of listings. */}
                {agentSlug ? (
                  <Link href={`/agent/${agentSlug}`} className="font-semibold text-blue-700 hover:underline">
                    {listing.agent}
                  </Link>
                ) : (
                  <p className="font-semibold text-slate-800">{listing.agent}</p>
                )}
              </div>
            )}
            {listedDate && (
              <div>
                <p className="text-xs text-slate-400 mb-1">{t.listed}</p>
                <p className="font-semibold text-slate-800">🗓 {listedDate}</p>
              </div>
            )}
          </div>

          {/* Contact */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-xl">
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">📞 {t.contactInfo}</h2>
            <div className="space-y-1 text-sm text-slate-700">
              <p>📱 Zalo / WhatsApp: <a href="tel:+84973747373" className="text-blue-600 hover:underline">+84 973 747 373</a></p>
              <p>📧 Email: <a href="mailto:hello@danang.homes" className="text-blue-600 hover:underline">hello@danang.homes</a></p>
              <p>🌐 Website: <a href={lang === 'vi' ? 'https://danang.homes/vi' : 'https://danang.homes'} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{lang === 'vi' ? 'danang.homes/vi' : 'danang.homes'}</a></p>
            </div>
          </div>

          {/* Per-listing highlighted note (e.g. flexible lease, recent renovation) */}
          {(() => {
            const note = getListingNote(listing.slug, lang === 'vi' ? 'vi' : 'en');
            if (!note) return null;
            return (
              <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                <p className="text-amber-900 leading-relaxed text-sm font-medium">⭐ {note}</p>
              </div>
            );
          })()}

          {/* Description */}
          {cleanText && (
            <div className="mb-8">
              <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">{t.description}</h2>
              <p className="text-slate-700 leading-relaxed whitespace-pre-line">{cleanText}</p>
            </div>
          )}

          {/* Running costs, when the source post stated them. Renders nothing
              when it did not, which today is most listings — see lib/runningCosts.ts. */}
          <RunningCosts text={sourceText} />

          {/* District section */}
          {districtInfo && (
            <div className="mb-8">
              <h2 className="text-lg font-bold text-slate-800 mb-3">
                {districtHeading(districtCopy(districtInfo, lang).name, lang)}
              </h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                {districtCopy(districtInfo, lang).description}
              </p>
              <div className="rounded-xl overflow-hidden border border-slate-200 h-64">
                <iframe
                  title={`Map of ${districtInfo.name} District, Da Nang`}
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${districtInfo.bbox.join(',')}&layer=mapnik&marker=${districtInfo.lat},${districtInfo.lng}`}
                  className="w-full h-full"
                  loading="lazy"
                />
              </div>
              <p className="text-xs text-slate-400 mt-1 text-right">
                <a href={`https://www.openstreetmap.org/?mlat=${districtInfo.lat}&mlon=${districtInfo.lng}#map=14/${districtInfo.lat}/${districtInfo.lng}`} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  View larger map
                </a>
              </p>
            </div>
          )}

          {/* Agent awareness callout */}
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-900">
            <p className="font-semibold mb-1">⚠️ {forLang({ en: 'Browsing Facebook for listings?', vi: 'Đang tìm kiếm trên Facebook?', ko: '페이스북에서 매물을 찾고 계신가요?', ru: 'Ищете жильё в Facebook?' }, lang)}</p>
            <p className="leading-relaxed">
              {forLang({
                en: 'Be aware of the risks of using unverified agents. ',
                vi: 'Hãy cẩn thận với các môi giới không có giấy phép. ',
                ko: '검증되지 않은 중개인을 이용할 때의 위험을 알아두세요. ',
                ru: 'Помните о рисках при работе с непроверенными агентами. ',
              }, lang)}
              <a
                href="https://danang.homes/renting-in-da-nang-agents-on-facebook-vs-trusted-professionals/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold underline hover:text-amber-700"
              >
                {forLang({ en: 'Read our guide before you proceed →', vi: 'Đọc hướng dẫn của chúng tôi →', ko: '진행하기 전에 안내를 읽어보세요 →', ru: 'Прочитайте наш гид, прежде чем продолжить →' }, lang)}
              </a>
            </p>
          </div>

          {/* Hub link */}
          <div className="mt-6 pt-6 border-t border-slate-100 text-center">
            <Link
              href={facetBase(listing.forSale ? 'sale' : 'rent', lang)}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:underline"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              {listing.forSale
                ? forLang({ en: 'View more properties for sale in Da Nang', vi: 'Xem tất cả bất động sản bán tại Đà Nẵng', ko: '다낭 매매 매물 더 보기', ru: 'Смотреть больше объектов на продажу в Дананге' }, lang)
                : forLang({ en: 'View more rentals in Da Nang', vi: 'Xem tất cả bất động sản cho thuê tại Đà Nẵng', ko: '다낭 임대 매물 더 보기', ru: 'Смотреть больше вариантов аренды в Дананге' }, lang)}
            </Link>
          </div>
        </div>
      </div>

      {/* Similar listings */}
      {similarListings.length > 0 && (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 mt-10 mb-12">
          <h2 className="text-lg font-bold text-slate-800 mb-5">
            {forLang({ en: 'Similar Listings', vi: 'Bất động sản tương tự', ko: '비슷한 매물', ru: 'Похожие объекты' }, lang)}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {similarListings.map(l => (
              <ListingCard key={l.slug} listing={l} />
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
