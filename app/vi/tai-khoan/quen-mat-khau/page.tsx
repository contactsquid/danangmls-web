import type { Metadata } from 'next';
import Link from 'next/link';
import ResetForm from '@/app/account/reset/ResetForm';
import { AccountShell } from '@/components/account/ui';
import { ACCOUNT_COPY, accountPaths } from '@/lib/accountCopy';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Đặt Lại Mật Khẩu | DanangMLS',
  robots: { index: false, follow: false },
};

const t = ACCOUNT_COPY.vi;

export default function ViResetPage() {
  return (
    <AccountShell title={t.resetTitle} subtitle={t.resetSubtitle}>
      <ResetForm lang="vi" />
      <p className="mt-6 text-sm text-slate-600">
        <Link href={accountPaths.vi.login} className="text-blue-600 hover:underline">{t.signInLink}</Link>
      </p>
    </AccountShell>
  );
}
