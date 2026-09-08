import { NextResponse } from 'next/server';
import { getListings, getForSaleListings } from '@/lib/sheets';
import { toGridListings } from '@/lib/gridListing';

// The grids need every listing so the client-side filters can search the whole
// set instantly — but shipping all of them inside the page meant a visitor
// waited on ~4,200 (rent) or ~8,000 (sale) listings before seeing the 48 that
// actually render. The page now sends only that first batch and the grid pulls
// the rest from here once it has painted.
//
// The important difference from the page render: this response is CDN-cacheable.
// The pages are force-dynamic, so every visitor pays a full server render; this
// is shared across all of them and served from the edge.
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const mode = new URL(request.url).searchParams.get('mode') === 'sale' ? 'sale' : 'rent';
  try {
    const listings = mode === 'sale' ? await getForSaleListings() : await getListings();
    return NextResponse.json(toGridListings(listings), {
      headers: {
        // Matches the 10-minute parsed-sheet cache the server already keeps, and
        // keeps serving the old copy for a day while a new one is fetched.
        'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=86400',
      },
    });
  } catch {
    // The grid keeps working on its initial batch if this fails.
    return NextResponse.json([], { status: 503, headers: { 'Cache-Control': 'no-store' } });
  }
}
