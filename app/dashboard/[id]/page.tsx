import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { dashboardIdMatches, getListingVideos } from '@/lib/listingVideos';
import VideoQueue from './VideoQueue';

// Unlisted internal tool: never cache, never index.
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Listing Video Queue',
  robots: { index: false, follow: false, nocache: true },
};

export default async function DashboardPage({
  params,
}: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!dashboardIdMatches(id)) notFound();

  const videos = await getListingVideos();

  return (
    <main className="mx-auto max-w-4xl px-5 py-10">
      <header className="mb-7">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Listing Video Queue</h1>
        <p className="mt-1.5 text-sm text-slate-600">
          YouTube publishes itself. TikTok and Facebook are posted by hand — download the file,
          copy the caption, then tick each one off here.
        </p>
      </header>
      <VideoQueue dashboardId={id} videos={videos} />
    </main>
  );
}
