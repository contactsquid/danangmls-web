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

/** RealEstateAgent for an /agent/<slug> profile page.
 *  worksFor is omitted for independent agents rather than emitting an
 *  Organization literally named "Independent". */
export function agentProfileLd(agent: {
  slug: string;
  display_name: string;
  bio: string;
  photo_url: string | null;
  workplace: string;
}, listingCount: number) {
  const independent = !agent.workplace || agent.workplace.toLowerCase() === 'independent';
  return {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    name: agent.display_name,
    url: `${BASE}/agent/${agent.slug}`,
    ...(agent.photo_url ? { image: agent.photo_url } : {}),
    ...(agent.bio ? { description: agent.bio } : {}),
    ...(independent ? {} : { worksFor: { '@type': 'Organization', name: agent.workplace } }),
    areaServed: [
      { '@type': 'City', name: 'Da Nang' },
      { '@type': 'City', name: 'Hoi An' },
    ],
    parentOrganization: { '@type': 'Organization', name: 'DanangMLS', url: BASE },
    ...(listingCount > 0
      ? { makesOffer: { '@type': 'Offer', itemOffered: { '@type': 'Residence' }, eligibleRegion: 'Da Nang, Vietnam' } }
      : {}),
  };
}

/** ItemList for the /agents directory. */
export function agentsItemListLd(agents: { slug: string; display_name: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Real Estate Agents in Da Nang, Vietnam',
    numberOfItems: agents.length,
    itemListElement: agents.slice(0, 50).map((a, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${BASE}/agent/${a.slug}`,
      name: a.display_name,
    })),
  };
}

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
