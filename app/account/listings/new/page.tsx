import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { AccountShell } from '@/components/account/ui';
import ListingForm from '@/components/account/ListingForm';
import { getOwnProfile } from '@/lib/agents';
import { LISTING_FORM_COPY } from '@/lib/listingFormCopy';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Add a listing',
  // Signed-in surface: no search value, and robots.ts disallows /account anyway.
  robots: { index: false, follow: false },
};

export default async function NewListingPage() {
  const profile = await getOwnProfile();
  if (!profile) redirect('/account/login?next=/account/listings/new');

  const t = LISTING_FORM_COPY.en;

  return (
    <AccountShell title={t.pageTitle} subtitle={t.pageSubtitle} wide>
      <ListingForm lang="en" profileSlug={profile.slug} />
    </AccountShell>
  );
}
