import { VND_RATE, KRW_RATE, RUB_RATE, priceLow } from '../price';

type Lang = 'en' | 'vi' | 'ko' | 'ru';

// One decimal below 10, whole numbers above: "1.2k", "262k", "6,9 tỷ", "17 tr".
function compact(n: number, decimalComma = false): string {
  const v = n >= 10 ? Math.round(n) : Math.round(n * 10) / 10;
  const s = String(v);
  return decimalComma ? s.replace('.', ',') : s;
}

/** The price as a map pin label: the low end of the listing's USD price, shortened
 *  and converted to the page language's currency. Null when the price has no number. */
export function shortPrice(price: string, lang: Lang): string | null {
  const usd = priceLow(price);
  if (!(usd > 0)) return null;

  if (lang === 'vi') {
    const vnd = usd * VND_RATE;
    return vnd >= 1e9 ? `${compact(vnd / 1e9, true)} tỷ` : `${compact(vnd / 1e6, true)} tr`;
  }
  if (lang === 'ko') {
    const krw = usd * KRW_RATE;
    return krw >= 1e8 ? `${compact(krw / 1e8)}억` : `${Math.round(krw / 1e4)}만`;
  }
  if (lang === 'ru') {
    const rub = usd * RUB_RATE;
    return rub >= 1e6 ? `${compact(rub / 1e6, true)} млн` : `${Math.round(rub / 1e3)} тыс`;
  }
  if (usd >= 1e6) return `$${compact(usd / 1e6)}M`;
  if (usd >= 1e3) return `$${compact(usd / 1e3)}k`;
  return `$${Math.round(usd)}`;
}
