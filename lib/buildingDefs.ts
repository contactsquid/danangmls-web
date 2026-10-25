import type { Listing } from './types';

/** Well-known Da Nang buildings. Shared by lib/facets.ts (which turns them into
 *  /for-rent/<slug> pages) and lib/buildings.ts (the "Popular Apartment Building"
 *  cards). Kept in its own module so those two can both import it without a cycle. */
export interface BuildingDef {
  name: string; pattern: RegExp; search: string;
  /** Photo of the building itself, for the facet page and its share card.
   *  Colour-graded, not AI-restyled — generative editing can silently alter a
   *  facade on a property we advertise. Optional: most buildings have none yet
   *  and fall back to a listing photo / the site default. */
  image?: string;
  /** 1200x630 crop of the same photo for og:image. */
  ogImage?: string;
}

/** URL slug for a building page: "Sam Towers" -> "sam-towers". */
export function buildingSlug(name: string): string {
  return name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

/** A building needs real inventory before it earns its own indexable page. Thin
 *  pages get classified as soft 404s — that is exactly what happened to
 *  danang.homes/districts/hoi-an with a single listing. */
export const BUILDING_PAGE_MIN_LISTINGS = 3;

export function buildingMatches(b: BuildingDef, l: Listing): boolean {
  return b.pattern.test(`${l.title} ${l.text}`);
}

export const POPULAR_BUILDINGS: BuildingDef[] = [
  { name: 'Hiyori Garden Tower',        pattern: /hiyori/i,                          search: 'Hiyori' },
  { name: 'Panoma',                     pattern: /panoma/i,                          search: 'Panoma' },
  { name: 'Monarchy',                   pattern: /monarchy/i,                        search: 'Monarchy' },
  { name: 'FPT Plaza / F.Home',         pattern: /(f\.?home|fpt\s*plaza)/i,          search: 'FPT' },
  // Not just "wyndham": Wyndham Golden Bay is a different building (below).
  { name: 'Wyndham Soleil',             pattern: /soleil|wyndham(?!\s*(?:da\s*nang\s*|danang\s*)?golden)/i, search: 'Soleil' },
  { name: 'Times Square FUTA Residence',pattern: /times\s*square|futa\s*residence/i, search: 'Times Square FUTA' },
  { name: 'Muong Thanh',                pattern: /m[ưu][ờo]ng\s+thanh/i,             search: 'Muong Thanh' },
  { name: 'One River',                  pattern: /one\s+river/i,                      search: 'One River' },
  { name: 'Alphanam Luxury',            pattern: /alphanam/i,                         search: 'Alphanam' },
  { name: 'Sun Cosmo',                  pattern: /sun\s*cosmo/i,                      search: 'Sun Cosmo' },
  { name: 'Cora Tower',                 pattern: /cora\s+tower/i,                     search: 'Cora' },
  { name: 'Blooming Tower',             pattern: /blooming/i,                         search: 'Blooming' },
  { name: 'The Filmore',                pattern: /filmore/i,                          search: 'Filmore' },
  // Risemount is SAM Towers' earlier name (same developer PAVNC, Như Nguyệt lot A2); merged 2026-10-25.
  { name: 'Sam Towers',                 pattern: /sam\s+tower|risemount/i,                      search: 'Sam Tower',
    image:   'https://images.danang.homes/buildings/sam-towers.jpg',
    ogImage: 'https://images.danang.homes/buildings/sam-towers-og.jpg' },
  { name: 'Hyatt Regency',             pattern: /hyatt/i,                            search: 'Hyatt' },
  { name: 'Azura',                      pattern: /\bazura\b/i,                        search: 'Azura' },
  { name: 'Indochina Riverside',        pattern: /indochina/i,                        search: 'Indochina' },
  { name: 'The Song',                   pattern: /the\s+song\b/i,                     search: 'The Song' },
  { name: 'Ariyana',                    pattern: /ariyana/i,                          search: 'Ariyana' },
  { name: 'Newtown Diamond',            pattern: /new\s*town\s*diamond/i,             search: 'Newtown Diamond' },
  // Added 2026-10-22 from Blake's addresses (pins in lib/geo/placement.ts MAP_LANDMARKS).
  { name: 'Vista Residence',            pattern: /\bvista\s+(?:residences?|apartments?|building|tower)\b/i, search: 'Vista' },
  { name: 'Wyndham Golden Bay',         pattern: /golden\s*bay/i,                    search: 'Golden Bay' },
  { name: 'The Ori Garden',             pattern: /\bori\s+garden\b/i,               search: 'Ori Garden' },
];
