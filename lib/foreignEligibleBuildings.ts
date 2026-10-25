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
  /** The project's name in the Da Nang Department of Construction announcement, when it differs. */
  officialName?: string;
  developer?: string;
  district?: string;
  pattern: RegExp;
  // Plain substring the listings grid can match on (the grid uses includes(),
  // not the regex). Defaults to `name` when omitted.
  search?: string;
  /** 'approved' = on a published Department of Construction list (batch + foreign quota below).
   *  'unlisted' = marketed to foreign buyers but on none of the city's published lists (2026-10-25 check). */
  status: 'approved' | 'unlisted';
  batch?: string;
  foreignUnits?: string;
}

// Source: Da Nang Department of Construction (Sở Xây dựng) lists of commercial housing projects
// approved for foreign ownership. Batch 1 (2019, republished 17/06/2021, sxd.danang.gov.vn), batch 2
// (Duyên hải Miền Trung), batch 3 (Nov 2023), batch 4 (Nov 2024), batch 5 (24/02/2025), batch 6
// (Feb 2026), batch 7 (Mar 2026). Checked 2026-10-25. Projects not on these lists "have not been
// considered" for foreign ownership (the Department's own wording).
// Blake 2026-10-25: Muong Thanh is NOT eligible (removed). F-Home (16 Lý Thường Kiệt) is on the
// city's NOT-approved list, so it no longer rides along with FPT Plaza.
export const FOREIGN_APPROVED_BUILDINGS: ForeignApprovedBuilding[] = [
  // ── On the city's published lists ──
  { name: 'SAM Towers (Risemount)', officialName: 'P.A Tower', developer: 'PAVNC', district: 'Hai Chau', pattern: /\bsam\s*towers?\b|\brisemount\b/i, search: 'Sam Tower', status: 'approved', batch: 'Batch 1 (2019)' },
  { name: 'Blooming Tower', developer: 'Korea Investment & Development', district: 'Hai Chau', pattern: /\bblooming\b/i, search: 'Blooming', status: 'approved', batch: 'Batch 1 (2019)' },
  { name: 'Monarchy', developer: 'Danang Housing Investment Development', district: 'Son Tra', pattern: /monarchy/i, search: 'Monarchy', status: 'approved', batch: 'Batch 1 (2019)' },
  { name: 'Hiyori Garden Tower', officialName: 'Tháp Vườn', developer: 'Sun Frontier Da Nang', district: 'Son Tra', pattern: /hiyori/i, search: 'Hiyori', status: 'approved', batch: 'Batch 1 (2019)' },
  { name: 'Azura', developer: 'VinaCapital', district: 'Son Tra', pattern: /\bazura\b/i, search: 'Azura', status: 'approved', batch: 'Batch 1 (2019)' },
  { name: 'FPT Plaza', officialName: 'FPT City Da Nang', developer: 'FPT City Da Nang', district: 'Ngu Hanh Son', pattern: /fpt\s*plaza|fpt\s*city/i, search: 'FPT', status: 'approved', batch: 'Batch 1 (2019)' },
  { name: 'Golden Square', developer: 'Dong A Real Estate', district: 'Hai Chau', pattern: /golden\s*square/i, search: 'Golden Square', status: 'approved', batch: 'Batch 1 (2019)' },
  { name: 'Lapaz Tower', developer: 'Danang Housing Investment Development', district: 'Hai Chau', pattern: /lapaz/i, search: 'Lapaz', status: 'approved', batch: 'Batch 1 (2019)' },
  { name: 'Danang Plaza', developer: 'Danang Housing Investment Development', district: 'Hai Chau', pattern: /da\s*nang\s*plaza/i, search: 'Danang Plaza', status: 'approved', batch: 'Batch 1 (2019)' },
  { name: 'HAGL Lakeview', developer: 'Hoang Anh Gia Lai', district: 'Thanh Khe', pattern: /hagl|hoang\s*anh\s*gia\s*lai/i, search: 'HAGL', status: 'approved', batch: 'Batch 1 (2019)' },
  { name: 'Harmony Tower', developer: 'Mien Trung Real Estate', district: 'Son Tra', pattern: /harmony\s+tower/i, search: 'Harmony', status: 'approved', batch: 'Batch 1 (2019)' },
  { name: 'The Summit', developer: 'Dat Kinh Tuyen So 1', district: 'Son Tra', pattern: /the\s+summit/i, search: 'Summit', status: 'approved', batch: 'Batch 1 (2019)' },
  { name: 'The Filmore', developer: 'Filmore Real Estate Development', district: 'Hai Chau', pattern: /fil+more/i, search: 'Filmore', status: 'approved', batch: 'Batch 3 (Nov 2023)', foreignUnits: '61 of 206' },
  { name: 'Sun Cosmo Residence', officialName: 'Apartment buildings on lots B4-1 & B4-2, Han River tourism zone', developer: 'Cu Lao Cham (Sun Group)', district: 'Ngu Hanh Son', pattern: /sun\s+cosmo/i, search: 'Sun Cosmo', status: 'approved', batch: 'Batch 4 (Nov 2024)', foreignUnits: '203' },
  { name: 'Newtown Diamond', officialName: 'New Town commercial & sports urban area', developer: 'New Town Development', district: 'Ngu Hanh Son', pattern: /new\s*town\s*diamond/i, search: 'Newtown Diamond', status: 'approved', batch: 'Batch 4 (Nov 2024)', foreignUnits: '519 apartments + 250 villas' },
  { name: 'Olalani Riverside Towers', developer: 'My Phuc', district: 'Son Tra', pattern: /olalani/i, search: 'Olalani', status: 'approved', batch: 'Batch 4 (Nov 2024)' },
  { name: 'Capital Square 2 & 3', developer: 'Mega Assets / SIH Real Estate', district: 'Son Tra', pattern: /capital\s*square\s*(?:2|3|ii|iii)\b/i, search: 'Capital Square', status: 'approved', batch: 'Batch 5 (Feb 2025)', foreignUnits: '502 + 512' },
  { name: 'Masteri Rivera Danang', officialName: 'Tuyên Sơn high-rise apartments (formerly The Estuary)', developer: 'Tuyen Son Housing Development (Masterise Homes)', district: 'Hai Chau', pattern: /masteri\s*rivera|the\s+estuary/i, search: 'Masteri', status: 'approved', batch: 'Batch 6 (Feb 2026)', foreignUnits: '332 of 1,112' },
  // ── Marketed to foreign buyers, but on none of the city's published lists (pending Blake's call) ──
  { name: 'Cora Tower', developer: 'Sun Group', district: 'Cam Le (Hoa Xuan)', pattern: /cora tower/i, search: 'Cora', status: 'unlisted' },
  { name: 'The Soleil / Wyndham Soleil', district: 'Son Tra', pattern: /soleil|wyndham(?!\s*(?:da\s*nang\s*|danang\s*)?golden)/i, search: 'Soleil', status: 'unlisted' },
  { name: 'Panoma', district: 'Ngu Hanh Son', pattern: /panoma/i, search: 'Panoma', status: 'unlisted' },
  { name: 'One River (villas)', district: 'Ngu Hanh Son', pattern: /one\s+river/i, search: 'One River', status: 'unlisted' },
  { name: 'The Point (villas)', district: 'Ngu Hanh Son', pattern: /the\s+point/i, search: 'The Point', status: 'unlisted' },
  { name: 'Alphanam Luxury Apartment / Altara Suites', developer: 'Alphanam', district: 'Son Tra', pattern: /alphanam|altara/i, search: 'Alphanam', status: 'unlisted' },
  { name: 'Times Square FUTA Residence', district: 'Son Tra', pattern: /times\s*square|futa\s*residence/i, search: 'Times Square FUTA', status: 'unlisted' },
];

