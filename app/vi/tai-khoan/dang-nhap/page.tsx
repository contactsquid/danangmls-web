import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import LoginForm from '@/app/account/login/LoginForm';
import { AccountShell } from '@/components/account/ui';
import { getOwnProfile } from '@/lib/agents';
import { ACCOUNT_COPY, accountPaths, safeNext } from '@/lib/accountCopy';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Đăng nhập môi giới',
  robots: { index: false, follow: true },
};

const t = ACCOUNT_COPY.vi;

const ERRORS: Record<string, string> = {
  verification: 'Email của anh/chị đã xác nhận xong — vui lòng đăng nhập bên dưới. (Nếu anh/chị chưa xác nhận, vui lòng yêu cầu liên kết mới.)',
  unavailable: 'Trang này chưa mở tài khoản môi giới.',
};

export default async function ViLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const { error, next } = await searchParams;
  const target = safeNext(next, accountPaths.vi.profile);

  if (await getOwnProfile()) redirect(target);

  return (
    <AccountShell title={t.loginTitle} subtitle={t.loginSubtitle}>
      <LoginForm lang="vi" next={target} initialError={error ? ERRORS[error] : undefined} />
      <div className="mt-6 space-y-2 text-sm text-slate-600">
        <p>
          <Link href={accountPaths.vi.reset} className="text-blue-600 hover:underline">{t.forgotPassword}</Link>
        </p>
        <p>
          {t.noAccount}{' '}
          <Link href={accountPaths.vi.signup} className="text-blue-600 hover:underline">{t.signUpLink}</Link>
        </p>
      </div>
    </AccountShell>
  );
}
