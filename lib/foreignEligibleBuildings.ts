// Known foreign-buyer-approved developments in Da Nang.
//
// Vietnamese law restricts foreign ownership: foreigners can own apartments/condos
// (not land or detached houses), and the BUILDING must be approved for foreign sale
// (developer registered the project + the 30% foreign quota has headroom).
//
// This list reflects developer- or project-level approvals known to allow foreign
// buyers. Maintained manually. Add new buildings here as they come online — verify
// by checking the developer's marketing materials for "foreign ownership available"
// language, or calling the sales office.
//
// Used by:
//   - lib/sheets.ts getForSaleListings() to set listing.foreignEligible
//   - ListingCard.tsx + ListingDetail.tsx to render the badge
//   - ListingsGrid.tsx to power the "Foreign Buyer Eligible only" filter

export interface ForeignApprovedBuilding {
  name: string;
  developer?: string;
  district?: string;
  pattern: RegExp;
}

export const FOREIGN_APPROVED_BUILDINGS: ForeignApprovedBuilding[] = [
  { name: 'Cora Tower',         developer: 'Sun Group',  district: 'Cam Le',        pattern: /cora tower/i },
  { name: 'The Soleil Da Nang', developer: 'PPC An Thinh', district: 'Ngu Hanh Son', pattern: /(the\s+)?soleil/i },
  { name: 'Muong Thanh',                                  district: 'Ngu Hanh Son', pattern: /m[ưu][ờo]ng\s+thanh/i },
  { name: 'Panoma',                                       district: 'Ngu Hanh Son', pattern: /panoma/i },
  { name: 'Hiyori Tower',                                 district: 'Son Tra',      pattern: /hiyori/i },
  { name: 'F.Home / FPT Plaza', developer: 'FPT',         district: 'Ngu Hanh Son', pattern: /(f\.?home|fpt\s+plaza|FPT\s+Plaza)/i },
  { name: 'One River',                                    district: 'Ngu Hanh Son', pattern: /one\s+river/i },
  { name: 'The Point Villas',                             district: 'Ngu Hanh Son', pattern: /the\s+point/i },
  { name: 'Risemount',                                    district: 'Hai Chau',     pattern: /risemount/i },
  { name: 'Alphanam Luxury Apartment',                    district: 'Ngu Hanh Son', pattern: /alphanam/i },
  { name: 'Sun Cosmo',          developer: 'Sun Group',   district: 'Ngu Hanh Son', pattern: /sun\s+cosmo/i },
  { name: 'Monarchy',                                     district: 'Son Tra',      pattern: /monarchy/i },
  { name: 'Wyndham Soleil',                               district: 'Ngu Hanh Son', pattern: /wyndham/i },
];

/**
 * Detect if a listing mentions a known foreign-approved building.
 * Returns the matched building entry, or null.
 */
export function detectForeignApprovedBuilding(haystack: string): ForeignApprovedBuilding | null {
  for (const b of FOREIGN_APPROVED_BUILDINGS) {
    if (b.pattern.test(haystack)) return b;
  }
  return null;
}

/**
 * The hard LEGAL ownership rules — a listing can only be foreign-owned if:
 *   - Type is "Apartment" (foreigners can own apartments/condos, not land/houses/villas), AND
 *   - it isn't a whole-building/commercial-block listing (can't be sold to a foreigner as one unit).
 * This is the GUARDRAIL applied even to trusted curated-group listings, so an agent who wrongly
 * posts a house/land/villa in the foreign group doesn't get the badge.
 */
export function passesForeignOwnershipRules(opts: { type?: string; title?: string; text?: string }): boolean {
  const isApartment = /^apartment$/i.test((opts.type || '').trim());
  if (!isApartment) return false;
  const blob = (opts.title || '') + ' ' + (opts.text || '');
  if (/apartment\s+building|multi-?story\s+apartment|apartment\s+complex|whole\s+building|entire\s+building|\d+-?(story|stage|level)\s+(apartment|building)/i.test(blob)) {
    return false;
  }
  return true;
}

/**
 * Returns true if a listing is likely eligible for foreign ownership:
 *   - passes the legal ownership rules (apartment, not a whole-building), AND
 *   - it mentions a known foreign-approved development.
 */
export function isForeignEligible(opts: { type?: string; title?: string; text?: string }): boolean {
  if (!passesForeignOwnershipRules(opts)) return false;
  return detectForeignApprovedBuilding((opts.title || '') + ' ' + (opts.text || '')) !== null;
}

// ── Foreign-eligible Facebook groups ──
//
// Blake maintains a separate FB group where curated foreigner-eligible listings
// are posted. An n8n scraper pulls from that group and writes to For Sale Staging
// alongside the regular for-sale scraper. Every listing whose Post URL traces
// back to one of these group IDs gets foreignEligible=true automatically — the
// curation is the trust signal, no per-listing inspection needed.
//
// Add a new group ID here when launching another curated group. The match is on
// the FB group path segment in the Post URL (numeric ID or vanity slug).

export const FOREIGN_ELIGIBLE_GROUP_IDS = new Set<string>([
  'apartmentforsaleindanang', // Blake's curated foreign-buyer apartments group (added 2026-07-23)
]);

/** Extract the FB group ID/slug from a permalink URL. */
function extractGroupId(postUrl: string): string | null {
  const m = (postUrl || '').match(/facebook\.com\/groups\/([^/?#]+)/i);
  return m ? m[1] : null;
}

/** True if the Post URL belongs to a curated foreign-eligible FB group. */
export function isFromForeignEligibleGroup(postUrl: string): boolean {
  const id = extractGroupId(postUrl);
  return id !== null && FOREIGN_ELIGIBLE_GROUP_IDS.has(id);
}
