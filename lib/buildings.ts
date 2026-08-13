import type { Listing } from './types';
import { firstServableImage } from './pageImages';
import { facetBase, type Mode } from './facets';

export interface BuildingCard { name: string; image: string; count: number; href: string }

interface BuildingDef { name: string; pattern: RegExp; search: string }

// Well-known Da Nang apartment buildings/complexes. Superset of the
// foreign-eligible list plus popular buildings from the wider market (several
// sourced from competitor listings, 2026-08). `search` is a plain substring the
// grid can match (it uses includes(), not the regex). The section is dynamic —
// only buildings that actually have listings in the current view are shown.
const POPULAR_BUILDINGS: BuildingDef[] = [
  { name: 'Hiyori Garden Tower',        pattern: /hiyori/i,                          search: 'Hiyori' },
  { name: 'Panoma',                     pattern: /panoma/i,                          search: 'Panoma' },
  { name: 'Monarchy',                   pattern: /monarchy/i,                        search: 'Monarchy' },
  { name: 'FPT Plaza / F.Home',         pattern: /(f\.?home|fpt\s*plaza)/i,          search: 'FPT' },
  { name: 'Wyndham Soleil',             pattern: /(wyndham|soleil)/i,                search: 'Soleil' },
  { name: 'Times Square FUTA Residence',pattern: /times\s*square|futa\s*residence/i, search: 'Times Square FUTA' },
  { name: 'Muong Thanh',                pattern: /m[ưu][ờo]ng\s+thanh/i,             search: 'Muong Thanh' },
  { name: 'One River',                  pattern: /one\s+river/i,                      search: 'One River' },
  { name: 'Risemount',                  pattern: /risemount/i,                        search: 'Risemount' },
  { name: 'Alphanam Luxury',            pattern: /alphanam/i,                         search: 'Alphanam' },
  { name: 'Sun Cosmo',                  pattern: /sun\s*cosmo/i,                      search: 'Sun Cosmo' },
  { name: 'Cora Tower',                 pattern: /cora\s+tower/i,                     search: 'Cora' },
  { name: 'Blooming Tower',             pattern: /blooming/i,                         search: 'Blooming' },
  { name: 'The Filmore',                pattern: /filmore/i,                          search: 'Filmore' },
  { name: 'Sam Towers',                 pattern: /sam\s+tower/i,                      search: 'Sam Tower' },
  { name: 'Hyatt Regency',             pattern: /hyatt/i,                            search: 'Hyatt' },
  { name: 'Azura',                      pattern: /\bazura\b/i,                        search: 'Azura' },
  { name: 'Indochina Riverside',        pattern: /indochina/i,                        search: 'Indochina' },
  { name: 'The Song',                   pattern: /the\s+song\b/i,                     search: 'The Song' },
  { name: 'Ariyana',                    pattern: /ariyana/i,                          search: 'Ariyana' },
  { name: 'Newtown Diamond',            pattern: /new\s*town\s*diamond/i,             search: 'Newtown Diamond' },
];

// Popular apartment buildings that currently have listings in this mode — each
// with a real thumbnail and a link that pre-fills the grid search. Max 8,
// busiest first. Empty when no known building has a listing here.
export function popularBuildings(listings: Listing[], mode: Mode, lang: 'en' | 'vi'): BuildingCard[] {
  const base = facetBase(mode, lang); // /for-rent, /for-sale, /vi/thue, /vi/mua-ban
  const cards: BuildingCard[] = [];
  for (const b of POPULAR_BUILDINGS) {
    const matches = listings.filter(l => b.pattern.test(`${l.title} ${l.text}`));
    if (!matches.length) continue;
    const imgListing = matches.find(l => firstServableImage(l));
    if (!imgListing) continue;
    cards.push({
      name: b.name,
      image: firstServableImage(imgListing)!,
      count: matches.length,
      href: `${base}?q=${encodeURIComponent(b.search)}#listings`,
    });
  }
  return cards.sort((a, b) => b.count - a.count).slice(0, 8);
}
