import NAMES from './cityJumpNames.json';
import { facetBase } from './facets';
import type { Lang } from './translations';

// City field on the search grids (Blake, 2026-10-02). It defaults to this site's city.
// Picking another city leaves for that city's rent/sale page, in the same language:
// Saigon / Hanoi / Da Nang go to their own sites, every other city goes to LotusMLS
// (the master site with every city). LotusMLS never links back here.
export const SITE_CITY = 'danang';
const CITY_SITES: Record<string, string> = {
  danang: 'https://danangmls.com',
  saigon: 'https://saigonmls.com',
  hanoi: 'https://hanoimls.com',
};
const LOTUS = 'https://lotusmls.com';
const LOTUS_SLUG: Record<string, string> = { saigon: 'ho-chi-minh-city', danang: 'da-nang' };

type Names = Record<string, { en: string; vi: string; ko: string; ru: string }>;
const CITY_NAMES = NAMES as Names;

// The 12 cities with the most listings on LotusMLS, separately for rentals and for sale (Blake, 2026-10-09).
// Counted from Supabase on that date, most listings first. Refresh them when the ranking drifts.
const TOP_CITIES: Record<'rent' | 'sale', string[]> = {
  rent: ['danang', 'saigon', 'can-tho', 'nha-trang', 'hanoi', 'da-lat', 'my-tho', 'buon-ma-thuot', 'phan-thiet', 'hai-phong', 'vung-tau', 'hue'],
  sale: ['danang', 'hanoi', 'saigon', 'vung-tau', 'hai-duong', 'hue', 'nam-dinh', 'vinh-long', 'quy-nhon', 'da-lat', 'vinh', 'buon-ma-thuot'],
};

/** The 12 busiest cities for this mode. This site's own city is always kept in the list. */
export function jumpCities(lang: Lang, mode: 'rent' | 'sale'): { slug: string; label: string }[] {
  const label = (s: string) => CITY_NAMES[s][lang as 'en'] ?? CITY_NAMES[s].en;
  const slugs = TOP_CITIES[mode].includes(SITE_CITY) ? TOP_CITIES[mode] : [SITE_CITY, ...TOP_CITIES[mode].slice(0, 11)];
  return slugs.map(slug => ({ slug, label: label(slug) }));
}

export function cityJumpUrl(city: string, mode: 'rent' | 'sale', lang: Lang): string {
  const base = facetBase(mode, lang);
  return CITY_SITES[city] ? CITY_SITES[city] + base : `${LOTUS}${base}/${LOTUS_SLUG[city] ?? city}`;
}
