import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import PasswordForm from './PasswordForm';
import { AccountShell } from '@/components/account/ui';
import { getOwnProfile } from '@/lib/agents';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Choose a New Password',
  robots: { index: false, follow: false },
};

/** Landing page for the password-reset email link. The callback route has
 *  already exchanged the token for a session by the time we get here, so an
 *  absent session means the link was stale. */
export default async function PasswordPage() {
  if (!(await getOwnProfile())) redirect('/account/reset');

  return (
    <AccountShell title="Choose a new password">
      <PasswordForm />
    </AccountShell>
  );
}
