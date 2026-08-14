'use server';

import { randomUUID } from 'node:crypto';
import { revalidatePath } from 'next/cache';
import { getOwnProfile } from '@/lib/agents';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { r2Upload, extensionFor, isR2Configured } from '@/lib/r2';
import { appendRow, findRowByColumn, readRow, updateRow, isSheetsConfigured } from '@/lib/googleSheets';
import {
  buildRow, validateSubmission, formatPrice, sheetShape, type ListingSubmission,
} from '@/lib/listingSubmit';
import { getMyListing } from '@/lib/myListings';
import { LISTING_FORM_COPY } from '@/lib/listingFormCopy';
import type { Lang } from '@/lib/translations';

export interface ListingActionState {
  error?: string;
  /** Set on success — the public URL of the listing. */
  url?: string;
  /** True when the success was an edit rather than a new listing, so the form
   *  can say "saved" instead of "published". */
  edited?: boolean;
}

const MAX_PHOTO_BYTES = 5 * 1024 * 1024;
const MAX_PHOTOS = 10;

function str(form: FormData, key: string): string {
  const v = form.get(key);
  return typeof v === 'string' ? v.trim() : '';
}

/**
 * Publishes an agent's listing: photos to R2, then one row appended to the
 * Google Sheet.
 *
 * Moderation is post-hoc by design (Blake, 2026-08-13) — a signed-in agent's
 * listing goes live immediately, exactly like the profile itself. There is no
 * approval queue to wait in. Note this needs NO name-claim verification: a
 * listing posted here is owned by the account that posted it, which is precisely
 * the case the claim gate exists to cover for *scraped* listings.
 */
export async function submitListingAction(
  _prev: ListingActionState,
  form: FormData,
): Promise<ListingActionState> {
  const lang: Lang = str(form, 'lang') === 'vi' ? 'vi' : 'en';
  const t = LISTING_FORM_COPY[lang];

  if (!isSupabaseConfigured || !isR2Configured || !isSheetsConfigured) {
    return { error: t.notConfigured };
  }

  // Authorisation is re-checked here rather than trusted from the page: a server
  // action is a public endpoint, reachable without ever rendering the form.
  const profile = await getOwnProfile();
  if (!profile) return { error: t.mustSignIn };
  if (profile.status !== 'active') return { error: t.mustSignIn };
  if (!profile.display_name.trim()) return { error: t.needsName };

  const forSale = str(form, 'deal') === 'sale';

  // ─── Photos ─────────────────────────────────────────────────────────────────
  const files = form.getAll('photos').filter((f): f is File => f instanceof File && f.size > 0);
  if (files.length === 0) return { error: t.errors.photos };

  const imageUrls: string[] = [];
  try {
    for (const file of files.slice(0, MAX_PHOTOS)) {
      if (file.size > MAX_PHOTO_BYTES) return { error: t.uploadFailed };
      const ext = extensionFor(file.type);
      if (!ext) return { error: t.uploadFailed };

      const buffer = Buffer.from(await file.arrayBuffer());
      // Foldered by agent so a spam account's uploads can be found and removed
      // as a set. The extension is required — isServableImage rejects
      // extension-less images.danang.homes URLs.
      const key = `agent-listings/${profile.slug}/${randomUUID()}.${ext}`;
      imageUrls.push(await r2Upload(buffer, file.type, key));
    }
  } catch (err) {
    console.error('[listing-submit] photo upload failed:', err);
    return { error: t.uploadFailed };
  }

  // ─── Build + validate ───────────────────────────────────────────────────────
  const submission: ListingSubmission = {
    forSale,
    propertyType: str(form, 'property_type'),
    district: str(form, 'district'),
    neighborhood: str(form, 'neighborhood'),
    bedrooms: str(form, 'bedrooms'),
    bathrooms: str(form, 'bathrooms'),
    areaSqm: str(form, 'area_sqm'),
    priceAmount: Number(str(form, 'price').replace(/[^0-9.]/g, '')),
    priceCurrency: str(form, 'currency') === 'VND' ? 'VND' : 'USD',
    title: str(form, 'title'),
    description: str(form, 'description'),
    imageUrls,
    agentName: profile.display_name,
  };

  const check = validateSubmission(submission);
  if (!check.ok && check.code) return { error: t.errors[check.code] };

  // ─── Append ─────────────────────────────────────────────────────────────────
  const built = buildRow(submission);
  try {
    await appendRow(built.tab, built.row);
  } catch (err) {
    console.error('[listing-submit] sheet append failed:', err);
    return { error: t.sheetFailed };
  }

  // The agent's own profile should show the new listing as soon as the sheet
  // cache turns over; nudging these paths avoids serving a stale render of the
  // pages they will look at first.
  revalidatePath(`/agent/${profile.slug}`);
  revalidatePath(`/vi/moi-gioi/${profile.slug}`);

  return { url: built.url };
}

// ─── Editing ──────────────────────────────────────────────────────────────────

