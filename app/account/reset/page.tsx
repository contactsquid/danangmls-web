import type { Metadata } from 'next';
import Link from 'next/link';
import ResetForm from './ResetForm';
import { AccountShell } from '@/components/account/ui';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Reset Your Password',
  robots: { index: false, follow: false },
};

export default function ResetPage() {
  return (
    <AccountShell
      title="Reset your password"
      subtitle="We’ll email you a link to choose a new one."
    >
      <ResetForm />
      <p className="mt-6 text-sm text-slate-600">
        <Link href="/account/login" className="text-blue-600 hover:underline">Back to sign in</Link>
      </p>
    </AccountShell>
  );
}
