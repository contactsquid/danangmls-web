// JSON-LD helpers for RealEstateListing pages (identical in all four MLS sites).
// Replaces the invalid top-level `price` string with a proper Offer (numeric price +
// currency, per-month spec for rentals) and emits every usable photo, not just the first.
import type { Listing } from './types';

/** "$266,000" / "$1,406/month" / "$500-$550/month" -> first USD number, or null. */
function priceUSD(price: string): number | null {
  const m = (price || '').match(/\$\s*([0-9][0-9,]*)/);
  if (!m) return null;
  const n = parseInt(m[1].replace(/,/g, ''), 10);
  return Number.isFinite(n) && n > 0 ? n : null;
}

export function listingOfferLd(listing: Listing, url: string) {
  const price = priceUSD(listing.price);
  const posted = listing.date && !Number.isNaN(Date.parse(listing.date)) ? new Date(listing.date).toISOString() : undefined;
  return {
    ...(posted && { datePosted: posted }),
    ...(price && {
      offers: {
        '@type': 'Offer',
        price,
        priceCurrency: 'USD',
        url,
        availability: 'https://schema.org/InStock',
        ...(!listing.forSale && {
          priceSpecification: { '@type': 'UnitPriceSpecification', price, priceCurrency: 'USD', unitText: 'MONTH' },
        }),
      },
    }),
  };
}

export function listingImagesLd(listing: Listing) {
  const imgs = (listing.images || []).filter(Boolean);
  const stable = imgs.filter(u => !u.includes('fbcdn.net') && !u.includes('facebook.com'));
  const out = (stable.length ? stable : imgs).slice(0, 10);
  return out.length ? { image: out } : {};
}
