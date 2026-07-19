import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
export async function GET() {
  const id = 'rmA-sDzzkaE';
  try {
    const res = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(`https://www.youtube.com/watch?v=${id}`)}&format=json`);
    const text = await res.text();
    return NextResponse.json({ ok: res.ok, status: res.status, text: text.slice(0, 300) });
  } catch (e: any) {
    return NextResponse.json({ error: String(e), stack: e?.stack });
  }
}
