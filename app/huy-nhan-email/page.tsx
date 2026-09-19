import type { Metadata } from 'next';
import { r2Upload } from '@/lib/r2';

/**
 * Unsubscribe from the agent onboarding emails.
 *
 * Those emails nudge an agent to post their first listing, and repeat twice more
 * if they never do. Someone who has left the industry needs a way to stop them —
 * both as basic courtesy and because Nghị định 13/2023/NĐ-CP requires consent to
 * be revocable. It also protects the sending reputation of the Gmail account
 * everything else goes out from: a spam complaint is far more costly than an
 * unsubscribe.
 *
 * The opt-out is a small object in R2 (`email-optout/<uid>.json`), which
 * ~/.openclaw/scripts/agent-emails/send-onboarding.py checks before sending.
 * R2 rather than Supabase because both sides already hold R2 credentials and it
 * needs no schema change — the same shape as the archive and redirect maps.
 *
 * Authorisation is the unguessable user id, which only appears in that person's
 * own email. No login: requiring a sign-in to stop unwanted email is exactly the
 * dark pattern this exists to avoid.
 */
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Ngừng nhận email — DanangMLS',
  robots: { index: false, follow: false },
};

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function UnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ u?: string }>;
}) {
  const { u } = await searchParams;
  const uid = (u ?? '').trim().toLowerCase();
  let state: 'ok' | 'bad' | 'error' = 'bad';

  if (UUID_RE.test(uid)) {
    try {
      await r2Upload(
        Buffer.from(JSON.stringify({ user_id: uid, at: new Date().toISOString() })),
        'application/json',
        `email-optout/${uid}.json`,
      );
      state = 'ok';
    } catch {
      // Never show a stack trace to someone trying to stop email. Tell them it
      // failed and give them a reply-to route that a human reads.
      state = 'error';
    }
  }

  const copy =
    state === 'ok'
      ? {
          h: 'Anh/chị đã ngừng nhận email',
          p: 'Chúng tôi sẽ không gửi thêm email nhắc đăng tin. Hồ sơ môi giới của anh/chị vẫn còn trên DanangMLS và anh/chị có thể đăng tin bất cứ lúc nào.',
        }
      : state === 'error'
        ? {
            h: 'Chưa ngừng được',
            p: 'Đã có lỗi xảy ra. Anh/chị vui lòng trả lời email nhắc gần nhất, chúng tôi sẽ xử lý thủ công.',
          }
        : {
            h: 'Đường dẫn không hợp lệ',
            p: 'Đường dẫn ngừng nhận email không đúng hoặc đã hỏng. Anh/chị vui lòng bấm lại đường dẫn trong email, hoặc trả lời email đó.',
          };

  return (
    <div className="bg-slate-50 min-h-[60vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full bg-white border border-slate-200 rounded-2xl p-7">
        <h1 className="text-xl font-semibold text-slate-900 mb-2">{copy.h}</h1>
        <p className="text-slate-600 leading-relaxed text-sm">{copy.p}</p>
        <a
          href="https://danangmls.com"
          className="inline-block mt-6 text-sm font-semibold text-blue-700 hover:underline"
        >
          Về trang chủ DanangMLS →
        </a>
      </div>
    </div>
  );
}
