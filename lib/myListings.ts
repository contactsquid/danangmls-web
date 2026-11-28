import 'server-only';

import { getListingsFromSheet as getListings, getForSaleListingsFromSheet as getForSaleListings } from './sheets';
import { getCrossCityListings, ownedByPortalSlug } from './crossCityEdit';
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

export function isOwnedBy(listing: Listing, profileSlug: string): boolean {
  // Any MLS site's portal folder counts: a listing posted from another site into this
  // site's city keeps its photos in the uploading site's folder (lib/crossCityEdit.ts).
  return ownedByPortalSlug(listing.images, profileSlug);
}

/** Every listing this agent posted through the portal, newest first. */
export async function getMyListings(profileSlug: string): Promise<Listing[]> {
  const [rentals, forSale, otherCities] = await Promise.all([getListings(), getForSaleListings(), getCrossCityListings(profileSlug)]);
  // Listings posted into other cities live in those cities' tabs (lib/crossCityEdit.ts).
  return [...[...rentals, ...forSale].filter(l => isOwnedBy(l, profileSlug)), ...otherCities]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/** One of the agent's listings by slug, or null when it is not theirs — which is
 *  also the answer for "does not exist", deliberately: an agent should not be
 *  able to probe which slugs are real. */
export async function getMyListing(profileSlug: string, slug: string): Promise<Listing | null> {
  const mine = await getMyListings(profileSlug);
  return mine.find(l => l.slug === slug) ?? null;
}
