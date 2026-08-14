import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import ProfileForm from './ProfileForm';
import { AccountShell } from '@/components/account/ui';
import { getOwnProfile } from '@/lib/agents';
import { signOutAction } from '../actions';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Your Agent Profile',
  robots: { index: false, follow: false },
};

export default async function ProfilePage() {
  // Authorization happens here, next to the data — proxy.ts only refreshes the
  // session, it does not gate access.
  const profile = await getOwnProfile();
  if (!profile) redirect('/account/login');

  return (
    <AccountShell
      title="Your agent profile"
      subtitle={
        <>
          Public at{' '}
          <Link href={`/agent/${profile.slug}`} className="text-blue-600 hover:underline">
            danangmls.com/agent/{profile.slug}
          </Link>
        </>
      }
      wide
    >
      {profile.status === 'suspended' && (
        <p className="mb-4 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">
          This profile is currently hidden from the public site. Contact DanangMLS if you think
          that is a mistake.
        </p>
      )}

      {/* Primary action for an agent who is already set up: the profile exists to
          carry listings, so posting one should not be buried. */}
      <div className="mb-6 flex flex-wrap items-center gap-3 rounded-lg border border-blue-100 bg-blue-50 px-4 py-3">
        <p className="text-sm text-slate-700 flex-1 min-w-0">
          Ready to post a property?
        </p>
        <Link
          href="/account/listings/new"
          className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
        >
          Add a listing
        </Link>
        <Link href="/vi/tai-khoan/dang-tin" className="text-sm text-blue-700 hover:underline">
          Tiếng Việt
        </Link>
      </div>

      <ProfileForm profile={profile} />

      <div className="mt-8 pt-6 border-t border-slate-200 flex items-center justify-between">
        {profile.is_admin ? (
          <Link href="/admin/agents" className="text-sm text-blue-600 hover:underline">
            Admin — manage agents
          </Link>
        ) : <span />}
        <form action={signOutAction}>
          <button type="submit" className="text-sm text-slate-500 hover:text-slate-700 hover:underline">
            Sign out
          </button>
        </form>
      </div>
    </AccountShell>
  );
}
