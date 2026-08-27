import { NextRequest } from 'next/server';
import { resolveShortLink } from '@/lib/shortlink';

export const dynamic = 'force-dynamic';

/** Vietnamese short link — same ids as /l/<id>, but lands on /vi/listing/<slug>. */
export async function GET(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  return resolveShortLink(id, req.url, 'vi');
}
