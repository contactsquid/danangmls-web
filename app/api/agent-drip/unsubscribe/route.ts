import { NextResponse, type NextRequest } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { verifyUnsubscribe } from '@/lib/agentDrip/token';

export const dynamic = 'force-dynamic';

const PAGE = (title: string, body: string) =>
  new NextResponse(
    `<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>${title}</title></head>
<body style="font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;max-width:480px;margin:0 auto;padding:48px 24px;color:#0f172a;">
<div style="font-size:22px;font-weight:700;margin-bottom:24px;">Danang<span style="color:#2563eb;">MLS</span></div>${body}</body></html>`,
    { headers: { 'Content-Type': 'text/html; charset=utf-8' } },
  );

/** GET only shows a confirm button. The actual opt-out is the POST, so a mail
 *  scanner that pre-fetches links cannot unsubscribe someone by accident. */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const u = searchParams.get('u') ?? '';
  const t = searchParams.get('t') ?? '';
  if (!verifyUnsubscribe(u, t)) {
    return PAGE('Liên kết không hợp lệ', '<p>Liên kết ngừng nhận email không đúng hoặc đã hết hạn. Anh/chị vui lòng bấm lại liên kết trong email gần nhất.</p>');
  }
  return PAGE(
    'Ngừng nhận email nhắc',
    `<p style="font-size:16px;line-height:1.6;">Anh/chị muốn ngừng nhận email nhắc đăng tin từ DanangMLS?</p>
<form method="post" action="/api/agent-drip/unsubscribe?u=${encodeURIComponent(u)}&t=${encodeURIComponent(t)}">
<button type="submit" style="background:#2563eb;color:#fff;border:0;padding:12px 24px;border-radius:8px;font-weight:600;font-size:15px;cursor:pointer;">Ngừng nhận email</button></form>`,
  );
}

/** Used by the page's button and by Gmail's one-click List-Unsubscribe. */
export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const u = searchParams.get('u') ?? '';
  const t = searchParams.get('t') ?? '';
  if (!verifyUnsubscribe(u, t)) {
    return PAGE('Liên kết không hợp lệ', '<p>Liên kết ngừng nhận email không đúng hoặc đã hết hạn. Anh/chị vui lòng bấm lại liên kết trong email gần nhất.</p>');
  }

  const admin = createAdminClient();
  if (!admin) return NextResponse.json({ error: 'unavailable' }, { status: 503 });

  await admin
    .from('agent_email_drip')
    .update({ stopped_at: new Date().toISOString(), stop_reason: 'unsubscribed' })
    .eq('user_id', u)
    .is('stopped_at', null);

  return PAGE(
    'Đã ngừng nhận email',
    '<p style="font-size:16px;line-height:1.6;">Anh/chị đã ngừng nhận email nhắc. Chúng tôi sẽ không gửi thêm email nhắc đăng tin nào nữa. Hồ sơ môi giới của anh/chị vẫn còn trên DanangMLS.</p>',
  );
}
