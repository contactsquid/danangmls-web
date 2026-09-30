import { NextResponse, type NextRequest } from 'next/server';
import { syncListings } from '@/lib/listingSync';

// Sheet → Supabase listings sync (lib/listingSync.ts), every 10 minutes (vercel.json).
// Parses the full sheet like a page render does, then writes only changed rows.
export const maxDuration = 300;
export const dynamic = 'force-dynamic';

/** Vercel Cron sends `Authorization: Bearer $CRON_SECRET`; anything else is refused.
 *  `?dry=1` reports what would change and writes nothing. */
export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get('authorization') !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  const dryRun = new URL(request.url).searchParams.get('dry') === '1';
  try {
    const report = await syncListings({ dryRun });
    if (report.aborted) console.error('[sync-listings] refused:', report.aborted);
    return NextResponse.json(report);
  } catch (err) {
    console.error('[sync-listings] failed:', err);
    return NextResponse.json({ error: String((err as Error).message || err) }, { status: 500 });
  }
}
