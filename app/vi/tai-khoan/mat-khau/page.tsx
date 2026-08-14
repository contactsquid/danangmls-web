import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import PasswordForm from '@/app/account/password/PasswordForm';
import { AccountShell } from '@/components/account/ui';
import { getOwnProfile } from '@/lib/agents';
import { ACCOUNT_COPY, accountPaths } from '@/lib/accountCopy';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Đặt Mật Khẩu Mới | DanangMLS',
  robots: { index: false, follow: false },
};

const t = ACCOUNT_COPY.vi;

/** Landing page for the password-reset email link. The callback route has
 *  already exchanged the token for a session by the time we get here, so an
 *  absent session means the link was stale. */
export default async function ViPasswordPage() {
  if (!(await getOwnProfile())) redirect(accountPaths.vi.reset);

  return (
    <AccountShell title={t.newPasswordTitle} subtitle={t.newPasswordSubtitle}>
      <PasswordForm lang="vi" />
    </AccountShell>
  );
}
