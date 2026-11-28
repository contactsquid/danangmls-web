import { NextResponse } from 'next/server';
import { findAgents } from '@/lib/agentApi';

export const dynamic = 'force-dynamic';
const CORS = { 'Access-Control-Allow-Origin': '*' };

export async function GET(request: Request) {
  const limit = Number(new URL(request.url).searchParams.get('limit') ?? 20) || 20;
  try {
    return NextResponse.json({ city: 'Da Nang, Vietnam', agents: await findAgents(limit) },
      { headers: { ...CORS, 'Cache-Control': 'public, s-maxage=900, stale-while-revalidate=3600' } });
  } catch {
    return NextResponse.json({ error: 'temporarily unavailable' }, { status: 503, headers: { ...CORS, 'Cache-Control': 'no-store' } });
  }
}
export function OPTIONS() { return new Response(null, { status: 204, headers: { ...CORS, 'Access-Control-Allow-Methods': 'GET, OPTIONS' } }); }
