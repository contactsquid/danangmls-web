/** One daily listing video, as produced by the Mac's publish-listing-video.js.
 *  YouTube publishes itself; TikTok and Facebook are posted by hand, and the
 *  two booleans are what the person posting ticks off. */
export interface ListingVideo {
  slug: string;
  video_date: string;
  title: string;
  price: string | null;
  district: string | null;
  beds: string | null;
  property_type: string | null;
  mls_url: string | null;
  video_url: string | null;
  youtube_url: string | null;
  caption: string | null;
  thumb_url: string | null;
  tiktok: boolean;
  facebook: boolean;
  /** Set by a database trigger the moment BOTH platforms are ticked, and cleared
   *  if either is un-ticked. Drives the 24h grace period so an accidental tick
   *  doesn't make the row vanish. */
  completed_at: string | null;
}

/** How long a finished video stays in the "needs posting" view.
 *
 *  Lives in its own client-safe module (no 'server-only' import) because the
 *  VideoQueue client component needs it at runtime — pulling it in from
 *  lib/listingVideos.ts would drag that file's server-only Supabase code into
 *  the client bundle. */
export const GRACE_MS = 24 * 60 * 60 * 1000;

export function withinGrace(completedAt: string | null): boolean {
  if (!completedAt) return false;
  const t = Date.parse(completedAt);
  return Number.isFinite(t) && Date.now() - t < GRACE_MS;
}
