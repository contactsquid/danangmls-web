import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import LoginForm from './LoginForm';
import { AccountShell } from '@/components/account/ui';
import { getOwnProfile } from '@/lib/agents';
import { ACCOUNT_COPY, accountPaths, safeNext } from '@/lib/accountCopy';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Agent Sign In',
  robots: { index: false, follow: true },
};

const t = ACCOUNT_COPY.en;

const ERRORS: Record<string, string> = {
  // Reached when the code exchange fails — most often because the email was
  // opened in a different browser from the one that started the signup, so the
  // PKCE verifier cookie is absent. The address itself is confirmed by Supabase
  // before the redirect, so telling people the link was "invalid" is both scary
  // and usually wrong. Signing in is the correct next step either way.
  verification: 'Your email is confirmed — please sign in below. (If you have not confirmed yet, request a new link.)',
  unavailable: 'Agent accounts are not enabled on this site yet.',
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const { error, next } = await searchParams;
  // Where to land after signing in. Pages that require auth send agents here
  // with ?next=… (the "Add property" button being the common one), so they
  // resume what they were doing instead of landing on their profile.
  const target = safeNext(next, accountPaths.en.profile);

  if (await getOwnProfile()) redirect(target);

  return (
    <AccountShell title="Agent sign in" subtitle={t.loginSubtitle}>
      <LoginForm lang="en" next={target} initialError={error ? ERRORS[error] : undefined} />
      <div className="mt-6 space-y-2 text-sm text-slate-600">
        <p>
          <Link href={accountPaths.en.reset} className="text-blue-600 hover:underline">{t.forgotPassword}</Link>
        </p>
        <p>
          {t.noAccount}{' '}
          <Link href={accountPaths.en.signup} className="text-blue-600 hover:underline">{t.signUpLink}</Link>
        </p>
      </div>
    </AccountShell>
  );
}
