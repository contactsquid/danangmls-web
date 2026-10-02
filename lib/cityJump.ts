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

/** The 25 cities, the three city sites first, then the rest A–Z in the page language. */
export function jumpCities(lang: Lang): { slug: string; label: string }[] {
  const label = (s: string) => CITY_NAMES[s][lang as 'en'] ?? CITY_NAMES[s].en;
  const top = ['saigon', 'hanoi', 'danang'];
  const rest = Object.keys(CITY_NAMES).filter(s => !top.includes(s)).sort((a, b) => label(a).localeCompare(label(b), lang));
  return [...top, ...rest].map(slug => ({ slug, label: label(slug) }));
}

export function cityJumpUrl(city: string, mode: 'rent' | 'sale', lang: Lang): string {
  const base = facetBase(mode, lang);
  return CITY_SITES[city] ? CITY_SITES[city] + base : `${LOTUS}${base}/${LOTUS_SLUG[city] ?? city}`;
}
