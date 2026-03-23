// Approximate VND/USD rate (matches the AI enrichment pipeline's conversion)
const VND_RATE = 26300;

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
