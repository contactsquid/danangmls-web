// Centralized JSON-LD for danangmls.com.
// Listing detail pages already emit RealEstateListing + BreadcrumbList inline;
// this module covers the site-level entities (Organization, WebSite) and the
// collection (ItemList) on the for-rent / for-sale grid pages.
import type { Listing } from './types';

const BASE = 'https://danangmls.com';

export const ORG_LD = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'DanangMLS',
  url: BASE,
  logo: `${BASE}/icon.svg`,
  description:
    'Multiple Listing Service for houses, apartments, and villas for rent and for sale in Da Nang and Hoi An, Vietnam. Aggregated from local agents and refreshed daily.',
  areaServed: [
    { '@type': 'City', name: 'Da Nang' },
    { '@type': 'City', name: 'Hoi An' },
  ],
};

export const SITE_LD = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'DanangMLS',
  url: BASE,
  inLanguage: ['en', 'vi'],
};

/** ItemList for a listings grid page (for-rent / for-sale, EN or VI). */
export function listingsItemListLd(
  listings: Listing[],
  opts: { forSale: boolean; vi: boolean },
) {
  const prefix = opts.vi ? `${BASE}/vi/listing/` : `${BASE}/listing/`;
  const name = opts.forSale
    ? (opts.vi ? 'Nhà đất bán tại Đà Nẵng' : 'Houses & Apartments for Sale in Da Nang')
    : (opts.vi ? 'Nhà cho thuê tại Đà Nẵng' : 'Houses & Apartments for Rent in Da Nang');
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    numberOfItems: listings.length,
    // Cap the embedded sample so the page payload stays small.
    itemListElement: listings.slice(0, 30).map((l, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: prefix + l.slug,
      name: opts.vi ? (l.vi_title || l.title) : l.title,
    })),
  };
}
