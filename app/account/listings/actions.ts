'use server';

import { randomUUID } from 'node:crypto';
import { revalidatePath } from 'next/cache';
import { getOwnProfile } from '@/lib/agents';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { r2Upload, extensionFor, isR2Configured } from '@/lib/r2';
import { appendRow, isSheetsConfigured } from '@/lib/googleSheets';
import { buildRow, validateSubmission, type ListingSubmission } from '@/lib/listingSubmit';
import { LISTING_FORM_COPY } from '@/lib/listingFormCopy';
import type { Lang } from '@/lib/translations';

export interface ListingActionState {
  error?: string;
  /** Set on success — the public URL of the new listing. */
  url?: string;
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
