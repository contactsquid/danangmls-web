// Da Nang ward/neighborhood mapping by district
export const NEIGHBORHOODS: Record<string, string[]> = {
  'Hai Chau': [
    'Binh Hien', 'Binh Thuan', 'Hai Chau 1', 'Hai Chau 2',
    'Hoa Thuan Dong', 'Hoa Thuan Tay', 'Nam Duong',
    'Phuoc Ninh', 'Thanh Binh', 'Thuan Phuoc',
  ],
  'Thanh Khe': [
    'An Khe', 'Chinh Gian', 'Hoa Khe', 'Tam Thuan',
    'Tan Chinh', 'Thanh Khe Dong', 'Thanh Khe Tay',
    'Thac Gian', 'Vinh Trung', 'Xuan Ha',
  ],
  'Son Tra': [
    'An Hai Bac', 'An Hai Dong', 'An Hai Tay',
    'Man Thai', 'Nam Duong', 'Nai Hien Dong', 'Tho Quang',
  ],
  'Ngu Hanh Son': [
    'Hoa Hai', 'Hoa Quy', 'Khue My', 'My An',
  ],
  'Lien Chieu': [
    'Hoa Hiep Bac', 'Hoa Hiep Nam',
    'Hoa Khanh Bac', 'Hoa Khanh Nam', 'Hoa Minh',
  ],
  'Cam Le': [
    'Hoa An', 'Hoa Phat', 'Hoa Tho Dong', 'Hoa Tho Tay',
    'Hoa Xuan', 'Khue Trung',
  ],
  'Hoi An': [
    'An Bang', 'An My', 'Cam An Bac', 'Cam An Nam',
    'Cam Chau', 'Cam Ha', 'Cam Kim', 'Cam Nam',
    'Cam Pho', 'Cam Thanh', 'Cua Dai', 'Minh An',
    'Son Phong', 'Tan An', 'Thanh Ha',
  ],
};

// Detect neighborhood from listing text/title/district
export function detectNeighborhood(text: string, title: string, district: string): string {
  const haystack = (title + ' ' + text).toLowerCase();
  const wards = NEIGHBORHOODS[district] || [];
  for (const ward of wards) {
    if (haystack.includes(ward.toLowerCase())) return ward;
  }
  return '';
}
