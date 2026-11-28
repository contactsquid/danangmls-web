import 'server-only';

import { randomUUID } from 'node:crypto';
import { cityName, isKnownCity } from './cities';
import { formatPrice, type ListingSubmission } from './listingSubmit';

/**
 * Cross-city posting (Blake, 2026-11-28). The add form on danangmls / saigonmls /
 * hanoimls defaults to the site's own city but lets an agent post in ANY city in
 * Vietnam. The own-city path is unchanged (buildRow in listingSubmit.ts). This file
 * builds the row for every OTHER city:
 *   - Da Nang / Saigon / Hanoi -> that city's own tabs (so it shows on that city's site)
 *   - any other city           -> the Lotus tabs, with the City column (like lotusmls's form)
 * Layouts are copied from each site's listingSubmit.ts (live-verified headers).
 * IDENTICAL in danangmls-web, saigonmls-web and hanoimls-web: change all three together.
 */

type Dest = 'danang' | 'saigon' | 'hanoi' | 'lotus';
interface Layout { cols: number; idx: Record<string, number>; imageCols: number[] }
interface DestInfo { site: string; contact: string; rent: Layout & { tab: string; postUrlCol: string }; sale: Layout & { tab: string; postUrlCol: string } }

const seq = (from: number, n: number) => Array.from({ length: n }, (_, i) => from + i);
const SALE_IDX = { TITLE: 0, TEXT: 1, PRICE: 2, DISTRICT: 3, BEDROOMS: 4, TYPE: 5, AGENT: 6, CONTACT: 17, MLS_URL: 18, POST_URL: 19, DATE: 20 };
const SALE = { cols: 23, idx: SALE_IDX, imageCols: seq(7, 10), tab: '', postUrlCol: 'T' };
const MLS_RENT_IDX = { TITLE: 0, TEXT: 1, PRICE: 2, DISTRICT: 3, BEDROOMS: 4, TYPE: 5, AGENT: 6, CONTACT: 17, POST_URL: 18, DATE: 19, MLS_URL: 20 };

const DESTS: Record<Dest, DestInfo> = {
  danang: {
    site: 'https://danangmls.com', contact: 'https://danang.homes/contact-us/',
    rent: { tab: 'Sheet1', postUrlCol: 'O', cols: 23, imageCols: [7, 8, 9, 10, 11, 18, 19, 20, 21, 22],
      idx: { TITLE: 0, TEXT: 1, PRICE: 2, DISTRICT: 3, BEDROOMS: 4, TYPE: 5, AGENT: 6, CONTACT: 12, POST_URL: 14, DATE: 15, MLS_URL: 17 } },
    sale: { ...SALE, tab: 'For Sale' },
  },
  saigon: {
    site: 'https://saigonmls.com', contact: 'https://saigonmls.com/contact',
    rent: { tab: 'Saigon For Rent', postUrlCol: 'S', cols: 21, imageCols: seq(7, 10), idx: MLS_RENT_IDX },
    sale: { ...SALE, tab: 'Saigon For Sale' },
  },
  hanoi: {
    site: 'https://hanoimls.com', contact: 'https://hanoimls.com/contact',
    rent: { tab: 'Hanoi For Rent', postUrlCol: 'S', cols: 21, imageCols: seq(7, 10), idx: MLS_RENT_IDX },
    sale: { ...SALE, tab: 'Hanoi For Sale' },
  },
  lotus: {
    site: 'https://lotusmls.com', contact: 'https://lotusmls.com/contact',
    rent: { tab: 'Lotus For Rent', postUrlCol: 'S', cols: 31, imageCols: seq(7, 10), idx: { ...MLS_RENT_IDX, CITY: 30 } },
    sale: { ...SALE, tab: 'Lotus For Sale', cols: 28, idx: { ...SALE_IDX, CITY: 27 } },
  },
};

export const DEST_LIST: Dest[] = ['danang', 'saigon', 'hanoi', 'lotus'];
export const destInfo = (d: Dest): DestInfo => DESTS[d];
export type { Dest };

