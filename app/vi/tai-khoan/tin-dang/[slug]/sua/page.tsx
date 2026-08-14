import type { Metadata } from 'next';
import { redirect, notFound } from 'next/navigation';
import { AccountShell } from '@/components/account/ui';
import EditListingForm from '@/components/account/EditListingForm';
import { getOwnProfile } from '@/lib/agents';
import { getMyListing } from '@/lib/myListings';
import { LISTING_FORM_COPY } from '@/lib/listingFormCopy';
import { accountPaths } from '@/lib/accountCopy';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Chỉnh Sửa Tin Đăng | DanangMLS',
  robots: { index: false, follow: false },
};

export default async function ViEditListingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const profile = await getOwnProfile();
  if (!profile) redirect(`${accountPaths.vi.login}?next=/vi/tai-khoan/tin-dang/${slug}/sua`);

  const listing = await getMyListing(profile.slug, slug);
  if (!listing) notFound();

  const t = LISTING_FORM_COPY.vi;

  return (
    <AccountShell title={t.editTitle} subtitle={t.editSubtitle} wide>
      <EditListingForm listing={listing} lang="vi" />
    </AccountShell>
  );
}
