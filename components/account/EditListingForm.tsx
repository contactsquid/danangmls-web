'use client';

import { useActionState, useState } from 'react';
import Link from 'next/link';
import { updateListingAction, type ListingActionState } from '@/app/account/listings/actions';
import { inputClass, labelClass, buttonClass, hintClass, FormMessage } from '@/components/account/ui';
import {
  LISTING_FORM_COPY, TYPE_LABELS, SUBMITTABLE_TYPES, SUBMITTABLE_DISTRICTS,
} from '@/lib/listingFormCopy';
import { NEIGHBORHOODS } from '@/lib/neighborhoods';
import { localizeDistrict } from '@/lib/price';
import { accountPaths } from '@/lib/accountCopy';
import type { Lang } from '@/lib/translations';
import type { Listing } from '@/lib/types';

const initial: ListingActionState = {};

// Mirrors MAX_PHOTO_BYTES in app/account/listings/actions.ts + the extension
// allowlist backing extensionFor() in lib/r2.ts — see ListingForm.tsx for why
// this also needs a client-side check, not just the server action's.
const ALLOWED_PHOTO_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_PHOTO_BYTES = 5 * 1024 * 1024;

/** Pulls the numeric part out of a stored price string ("$1,521/month" → 1521).
 *  Sheet prices are always USD, so the currency selector starts on USD; an agent
 *  who switches to VND is entering a fresh amount, not converting this one. */
function priceAmount(price: string): string {
  const digits = price.replace(/[^0-9.]/g, '');
  return digits || '';
}

