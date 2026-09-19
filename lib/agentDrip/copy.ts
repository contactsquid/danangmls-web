import { SITE_URL } from '@/lib/supabase/config';

/**
 * The three onboarding emails, in Vietnamese.
 *
 * Register is **anh/chị**, not `bạn`. The vietnamese-landing-copy skill's register
 * matrix puts "brokerage, local services, chat and email follow-up" in the
 * `consult` register and explicitly rules out `bạn` there. The rest of the
 * agent-facing site does use `bạn`, and that stays — this surface is deliberately
 * different because the reader is a working broker being written to directly, not
 * a consumer browsing a form. Mixing the two WITHIN one email would be the defect;
 * choosing a different one per audience is not.
 *
 * Blake's correction, 2026-09-19: these agents serve **foreigners renting**, not
 * buyers. Avoid `khách tìm nhà` ("people looking for a house", which reads as
 * buyers) — say `khách thuê`, and name the foreign-renter demand explicitly. It is
 * accurate AND it is the best reason an agent has to post.
 *
 * Also avoid English-calqued passives (`đã được kích hoạt` → `đã hoạt động`), and
 * never claim a ranking, lead volume or fee: unproven advertising superlatives are
 * unlawful in Vietnam under Điều 8 khoản 11 Luật Quảng cáo 16/2012/QH13.
 *
 * Validated with the skill's validate_copy.py --register consult: 0 errors.
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
    subject: 'Chào mừng anh/chị đến với DanangMLS',
    preheader: 'Hồ sơ môi giới của anh/chị đã hoạt động — bước tiếp theo là đăng tin đầu tiên.',
    paragraphs: [
      'Cảm ơn anh/chị đã tham gia DanangMLS. Hồ sơ môi giới của anh/chị đã hoạt động.',
      'Phần lớn khách trên DanangMLS là người nước ngoài đang tìm thuê nhà và căn hộ tại Đà Nẵng. Khách xem tin đăng trước, rồi mới bấm vào tên môi giới. Vì vậy tin đăng đầu tiên là bước giúp khách nhìn thấy anh/chị.',
      'Anh/chị chỉ cần điền thông tin, tải ảnh lên (JPG, PNG hoặc WebP, mỗi ảnh tối đa 5 MB) và lưu lại.',
    ],
    cta: 'Đăng tin đầu tiên',
    closing: ['Nếu anh/chị đã đăng tin rồi, xin cảm ơn và anh/chị có thể bỏ qua email này.'],
  },
  reminder1: {
    subject: 'Hồ sơ DanangMLS của anh/chị chưa có tin đăng',
    preheader: 'Khách thuê chưa có đường dẫn nào để đến trang của anh/chị.',
    paragraphs: [
      'Đã một tuần kể từ khi anh/chị tạo tài khoản, nhưng hồ sơ vẫn chưa có tin đăng nào.',
      'Khách thuê trên DanangMLS — phần lớn là người nước ngoài — bắt đầu từ tin đăng, sau đó mới bấm vào tên môi giới để xem hồ sơ. Khi hồ sơ chưa có tin đăng, khách không có đường dẫn nào để đến trang của anh/chị, và Google cũng chưa đưa trang hồ sơ vào kết quả tìm kiếm.',
      'Một tin đăng là đủ để hồ sơ của anh/chị bắt đầu nhận khách.',
    ],
    cta: 'Đăng tin ngay',
    closing: [],
  },
  reminder2: {
    subject: 'Nhắc lần cuối: hồ sơ DanangMLS của anh/chị chưa có tin đăng',
    preheader: 'Đây là email nhắc cuối cùng — sau email này chúng tôi sẽ không gửi thêm.',
    paragraphs: [
      'Đây là email nhắc cuối cùng của chúng tôi. Sau hai tuần, hồ sơ của anh/chị vẫn chưa có tin đăng, nên khách thuê vẫn chưa thể tìm thấy anh/chị trên DanangMLS.',
      'Hồ sơ của anh/chị vẫn còn. Bất cứ khi nào thuận tiện, anh/chị chỉ cần đăng nhập và đăng tin, chỉ mất vài phút.',
    ],
    cta: 'Đăng tin đầu tiên',
    closing: ['Chúng tôi sẽ không gửi thêm email nhắc về việc này.'],
  },
};

/** Vietnamese add-listing form; signed-out agents are sent through the Vietnamese
 *  login and land back on it (`?next=`), so this one link works for everyone. */
export const ADD_LISTING_URL = `${SITE_URL}/vi/tai-khoan/dang-tin`;

// Site palette, matching the header wordmark and the listing pages.
const BLUE = '#2563eb';
const INK = '#0f172a';
const BODY = '#334155';
const MUTED = '#64748b';
const LINE = '#e2e8f0';
const PAGE_BG = '#f1f5f9';
const CARD = '#ffffff';

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
  const greeting = `Chào anh/chị ${opts.name},`;
  const signoff = ['Trân trọng,', 'Đội ngũ DanangMLS'];
  const footer = `Anh/chị nhận email này vì đã đăng ký tài khoản môi giới tại danangmls.com bằng địa chỉ ${opts.email}.`;
  const unsubLabel = 'Ngừng nhận email nhắc';

  const font = `-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif`;
  const p = (s: string, size = '15px', color = BODY, pad = '0 0 16px') =>
    `<tr><td style="padding:${pad};font:400 ${size}/1.65 ${font};color:${color};">${escapeHtml(s)}</td></tr>`;

  // Email HTML, not web HTML: tables and fully inline styles, ~600px. Outlook
  // renders with Word, and Gmail strips <style> blocks in several contexts.
  // The wordmark is TEXT, not an image: most clients block remote images by
  // default, so an image header is a grey box on first contact.
  const html = `<!doctype html>
<html lang="vi"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="x-apple-disable-message-reformatting">
<title>${escapeHtml(c.subject)}</title>
</head>
<body style="margin:0;padding:0;background:${PAGE_BG};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;height:0;width:0;">${escapeHtml(c.preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${PAGE_BG};">
<tr><td align="center" style="padding:28px 12px;">
  <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:100%;">
    <tr><td style="padding:0 0 18px;font:700 20px/1 ${font};color:${INK};letter-spacing:-.3px;">Danang<span style="color:${BLUE};">MLS</span></td></tr>
    <tr><td style="background:${CARD};border:1px solid ${LINE};border-radius:14px;padding:28px 26px 22px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
        ${p(greeting, '18px', INK)}
        ${c.paragraphs.map(t => p(t)).join('\n        ')}
        <tr><td style="padding:6px 0 18px;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
            <td align="center" bgcolor="${BLUE}" style="border-radius:8px;">
              <a href="${ADD_LISTING_URL}" style="display:inline-block;padding:13px 26px;font:600 15px/1 ${font};color:#ffffff;text-decoration:none;border-radius:8px;">${escapeHtml(c.cta)}</a>
            </td></tr></table>
        </td></tr>
        ${c.closing.map(t => p(t, '13px', MUTED)).join('\n        ')}
        <tr><td style="padding:6px 0 18px;"><div style="height:1px;background:${LINE};line-height:1px;font-size:0;">&nbsp;</div></td></tr>
        ${p(signoff.join(' '), '15px', BODY, '0')}
      </table>
    </td></tr>
    <tr><td style="padding:18px 4px 0;font:400 12px/1.6 ${font};color:${MUTED};">
      ${escapeHtml(footer)}<br>
      <a href="${opts.unsubscribeUrl}" style="color:${MUTED};text-decoration:underline;">${escapeHtml(unsubLabel)}</a>
    </td></tr>
  </table>
</td></tr>
</table>
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
