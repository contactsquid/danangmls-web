import 'server-only';

import { cache } from 'react';
import { createPublicClient, createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { getListings, getForSaleListings } from '@/lib/sheets';
import type { Listing } from '@/lib/types';

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
}

/** The signed-in user's own profile, including the columns hidden from the public view. */
export interface OwnAgentProfile extends AgentProfile {
  id: string;
  phone: string | null;
  status: 'active' | 'suspended';
  is_admin: boolean;
  listing_agent_name_verified: boolean;
}

const PUBLIC_COLUMNS =
  'slug, display_name, bio, photo_url, workplace, listing_agent_name, verified, created_at';

/** Agent names in the sheet arrive with inconsistent spacing and casing
 *  (they originate from scraped Facebook posts), so every comparison against
 *  them goes through this.
 *
 *  Emoji are stripped too. Facebook agents routinely decorate their display
 *  names — "Vy Tran🏡✨", "A. Nhật🌟" — and 1,078 distinct names across the sheet
 *  carry them. Exact matching missed every one: Vy Tran alone had 23 listings
 *  split off from her own 235 by nothing but a house and a sparkle.
 *
 *  Only pictographs and their joiners go; letters, punctuation and diacritics
 *  are untouched, so "Ms. Vy" and "Phan Vy" stay the distinct people they are. */
const PICTOGRAPHS = /[\p{Extended_Pictographic}‍️⃣]/gu;

export function normalizeAgentName(name: string | null | undefined): string {
  return (name ?? '')
    .replace(PICTOGRAPHS, '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ');
}

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

const OWNED_PREFIX = 'https://images.danang.homes/agent-listings/';

/** The profile slug that posted this listing through the portal, or null for a
 *  scraped Facebook row.
 *
 *  The prefix is written server-side as `agent-listings/${profile.slug}/` from
 *  the AUTHENTICATED session (app/account/listings/actions.ts), never from user
 *  input — so an agent cannot put a listing under someone else's slug. That
 *  makes upload provenance strictly stronger evidence of ownership than the
 *  self-declared `listing_agent_name`, which is why it needs no admin approval. */
function portalOwnerSlug(listing: Listing): string | null {
  for (const url of listing.images) {
    if (!url.startsWith(OWNED_PREFIX)) continue;
    const rest = url.slice(OWNED_PREFIX.length);
    const slash = rest.indexOf('/');
    if (slash > 0) return rest.slice(0, slash);
  }
  return null;
}

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
 *
 *  Route 1 was missing until 2026-09-24: an agent signed up, posted a listing
 *  through the portal, and her profile showed nothing, because the only path to
 *  a listing was an admin-verified name claim she had never made. A portal
 *  listing not appearing on its own author's profile is the one case that can
 *  never be a mis-claim. */
export async function getAgentListings(profile: AgentProfile): Promise<Listing[]> {
  const claimed = normalizeAgentName(profile.listing_agent_name);

  const [rentals, forSale] = await Promise.all([getListings(), getForSaleListings()]);

  const seen = new Set<string>();
  const mine: Listing[] = [];
  for (const l of [...rentals, ...forSale]) {
    const owned = portalOwnerSlug(l) === profile.slug
      || (claimed !== '' && normalizeAgentName(l.agent) === claimed);
    if (!owned || seen.has(l.slug)) continue;   // a row can match both routes
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
  const wanted = new Map<string, string>(); // normalized sheet name -> profile slug

  for (const p of profiles) {
    const claimed = normalizeAgentName(p.listing_agent_name);
    counts.set(p.slug, 0);
    if (claimed) wanted.set(claimed, p.slug);
  }
  // NB: no early return on an empty `wanted`. Portal-posted listings are counted
  // by image path, so a profile with no verified name claim can still have a
  // real count — that bug showed the /agents directory "0 listings" for an agent
  // who had just posted one.

  const [rentals, forSale] = await Promise.all([getListings(), getForSaleListings()]);
  for (const listing of [...rentals, ...forSale]) {
    // Upload provenance wins over the name claim, and `continue` stops a listing
    // that matches both routes from being counted twice.
    const posted = portalOwnerSlug(listing);
    if (posted && counts.has(posted)) {
      counts.set(posted, (counts.get(posted) ?? 0) + 1);
      continue;
    }
    const slug = wanted.get(normalizeAgentName(listing.agent));
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
    .select('id, slug, display_name, bio, photo_url, workplace, phone, status, is_admin, listing_agent_name, listing_agent_name_verified, created_at')
    .eq('id', user.id)
    .maybeSingle();

  if (error || !data) {
    if (error) console.error('[agents] Failed to load own profile:', error.message);
    return null;
  }

  return { ...data, verified: data.listing_agent_name_verified } as OwnAgentProfile;
});
