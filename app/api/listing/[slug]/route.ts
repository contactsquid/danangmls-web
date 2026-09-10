import { getListings, getForSaleListings } from '@/lib/sheets';

// Full parsed Listing for one slug. Exists so the archiver can capture a listing
// in EXACTLY the shape the site renders, instead of re-implementing the sheet
// row -> Listing mapping in a separate script where it would silently drift.
// maintain-sheet.js calls this for each expiring row, then writes the response
// to R2 as archive/<slug>.json before deleting the row.
export const dynamic = 'force-dynamic';

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [rentals, forSale] = await Promise.allSettled([getListings(), getForSaleListings()]);
  const all = [
    ...(rentals.status === 'fulfilled' ? rentals.value : []),
    ...(forSale.status === 'fulfilled' ? forSale.value : []),
  ];
  const listing = all.find(l => l.slug === slug);
  if (!listing) {
    return Response.json({ error: 'not found' }, { status: 404, headers: { 'cache-control': 'no-store' } });
  }
  return Response.json(listing, { headers: { 'cache-control': 'no-store' } });
}
