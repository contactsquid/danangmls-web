import 'server-only';

import { randomUUID } from 'node:crypto';
import { VALID_DISTRICTS, VALID_TYPES } from './sheets';

/**
 * Turns an agent's form submission into a row for the listings Google Sheet.
 *
 * The sheet is still the single source of truth for listings — the portal
 * appends to the very same tabs the Facebook scrapers write to, so a
 * portal-submitted listing renders, filters, and ranks exactly like a scraped
 * one with no special-casing anywhere in the read path.
 *
 * Column positions are duplicated from lib/sheets.ts on purpose: that file's
 * constants are private to its parser, and a writer that silently drifted from
 * the reader would corrupt rows. Both are pinned by the live-verified header in
 * the memory notes; if the sheet ever changes shape, change both together.
 */

/** Matches lib/price.ts. Kept in sync deliberately — a different rate here
 *  would make portal listings price-sort inconsistently against scraped ones. */
const VND_RATE = 26300;

const CONTACT_URL = 'https://danang.homes/contact-us/';
const SITE = 'https://danangmls.com';

/** Sheet1 (rentals) column order, 0-indexed. */
const RENTAL_COLUMNS = 23;
const R_IDX = {
  TITLE: 0, TEXT: 1, PRICE: 2, DISTRICT: 3, BEDROOMS: 4, TYPE: 5, AGENT: 6,
  IMG1: 7, CONTACT: 12, POST_URL: 14, DATE: 15, MLS_URL: 17, IMG6: 18,
} as const;

/** For Sale column order, 0-indexed. Note it differs from Sheet1: all ten image
 *  columns are contiguous, and Contact/MLS/Post URL/Date sit after them. */
const SALE_COLUMNS = 23;
const S_IDX = {
  TITLE: 0, TEXT: 1, PRICE: 2, DISTRICT: 3, BEDROOMS: 4, TYPE: 5, AGENT: 6,
  IMG1: 7, CONTACT: 17, MLS_URL: 18, POST_URL: 19, DATE: 20,
} as const;

export const RENTAL_TAB = 'Sheet1';
export const SALE_TAB = 'For Sale';

export interface ListingSubmission {
  forSale: boolean;
  propertyType: string;
  district: string;
  neighborhood: string;
  bedrooms: string;
  bathrooms: string;
  areaSqm: string;
  priceAmount: number;
  priceCurrency: 'USD' | 'VND';
  title: string;
  description: string;
  /** Public R2 URLs, already uploaded. At least one is required — a listing
   *  with no servable image is hidden by isServableImage in lib/sheets.ts. */
  imageUrls: string[];
  agentName: string;
}

/** Mirrors slugify() in lib/sheets.ts. We also write the DanangMLS URL column,
 *  which takes precedence via mlsUrlToSlug, so this only has to agree with the
 *  reader — it is not the thing that pins the slug. */
function slugify(text: string, postUrl: string): string {
  let h = 0;
  for (let i = 0; i < postUrl.length; i++) {
    h = (Math.imul(31, h) + postUrl.charCodeAt(i)) >>> 0;
  }
  const suffix = h.toString(36).slice(0, 6) || '0';
  return (
    text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60) +
    '-' + suffix
  );
}

/** Sheet prices are USD strings: "$1,140/month" for rentals, "$294,500" for
 *  sales (both live-verified). Agents may enter VND, which is converted here so
 *  every row in the sheet stays one currency — the site does its own VND display
 *  conversion at render time. */
export function formatPrice(amount: number, currency: 'USD' | 'VND', forSale: boolean): string {
  const usd = currency === 'VND' ? amount / VND_RATE : amount;
  const rounded = Math.round(usd);
  return `$${rounded.toLocaleString('en-US')}${forSale ? '' : '/month'}`;
}

/** M/D/YYYY, matching what the sheet already holds. Written with
 *  valueInputOption=USER_ENTERED so Sheets stores a real date, not text. */
function todayForSheet(): string {
  const now = new Date();
  return `${now.getMonth() + 1}/${now.getDate()}/${now.getFullYear()}`;
}

/** A listing that came through the portal has no Facebook post behind it, but
 *  Post URL is the sheet's de-facto unique key (dedupe-listings.js matches on
 *  it, and slugify hashes it), so it needs a stable unique value. Nothing
 *  renders it as a link — it is only read for slug hashing and Facebook-group
 *  detection, and the latter correctly yields "not from a known group". */
function submissionPostUrl(): string {
  return `${SITE}/submitted/${randomUUID()}`;
}

/** Auto-title for agents who leave it blank, in the house style of scraped
 *  titles ("3-Bedroom House for Rent in Hai Chau, Da Nang"). */
