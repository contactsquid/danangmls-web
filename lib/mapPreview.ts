import type { Metadata } from 'next';
import MANIFEST from './mapOgManifest.json';
import { buildingSlug } from './buildingDefs';

// Link previews for map-view URLs (Blake, 2026-09-26): a shared
// danangmls.com/for-rent?view=map shows a picture of the map instead of the logo
// card. The pictures are screenshots of the live map, labelled, captured by
// scripts/capture-map-og.ts into public/og/map/ (which also writes the manifest).
// Canonical URLs are untouched — only og:image / twitter:image change.

/** Adds the map picture to a page's metadata when the URL carries ?view=map. */
export function withMapPreview(
  meta: Metadata,
  view: unknown,
  lang: string,
  mode: 'rent' | 'sale',
  district?: string,
  files: string[] = (MANIFEST as { files: string[] }).files,
): Metadata {
  if (view !== 'map') return meta;
  const label = lang === 'vi' ? 'vi' : 'en';   // ko/ru read the English label
  const candidates = [
    ...(district ? [`${label}-${mode}-${buildingSlug(district)}`] : []),
    `${label}-${mode}`,
  ];
  const name = candidates.find(c => files.includes(c));
  if (!name) return meta;
  const image = {
    url: `/og/map/${name}.jpg`,
    width: 1200,
    height: 630,
    alt: lang === 'vi' ? 'Bản đồ bất động sản trên DanangMLS' : 'Map of listings on DanangMLS',
  };
  // Both blocks: twitter:image is NOT inherited from openGraph (see lib/ogImage.ts).
  return {
    ...meta,
    openGraph: { ...(meta.openGraph ?? {}), images: [image] },
    twitter: { ...(meta.twitter ?? {}), card: 'summary_large_image', images: [image] },
  };
}
