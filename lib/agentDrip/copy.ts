import { SITE_URL } from '@/lib/supabase/config';

/**
 * The three onboarding emails, in Vietnamese.
 *
 * Register is "bạn", matching the rest of the agent-facing surface (account
 * forms, add-listing form, the confirmation email). Nothing here claims a
 * ranking, a lead volume or a fee — advertising superlatives are unlawful in
 * Vietnam without proof, and we have none.
 */

export type DripStep = 'welcome' | 'reminder1' | 'reminder2';

interface StepCopy {
  subject: string;
  /** Hidden inbox-preview line. */
  preheader: string;
  paragraphs: string[];
  cta: string;
  closing: string[];
}

const COPY: Record<DripStep, StepCopy> = {
  welcome: {
    subject: 'Chào mừng bạn đến với DanangMLS',
    preheader: 'Đăng tin đầu tiên chỉ mất vài phút.',
    paragraphs: [
      'Cảm ơn bạn đã tham gia DanangMLS. Hồ sơ môi giới của bạn đã được kích hoạt.',
      'Bước tiếp theo rất đơn giản: đăng tin bất động sản đầu tiên. Bạn chỉ cần điền thông tin, tải ảnh lên (JPG, PNG hoặc WebP, tối đa 5 MB mỗi ảnh) và lưu lại. Tin đăng sẽ xuất hiện trên website để khách hàng tìm thấy.',
    ],
    cta: 'Đăng tin đầu tiên',
    closing: ['Nếu bạn đã đăng tin rồi, cảm ơn bạn và bạn có thể bỏ qua email này.'],
  },
  reminder1: {
    subject: 'Bạn chưa có tin đăng nào trên DanangMLS',
    preheader: 'Khách hàng chưa thể tìm thấy bạn.',
    paragraphs: [
      'Đã một tuần kể từ khi bạn tạo tài khoản, nhưng hiện tại bạn chưa có tin đăng nào trên DanangMLS. Vì vậy, khách hàng đang tìm nhà tại Đà Nẵng chưa thể tìm thấy bạn.',
      'Đăng tin đầu tiên chỉ mất vài phút. Sau khi lưu, tin đăng sẽ xuất hiện trên website.',
    ],
    cta: 'Đăng tin ngay',
    closing: [],
  },
  reminder2: {
    subject: 'Nhắc lần cuối: đăng tin đầu tiên của bạn trên DanangMLS',
    preheader: 'Đây là email nhắc cuối cùng của chúng tôi.',
    paragraphs: [
      'Đây là email nhắc cuối cùng của chúng tôi. Sau hai tuần, tài khoản của bạn vẫn chưa có tin đăng nào, nên khách hàng vẫn chưa thể tìm thấy bạn trên DanangMLS.',
      'Tài khoản của bạn vẫn được giữ nguyên. Bất cứ khi nào thuận tiện, bạn chỉ cần đăng nhập và đăng tin, chỉ mất vài phút.',
    ],
    cta: 'Đăng tin đầu tiên',
    closing: ['Chúng tôi sẽ không gửi thêm email nhắc nhở nào nữa.'],
  },
};

/** Vietnamese add-listing form; signed-out agents are sent through the Vietnamese
 *  login and land back on it (`?next=`), so this one link works for everyone. */
export const ADD_LISTING_URL = `${SITE_URL}/vi/tai-khoan/dang-tin`;

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export interface RenderedEmail {
  subject: string;
  html: string;
  text: string;
}

export function renderDripEmail(
  step: DripStep,
  opts: { name: string; email: string; unsubscribeUrl: string },
): RenderedEmail {
  const c = COPY[step];
  const greeting = `Chào ${opts.name},`;
  const signoff = ['Trân trọng,', 'Đội ngũ DanangMLS'];
  const footer = `Bạn nhận email này vì đã đăng ký tài khoản môi giới tại danangmls.com bằng địa chỉ ${opts.email}.`;
  const unsubLabel = 'Không muốn nhận email nhắc nhở nữa? Hủy nhận email';

  const p = (s: string, style = 'font-size:16px;line-height:1.6;margin:0 0 16px;') =>
    `<p style="${style}">${escapeHtml(s)}</p>`;

  const html = `<!doctype html>
<html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(c.subject)}</title></head>
<body style="margin:0;background:#ffffff;">
<span style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(c.preheader)}</span>
<div style="font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;color:#0f172a;">
  <div style="font-size:22px;font-weight:700;letter-spacing:-0.02em;margin-bottom:24px;">Danang<span style="color:#2563eb;">MLS</span></div>
  ${p(greeting)}
  ${c.paragraphs.map(t => p(t)).join('\n  ')}
  <p style="margin:24px 0;"><a href="${ADD_LISTING_URL}" style="background:#2563eb;color:#ffffff;text-decoration:none;padding:12px 24px;border-radius:8px;font-weight:600;font-size:15px;display:inline-block;">${escapeHtml(c.cta)}</a></p>
  ${c.closing.map(t => p(t)).join('\n  ')}
  <p style="font-size:16px;line-height:1.6;margin:24px 0 0;">${signoff.map(escapeHtml).join('<br>')}</p>
  <hr style="border:none;border-top:1px solid #e2e8f0;margin:32px 0 16px;">
  ${p(footer, 'font-size:12px;line-height:1.5;color:#94a3b8;margin:0 0 8px;')}
  <p style="font-size:12px;line-height:1.5;margin:0;"><a href="${opts.unsubscribeUrl}" style="color:#64748b;">${escapeHtml(unsubLabel)}</a></p>
</div>
</body></html>`;

  const text = [
    greeting,
    '',
    ...c.paragraphs.flatMap(t => [t, '']),
    `${c.cta}: ${ADD_LISTING_URL}`,
    '',
    ...c.closing.flatMap(t => [t, '']),
    ...signoff,
    '',
    '--',
    footer,
    `${unsubLabel}: ${opts.unsubscribeUrl}`,
  ].join('\n');

  return { subject: c.subject, html, text };
}
