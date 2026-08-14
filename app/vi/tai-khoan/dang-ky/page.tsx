import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import SignupForm from '@/app/account/signup/SignupForm';
import { AccountShell } from '@/components/account/ui';
import { getOwnProfile } from '@/lib/agents';
import { ACCOUNT_COPY, accountPaths } from '@/lib/accountCopy';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Tạo Hồ Sơ Môi Giới | DanangMLS',
  description:
    'Tạo hồ sơ môi giới miễn phí trên DanangMLS để giới thiệu bất động sản của bạn tại Đà Nẵng và Hội An.',
  robots: { index: false, follow: true },
};

const t = ACCOUNT_COPY.vi;

export default async function ViSignupPage() {
  if (await getOwnProfile()) redirect(accountPaths.vi.profile);

  return (
    <AccountShell title={t.signupTitle} subtitle={t.signupSubtitle}>
      <SignupForm lang="vi" />
      <p className="mt-6 text-sm text-slate-600">
        {t.haveAccount}{' '}
        <Link href={accountPaths.vi.login} className="text-blue-600 hover:underline">{t.signInLink}</Link>
      </p>
    </AccountShell>
  );
}
