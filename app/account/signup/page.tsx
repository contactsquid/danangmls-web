import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import SignupForm from './SignupForm';
import { AccountShell } from '@/components/account/ui';
import { getOwnProfile } from '@/lib/agents';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Create an Agent Profile',
  description:
    'Create a free DanangMLS agent profile to showcase your Da Nang and Hoi An property listings.',
  // Account screens are utility pages: no search value, and indexing them would
  // put a sign-up form in the results for brand queries.
  robots: { index: false, follow: true },
};

export default async function SignupPage() {
  if (await getOwnProfile()) redirect('/account/profile');

  return (
    <AccountShell
      title="Create your agent profile"
      subtitle="Free for agents listing property in Da Nang and Hoi An."
    >
      <SignupForm />
      <p className="mt-6 text-sm text-slate-600">
        Already have an account?{' '}
        <Link href="/account/login" className="text-blue-600 hover:underline">Sign in</Link>
      </p>
    </AccountShell>
  );
}
