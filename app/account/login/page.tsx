import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import LoginForm from './LoginForm';
import { AccountShell } from '@/components/account/ui';
import { getOwnProfile } from '@/lib/agents';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Agent Sign In',
  robots: { index: false, follow: true },
};

const ERRORS: Record<string, string> = {
  verification: 'That confirmation link was invalid or has expired. Try signing in, or request a new link.',
  unavailable: 'Agent accounts are not enabled on this site yet.',
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  if (await getOwnProfile()) redirect('/account/profile');

  const { error } = await searchParams;

  return (
    <AccountShell title="Agent sign in">
      <LoginForm initialError={error ? ERRORS[error] : undefined} />
      <div className="mt-6 space-y-2 text-sm text-slate-600">
        <p>
          <Link href="/account/reset" className="text-blue-600 hover:underline">Forgot your password?</Link>
        </p>
        <p>
          No account yet?{' '}
          <Link href="/account/signup" className="text-blue-600 hover:underline">Create one</Link>
        </p>
      </div>
    </AccountShell>
  );
}
