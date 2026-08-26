import { NextResponse } from 'next/server';
import { getListings, getForSaleListings } from '@/lib/sheets';

/** Resolve a short listing id (the trailing token of a pinned slug) to its canonical URL.
 *  Shared by /l/<id> and its /1/<id> alias — in most sans-serif fonts a lowercase "l"
 *  and a "1" are indistinguishable, and people retype these by hand off a phone screen. */
export async function resolveShortLink(rawId: string, requestUrl: string) {
  const key = (rawId || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  // Redirect within whatever host served this request. The site answers on www but
  // declares an apex canonical, so hardcoding either one adds a needless extra hop.
  const origin = new URL(requestUrl).origin;
  if (!key) return NextResponse.redirect(origin, 302);

  const [rentals, forSale] = await Promise.allSettled([getListings(), getForSaleListings()]);
  const all = [
    ...(rentals.status === 'fulfilled' ? rentals.value : []),
    ...(forSale.status === 'fulfilled' ? forSale.value : []),
  ];

  const hit = all.find(l => {
    const s = (l.slug || '').toLowerCase();
    return s.slice(s.lastIndexOf('-') + 1) === key;
  });

  // Unknown id lands on the homepage rather than a 404 — a dead link inside a
  // WhatsApp post is worse than a soft landing.
  return hit
    ? NextResponse.redirect(`${origin}/listing/${hit.slug}`, 301)
    : NextResponse.redirect(origin, 302);
}
