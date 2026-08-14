import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { AccountShell } from '@/components/account/ui';
import ListingForm from '@/components/account/ListingForm';
import { getOwnProfile } from '@/lib/agents';
import { LISTING_FORM_COPY } from '@/lib/listingFormCopy';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Đăng tin bất động sản',
  robots: { index: false, follow: false },
};

/** Vietnamese add-listing form. Same component as the English route with a
 *  different `lang` — the two cannot drift apart.
 *
 *  Sign-in itself is still English-only, so an unauthenticated visitor is sent
 *  to /account/login; the Vietnamese account flow is the next piece of work. */
export default async function ViNewListingPage() {
  const profile = await getOwnProfile();
  if (!profile) redirect('/account/login?next=/vi/tai-khoan/dang-tin');

  const t = LISTING_FORM_COPY.vi;

  return (
    <AccountShell title={t.pageTitle} subtitle={t.pageSubtitle} wide>
      <ListingForm lang="vi" profileSlug={profile.slug} />
    </AccountShell>
  );
}
