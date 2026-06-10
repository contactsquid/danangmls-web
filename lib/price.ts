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

/**
 * Builds the SEO alt-text prefix for listing photos, localized to the page language.
 * On /vi pages this yields e.g. "Cho thuê Nhà Phố 3 phòng ngủ tại Sơn Trà, Đà Nẵng";
 * the English output is byte-identical to the original inline array, so EN pages are unchanged.
 */
export function localizedAltPrefix(
  opts: { bedrooms?: number | string | null; type?: string | null; district?: string | null; forSale?: boolean },
  lang: string,
): string {
  const { bedrooms, type, district, forSale } = opts;
  // bedrooms can arrive as the string "0" (truthy!) for land/studio listings;
  // coerce and treat 0 / non-numeric as "no bedroom count" so we never emit
  // "0 phòng ngủ" / "0-bedroom".
  const bedCount = Number(bedrooms);
  const hasBeds  = Number.isFinite(bedCount) && bedCount > 0;
  if (lang === 'vi') {
    const verb  = forSale ? 'Bán' : 'Cho thuê';
    const t     = type ? localizeType(type, 'vi') : 'Bất động sản';
    const beds  = hasBeds ? ` ${bedCount} phòng ngủ` : '';
    const place = district ? `${localizeDistrict(district, 'vi')}, Đà Nẵng` : 'Đà Nẵng';
    return `${verb} ${t}${beds} tại ${place}`;
  }
  return [
    hasBeds && `${bedCount}-bedroom`,
    type,
    forSale ? 'for sale' : 'for rent',
    district && `in ${district}`,
    'Da Nang',
  ].filter(Boolean).join(' ');
}

// Vietnamese first-photo lead keyphrases. House phrases rotate per listing (by
// slug) so the catalogue collectively targets all three high-volume variants
// without stuffing any single image. Apartments/land use one typed phrase.
const VI_SALE_HOUSE_LEADS = ['Bán Nhà Đà Nẵng', 'Nhà Bán Đà Nẵng', 'Mua Bán Nhà Đà Nẵng'];
const VI_RENT_HOUSE_LEADS = ['Cho thuê Nhà Đà Nẵng', 'Nhà Cho thuê Đà Nẵng', 'Thuê Nhà Đà Nẵng'];

function slugRotate(slug: string, n: number): number {
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (Math.imul(h, 31) + slug.charCodeAt(i)) >>> 0;
  return h % n;
}

/**
 * Vietnamese alt-text prefix for the FIRST listing photo — the image Google is
 * most likely to index for image search. Leads with a high-volume search
 * keyphrase, then appends the specific listing detail (type, beds, district).
 * Intended for /vi pages only; callers pass this just for the first image and
 * fall back to localizedAltPrefix() for the rest and for English.
 */
export function viFirstImageAltPrefix(
  opts: { bedrooms?: number | string | null; type?: string | null; district?: string | null; forSale?: boolean; slug?: string },
): string {
  const { bedrooms, type, district, forSale, slug = '' } = opts;
  const t = (type || '').toLowerCase();
  let lead: string;
  if (forSale) {
    if (t === 'house' || t === 'villa') lead = VI_SALE_HOUSE_LEADS[slugRotate(slug, VI_SALE_HOUSE_LEADS.length)];
    else if (t === 'apartment')         lead = 'Bán Căn Hộ Đà Nẵng';
    else if (t === 'land')              lead = 'Bán Đất Đà Nẵng';
    else                                lead = 'Mua Bán Nhà Đất Đà Nẵng';
  } else {
    if (t === 'house' || t === 'villa') lead = VI_RENT_HOUSE_LEADS[slugRotate(slug, VI_RENT_HOUSE_LEADS.length)];
    else if (t === 'apartment')         lead = 'Cho thuê Căn Hộ Đà Nẵng';
    else if (t === 'land')              lead = 'Cho thuê Đất Đà Nẵng';
    else                                lead = 'Cho thuê Nhà Đà Nẵng';
  }
  // Descriptive tail — no verb, since the lead phrase already carries intent.
  const bedCount = Number(bedrooms);
  const hasBeds  = Number.isFinite(bedCount) && bedCount > 0;
  const typeVi   = type ? localizeType(type, 'vi') : 'Bất động sản';
  const beds     = hasBeds ? ` ${bedCount} phòng ngủ` : '';
  const place    = district ? `${localizeDistrict(district, 'vi')}, Đà Nẵng` : 'Đà Nẵng';
  return `${lead} – ${typeVi}${beds} tại ${place}`;
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

function formatAsUSD(vnd: number): string {
  const usd = Math.round(vnd / VND_RATE);
  return `$${usd.toLocaleString('en-US')}`;
}

/**
 * Extracts a price from free-text listing descriptions when the Price column is empty.
 * Handles VND amounts common in for-sale posts ("X billion VND", "X tỷ", raw 9-digit numbers)
 * and USD/month amounts in rental posts. Returns a "$XXX,XXX" or "$XXX/month" string,
 * or empty string if no extractable price is found.
 */
export function extractPriceFromText(text: string, forSale: boolean): string {
  if (!text) return '';

  if (forSale) {
    // "5.45 billion VND" / "7 Billion VND" / "8.85 billion"
    const billionMatch = text.match(/(\d+(?:[.,]\d+)?)\s*[Bb]illion/);
    if (billionMatch) {
      const vnd = parseFloat(billionMatch[1].replace(',', '.')) * 1_000_000_000;
      return formatAsUSD(vnd);
    }
    // "4.8 tỷ" / "4,8 tỷ"
    const tyMatch = text.match(/(\d+(?:[.,]\d+)?)\s*tỷ/);
    if (tyMatch) {
      const vnd = parseFloat(tyMatch[1].replace(',', '.')) * 1_000_000_000;
      return formatAsUSD(vnd);
    }
    // "4,400,000,000 VND" — raw VND number followed by currency marker
    const rawMatch = text.match(/(\d[\d,]*\d)\s*(?:VND|₫)/);
    if (rawMatch) {
      const vnd = parseFloat(rawMatch[1].replace(/,/g, ''));
      if (vnd >= 100_000_000) return formatAsUSD(vnd);
    }
  } else {
    // Rental: "$500/month" or "$500 per month" embedded in text
    const usdMatch = text.match(/\$\s*(\d[\d,]*)\s*(?:\/\s*month|per\s+month)/i);
    if (usdMatch) {
      return `$${parseInt(usdMatch[1].replace(/,/g, ''), 10).toLocaleString('en-US')}/month`;
    }
  }

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
