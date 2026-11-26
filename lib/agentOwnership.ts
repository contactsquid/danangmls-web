import { normalizeVnPhone } from './agentContact';
import { portalUploaderSlug } from './imageStore';
import { agentNameKey, normalizeAgentName } from './agentNameKey';

/**
 * Which profile a listing belongs to. ONE rule, used by the profile page
 * (getAgentListings), the /agents directory counts (getAgentListingCounts) and the
 * agent link on a listing (getAgentSlugForListing), so the three can never disagree.
 *
 * Three routes, strongest first:
 *  1. Posted through the portal — the upload folder (portalUploaderSlug) is
 *     written server-side from the signed-in profile, so it is proof.
 *  2. Admin-verified `listing_agent_name` claim (the public view nulls it until
 *     verified), matched with normalizeAgentName.
 *  3. Name + phone (added 2026-11-26): the scraped listing's agent name has the
 *     same agentNameKey as the profile's display_name AND the phone scraped from
 *     the post equals the profile's phone. A same-name post with a different (or
 *     no) number is NOT linked: names alone are not unique among scraped agents.
 *     Measured on live data: links Đào Lệ Tuyền 26, Trần Nguyên Lâm 14, Trung
 *     Thành 11, Hoàng Vũ Thái Bình 7 listings and leaves out 4 same-name posts
 *     carrying other numbers.
 */

export interface OwnershipProfile {
  slug: string;
  display_name: string;
  listing_agent_name: string | null;
  phone: string | null;
}

export interface OwnershipListing {
  images: string[];
  agent: string;
  agentPhone?: string;
}

export interface OwnerIndex {
  slugs: Set<string>;
  byClaim: Map<string, string>;
  byNamePhone: Map<string, string>;
}

/** 9 local digits, or ''. Listing.agentPhone is ALREADY 9 local digits, and
 *  running normalizeVnPhone on it again would break every 084… number (its
 *  "84" country-code strip turns 84xxxxxxx into 7 digits). */
export function phoneKey(raw: string | null | undefined): string {
  const s = String(raw ?? '').trim();
  if (/^[35789]\d{8}$/.test(s)) return s;
  return normalizeVnPhone(s);
}

export function buildOwnerIndex(profiles: OwnershipProfile[]): OwnerIndex {
  const idx: OwnerIndex = { slugs: new Set(), byClaim: new Map(), byNamePhone: new Map() };
  for (const p of profiles) {
    idx.slugs.add(p.slug);
    const claim = normalizeAgentName(p.listing_agent_name);
    if (claim && !idx.byClaim.has(claim)) idx.byClaim.set(claim, p.slug);
    const key = agentNameKey(p.display_name);
    const phone = phoneKey(p.phone);
    const np = `${key}|${phone}`;
    if (key && phone && !idx.byNamePhone.has(np)) idx.byNamePhone.set(np, p.slug);
  }
  return idx;
}

export function listingOwnerSlug(listing: OwnershipListing, idx: OwnerIndex): string | null {
  const posted = portalUploaderSlug(listing.images ?? []);
  if (posted && idx.slugs.has(posted)) return posted;

  const claim = normalizeAgentName(listing.agent);
  if (claim) {
    const slug = idx.byClaim.get(claim);
    if (slug) return slug;
  }

  const key = agentNameKey(listing.agent);
  const phone = phoneKey(listing.agentPhone);
  if (key && phone) return idx.byNamePhone.get(`${key}|${phone}`) ?? null;
  return null;
}

/**
 * Whether a listing-name claim can be approved without an admin: there is at
 * least one listing under that name (by agentNameKey), every one of those that
 * carries a scraped phone carries the claimant's phone, and at least one does.
 *
 * The "at least one does" part is deliberate: For Sale rows never carry a scraped
 * phone, so without it anyone could auto-claim an agent whose listings have no
 * number at all. Those stay pending for the admin, as before.
 */
export function shouldAutoApproveClaim(
  claimName: string,
  profilePhone: string | null | undefined,
  listings: OwnershipListing[],
): boolean {
  const key = agentNameKey(claimName);
  const phone = phoneKey(profilePhone);
  if (!key || !phone) return false;
  let matching = 0;
  for (const l of listings) {
    if (agentNameKey(l.agent) !== key) continue;
    const lp = phoneKey(l.agentPhone);
    if (!lp) continue;
    if (lp !== phone) return false;
    matching++;
  }
  return matching > 0;
}

export interface NameKeyGroup<L> {
  /** The most common raw spelling on the listings, stored as the claim. */
  name: string;
  listings: L[];
}

/** Listings whose agent name has exactly this agentNameKey, newest first, with the
 *  most common raw spelling. Null when there are none (or the key is empty). */
export function groupByNameKey<L extends { agent: string; date: string }>(
  listings: L[],
  key: string,
): NameKeyGroup<L> | null {
  if (!key) return null;
  const spellings = new Map<string, number>();
  const mine: L[] = [];
  for (const l of listings) {
    if (agentNameKey(l.agent) !== key) continue;
    mine.push(l);
    const raw = (l.agent ?? '').trim();
    spellings.set(raw, (spellings.get(raw) ?? 0) + 1);
  }
  if (!mine.length) return null;
  const name = [...spellings.entries()].sort((a, b) => b[1] - a[1])[0][0];
  mine.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return { name, listings: mine };
}
