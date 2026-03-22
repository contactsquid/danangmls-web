import { getListings, getForSaleListings } from '@/lib/sheets';

const BASE = 'https://danangmls.com';

export default async function sitemap() {
  const [rentals, forSale] = await Promise.all([getListings(), getForSaleListings()]);
  const now = new Date();

  return [
    { url: BASE,               lastModified: now, changeFrequency: 'hourly' as const, priority: 1.0 },
    { url: `${BASE}/for-sale`, lastModified: now, changeFrequency: 'hourly' as const, priority: 0.9 },
    ...rentals.map(l => ({
      url: `${BASE}/listing/${l.slug}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
    ...forSale.map(l => ({
      url: `${BASE}/listing/${l.slug}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
  ];
}
