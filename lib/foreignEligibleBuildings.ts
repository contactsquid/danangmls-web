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
 * Returns true if a listing is likely eligible for foreign ownership:
 *   - Type is "Apartment" (foreigners can only own apartments under Vietnamese law)
 *   - AND it isn't a whole-building/commercial-block listing
 *   - AND it mentions a known foreign-approved development
 */
export function isForeignEligible(opts: { type?: string; title?: string; text?: string }): boolean {
  const isApartment = /^apartment$/i.test((opts.type || '').trim());
  if (!isApartment) return false;
  const blob = (opts.title || '') + ' ' + (opts.text || '');
  // Exclude whole-building plays — those aren't sellable to foreigners as a single unit
  if (/apartment\s+building|multi-?story\s+apartment|apartment\s+complex|whole\s+building|entire\s+building|\d+-?(story|stage|level)\s+(apartment|building)/i.test(blob)) {
    return false;
  }
  return detectForeignApprovedBuilding(blob) !== null;
}
