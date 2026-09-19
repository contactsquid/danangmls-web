import { NextResponse, type NextRequest } from 'next/server';
import { runDrip } from '@/lib/agentDrip/run';

// Sheet reads parse a large CSV; give the daily run room.
export const maxDuration = 60;
export const dynamic = 'force-dynamic';

/** Daily cron (vercel.json). Vercel sends `Authorization: Bearer $CRON_SECRET`;
 *  anything else is refused. `?dry=1` reports what would be sent, sends nothing. */
export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get('authorization') !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const dryRun = new URL(request.url).searchParams.get('dry') === '1';
  try {
    const result = await runDrip({ dryRun });
    return NextResponse.json({ dryRun, ...result });
  } catch (err) {
    console.error('[agent-drip] run failed:', err);
    return NextResponse.json({ error: 'run failed' }, { status: 500 });
  }
}
