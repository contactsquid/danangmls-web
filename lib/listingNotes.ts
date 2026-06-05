// Per-listing extra notes. Surfaced as a highlighted callout on the listing
// detail page, above the main description. Keyed by listing slug.
//
// Use this for one-off, non-templated facts that don't fit the sheet schema
// (lease length flexibility, recent renovation, owner-furnished extras, etc.).
// For anything that applies broadly, extend the sheet schema instead.

export interface ListingNote {
  en: string;
  vi: string;
}

export const LISTING_NOTES: Record<string, ListingNote> = {
  'luxury-villa-with-private-pool-in-premier-village-rxyx5l': {
    en: 'Available for a 6-month lease — a flexible option, since most properties in Da Nang require a 12-month commitment.',
    vi: 'Cho thuê tối thiểu 6 tháng — một lựa chọn linh hoạt, vì hầu hết các bất động sản tại Đà Nẵng yêu cầu hợp đồng 12 tháng.',
  },
};

export function getListingNote(slug: string, lang: 'en' | 'vi'): string | null {
  const note = LISTING_NOTES[slug];
  if (!note) return null;
  return lang === 'vi' ? note.vi : note.en;
}
