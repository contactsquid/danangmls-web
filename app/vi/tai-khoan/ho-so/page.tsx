import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { AccountShell } from '@/components/account/ui';
import ProfilePageBody, { ProfileSubtitle } from '@/components/account/ProfilePageBody';
import { getOwnProfile } from '@/lib/agents';
import { ACCOUNT_COPY, accountPaths } from '@/lib/accountCopy';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Hồ Sơ Môi Giới Của Bạn | DanangMLS',
  robots: { index: false, follow: false },
};

export default async function ViProfilePage() {
  const profile = await getOwnProfile();
  if (!profile) redirect(accountPaths.vi.login);

  return (
    <AccountShell
      title={ACCOUNT_COPY.vi.profileTitle}
      subtitle={<ProfileSubtitle slug={profile.slug} lang="vi" />}
      wide
    >
      <ProfilePageBody profile={profile} lang="vi" />
    </AccountShell>
  );
}
