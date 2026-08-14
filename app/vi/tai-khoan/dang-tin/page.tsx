import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { AccountShell } from '@/components/account/ui';
import ListingForm from '@/components/account/ListingForm';
import { getOwnProfile } from '@/lib/agents';
import { LISTING_FORM_COPY } from '@/lib/listingFormCopy';
import { accountPaths } from '@/lib/accountCopy';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Đăng tin bất động sản',
  robots: { index: false, follow: false },
};

/** Vietnamese add-listing form. Same component as the English route with a
 *  different `lang` — the two cannot drift apart. A signed-out visitor goes to
 *  the Vietnamese sign-in and is returned here afterwards. */
export default async function ViNewListingPage() {
  const profile = await getOwnProfile();
  if (!profile) redirect(`${accountPaths.vi.login}?next=${accountPaths.vi.newListing}`);

  const t = LISTING_FORM_COPY.vi;

  return (
    <AccountShell title={t.pageTitle} subtitle={t.pageSubtitle} wide>
      <ListingForm lang="vi" profileSlug={profile.slug} />
    </AccountShell>
  );
}
