import { NextRequest } from 'next/server';
import { resolveShortLink } from '@/lib/shortlink';

export const dynamic = 'force-dynamic';

export async function GET(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  return resolveShortLink(id);
}
