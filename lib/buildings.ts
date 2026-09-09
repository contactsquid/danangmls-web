import { type Lang, viOrEn } from './translations';
import type { Listing } from './types';
import { firstServableImage } from './pageImages';
import { facetUrl, type Mode } from './facets';
import { POPULAR_BUILDINGS, buildingMatches } from './buildingDefs';

export interface BuildingCard { name: string; image: string; count: number; href: string }

// Popular apartment buildings that currently have listings in this mode — each
// with a real thumbnail, linking to that building's own facet page. Max 8,
// busiest first. Empty when no known building has a listing here.
export function popularBuildings(listings: Listing[], mode: Mode, langIn: Lang): BuildingCard[] {
  const lang = viOrEn(langIn);
  const cards: BuildingCard[] = [];
  for (const b of POPULAR_BUILDINGS) {
    const matches = listings.filter(l => buildingMatches(b, l));
    if (!matches.length) continue;
    const imgListing = matches.find(l => firstServableImage(l));
    if (!imgListing) continue;
    cards.push({
      name: b.name,
      image: firstServableImage(imgListing)!,
      count: matches.length,
      href: facetUrl(mode, lang, { kind: 'building', value: b.name }),
    });
  }
  return cards.sort((a, b) => b.count - a.count).slice(0, 8);
}
