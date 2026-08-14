import type { Metadata } from 'next';
import { redirect, notFound } from 'next/navigation';
import { AccountShell } from '@/components/account/ui';
import EditListingForm from '@/components/account/EditListingForm';
import { getOwnProfile } from '@/lib/agents';
import { getMyListing } from '@/lib/myListings';
import { LISTING_FORM_COPY } from '@/lib/listingFormCopy';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Edit Listing',
  robots: { index: false, follow: false },
};

export default async function EditListingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const profile = await getOwnProfile();
  if (!profile) redirect(`/account/login?next=/account/listings/${slug}/edit`);

  // getMyListing returns null for "not yours" as well as "does not exist", so a
  // 404 is the right answer to both — an agent should not be able to tell them
  // apart by probing.
  const listing = await getMyListing(profile.slug, slug);
  if (!listing) notFound();

  const t = LISTING_FORM_COPY.en;

  return (
    <AccountShell title={t.editTitle} subtitle={t.editSubtitle} wide>
      <EditListingForm listing={listing} lang="en" />
    </AccountShell>
  );
}
