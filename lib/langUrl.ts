import type { Lang } from './translations';
import { resolveFacet, facetUrl, facetBase } from './facets';

// Maps the current path to its equivalent in another language. Lifted out of
// SiteHeader so every language control shares one mapping — two copies would
// drift and strand people on the wrong page.
//
// English lives at the root, everything else is prefixed. Vietnamese keeps its
// translated path words (/vi/thue) because those URLs are indexed; Korean and
// Russian use the English words under their prefix (/ko/for-rent).
const SHAPES = [
  { prefix: '/vi', rent: '/vi/thue',     sale: '/vi/mua-ban' },
  { prefix: '/ko', rent: '/ko/for-rent', sale: '/ko/for-sale' },
  { prefix: '/ru', rent: '/ru/for-rent', sale: '/ru/for-sale' },
  { prefix: '',    rent: '/for-rent',    sale: '/for-sale' },
] as const;

export function getLangUrl(pathname: string, targetLang: Lang): string {
  const home = targetLang === 'en' ? '/' : `/${targetLang}`;

  for (const s of SHAPES) {
    const inScope = s.prefix
      ? pathname === s.prefix || pathname.startsWith(s.prefix + '/')
      : true;
    if (!inScope) continue;

    for (const [base, mode] of [[s.rent, 'rent'], [s.sale, 'sale']] as const) {
      if (pathname === base) return facetBase(mode, targetLang);
      if (pathname.startsWith(base + '/')) {
        const f = resolveFacet(pathname.slice(base.length + 1));
        return f ? facetUrl(mode, targetLang, f) : facetBase(mode, targetLang);
      }
    }

    const listingBase = s.prefix ? `${s.prefix}/listing/` : '/listing/';
    if (pathname.startsWith(listingBase)) {
      const slug = pathname.slice(listingBase.length);
      return targetLang === 'en' ? `/listing/${slug}` : `/${targetLang}/listing/${slug}`;
    }

    // Any other page: stay on the same page (Blake, 2026-10-20 — the switcher used to dump
    // visitors on the homepage). Vietnamese has translated twins for most pages; Korean and
    // Russian only have home/rent/sale/listings, so they keep the English page.
    const en = toEnglishPath(pathname, s.prefix);
    if (en === '/') return home;
    if (targetLang === 'en' || targetLang === 'ko' || targetLang === 'ru') return en;
    return toVietnamesePath(en) ?? en;
  }
  return home;
}

// English page <-> its Vietnamese twin. Add a row whenever a page gets a Vietnamese version.
const VI_PAGES: [string, string][] = [
  ['/about', '/vi/gioi-thieu'],
  ['/agents', '/vi/moi-gioi'],
  ['/contact', '/vi/lien-he'],
  ['/privacy-policy', '/vi/chinh-sach-bao-mat'],
  ['/terms', '/vi/dieu-khoan'],
  ['/account/signup', '/vi/tai-khoan/dang-ky'],
  ['/account/login', '/vi/tai-khoan/dang-nhap'],
  ['/account/listings/new', '/vi/tai-khoan/dang-tin'],
  ['/account/listings', '/vi/tai-khoan/tin-dang'],
  ['/account/profile', '/vi/tai-khoan/ho-so'],
  ['/account/password', '/vi/tai-khoan/mat-khau'],
  ['/account/reset', '/vi/tai-khoan/quen-mat-khau'],
];
// Pages with a slug in the middle.
const VI_PATTERNS: [RegExp, (m: RegExpMatchArray) => string, RegExp, (m: RegExpMatchArray) => string][] = [
  [/^\/agent\/([^/]+)$/, m => `/vi/moi-gioi/${m[1]}`, /^\/vi\/moi-gioi\/([^/]+)$/, m => `/agent/${m[1]}`],
  [/^\/account\/listings\/([^/]+)\/edit$/, m => `/vi/tai-khoan/tin-dang/${m[1]}/sua`, /^\/vi\/tai-khoan\/tin-dang\/([^/]+)\/sua$/, m => `/account/listings/${m[1]}/edit`],
];

function toEnglishPath(pathname: string, prefix: string): string {
  const p = pathname.replace(/\/+$/, '') || '/';
  if (prefix === '/vi') {
    if (p === '/vi') return '/';
    const row = VI_PAGES.find(([, vi]) => vi === p);
    if (row) return row[0];
    for (const [, , viRe, toEn] of VI_PATTERNS) { const m = p.match(viRe); if (m) return toEn(m); }
    return '/';                                  // a Vietnamese-only page with no English twin
  }
  if (prefix) return p.slice(prefix.length) || '/';  // /ko, /ru: English words under the prefix
  return p;
}

function toVietnamesePath(en: string): string | null {
  const row = VI_PAGES.find(([e]) => e === en);
  if (row) return row[1];
  for (const [enRe, toVi] of VI_PATTERNS) { const m = en.match(enRe); if (m) return toVi(m); }
  return null;
}