/** Districts the three city sites accept (their own vocab, = lotusmls public/data/districts). */
export const CITY_SITE_DISTRICTS: Record<string, string[]> = {
  danang: ['Cam Le', 'Hai Chau', 'Hoa Vang', 'Hoi An', 'Lien Chieu', 'Ngu Hanh Son', 'Son Tra', 'Thanh Khe'],
  saigon: ['Binh Chanh', 'Binh Tan', 'Binh Thanh', 'Can Gio', 'Cu Chi', 'District 1', 'District 2', 'District 3', 'District 4', 'District 5', 'District 6', 'District 7', 'District 8', 'District 9', 'District 10', 'District 11', 'District 12', 'Go Vap', 'Hoc Mon', 'Nha Be', 'Phu Nhuan', 'Tan Binh', 'Tan Phu', 'Thu Duc'],
  hanoi: ['Ba Dinh', 'Ba Vi', 'Bac Tu Liem', 'Cau Giay', 'Chuong My', 'Dan Phuong', 'Dong Anh', 'Dong Da', 'Gia Lam', 'Ha Dong', 'Hai Ba Trung', 'Hoai Duc', 'Hoan Kiem', 'Hoang Mai', 'Long Bien', 'Me Linh', 'My Duc', 'Nam Tu Liem', 'Phu Xuyen', 'Phuc Tho', 'Quoc Oai', 'Soc Son', 'Son Tay', 'Tay Ho', 'Thach That', 'Thanh Oai', 'Thanh Tri', 'Thuong Tin', 'Ung Hoa'],
};

export const destFor = (city: string): Dest => (city === 'danang' || city === 'saigon' || city === 'hanoi' ? city : 'lotus');

/** null = fine, otherwise the validation code to report. */
export function checkCityDistrict(city: string, district: string): 'city' | 'district' | null {
  if (!isKnownCity(city)) return 'city';
  const list = CITY_SITE_DISTRICTS[city];
  if (list) return list.includes(district) ? null : 'district';
  return district.trim() && district.length <= 80 ? null : 'district';
}

function slugify(text: string, postUrl: string): string {
  let h = 0;
  for (let i = 0; i < postUrl.length; i++) h = (Math.imul(31, h) + postUrl.charCodeAt(i)) >>> 0;
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60) + '-' + (h.toString(36).slice(0, 6) || '0');
}

function nowForSheet(): string {
  const l = new Date(Date.now() + 7 * 3600 * 1000);
  const p = (n: number, w = 2) => String(n).padStart(w, '0');
  return `${l.getUTCFullYear()}-${p(l.getUTCMonth() + 1)}-${p(l.getUTCDate())}T${p(l.getUTCHours())}:${p(l.getUTCMinutes())}:${p(l.getUTCSeconds())}.${p(l.getUTCMilliseconds(), 3)}+07:00`;
}

function autoTitleFor(s: ListingSubmission, city: string): string {
  const beds = s.bedrooms.trim();
  const bedPart = beds === '0' ? (s.propertyType === 'Apartment' ? 'Studio ' : '')
    : beds.endsWith('+') ? `${beds} Bedroom `
    : Number(beds) > 0 ? `${Number(beds)}-Bedroom ` : '';
  const c = city === 'saigon' ? 'Ho Chi Minh City' : cityName(city, 'en');
  const where = s.district && s.district !== c ? ` in ${s.district}, ${c}` : ` in ${c}`;
  return `${bedPart}${s.propertyType} ${s.forSale ? 'for Sale' : 'for Rent'}${where}`;
}

export interface CrossRow { tab: string; row: string[]; url: string }

export function buildCrossCityRow(s: ListingSubmission, city: string): CrossRow {
  const d = DESTS[destFor(city)];
  const L = s.forSale ? d.sale : d.rent;
  const postUrl = `${d.site}/submitted/${randomUUID()}`;
  const title = s.title.trim() || autoTitleFor(s, city);
  const url = `${d.site}/listing/${slugify(title, postUrl)}`;
  const extras = [
    s.bathrooms && `Bathrooms: ${s.bathrooms}`,
    s.areaSqm && `Area: ${s.areaSqm} m²`,
    s.neighborhood && `Neighborhood: ${s.neighborhood}`,
    !s.forSale && s.minTerm && `Minimum term: ${s.minTerm}`,
  ].filter(Boolean).join(' · ');
  const row = new Array<string>(L.cols).fill('');
  const set = (k: string, v: string) => { if (L.idx[k] !== undefined) row[L.idx[k]] = v; };
  set('TITLE', title);
  set('TEXT', extras ? `${s.description.trim()}\n\n${extras}` : s.description.trim());
  set('PRICE', formatPrice(s.priceAmount, s.priceCurrency, s.forSale));
  set('DISTRICT', s.district.trim());
  set('BEDROOMS', s.bedrooms || '');
  set('TYPE', s.propertyType);
  set('AGENT', s.agentName.trim());
  set('CONTACT', d.contact);
  set('POST_URL', postUrl);
  set('DATE', nowForSheet());
  set('MLS_URL', url);
  set('CITY', destFor(city) === 'lotus' ? city : '');
  s.imageUrls.slice(0, 10).forEach((u, i) => { row[L.imageCols[i]] = u; });
  return { tab: L.tab, row, url };
}
