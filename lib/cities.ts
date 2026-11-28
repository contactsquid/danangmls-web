// The cities LotusMLS knows about (2026-10-01).
//  - cityNames.json: the 25 scraped cities, with names in all four site languages
//    (from ~/projects/lotusmls-geo/cities/*/meta.json and the three city sites).
//  - vietnamPlaces.json: every city and town in Vietnam (GADM level 2, 630 entries),
//    for agents posting directly — "any city in Vietnam, not just the top 25" (Blake).
// A listing's `city` is one of these slugs.
import NAMES from './cityNames.json';
import PLACES from './vietnamPlaces.json';
import type { Lang } from './translations';

type Names = { en: string; vi: string; ko: string; ru: string; label?: Record<string, string>; center?: [number, number] };
export interface Place { slug: string; en: string; vi: string; province: string; provinceVi: string; type: string; scraped: boolean; aliases?: string[] }

const NAMED = NAMES as unknown as Record<string, Names>;
export const PLACES_LIST = PLACES as Place[];
const BY_SLUG = new Map(PLACES_LIST.map(p => [p.slug, p]));

/** The 25 cities we scrape, in the order Blake listed them (largest first). */
export const SCRAPED_CITIES = ['saigon', 'hanoi', 'can-tho', 'danang', 'hai-phong', 'long-xuyen', 'my-tho', 'nha-trang', 'vung-tau',
  'tay-ninh', 'hue', 'vinh', 'nam-dinh', 'hai-duong', 'quang-ngai', 'buon-ma-thuot', 'quy-nhon', 'vinh-long', 'thai-nguyen',
  'rach-gia', 'thanh-hoa', 'long-thanh', 'phan-thiet', 'phan-rang-thap-cham', 'da-lat'];

/** A city's display name in the page language ("Long Thành (Đồng Nai)" where it needs its province). */
export function cityName(slug: string | undefined, lang: Lang | string = 'en'): string {
  if (!slug) return '';
  const n = NAMED[slug];
  if (n) {
    const l = (lang === 'vi' || lang === 'ko' || lang === 'ru') ? lang : 'en';
    return n.label?.[l] ?? n[l];
  }
  const p = BY_SLUG.get(slug);
  if (p) return lang === 'vi' ? p.vi : p.en;
  return slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

export function isKnownCity(slug: string): boolean { return Boolean(NAMED[slug] || BY_SLUG.get(slug)); }

/** Accent-insensitive key for matching what someone types ("da" matches Đà Nẵng and Đà Lạt). */
export function foldName(s: string): string {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase().trim();
}

/** A district worth showing: not blank, not the scrapers' "Not Provided", not an
 *  "Outside <city>" catch-all (Blake, 2026-10-01: show "Da Nang", not "Not Provided, Da Nang"). */
export function shownDistrict(d: string | undefined): string {
  const v = (d ?? '').trim();
  return !v || /^not provided$/i.test(v) || /^outside\b/i.test(v) ? '' : v;
}
