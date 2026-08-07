import type { Listing } from './types';
import { localizeType, localizeDistrict } from './price';

// Single-facet filter pages: /for-rent/<slug>, /for-sale/<slug> (+ VI
// /vi/thue/<slug>, /vi/mua-ban/<slug>). A <slug> is ONE of a property type, a
// district, a bedroom count, or "foreign-buyer-eligible" (sale only). Type and
// bedroom slugs are localized (VI routes use Vietnamese slugs, e.g. /vi/thue/nha,
// /vi/thue/3-phong-ngu); district slugs are the ASCII form shared by both langs.

export type Mode = 'rent' | 'sale';
export type FacetKind = 'type' | 'district' | 'bedrooms' | 'foreign';
export interface Facet { kind: FacetKind; value: string }

export const FOREIGN_FACET: Facet = { kind: 'foreign', value: 'foreign' };

// Canonical property types + their EN/VI slugs
const TYPE_VI_SLUG: Record<string, string> = {
  House: 'nha', Apartment: 'can-ho', Villa: 'biet-thu', Townhouse: 'nha-pho',
  Studio: 'studio', Land: 'dat', Office: 'van-phong', Retail: 'mat-bang',
  Shophouse: 'shophouse', Commercial: 'thuong-mai',
};
const TYPE_VALUES = Object.keys(TYPE_VI_SLUG);
const EN_SLUG_TO_TYPE: Record<string, string> = Object.fromEntries(TYPE_VALUES.map(t => [t.toLowerCase(), t]));
const VI_SLUG_TO_TYPE: Record<string, string> = Object.fromEntries(Object.entries(TYPE_VI_SLUG).map(([t, s]) => [s, t]));

const DISTRICT_SLUGS: Record<string, string> = {
  'hai-chau': 'Hai Chau', 'thanh-khe': 'Thanh Khe', 'son-tra': 'Son Tra',
  'ngu-hanh-son': 'Ngu Hanh Son', 'lien-chieu': 'Lien Chieu', 'cam-le': 'Cam Le',
  'hoi-an': 'Hoi An',
};

const FOREIGN_SLUG = { en: 'foreign-buyer-eligible', vi: 'so-huu-nuoc-ngoai' };

const EN_TYPE_PLURAL: Record<string, string> = {
  House: 'Houses', Apartment: 'Apartments', Villa: 'Villas', Townhouse: 'Townhouses',
  Studio: 'Studios', Land: 'Land', Office: 'Offices', Retail: 'Retail Spaces',
  Shophouse: 'Shophouses', Commercial: 'Commercial Properties',
};

export function districtSlug(d: string): string { return d.toLowerCase().trim().replace(/\s+/g, '-'); }

/** Canonical URL slug for a facet in a given language. */
export function facetSlug(f: Facet, lang: 'en' | 'vi'): string {
  if (f.kind === 'type') return lang === 'vi' ? (TYPE_VI_SLUG[f.value] ?? f.value.toLowerCase()) : f.value.toLowerCase();
  if (f.kind === 'district') return districtSlug(f.value);
  if (f.kind === 'bedrooms') return lang === 'vi' ? `${f.value}-phong-ngu` : `${f.value}-bedroom${f.value === '1' ? '' : 's'}`;
  return lang === 'vi' ? FOREIGN_SLUG.vi : FOREIGN_SLUG.en; // foreign
}

/** slug → Facet. Accepts either language's slug (canonical redirect fixes the URL). */
export function resolveFacet(slug: string, _lang?: 'en' | 'vi'): Facet | null {
  const s = (slug || '').toLowerCase();
  if (EN_SLUG_TO_TYPE[s]) return { kind: 'type', value: EN_SLUG_TO_TYPE[s] };
  if (VI_SLUG_TO_TYPE[s]) return { kind: 'type', value: VI_SLUG_TO_TYPE[s] };
  if (DISTRICT_SLUGS[s]) return { kind: 'district', value: DISTRICT_SLUGS[s] };
  const m = s.match(/^(\d+)-(?:bedrooms?|phong-ngu)$/);
  if (m && +m[1] >= 1 && +m[1] <= 9) return { kind: 'bedrooms', value: m[1] };
  if (s === FOREIGN_SLUG.en || s === FOREIGN_SLUG.vi) return { ...FOREIGN_FACET };
  return null;
}

/** Does a listing belong on this facet page? Mirrors ListingsGrid's client filter logic. */
export function facetMatches(l: Listing, f: Facet): boolean {
  if (f.kind === 'type') return (l.type || '').toLowerCase() === f.value.toLowerCase();
  if (f.kind === 'district') return (l.district || '').toLowerCase().includes(f.value.toLowerCase());
  if (f.kind === 'bedrooms') return String(l.bedrooms || '') === f.value;
  if (f.kind === 'foreign') return !!l.foreignEligible;
  return false;
}