/**
 * Updates a listing the agent posted through the portal.
 *
 * Patches only the cells it owns and writes the rest of the row back untouched,
 * so columns this app knows nothing about survive. Three things are deliberately
 * never changed:
 *   • Post URL — the row's identity, and what finds it again next time.
 *   • DanangMLS URL — pins the slug, so editing a title cannot change the public
 *     address of a listing that may already be indexed or shared.
 *   • Date — "Listed" should reflect when it was listed, not last edited.
 */
export async function updateListingAction(
  _prev: ListingActionState,
  form: FormData,
): Promise<ListingActionState> {
  const lang: Lang = str(form, 'lang') === 'vi' ? 'vi' : 'en';
  const t = LISTING_FORM_COPY[lang];

  if (!isSupabaseConfigured || !isR2Configured || !isSheetsConfigured) {
    return { error: t.notConfigured };
  }

  const profile = await getOwnProfile();
  if (!profile || profile.status !== 'active') return { error: t.mustSignIn };

  const slug = str(form, 'slug');
  const existing = await getMyListing(profile.slug, slug);
  // Null covers both "not yours" and "does not exist" — same answer either way,
  // so this cannot be used to probe which listings exist.
  if (!existing) return { error: t.notYours };

  // Images: the agent reorders/removes existing ones and may add more. The order
  // submitted IS the display order, so the hero is simply whichever is first.
  const keptImages = form.getAll('keep_images').filter((v): v is string => typeof v === 'string');
  const ordered = keptImages.filter(url => existing.images.includes(url));

  const newFiles = form.getAll('photos').filter((f): f is File => f instanceof File && f.size > 0);
  const uploaded: string[] = [];
  try {
    for (const file of newFiles.slice(0, MAX_PHOTOS - ordered.length)) {
      if (file.size > MAX_PHOTO_BYTES) return { error: t.uploadFailed };
      const ext = extensionFor(file.type);
      if (!ext) return { error: t.uploadFailed };
      const buffer = Buffer.from(await file.arrayBuffer());
      const key = `agent-listings/${profile.slug}/${randomUUID()}.${ext}`;
      uploaded.push(await r2Upload(buffer, file.type, key));
    }
  } catch (err) {
    console.error('[listing-edit] photo upload failed:', err);
    return { error: t.uploadFailed };
  }

  const images = [...ordered, ...uploaded].slice(0, MAX_PHOTOS);
  // Removing every photo would hide the listing entirely (isServableImage), so
  // it is refused rather than silently unpublishing it.
  if (images.length === 0) return { error: t.errors.photos };

  const forSale = existing.forSale;
  const submission: ListingSubmission = {
    forSale,
    propertyType: str(form, 'property_type'),
    district: str(form, 'district'),
    neighborhood: str(form, 'neighborhood'),
    bedrooms: str(form, 'bedrooms'),
    bathrooms: '',
    areaSqm: '',
    priceAmount: Number(str(form, 'price').replace(/[^0-9.]/g, '')),
    priceCurrency: str(form, 'currency') === 'VND' ? 'VND' : 'USD',
    title: str(form, 'title'),
    description: str(form, 'description'),
    imageUrls: images,
    agentName: profile.display_name,
  };

  const check = validateSubmission(submission);
  if (!check.ok && check.code) return { error: t.errors[check.code] };

  try {
    const { tab, postUrlColumn, indices } = sheetShape(forSale);
    const rowNumber = await findRowByColumn(tab, postUrlColumn, existing.postUrl);
    if (!rowNumber) {
      console.error(`[listing-edit] no row found for postUrl ${existing.postUrl}`);
      return { error: t.sheetFailed };
    }

    const row = await readRow(tab, rowNumber);
    row[indices.TITLE]    = submission.title.trim() || existing.title;
    row[indices.TEXT]     = submission.description.trim();
    row[indices.PRICE]    = formatPrice(submission.priceAmount, submission.priceCurrency, forSale);
    row[indices.DISTRICT] = submission.district;
    row[indices.BEDROOMS] = submission.bedrooms || '';
    row[indices.TYPE]     = submission.propertyType;

    // Clear every image cell first: a listing edited from eight photos down to
    // three must not keep the stale five.
    for (const i of indices.IMAGE_COLUMNS) row[i] = '';
    indices.IMAGE_COLUMNS.forEach((col, i) => { row[col] = images[i] ?? ''; });

    await updateRow(tab, rowNumber, row);
  } catch (err) {
    console.error('[listing-edit] sheet update failed:', err);
    return { error: t.sheetFailed };
  }

  revalidatePath(`/listing/${existing.slug}`);
  revalidatePath(`/vi/listing/${existing.slug}`);
  revalidatePath(`/agent/${profile.slug}`);
  revalidatePath(`/vi/moi-gioi/${profile.slug}`);

  return { url: `https://danangmls.com/listing/${existing.slug}`, edited: true };
}
