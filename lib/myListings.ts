import 'server-only';

import { getListings, getForSaleListings } from './sheets';
import type { Listing } from './types';

/**
 * Which listings an agent may edit.
 *
 * Ownership is proved by the photo path, NOT by the Listing Agent name. Photos
 * are uploaded to `agent-listings/<profile-slug>/…`, and that key is built
 * server-side from the authenticated agent's own profile — nobody can write into
 * another agent's folder.
 *
 * Matching on the name instead would be a real hole: display_name is free text,
 * so an agent could rename themselves to a prolific agent and inherit edit
 * rights over that agent's entire portfolio. The name is exactly what the
 * admin-verified claim gate exists to police; it is not an ownership proof.
 *
 * Consequence, and it is the correct one: only listings posted through the
 * portal are editable. Scraped Facebook listings have no owner to speak of.
 */

const OWNED_PREFIX = 'https://images.danang.homes/agent-listings/';

export function isOwnedBy(listing: Listing, profileSlug: string): boolean {
  if (!profileSlug) return false;
  const prefix = `${OWNED_PREFIX}${profileSlug}/`;
  return listing.images.some(url => url.startsWith(prefix));
}

/** Every listing this agent posted through the portal, newest first. */
export async function getMyListings(profileSlug: string): Promise<Listing[]> {
  const [rentals, forSale] = await Promise.all([getListings(), getForSaleListings()]);
  return [...rentals, ...forSale]
    .filter(l => isOwnedBy(l, profileSlug))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/** One of the agent's listings by slug, or null when it is not theirs — which is
 *  also the answer for "does not exist", deliberately: an agent should not be
 *  able to probe which slugs are real. */
export async function getMyListing(profileSlug: string, slug: string): Promise<Listing | null> {
  const mine = await getMyListings(profileSlug);
  return mine.find(l => l.slug === slug) ?? null;
}
