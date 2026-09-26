// Da Nang ward/neighborhood mapping by district: the pre-2025 wards (GADM), which is
// how agents and renters still name places. Must match the ward names in
// lib/geo/areas.json (scripts/build-geo-areas.ts) — map pins are kept inside the
// ward's real boundary. Kept as a plain list so the neighborhood dropdown doesn't
// pull the boundary file into the page.
export const NEIGHBORHOODS: Record<string, string[]> = {
  'Hai Chau': ['Binh Hien', 'Binh Thuan', 'Hai Chau 1', 'Hai Chau 2', 'Hoa Cuong Bac', 'Hoa Cuong Nam', 'Hoa Thuan Dong', 'Hoa Thuan Tay', 'Nam Duong', 'Phuoc Ninh', 'Thach Thang', 'Thanh Binh', 'Thuan Phuoc'],
  'Thanh Khe': ['An Khe', 'Chinh Gian', 'Hoa Khe', 'Tam Thuan', 'Tan Chinh', 'Thac Gian', 'Thanh Khe Dong', 'Thanh Khe Tay', 'Vinh Trung', 'Xuan Ha'],
  'Son Tra': ['An Hai Bac', 'An Hai Dong', 'An Hai Tay', 'Man Thai', 'Nai Hien Dong', 'Phuoc My', 'Tho Quang'],
  'Ngu Hanh Son': ['Hoa Hai', 'Hoa Quy', 'Khue My', 'My An'],
  'Lien Chieu': ['Hoa Hiep Bac', 'Hoa Hiep Nam', 'Hoa Khanh Bac', 'Hoa Khanh Nam', 'Hoa Minh'],
  'Cam Le': ['Hoa An', 'Hoa Phat', 'Hoa Tho Dong', 'Hoa Tho Tay', 'Hoa Xuan', 'Khue Trung'],
  'Hoi An': ['Cam An', 'Cam Chau', 'Cam Ha', 'Cam Kim', 'Cam Nam', 'Cam Pho', 'Cam Thanh', 'Cua Dai', 'Minh An', 'Son Phong', 'Tan An', 'Tan Hiep', 'Thanh Ha'],
  'Hoa Vang': ['Hoa Bac', 'Hoa Chau', 'Hoa Khuong', 'Hoa Lien', 'Hoa Nhon', 'Hoa Ninh', 'Hoa Phong', 'Hoa Phu', 'Hoa Phuoc', 'Hoa Son', 'Hoa Tien'],
};

// Well-known place names that sit inside one ward.
const ALIASES: Record<string, Record<string, string>> = {
  'Hoi An': { 'an bang': 'Cam An' },
  'Hai Chau': { 'hai chau i': 'Hai Chau 1', 'hai chau ii': 'Hai Chau 2' },
};

const fold = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase();
const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Detect neighborhood from listing text/title/district: the ward mentioned EARLIEST,
// accents ignored ("Mỹ An" and "My An" both count), whole words only.
export function detectNeighborhood(text: string, title: string, district: string): string {
  const haystack = fold(title + ' ' + text);
  const names: [string, string][] = [
    ...(NEIGHBORHOODS[district] || []).map(w => [fold(w), w] as [string, string]),
    ...Object.entries(ALIASES[district] || {}),
  ];
  let best = '', at = Infinity;
  for (const [needle, ward] of names) {
    const m = new RegExp(`(^|[^a-z0-9])${escape(needle)}($|[^a-z0-9])`).exec(haystack);
    if (m && m.index < at) { at = m.index; best = ward; }
  }
  return best;
}
