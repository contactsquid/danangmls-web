import { NextResponse } from 'next/server';
import { searchListings, getListingBySlug, paramsFrom } from '@/lib/agentApi';

export const dynamic = 'force-dynamic';
const CORS = { 'Access-Control-Allow-Origin': '*' };
const CACHE = { ...CORS, 'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=3600' };

// GET /api/v1/listings?mode=rent|sale&district=Hai Chau&property_type=Apartment&bedrooms=2
//     &min_price_usd=&max_price_usd=&q=&limit=10&offset=0     |   ?id=<slug> for one listing in full.
export async function GET(request: Request) {
  const sp = new URL(request.url).searchParams;
  try {
    const id = sp.get('id');
    if (id) {
      const one = await getListingBySlug(id);
      return one ? NextResponse.json(one, { headers: CACHE }) : NextResponse.json({ error: 'not found' }, { status: 404, headers: CORS });
    }
    return NextResponse.json(await searchListings(paramsFrom(k => sp.get(k))), { headers: CACHE });
  } catch {
    return NextResponse.json({ error: 'temporarily unavailable' }, { status: 503, headers: { ...CORS, 'Cache-Control': 'no-store' } });
  }
}
export function OPTIONS() { return new Response(null, { status: 204, headers: { ...CORS, 'Access-Control-Allow-Methods': 'GET, OPTIONS' } }); }