export default function EditListingForm({ listing, lang }: { listing: Listing; lang: Lang }) {
  const t = LISTING_FORM_COPY[lang];
  const [state, formAction, pending] = useActionState(updateListingAction, initial);

  const [district, setDistrict] = useState(listing.district);
  // The order of this array IS the order the photos will be stored in, so the
  // first entry is the hero. "Set as main" moves an entry to the front rather
  // than storing a separate hero flag — one source of truth, and it matches how
  // the sheet stores them (Image URL 1 first).
  const [images, setImages] = useState<string[]>(listing.images);
  const [addCount, setAddCount] = useState(0);
  const [photoError, setPhotoError] = useState<string | null>(null);

  const neighborhoods = district ? (NEIGHBORHOODS[district] ?? []) : [];
  const listingsHref = lang === 'vi' ? '/vi/tai-khoan/tin-dang' : '/account/listings';

  if (state.url) {
    return (
      <div className="text-center">
        <p className="text-lg font-semibold text-slate-900 mb-2">{t.savedTitle}</p>
        <p className="text-sm text-slate-600 mb-1">
          <a href={state.url} className="text-blue-600 hover:underline break-all">{state.url}</a>
        </p>
        <p className={`${hintClass} mb-6`}>{t.successDelay}</p>
        <Link href={listingsHref} className="text-blue-600 hover:underline text-sm">
          {t.backToListings}
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-6">
      <FormMessage error={photoError ?? state.error} />
      <input type="hidden" name="lang" value={lang} />
      <input type="hidden" name="slug" value={listing.slug} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass} htmlFor="property_type">{t.propertyType}</label>
          <select id="property_type" name="property_type" required defaultValue={listing.type} className={inputClass}>
            {SUBMITTABLE_TYPES.map(v => (
              <option key={v} value={v}>{TYPE_LABELS[lang][v] ?? v}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass} htmlFor="district">{t.district}</label>
          <select
            id="district"
            name="district"
            required
            value={district}
            onChange={e => setDistrict(e.target.value)}
            className={inputClass}
          >
            {SUBMITTABLE_DISTRICTS.map(d => (
              <option key={d} value={d}>{lang === 'vi' ? localizeDistrict(d, 'vi') : d}</option>
            ))}
          </select>
        </div>
      </div>

      {neighborhoods.length > 0 && (
        <div>
          <label className={labelClass} htmlFor="neighborhood">
            {t.neighborhood} <span className="text-slate-400 font-normal">({t.optional})</span>
          </label>
          <select id="neighborhood" name="neighborhood" defaultValue={listing.neighborhood} className={inputClass}>
            <option value="">{t.neighborhoodAny}</option>
            {neighborhoods.map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass} htmlFor="bedrooms">
            {t.bedrooms} <span className="text-slate-400 font-normal">({t.optional})</span>
          </label>
          <input
            id="bedrooms" name="bedrooms" type="number" min="0" max="20"
            defaultValue={listing.bedrooms} className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="price">{t.price}</label>
          <div className="flex gap-2">
            <input
              id="price" name="price" type="text" inputMode="decimal" required
              defaultValue={priceAmount(listing.price)}
              className={`${inputClass} flex-1 min-w-0 text-lg py-3 font-medium`}
            />
            <select
              name="currency" defaultValue="USD" aria-label="Currency"
              className="w-24 shrink-0 rounded-lg border border-slate-300 bg-white px-2 py-3 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            >
              <option value="USD">USD</option>
              <option value="VND">VND</option>
            </select>
          </div>
        </div>
      </div>

      <div>
        <label className={labelClass} htmlFor="title">{t.title}</label>
        <input id="title" name="title" type="text" maxLength={120} defaultValue={listing.title} className={inputClass} />
      </div>

      <div>
        <label className={labelClass} htmlFor="description">{t.description}</label>
        <textarea id="description" name="description" rows={8} required defaultValue={listing.text} className={inputClass} />
      </div>

      {/* Photos: order is meaning. The first is the hero. */}
      <div>
        <span className={labelClass}>{t.photosCurrent}</span>
        <p className={`${hintClass} mb-3`}>{t.heroHint}</p>

        <ul className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {images.map((url, i) => (
            <li key={url} className={`rounded-lg border p-2 ${i === 0 ? 'border-blue-500 bg-blue-50' : 'border-slate-200'}`}>
              <input type="hidden" name="keep_images" value={url} />
              {/* eslint-disable-next-line @next/next/no-img-element -- matches the plain <img> used across this codebase */}
              <img src={url} alt="" className="w-full h-24 object-cover rounded" />
              {i === 0 ? (
                <p className="mt-2 text-xs font-medium text-blue-700 text-center">★ {t.heroLabel}</p>
              ) : (
                <button
                  type="button"
                  onClick={() => setImages(prev => [url, ...prev.filter(u => u !== url)])}
                  className="mt-2 w-full text-xs text-blue-600 hover:underline"
                >
                  {t.heroLabel}
                </button>
              )}
              <button
                type="button"
                onClick={() => setImages(prev => prev.filter(u => u !== url))}
                className="mt-1 w-full text-xs text-slate-400 hover:text-red-600"
              >
                {t.removePhoto}
              </button>
            </li>
          ))}
        </ul>

        {images.length === 0 && (
          <p className="text-sm text-red-600 mt-2">{t.errors.photos}</p>
        )}

        <div className="mt-4">
          <label className={labelClass} htmlFor="photos">{t.addMorePhotos}</label>
          <input
            id="photos" name="photos" type="file" accept="image/jpeg,image/png,image/webp" multiple
            onChange={e => {
              const picked = Array.from(e.target.files ?? []);
              const valid = picked.filter(
                f => ALLOWED_PHOTO_TYPES.includes(f.type) && f.size <= MAX_PHOTO_BYTES,
              );
              if (valid.length < picked.length) {
                const dt = new DataTransfer();
                valid.forEach(f => dt.items.add(f));
                e.target.files = dt.files;
                setPhotoError(t.uploadFailed);
              } else {
                setPhotoError(null);
              }
              setAddCount(valid.length);
            }}
            className="w-full text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:text-sm file:font-medium file:text-slate-700 hover:file:bg-slate-200"
          />
          <p className={hintClass}>
            {addCount > 0 ? `+${addCount}` : `${images.length} / 10`}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button type="submit" disabled={pending || images.length === 0} className={buttonClass}>
          {pending ? t.saving : t.saveChanges}
        </button>
        <Link href={listingsHref} className="text-sm text-slate-500 hover:underline whitespace-nowrap">
          {t.backToListings}
        </Link>
      </div>
    </form>
  );
}
