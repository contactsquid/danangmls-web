import { getListings, getForSaleListings } from '@/lib/sheets';
import type { Listing } from '@/lib/types';

const BASE = 'https://danangmls.com';

// Image-sitemap entries (<image:image>). Next renders item.images as raw,
// UN-escaped <image:loc>, so we only emit permanent, absolute, XML-safe URLs:
// the rehosted images.danang.homes (R2) photos. Transient fbcdn / /api/img
// proxy URLs are excluded (they contain '&', may 404, and aren't canonical).
function permanentImages(l: Listing): string[] {
  return (l.images || [])
    .filter((u): u is string =>
      typeof u === 'string' &&
      u.startsWith('https://images.danang.homes/') &&
      !/[<>&"']/.test(u))
    .slice(0, 20);
}

export default async function sitemap() {
  const [rentals, forSale] = await Promise.all([getListings(), getForSaleListings()]);
  const now = new Date();

  return [
    // English
    { url: BASE,                lastModified: now, changeFrequency: 'daily'  as const, priority: 1.0 },
    { url: `${BASE}/for-rent`,  lastModified: now, changeFrequency: 'hourly' as const, priority: 0.9 },
    { url: `${BASE}/for-sale`,  lastModified: now, changeFrequency: 'hourly' as const, priority: 0.9 },
    // Vietnamese
    { url: `${BASE}/vi`,         lastModified: now, changeFrequency: 'daily'  as const, priority: 1.0 },
    { url: `${BASE}/vi/thue`,    lastModified: now, changeFrequency: 'hourly' as const, priority: 0.9 },
    { url: `${BASE}/vi/mua-ban`, lastModified: now, changeFrequency: 'hourly' as const, priority: 0.9 },
    // Trust / info pages
    { url: `${BASE}/about`,          lastModified: now, changeFrequency: 'yearly'  as const, priority: 0.3 },
    { url: `${BASE}/contact`,        lastModified: now, changeFrequency: 'yearly'  as const, priority: 0.3 },
    { url: `${BASE}/privacy-policy`, lastModified: now, changeFrequency: 'yearly'  as const, priority: 0.2 },
    { url: `${BASE}/terms`,          lastModified: now, changeFrequency: 'yearly'  as const, priority: 0.2 },
    { url: `${BASE}/vi/gioi-thieu`,         lastModified: now, changeFrequency: 'yearly' as const, priority: 0.3 },
    { url: `${BASE}/vi/lien-he`,            lastModified: now, changeFrequency: 'yearly' as const, priority: 0.3 },
    { url: `${BASE}/vi/chinh-sach-bao-mat`, lastModified: now, changeFrequency: 'yearly' as const, priority: 0.2 },
    { url: `${BASE}/vi/dieu-khoan`,         lastModified: now, changeFrequency: 'yearly' as const, priority: 0.2 },
    // English listings
    ...rentals.map(l => ({
      url: `${BASE}/listing/${l.slug}`,
      lastModified: now, changeFrequency: 'weekly' as const, priority: 0.7,
      images: permanentImages(l),
    })),
    ...forSale.map(l => ({
      url: `${BASE}/listing/${l.slug}`,
      lastModified: now, changeFrequency: 'weekly' as const, priority: 0.7,
      images: permanentImages(l),
    })),
    // Vietnamese listings
    ...rentals.map(l => ({
      url: `${BASE}/vi/listing/${l.slug}`,
      lastModified: now, changeFrequency: 'weekly' as const, priority: 0.7,
      images: permanentImages(l),
    })),
    ...forSale.map(l => ({
      url: `${BASE}/vi/listing/${l.slug}`,
      lastModified: now, changeFrequency: 'weekly' as const, priority: 0.7,
      images: permanentImages(l),
    })),
  ];
}