export function facetBase(mode: Mode, lang: 'en' | 'vi'): string {
  if (lang === 'vi') return mode === 'rent' ? '/vi/thue' : '/vi/mua-ban';
  return mode === 'rent' ? '/for-rent' : '/for-sale';
}
export function facetUrl(mode: Mode, lang: 'en' | 'vi', f: Facet): string {
  return `${facetBase(mode, lang)}/${facetSlug(f, lang)}`;
}

/** Build a facet URL from a raw listing field value; null when not a linkable facet. */
export function listingFieldHref(kind: 'type' | 'district' | 'bedrooms', raw: string, mode: Mode, lang: 'en' | 'vi'): string | null {
  if (!raw) return null;
  if (kind === 'type') {
    const canon = TYPE_VALUES.find(t => t.toLowerCase() === raw.toLowerCase());
    return canon ? facetUrl(mode, lang, { kind: 'type', value: canon }) : null;
  }
  if (kind === 'district') {
    const s = districtSlug(raw);
    return DISTRICT_SLUGS[s] ? facetUrl(mode, lang, { kind: 'district', value: DISTRICT_SLUGS[s] }) : null;
  }
  const n = String(raw).trim();
  if (!/^\d+$/.test(n) || +n < 1 || +n > 9) return null;
  return facetUrl(mode, lang, { kind: 'bedrooms', value: n });
}

/** Which grid dropdown/checkbox the facet pre-selects. */
export function facetInitialFilters(f: Facet): { type?: string; district?: string; beds?: string; foreign?: boolean } {
  if (f.kind === 'type') return { type: f.value };
  if (f.kind === 'district') return { district: f.value };
  if (f.kind === 'bedrooms') return { beds: f.value };
  if (f.kind === 'foreign') return { foreign: true };
  return {};
}

export interface FacetContent { h1: string; subtitle: string; title: string; description: string }

export function facetContent(f: Facet, mode: Mode, lang: 'en' | 'vi', count: number): FacetContent {
  return lang === 'vi' ? facetContentVi(f, mode, count) : facetContentEn(f, mode, count);
}

function facetContentEn(f: Facet, mode: Mode, count: number): FacetContent {
  const forX = mode === 'rent' ? 'for Rent' : 'for Sale';
  const rentSale = mode === 'rent' ? 'for rent' : 'for sale';
  // The houses-rent facet targets the SINGULAR "house for rent in Da Nang" so it
  // doesn't cannibalize the /for-rent hub (which owns the plural "houses for rent").
  if (f.kind === 'type' && f.value === 'House' && mode === 'rent') {
    const h1 = 'House for Rent in Da Nang, Vietnam';
    return {
      h1, title: h1,
      subtitle: `Browse ${count} houses for rent in Da Nang and Hoi An — furnished family homes, townhouses, and pool villas on long-term leases. Updated daily from local agents.`,
      description: `Find a house for rent in Da Nang and Hoi An — furnished 2–5 bedroom homes, townhouses, and villas on long-term leases near My Khe Beach and the city. ${count} listings updated daily on DanangMLS.`,
    };
  }
  if (f.kind === 'type') {
    const plural = EN_TYPE_PLURAL[f.value] || `${f.value}s`;
    const lc = plural.toLowerCase();
    const h1 = `${plural} ${forX} in Da Nang, Vietnam`;
    return { h1, title: h1,
      subtitle: `Browse ${count} ${lc} ${rentSale} in Da Nang and Hoi An — updated daily from local agents and property managers.`,
      description: `Browse ${lc} ${rentSale} in Da Nang and Hoi An. ${count} listings updated daily from local agents on DanangMLS.` };
  }
  if (f.kind === 'district') {
    const h1 = `Property ${forX} in ${f.value}, Da Nang`;
    return { h1, title: h1,
      subtitle: `Browse ${count} properties ${rentSale} in ${f.value}, Da Nang — houses, apartments, and villas updated daily.`,
      description: `Houses, apartments, and villas ${rentSale} in ${f.value}, Da Nang. ${count} listings updated daily on DanangMLS.` };
  }
  if (f.kind === 'foreign') {
    const h1 = `Foreign-Buyer-Eligible Homes for Sale in Da Nang, Vietnam`;
    return { h1, title: h1,
      subtitle: `Browse ${count} homes in Da Nang that foreigners can legally buy — condos and apartments in ownership-approved buildings, updated daily.`,
      description: `Da Nang homes foreigners can legally own — apartments and condos in foreign-ownership-approved buildings. ${count} listings updated daily on DanangMLS.` };
  }
  const noun = mode === 'rent' ? 'Rentals' : 'Homes for Sale';
  const lcNoun = mode === 'rent' ? 'rentals' : 'homes for sale';
  const h1 = `${f.value}-Bedroom ${noun} in Da Nang, Vietnam`;
  return { h1, title: h1,
    subtitle: `Browse ${count} ${f.value}-bedroom ${lcNoun} in Da Nang and Hoi An — updated daily from local agents.`,
    description: `${f.value}-bedroom ${mode === 'rent' ? 'properties for rent' : 'homes for sale'} in Da Nang and Hoi An. ${count} listings updated daily on DanangMLS.` };
}

