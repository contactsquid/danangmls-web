import 'server-only';

import { createAdminClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import type { ListingVideo } from '@/lib/videoGrace';

export type { ListingVideo };

/** The dashboard is unlisted rather than logged in — the id in the URL is the
 *  only gate, so it lives in an env var instead of the repo. No id configured
 *  means every /dashboard/* URL 404s, which is the right way to fail. */
export function dashboardIdMatches(id: string): boolean {
  const expected = process.env.VIDEO_DASHBOARD_ID;
  if (!expected) return false;
  return id === expected;
}

export async function getListingVideos(): Promise<ListingVideo[]> {
  if (!isSupabaseConfigured) return [];
  const supabase = createAdminClient();
  // createAdminClient() returns null when the service-role key is absent — the
  // queue simply reads as empty rather than throwing during a render.
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('listing_videos')
    .select('*')
    // Newest first. created_at leads because two videos can share a video_date;
    // slug is a deterministic tiebreaker so equal timestamps can't shuffle the
    // list between renders (which is exactly what happened on the first seed).
    .order('created_at', { ascending: false })
    .order('video_date', { ascending: false })
    .order('slug', { ascending: true })
    .limit(120);
  if (error) {
    console.error('[listing_videos] read failed:', error.message);
    return [];
  }
  return (data ?? []) as ListingVideo[];
}

export async function setPosted(
  slug: string,
  platform: 'tiktok' | 'facebook',
  value: boolean,
): Promise<{ error?: string; completedAt?: string | null }> {
  if (!isSupabaseConfigured) return { error: 'Supabase is not configured.' };
  const supabase = createAdminClient();
  if (!supabase) return { error: 'Service key is not configured.' };
  // Return the row so the caller gets completed_at as the trigger just set it,
  // rather than guessing at it client-side.
  const { data, error } = await supabase
    .from('listing_videos')
    .update({ [platform]: value })
    .eq('slug', slug)
    .select('completed_at')
    .single();
  if (error) return { error: error.message };
  return { completedAt: (data?.completed_at as string | null) ?? null };
}
