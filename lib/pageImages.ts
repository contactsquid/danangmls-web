import type { Listing } from './types';

// Canonical districts used in the bottom "explore by district" photo grid.
export const SEO_DISTRICTS = ['Hai Chau', 'Thanh Khe', 'Son Tra', 'Ngu Hanh Son', 'Lien Chieu', 'Cam Le', 'Hoi An', 'Hoa Vang'];

// Hand-curated hero photo per district (permanent R2 keys). Preferred over the
// dynamic "first listing photo" so the grid always shows an attractive shot.
export const DISTRICT_HERO: Record<string, string> = {
  'Hai Chau':     'https://images.danang.homes/curated/district-hai-chau.jpg',
  'Thanh Khe':    'https://images.danang.homes/curated/district-thanh-khe.jpg',
  'Son Tra':      'https://images.danang.homes/curated/district-son-tra.jpg',
  'Ngu Hanh Son': 'https://images.danang.homes/curated/district-ngu-hanh-son.jpg',
  'Lien Chieu':   'https://images.danang.homes/curated/district-lien-chieu.jpg',
  'Cam Le':       'https://images.danang.homes/curated/district-cam-le.jpg',
  'Hoi An':       'https://images.danang.homes/curated/district-hoi-an.jpg',
  'Hoa Vang':     'https://images.danang.homes/curated/district-hoa-vang.jpg',
};

// Only permanent, rehosted R2 photos (fbcdn/proxy URLs are transient / login-walled).
function servable(u?: string): u is string {
  return !!u && u.startsWith('https://images.danang.homes/') && /\.(jpe?g|png|webp)$/i.test(u);
}

export function firstServableImage(l: Listing): string | undefined {
  return (l.images || []).find(servable);
}

/** One representative photo per district (from a real listing there). */
export function districtImageMap(listings: Listing[]): Record<string, string> {
  const map: Record<string, string> = {};
  for (const d of SEO_DISTRICTS) {
    const dl = d.toLowerCase();
    const l = listings.find(x => (x.district || '').toLowerCase().includes(dl) && firstServableImage(x));
    if (l) map[d] = firstServableImage(l)!;
  }
  return map;
}

/** First usable photo across the set (for the FAQ side image). */
export function firstAnyImage(listings: Listing[]): string | undefined {
  for (const l of listings) {
    const img = firstServableImage(l);
    if (img) return img;
  }
  return undefined;
}
