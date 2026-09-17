// Handing sub-floor rental leads to the agent who actually holds the listing.
//
// Measured 2026-09-17: 70.2% of rentals (3,461 of 4,928) are below Blake's
// 25,000,000 ₫/month service floor. Every one of them used to show the agency's
// single phone number, so a customer who wanted a 12,000,000 ₫ house reached
// DanangMLS and was sent back to Facebook. 91.7% of those listings already carry
// the agent's own number in Sheet1 col Y, harvested by n8n from the raw post text
// before enrichment rewrites it.
//
// Rentals only, and only below the floor: at or above it the lead is one Blake
// wants, and nothing changes.

import { KO_DISTRICTS, RU_DISTRICTS } from './price';
import { ruPlural, type Lang } from './translations';

const VND_RATE = 26300;                       // matches lib/price.ts
const SERVICE_FLOOR_VND = 25_000_000;         // Blake's monthly floor
const SERVICE_FLOOR_USD = SERVICE_FLOOR_VND / VND_RATE;   // ≈ $951

/**
 * Normalises a Vietnamese mobile number to its 9 local digits ("905897639"),
 * or '' if it isn't one.
 *
 * The sheet holds these in every shape agents type them — "0905.897.639",
 * "+84 905 897 639", "84905897639". A VN mobile is 0 + 9 digits, and the 9-digit
 * local part starts 3/5/7/8/9; landlines and malformed entries are rejected
 * rather than guessed at, because a wrong number is worse than none.
 */
export function normalizeVnPhone(raw: string | undefined | null): string {
  const digits = String(raw ?? '').replace(/\D/g, '');
  if (!digits) return '';
  // Strip a country code or trunk prefix, whichever is present.
  let local = digits;
  if (local.startsWith('84')) local = local.slice(2);
  else if (local.startsWith('0')) local = local.slice(1);
  if (local.length !== 9) return '';
  if (!/^[35789]/.test(local)) return '';
  return local;
}

/** "+84 905 897 639" — display form. */
export function formatVnPhone(local9: string): string {
  if (local9.length !== 9) return local9;
  return `+84 ${local9.slice(0, 3)} ${local9.slice(3, 6)} ${local9.slice(6)}`;
}

/** Parses the sheet's USD price string to a number. Ranges take the low end. */
function priceToUsd(price: string): number | null {
  const m = String(price || '').match(/\$?([\d,]+(?:\.\d+)?)/);
  if (!m) return null;
  const n = parseFloat(m[1].replace(/,/g, ''));
  return Number.isFinite(n) && n > 0 ? n : null;
}

/**
 * True when this listing's rent is below the service floor, i.e. the lead should
 * go to the agent. Unparseable prices return false — defaulting to "keep it" is
 * the safe direction, since the cost of wrongly handing away a premium lead is
 * higher than the cost of one sub-floor lead still reaching Blake.
 */
export function isBelowServiceFloor(listing: { price: string; forSale: boolean }): boolean {
  if (listing.forSale) return false;
  const usd = priceToUsd(listing.price);
  if (usd === null) return false;
  return usd < SERVICE_FLOOR_USD;
}

/** Opens a Zalo chat. Zalo is keyed on the phone number and is effectively
 *  universal among Vietnamese agents, which is why it leads. */
export function zaloLink(local9: string): string {
  return `https://zalo.me/84${local9}`;
}

export function telLink(local9: string): string {
  return `tel:+84${local9}`;
}

export type EnquiryListing = {
  slug: string;
  bedrooms?: string;
  district?: string;
  type?: string;
};

function listingUrl(slug: string): string {
  return `https://danangmls.com/listing/${slug}`;
}

/**
 * The Vietnamese wording of the enquiry — now used only for `/vi` readers, via
 * enquiryFor(). It was briefly what every locale sent, on the reasoning that the
 * agent reads Vietnamese; see enquiryFor() for why that was wrong.
 *
 * It deliberately leads with the DanangMLS link. That is what earns the site
 * credit for the introduction and gives the agent a reason to post here directly,
 * instead of the customer arriving with no idea where the lead came from.
 */