export function autoTitle(s: Pick<ListingSubmission, 'bedrooms' | 'propertyType' | 'district' | 'forSale'>): string {
  const beds = Number(s.bedrooms);
  const bedPart = Number.isFinite(beds) && beds > 0 ? `${beds}-Bedroom ` : '';
  const action = s.forSale ? 'for Sale' : 'for Rent';
  const where = s.district && s.district !== 'Da Nang' ? ` in ${s.district}, Da Nang` : ' in Da Nang';
  return `${bedPart}${s.propertyType} ${action}${where}`;
}

export type ValidationCode =
  | 'type' | 'district' | 'price' | 'rentRange' | 'saleRange'
  | 'description' | 'photos' | 'agentName';

export interface ValidationResult {
  ok: boolean;
  /** A code rather than a message: the form is bilingual, so the wording lives
   *  in lib/listingFormCopy.ts and is chosen by the caller's language. */
  code?: ValidationCode;
}

export function validateSubmission(s: ListingSubmission): ValidationResult {
  if (!VALID_TYPES.has(s.propertyType)) return { ok: false, code: 'type' };
  if (!VALID_DISTRICTS.has(s.district)) return { ok: false, code: 'district' };
  if (!Number.isFinite(s.priceAmount) || s.priceAmount <= 0) return { ok: false, code: 'price' };
  // A VND price typed as USD (or vice versa) is the most likely data-entry
  // error, and it poisons price filters for everyone. These bounds are wide
  // enough to allow anything real in this market.
  const usd = s.priceCurrency === 'VND' ? s.priceAmount / VND_RATE : s.priceAmount;
  if (!s.forSale && (usd < 30 || usd > 20_000)) return { ok: false, code: 'rentRange' };
  if (s.forSale && (usd < 5_000 || usd > 20_000_000)) return { ok: false, code: 'saleRange' };
  if (s.description.trim().length < 30) return { ok: false, code: 'description' };
  if (s.imageUrls.length === 0) return { ok: false, code: 'photos' };
  if (!s.agentName.trim()) return { ok: false, code: 'agentName' };
  return { ok: true };
}

export interface BuiltRow {
  tab: string;
  row: string[];
  slug: string;
  url: string;
}

/** Builds the positional row. Every cell from column A is present — `values.append`
 *  aligns to the first column of the range, so a sparse array would shift data
 *  into the wrong columns (the bug behind danangmls-rentals-missing-date-fix). */
export function buildRow(s: ListingSubmission): BuiltRow {
  const postUrl = submissionPostUrl();
  const title = s.title.trim() || autoTitle(s);
  const slug = slugify(title, postUrl);
  const url = `${SITE}/listing/${slug}`;
  const price = formatPrice(s.priceAmount, s.priceCurrency, s.forSale);
  const date = todayForSheet();

  // Details the sheet has no dedicated column for are appended to the body text,
  // which is what the scraped rows do too — the site renders and searches it.
  const extras = [
    s.bathrooms && `Bathrooms: ${s.bathrooms}`,
    s.areaSqm && `Area: ${s.areaSqm} m²`,
    s.neighborhood && `Neighbourhood: ${s.neighborhood}`,
  ].filter(Boolean).join(' · ');
  const text = extras ? `${s.description.trim()}\n\n${extras}` : s.description.trim();

  const width = s.forSale ? SALE_COLUMNS : RENTAL_COLUMNS;
  const row = new Array<string>(width).fill('');

  const idx = s.forSale ? S_IDX : R_IDX;
  row[idx.TITLE]    = title;
  row[idx.TEXT]     = text;
  row[idx.PRICE]    = price;
  row[idx.DISTRICT] = s.district;
  row[idx.BEDROOMS] = s.bedrooms || '';
  row[idx.TYPE]     = s.propertyType;
  row[idx.AGENT]    = s.agentName.trim();
  row[idx.CONTACT]  = CONTACT_URL;
  row[idx.POST_URL] = postUrl;
  row[idx.DATE]     = date;
  row[idx.MLS_URL]  = url;

  if (s.forSale) {
    // For Sale: images occupy ten contiguous columns from IMG1.
    s.imageUrls.slice(0, 10).forEach((u, i) => { row[S_IDX.IMG1 + i] = u; });
  } else {
    // Sheet1: images 1-5 are contiguous, then 6-10 restart further along.
    s.imageUrls.slice(0, 5).forEach((u, i) => { row[R_IDX.IMG1 + i] = u; });
    s.imageUrls.slice(5, 10).forEach((u, i) => { row[R_IDX.IMG6 + i] = u; });
  }

  return { tab: s.forSale ? SALE_TAB : RENTAL_TAB, row, slug, url };
}