function facetContentVi(f: Facet, mode: Mode, count: number): FacetContent {
  const thueBan = mode === 'rent' ? 'Cho Thuê' : 'Bán';
  const thueBanLc = mode === 'rent' ? 'cho thuê' : 'bán';
  if (f.kind === 'type') {
    const viType = localizeType(f.value, 'vi');
    const h1 = `${viType} ${thueBan} tại Đà Nẵng, Việt Nam`;
    return { h1, title: h1,
      subtitle: `Xem ${count} ${viType.toLowerCase()} ${thueBanLc} tại Đà Nẵng và Hội An — cập nhật hàng ngày từ các đại lý địa phương.`,
      description: `${viType} ${thueBanLc} tại Đà Nẵng và Hội An. ${count} tin đăng cập nhật hàng ngày trên DanangMLS.` };
  }
  if (f.kind === 'district') {
    const viDistrict = localizeDistrict(f.value, 'vi');
    const h1 = `Bất Động Sản ${thueBan} tại ${viDistrict}, Đà Nẵng`;
    return { h1, title: h1,
      subtitle: `Xem ${count} bất động sản ${thueBanLc} tại ${viDistrict}, Đà Nẵng — nhà, căn hộ và biệt thự cập nhật hàng ngày.`,
      description: `Nhà, căn hộ và biệt thự ${thueBanLc} tại ${viDistrict}, Đà Nẵng. ${count} tin đăng cập nhật hàng ngày trên DanangMLS.` };
  }
  if (f.kind === 'foreign') {
    const h1 = `Nhà Bán Cho Người Nước Ngoài Sở Hữu tại Đà Nẵng`;
    return { h1, title: h1,
      subtitle: `Xem ${count} căn hộ tại Đà Nẵng mà người nước ngoài được phép sở hữu hợp pháp — trong các tòa nhà đã được duyệt, cập nhật hàng ngày.`,
      description: `Căn hộ tại Đà Nẵng người nước ngoài được phép sở hữu, trong các tòa nhà đã được duyệt. ${count} tin đăng cập nhật hàng ngày trên DanangMLS.` };
  }
  const h1 = mode === 'rent'
    ? `Cho Thuê ${f.value} Phòng Ngủ tại Đà Nẵng, Việt Nam`
    : `Bán Nhà ${f.value} Phòng Ngủ tại Đà Nẵng, Việt Nam`;
  return { h1, title: h1,
    subtitle: `Xem ${count} bất động sản ${f.value} phòng ngủ ${thueBanLc} tại Đà Nẵng và Hội An — cập nhật hàng ngày.`,
    description: `Bất động sản ${f.value} phòng ngủ ${thueBanLc} tại Đà Nẵng và Hội An. ${count} tin đăng cập nhật hàng ngày trên DanangMLS.` };
}

/** Distinct facets that currently have at least one listing (for the sitemap). */
export function facetsWithInventory(listings: Listing[]): Facet[] {
  const seen = new Set<string>();
  const out: Facet[] = [];
  const add = (f: Facet) => { const k = `${f.kind}:${f.value}`; if (!seen.has(k)) { seen.add(k); out.push(f); } };
  for (const l of listings) {
    if (l.type) { const canon = TYPE_VALUES.find(t => t.toLowerCase() === l.type.toLowerCase()); if (canon) add({ kind: 'type', value: canon }); }
    if (l.district) { const s = districtSlug(l.district); if (DISTRICT_SLUGS[s]) add({ kind: 'district', value: DISTRICT_SLUGS[s] }); }
    const b = String(l.bedrooms || '').trim();
    if (/^\d+$/.test(b) && +b >= 1 && +b <= 9) add({ kind: 'bedrooms', value: b });
    if (l.foreignEligible) add({ ...FOREIGN_FACET });
  }
  return out;
}