export function enquiryVi(listing: EnquiryListing): string {
  const url = listingUrl(listing.slug);
  const beds = String(listing.bedrooms || '').trim();
  const where = VI_DISTRICT[String(listing.district || '').trim()] || '';

  // "căn 3 phòng ngủ ở Ngũ Hành Sơn" — modifier follows the noun, which is the
  // most visible tell when this kind of copy is written by translating English.
  let what = 'tin đăng này';
  if (beds && where) what = `căn ${beds} phòng ngủ ở ${where}`;
  else if (beds) what = `căn ${beds} phòng ngủ`;
  else if (where) what = `căn ở ${where}`;

  return `Chào anh/chị, tôi quan tâm đến ${what} trên DanangMLS:\n${url}\nCăn này còn trống không ạ?`;
}

// Accented district names for the enquiry text. The sheet stores unaccented
// English forms; an agent reads the accented Vietnamese.
const VI_DISTRICT: Record<string, string> = {
  'Hai Chau': 'Hải Châu',
  'Thanh Khe': 'Thanh Khê',
  'Son Tra': 'Sơn Trà',
  'Ngu Hanh Son': 'Ngũ Hành Sơn',
  'Lien Chieu': 'Liên Chiểu',
  'Cam Le': 'Cẩm Lệ',
  'Hoi An': 'Hội An',
  'Hoa Vang': 'Hòa Vang',
  'Da Nang': 'Đà Nẵng',
};

/**
 * The enquiry to send the agent, in the CUSTOMER's own language.
 *
 * This started out as Vietnamese-only, on the reasoning that the agent reads
 * Vietnamese. Blake overruled it, and he is right: the customer is going to want
 * to continue the conversation in their own language, so opening in Vietnamese
 * buys one fluent message and then a reply the customer cannot read. Starting in
 * their language sets the expectation honestly from the first line, and the agent
 * translates either way.
 *
 * The DanangMLS link carries the attribution regardless of language — it is the
 * part that earns the site credit for the introduction — so nothing is lost by
 * dropping the Vietnamese, and /vi gets the block too now.
 */
export function enquiryFor(listing: EnquiryListing, lang: Lang): string {
  if (lang === 'vi') return enquiryVi(listing);
  const url = listingUrl(listing.slug);
  const beds = String(listing.bedrooms || '').trim();
  const dist = String(listing.district || '').trim();
  const n = Number(beds);
  const hasBeds = Boolean(beds) && Number.isFinite(n) && n > 0;

  if (lang === 'ko') {
    const where = KO_DISTRICTS[dist] || dist;
    const what = hasBeds && where ? `${where}의 침실 ${beds}개 매물`
               : hasBeds          ? `침실 ${beds}개 매물`
               : where            ? `${where} 매물`
               :                    '이 매물';
    return `안녕하세요. DanangMLS에서 ${what}을 보았습니다:\n${url}\n아직 임대 가능한가요?`;
  }

  if (lang === 'ru') {
    const where = RU_DISTRICTS[dist] || dist;
    // Transliterated district names would need prepositional-case inflection after
    // "в", which these nominative forms do not carry. The parenthetical keeps the
    // name uninflected and the sentence grammatical.
    const bedsPart = hasBeds ? `${beds} ${ruPlural(n, 'спальня', 'спальни', 'спален')}` : '';
    const inner = [bedsPart, where].filter(Boolean).join(', ');
    const what = inner ? `объект (${inner})` : 'этот объект';
    return `Здравствуйте! Меня интересует ${what} на DanangMLS:\n${url}\nОн ещё свободен?`;
  }

  const what = hasBeds && dist ? `the ${beds}-bedroom place in ${dist}`
             : hasBeds        ? `the ${beds}-bedroom place`
             : dist           ? `the place in ${dist}`
             :                  'this listing';
  return `Hi, I'm interested in ${what} on DanangMLS:\n${url}\nIs it still available?`;
}
