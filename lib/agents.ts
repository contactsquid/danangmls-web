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
 *  them goes through this. */
export function normalizeAgentName(name: string | null | undefined): string {
  return (name ?? '').trim().toLowerCase().replace(/\s+/g, ' ');
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

/** Every listing (rental + sale) credited to this profile in the Google Sheet.
 *
 *  Returns [] when the name claim is unverified — `listing_agent_name` is served
 *  as NULL by the view in that case, so an unapproved claim cannot pull another
 *  agent's portfolio onto a profile page. */
export async function getAgentListings(profile: AgentProfile): Promise<Listing[]> {
  const claimed = normalizeAgentName(profile.listing_agent_name);
  if (!claimed) return [];

  const [rentals, forSale] = await Promise.all([getListings(), getForSaleListings()]);

  return [...rentals, ...forSale].filter(l => normalizeAgentName(l.agent) === claimed);
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
  if (wanted.size === 0) return counts;

  const [rentals, forSale] = await Promise.all([getListings(), getForSaleListings()]);
  for (const listing of [...rentals, ...forSale]) {
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
