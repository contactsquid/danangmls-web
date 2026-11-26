import 'server-only';
import { normalizeVnPhone } from './agentContact';

import { cache } from 'react';
import { createPublicClient, createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { getListings, getForSaleListings } from '@/lib/sheets';
import type { Listing } from '@/lib/types';
import { normalizeAgentName } from './agentNameKey';
import { buildOwnerIndex, listingOwnerSlug } from './agentOwnership';

/** A profile as the public site sees it. Mirrors the agent_public view, which
 *  is where the private columns are stripped — see the migration. */
export interface AgentProfile {
  slug: string;
  display_name: string;
  bio: string;
  photo_url: string | null;
  workplace: string;
  /** Null unless an admin verified the claim; the view enforces this. */
  listing_agent_name: string | null;
  verified: boolean;
  created_at: string;
  /** Published ONLY once the agent ticks WhatsApp or Zalo. The number was
   *  originally collected under "not shown publicly", so the tick is the
   *  consent to publish it — and `agent_public` nulls the column otherwise,
   *  so no API path can leak a number the agent never agreed to show. */
  phone: string | null;
  has_whatsapp: boolean;
  has_zalo: boolean;
}

/** The signed-in user's own profile, including the columns hidden from the public view. */
export interface OwnAgentProfile extends AgentProfile {
  id: string;
  status: 'active' | 'suspended';
  is_admin: boolean;
  listing_agent_name_verified: boolean;
}

// One string literal, not a concatenation: supabase-js parses the select list
// with template-literal types at compile time, and `+` erases the literal type,
// which makes the query resolve to GenericStringError[] instead of the row type.
const PUBLIC_COLUMNS = 'slug, display_name, bio, photo_url, workplace, listing_agent_name, verified, created_at, phone, has_whatsapp, has_zalo';

// normalizeAgentName moved to the client-safe lib/agentNameKey.ts (2026-11-26) so the
// ownership rule in lib/agentOwnership.ts can be unit-tested; re-exported for callers.
export { normalizeAgentName };

/** All publicly visible profiles, newest first. */
export const getAgentProfiles = cache(async (): Promise<AgentProfile[]> => {
  if (!isSupabaseConfigured) return [];

  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from('agent_public')
    .select(PUBLIC_COLUMNS)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[agents] Failed to load profiles:', error.message);
    return [];
  }
  return (data ?? []) as AgentProfile[];
});

export const getAgentProfile = cache(async (slug: string): Promise<AgentProfile | null> => {
  if (!isSupabaseConfigured) return null;

  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from('agent_public')
    .select(PUBLIC_COLUMNS)
    .eq('slug', slug)
    .maybeSingle();

  if (error) {
    console.error(`[agents] Failed to load profile "${slug}":`, error.message);
    return null;
  }
  return (data as AgentProfile | null) ?? null;
});

/** Every listing (rental + sale) belonging to this profile, newest first.
 *
 *  TWO routes to ownership, and they are not equivalent:
 *
 *  1. **Posted through the portal** — proven by the image path, which the server
 *     derives from the signed-in profile. Needs no approval.
 *  2. **Claimed by name** — `listing_agent_name`, for scraped Facebook rows that
 *     carry the agent's name. The view serves this as NULL until an admin
 *     verifies it, so an unapproved claim still cannot pull another agent's
 *     portfolio onto a profile page.
 *  3. **Name + phone** — a scraped row whose agent name matches the display name
 *     (agentNameKey) and whose scraped phone matches the profile phone.
 *
 *  Route 1 was missing until 2026-09-24: an agent signed up, posted a listing
 *  through the portal, and her profile showed nothing, because the only path to
 *  a listing was an admin-verified name claim she had never made. A portal
 *  listing not appearing on its own author's profile is the one case that can
 *  never be a mis-claim. */
