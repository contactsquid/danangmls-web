import { NextRequest, NextResponse } from 'next/server';

// Legacy image proxy for Facebook-CDN photos. Nothing on the site links here any
// more (photos are rehosted to R2 and served via the Cloudflare worker), but old
// cached pages and shares may. Until 2026-09-29 it fetched ANY url and cached the
// result for 7 days — an open proxy anyone could relay content through our domain.
// Now: https only, Facebook CDN or our own image hosts only, images only.
const ALLOWED_HOST = /(^|\.)(fbcdn\.net|images\.danang\.homes)$/i;
const MAX_BYTES = 15 * 1024 * 1024;

function allowedImageUrl(raw: string | null): URL | null {
  if (!raw) return null;
  let u: URL;
  try { u = new URL(raw); } catch { return null; }
  if (u.protocol !== 'https:' || u.username || u.password || u.port) return null;
  return ALLOWED_HOST.test(u.hostname) ? u : null;
}

export async function GET(req: NextRequest) {
  const url = allowedImageUrl(req.nextUrl.searchParams.get('url'));
  if (!url) return new NextResponse('Bad request', { status: 400 });

  try {
    const res = await fetch(url, {
      redirect: 'error',   // a redirect could leave the allow-list
      headers: {
        'Referer': 'https://www.facebook.com/',
        'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
      },
    });

    if (!res.ok) {
      return new NextResponse('Image not found', { status: 404 });
    }

    const contentType = res.headers.get('content-type') || '';
    if (!/^image\//i.test(contentType)) return new NextResponse('Not an image', { status: 415 });
    const body = await res.arrayBuffer();
    if (body.byteLength > MAX_BYTES) return new NextResponse('Too large', { status: 413 });

    return new NextResponse(body, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=604800, stale-while-revalidate=86400',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch {
    return new NextResponse('Failed to fetch image', { status: 502 });
  }
}
