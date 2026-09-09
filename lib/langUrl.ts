import type { Lang } from './translations';
import { resolveFacet, facetUrl } from './facets';

// Maps the current path to its equivalent in another language. Lifted out of
// SiteHeader so the language picker beside the search box uses exactly the same
// mapping — two copies of this would drift and strand people on the wrong page.
export function getLangUrl(pathname: string, targetLang: Lang): string {
  if (targetLang === 'vi') {
    if (pathname === '/') return '/vi';
    if (pathname === '/for-rent') return '/vi/thue';
    if (pathname === '/for-sale') return '/vi/mua-ban';
    if (pathname.startsWith('/for-rent/')) { const f = resolveFacet(pathname.slice('/for-rent/'.length)); return f ? facetUrl('rent', 'vi', f) : '/vi/thue'; }
    if (pathname.startsWith('/for-sale/')) { const f = resolveFacet(pathname.slice('/for-sale/'.length)); return f ? facetUrl('sale', 'vi', f) : '/vi/mua-ban'; }
    if (pathname.startsWith('/listing/')) return '/vi' + pathname;
    return '/vi';
  } else {
    if (pathname === '/vi') return '/';
    if (pathname === '/vi/thue') return '/for-rent';
    if (pathname === '/vi/mua-ban') return '/for-sale';
    if (pathname.startsWith('/vi/thue/')) { const f = resolveFacet(pathname.slice('/vi/thue/'.length)); return f ? facetUrl('rent', 'en', f) : '/for-rent'; }
    if (pathname.startsWith('/vi/mua-ban/')) { const f = resolveFacet(pathname.slice('/vi/mua-ban/'.length)); return f ? facetUrl('sale', 'en', f) : '/for-sale'; }
    if (pathname.startsWith('/vi/listing/')) return pathname.replace('/vi', '');
    return '/';
  }
}