export async function getAgentListings(profile: AgentProfile): Promise<Listing[]> {
  // The whole pool goes into the index, not just this profile, so a portal post or
  // verified claim belonging to someone else beats a weaker route to this one.
  const pool = await getAgentProfiles();
  const idx = buildOwnerIndex(pool.some(p => p.slug === profile.slug) ? pool : [...pool, profile]);

  const [rentals, forSale] = await Promise.all([getListings(), getForSaleListings()]);

  const seen = new Set<string>();
  const mine: Listing[] = [];
  for (const l of [...rentals, ...forSale]) {
    if (listingOwnerSlug(l, idx) !== profile.slug || seen.has(l.slug)) continue;
    seen.add(l.slug);
    mine.push(l);
  }
  return mine.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/** Counts per profile in one pass over the sheets, for the /agents directory.
 *  Doing this per-profile would re-scan ~7,600 listings for each agent. */
export async function getAgentListingCounts(
  profiles: AgentProfile[],
): Promise<Map<string, number>> {
  const counts = new Map<string, number>();
  for (const p of profiles) counts.set(p.slug, 0);
  const idx = buildOwnerIndex(profiles);

  const [rentals, forSale] = await Promise.all([getListings(), getForSaleListings()]);
  for (const listing of [...rentals, ...forSale]) {
    // One owner per listing (lib/agentOwnership.ts), so nothing is counted twice.
    const slug = listingOwnerSlug(listing, idx);
    if (slug) counts.set(slug, (counts.get(slug) ?? 0) + 1);
  }
  return counts;
}

/** Sheet "Listing Agent" name → profile slug, for VERIFIED profiles only.
 *
 *  The view already serves `listing_agent_name` as NULL until an admin approves
 *  the claim, so an unverified claim can never turn into a link — the same rule
 *  that keeps listings off an unverified profile.
 *
 *  Cached per request: a listing page calls this once, and the underlying
 *  `getAgentProfiles()` is itself cached, so rendering N listings costs one
 *  Supabase round-trip rather than N. */
export const getVerifiedAgentSlugs = cache(async (): Promise<Map<string, string>> => {
  const profiles = await getAgentProfiles();
  const byName = new Map<string, string>();
  for (const p of profiles) {
    const name = normalizeAgentName(p.listing_agent_name);
    if (name) byName.set(name, p.slug);
  }
  return byName;
});

/** The profile slug to link a listing's agent name to, or null when that agent
 *  has no verified profile (the common case — most sheet agents never sign up). */
export async function getAgentSlugForName(agent: string | null | undefined): Promise<string | null> {
  const name = normalizeAgentName(agent);
  if (!name) return null;
  return (await getVerifiedAgentSlugs()).get(name) ?? null;
}

/** The ownership index over every public profile, built once per request. */
const getOwnerIndex = cache(async () => buildOwnerIndex(await getAgentProfiles()));

/** Profile slug for a listing: the portal poster first (proven by the image path),
 *  else a verified name claim, else a name + phone match (lib/agentOwnership.ts).
 *  Only returns slugs that have a public profile page. */
export async function getAgentSlugForListing(listing: Listing): Promise<string | null> {
  return listingOwnerSlug(listing, await getOwnerIndex());
}

/** Profiles are self-serve, so the site will accumulate near-empty ones. An
 *  indexable page with no bio and no inventory is textbook thin content, and at
 *  scale it drags the whole domain down — so those get noindex,follow until the
 *  agent fills the profile in. "follow" keeps any links on it live.
 *
 *  Lives here rather than in the page so BOTH language routes and the sitemap
 *  apply the identical rule. A sitemap listing a URL the page marks noindex is a
 *  contradictory signal, and two pages disagreeing about it is worse. */
export function isThinProfile(profile: AgentProfile, listings: Listing[]): boolean {
  return listings.length === 0 && profile.bio.trim().length < 40;
}

// ─── Signed-in user ───────────────────────────────────────────────────────────

/** The current user's own profile, or null when signed out.
 *
 *  Uses getUser(), never getSession(): getSession() trusts whatever is in the
 *  cookie, which a client can forge. getUser() revalidates against the auth
 *  server, so it is the only safe basis for an authorization decision. */
export const getOwnProfile = cache(async (): Promise<OwnAgentProfile | null> => {
  if (!isSupabaseConfigured) return null;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('agent_profiles')
    // Kept as one string literal, not a concatenation: supabase-js parses this
    // at the type level and a non-literal select silently degrades the row type.
    .select('id, slug, display_name, bio, photo_url, workplace, phone, status, is_admin, listing_agent_name, listing_agent_name_verified, created_at, has_whatsapp, has_zalo')
    .eq('id', user.id)
    .maybeSingle();

  if (error || !data) {
    if (error) console.error('[agents] Failed to load own profile:', error.message);
    return null;
  }

  return { ...data, verified: data.listing_agent_name_verified } as OwnAgentProfile;
});


/** Contact for a portal-posted listing that has no scraped number: the poster's own
 *  profile phone (and whether they said it is on WhatsApp). Portal listings never
 *  get an "Agent Contact" value (only the Facebook scraper writes it), so without
 *  this a sub-floor listing fell back to the agency line instead of its poster. */
export async function getProfileContactForSlug(slug: string | null): Promise<{ phone: string; whatsapp: boolean } | null> {
  if (!slug) return null;
  const p = (await getAgentProfiles()).find(x => x.slug === slug);
  const phone = normalizeVnPhone(p?.phone);
  return p && phone ? { phone, whatsapp: Boolean(p.has_whatsapp) } : null;
}
