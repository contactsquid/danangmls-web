'use server';

import { revalidatePath } from 'next/cache';
import { dashboardIdMatches, setPosted } from '@/lib/listingVideos';

/** Toggling is gated on the same unlisted id that renders the page, so a stray
 *  POST without it does nothing. */
export async function togglePosted(
  dashboardId: string,
  slug: string,
  platform: 'tiktok' | 'facebook',
  value: boolean,
): Promise<{ error?: string }> {
  if (!dashboardIdMatches(dashboardId)) return { error: 'Not found.' };
  const result = await setPosted(slug, platform, value);
  if (!result.error) revalidatePath(`/dashboard/${dashboardId}`);
  return result;
}
