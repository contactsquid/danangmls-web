import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { AccountShell } from '@/components/account/ui';
import MyListingsView from '@/components/account/MyListingsView';
import { getOwnProfile } from '@/lib/agents';
import { getMyListings } from '@/lib/myListings';
import { LISTING_FORM_COPY } from '@/lib/listingFormCopy';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Your Listings',
  robots: { index: false, follow: false },
};

export default async function MyListingsPage() {
  const profile = await getOwnProfile();
  if (!profile) redirect('/account/login?next=/account/listings');

  const listings = await getMyListings(profile.slug);
  const t = LISTING_FORM_COPY.en;

  return (
    <AccountShell title={t.myListings} wide>
      <div className="mb-4 text-right">
        <Link
          href="/account/listings/new"
          className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          {t.pageTitle}
        </Link>
      </div>
      <MyListingsView listings={listings} lang="en" />
    </AccountShell>
  );
}