/** Projects the Department of Construction listed as NOT open to foreign ownership (2021 list), plus
 *  Blake's own finding (Muong Thanh, 2026-10-25). Naming one blocks the badge, even from the curated group. */
export const FOREIGN_NOT_APPROVED: { name: string; pattern: RegExp; source: string; sourceVi: string }[] = [
  { name: 'F-Home (16 Lý Thường Kiệt)', pattern: /\bf\.?\s*-?home\b/i, source: 'Department of Construction, 2021', sourceVi: 'Sở Xây dựng, 2021' },
  { name: 'Danang Diamond Tower (Marriott, 58 Bạch Đằng)', pattern: /da\s*nang\s+diamond\s+tower/i, source: 'Department of Construction, 2021', sourceVi: 'Sở Xây dựng, 2021' },
  { name: 'Indochina Riverside Tower', pattern: /indochina\s+riverside/i, source: 'Department of Construction, 2021', sourceVi: 'Sở Xây dựng, 2021' },
  { name: 'Muong Thanh', pattern: /m[ưu][ờo]ng\s+thanh/i, source: 'Confirmed by DanangMLS, 2026', sourceVi: 'DanangMLS xác nhận, 2026' },
];

/** Names a not-approved project and no approved one ("near the Muong Thanh hotel" in a Monarchy listing is fine). */
export function namesNotApprovedBuilding(haystack: string): boolean {
  return FOREIGN_NOT_APPROVED.some(b => b.pattern.test(haystack)) && detectForeignApprovedBuilding(haystack) === null;
}

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
