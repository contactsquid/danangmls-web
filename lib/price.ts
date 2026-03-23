// Approximate VND/USD rate (matches the AI enrichment pipeline's conversion)
const VND_RATE = 26300;

export const VI_TYPES: Record<string, string> = {
  'Apartment': 'Căn Hộ',
  'House':     'Nhà Phố',
  'Land':      'Đất Nền',
  'Villa':     'Biệt Thự',
  'Commercial': 'Thương Mại',
};

export const VI_DISTRICTS: Record<string, string> = {
  'Hai Chau':     'Hải Châu',
  'Thanh Khe':    'Thanh Khê',
  'Son Tra':      'Sơn Trà',
  'Ngu Hanh Son': 'Ngũ Hành Sơn',
  'Lien Chieu':   'Liên Chiểu',
  'Cam Le':       'Cẩm Lệ',
  'Hoi An':       'Hội An',
};

export function localizeType(type: string, lang: string): string {
  return lang === 'vi' ? (VI_TYPES[type] ?? type) : type;
}

export function localizeDistrict(district: string, lang: string): string {
  if (lang !== 'vi') return district;
  // Try exact match first, then case-insensitive
  return VI_DISTRICTS[district] ?? VI_DISTRICTS[Object.keys(VI_DISTRICTS).find(k => k.toLowerCase() === district.toLowerCase()) ?? ''] ?? district;
}

function vndFormat(vnd: number): string {
  if (vnd >= 1_000_000_000) {
    const ty = vnd / 1_000_000_000;
    return `${ty % 1 === 0 ? ty : ty.toFixed(1)} tỷ ₫`;
  }
  if (vnd >= 1_000_000) {
    const trieu = vnd / 1_000_000;
    return `${trieu % 1 === 0 ? trieu : trieu.toFixed(1)} triệu ₫`;
  }
  return `${vnd.toLocaleString('vi-VN')} ₫`;
}

function parseDollars(s: string): number {
  return parseInt(s.replace(/,/g, ''), 10);
}

function viSuffix(rest: string): string {
  if (/month/i.test(rest)) return '/tháng';
  if (/for sale/i.test(rest)) return '';
  return '';
}

export function convertPriceToVND(price: string): string {
  if (!price) return price;

  // Range: "$500-$550/month"
  const rangeMatch = price.match(/^\$([0-9,]+)\s*-\s*\$([0-9,]+)(.*)/);
  if (rangeMatch) {
    const lo = parseDollars(rangeMatch[1]) * VND_RATE;
    const hi = parseDollars(rangeMatch[2]) * VND_RATE;
    return `${vndFormat(lo)} - ${vndFormat(hi)}${viSuffix(rangeMatch[3])}`;
  }

  // Single: "$500/month" or "$262,000 for sale"
  const singleMatch = price.match(/^\$([0-9,]+)(.*)/);
  if (singleMatch) {
    const amount = parseDollars(singleMatch[1]) * VND_RATE;
    return `${vndFormat(amount)}${viSuffix(singleMatch[2])}`;
  }

  return price;
}
