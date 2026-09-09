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

    // Anything else (about, contact, account…) has no translated twin in ko/ru,
    // so send the visitor to that language's home rather than a 404.
    return home;
  }
  return home;
}
