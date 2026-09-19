import { NextResponse, type NextRequest } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

/**
 * Counts listing views and contact-button clicks.
 *
 * Why the browser reports this instead of the server: listing pages are ISR with
 * `revalidate = 300`, so a cache hit never executes the server component. Counting
 * in the page would record roughly one view per listing per five minutes no matter
 * how many people actually read it. A beacon fires on every real page load.
 *
 * It also filters bots almost for free — crawlers do not run the script — which
 * matters on a site with ~12,000 listing pages where unfiltered counts would rank
 * whoever Googlebot visited most rather than whoever people actually read.
 *
 * Writes go through the bump_listing_stat RPC, which is a single atomic upsert:
 * a read-modify-write from here would drop counts whenever two people opened the
 * same listing at once.
 */

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const KINDS = new Set(['view', 'zalo', 'whatsapp', 'sms', 'website']);
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

// Cheap belt-and-braces against a crawler that does run scripts, and against the
// obvious way to inflate your own numbers from a script.
const BOT_RE = /bot|crawl|spider|slurp|bingpreview|facebookexternalhit|embedly|quora|pinterest|headless|lighthouse|curl|wget|python-requests|axios|node-fetch|go-http|java\//i;

export async function POST(req: NextRequest) {
  // Always 204: this is fire-and-forget telemetry. Returning an error teaches a
  // caller nothing useful and turns a counting problem into a console error on a
  // visitor's listing page.
  const ok = () => new NextResponse(null, { status: 204 });

  try {
    const ua = req.headers.get('user-agent') ?? '';
    if (!ua || BOT_RE.test(ua)) return ok();

    // Only count a beacon that came from our own site. Without this, anyone can
    // curl this endpoint and invent numbers for a leaderboard agents compare
    // themselves against.
    const origin = req.headers.get('origin') ?? '';
    if (origin && !/^https:\/\/(www\.)?danangmls\.com$/.test(origin)) return ok();

    const body = (await req.json()) as { slug?: unknown; kind?: unknown; agent?: unknown };
    const slug = typeof body.slug === 'string' ? body.slug.trim().toLowerCase() : '';
    const kind = typeof body.kind === 'string' ? body.kind.trim().toLowerCase() : '';
    const agent = typeof body.agent === 'string' ? body.agent.trim().slice(0, 120) : null;

    if (!SLUG_RE.test(slug) || slug.length > 200 || !KINDS.has(kind)) return ok();

    const admin = createAdminClient();
    if (!admin) return ok();

    await admin.rpc('bump_listing_stat', {
      p_slug: slug,
      p_kind: kind,
      p_agent: agent || null,
    });
  } catch {
    // Never let telemetry surface as an error to a visitor.
  }
  return ok();
}
