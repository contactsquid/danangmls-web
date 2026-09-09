'use client';

import { forLang } from '@/lib/translations';

import { useActionState, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { submitListingAction, type ListingActionState } from '@/app/account/listings/actions';
import { inputClass, labelClass, buttonClass, hintClass, FormMessage } from '@/components/account/ui';
import {
  LISTING_FORM_COPY, TYPE_LABELS, SUBMITTABLE_TYPES, SUBMITTABLE_DISTRICTS,
} from '@/lib/listingFormCopy';
import { NEIGHBORHOODS } from '@/lib/neighborhoods';
import { localizeDistrict } from '@/lib/price';
import type { Lang } from '@/lib/translations';

const initial: ListingActionState = {};

// Mirrors MAX_PHOTO_BYTES in app/account/listings/actions.ts + the extension
// allowlist backing extensionFor() in lib/r2.ts. Checked here too so bad
// files never reach the server action — with up to 10 photos in one
// multipart body, it's easy to trip next.config.ts's serverActions
// bodySizeLimit ('6mb') before the action's own per-file checks ever run,
// which surfaces as a raw crash instead of our nice inline error.
const ALLOWED_PHOTO_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_PHOTO_BYTES = 5 * 1024 * 1024;

export default function ListingForm({ lang, profileSlug }: { lang: Lang; profileSlug: string }) {
  const t = forLang(LISTING_FORM_COPY, lang);
  const [state, formAction, pending] = useActionState(submitListingAction, initial);

  const [forSale, setForSale] = useState(false);
  const [district, setDistrict] = useState('');
  // The order of this array IS the order photos are submitted in (and so the
  // order they land in the sheet's Image URL columns) — same "order is
  // meaning, first is the hero" model as EditListingForm.tsx. The <input>
  // itself stays uncontrolled (the server action reads its FormData
  // directly), so every reorder/remove rebuilds its FileList to match.
  const [photos, setPhotos] = useState<File[]>([]);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const previews = useMemo(() => photos.map(f => URL.createObjectURL(f)), [photos]);
  useEffect(() => () => previews.forEach(url => URL.revokeObjectURL(url)), [previews]);

  function syncFileInput(files: File[]) {
    const dt = new DataTransfer();
    files.forEach(f => dt.items.add(f));
    if (fileInputRef.current) fileInputRef.current.files = dt.files;
  }

  function movePhoto(index: number, dir: -1 | 1) {
    setPhotos(prev => {
      const target = index + dir;
      if (target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      [next[index], next[target]] = [next[target], next[index]];
      syncFileInput(next);
      return next;
    });
  }

  function removePhoto(index: number) {
    setPhotos(prev => {
      const next = prev.filter((_, i) => i !== index);
      syncFileInput(next);
      return next;
    });
  }

  // Neighbourhood options follow the district, exactly like the listing search
  // filters do (components/ListingsGrid.tsx) — same source of truth.
  const neighborhoods = district ? (NEIGHBORHOODS[district] ?? []) : [];

  const profileHref = lang === 'vi' ? `/vi/moi-gioi/${profileSlug}` : `/agent/${profileSlug}`;

  if (state.url) {
    return (
      <div className="text-center">
        <p className="text-lg font-semibold text-slate-900 mb-2">{t.successTitle}</p>
        <p className="text-sm text-slate-600 mb-1">
          <a href={state.url} className="text-blue-600 hover:underline break-all">{state.url}</a>
        </p>
        <p className={`${hintClass} mb-6`}>{t.successDelay}</p>
        <div className="flex flex-wrap gap-3 justify-center">
          {/* A full reload rather than a router push: useActionState keeps the
              success state otherwise, and the agent lands on a "published"
              screen instead of an empty form. */}
          <a href={typeof window === 'undefined' ? '#' : window.location.pathname} className={`${buttonClass} w-auto px-4 inline-block text-center`}>
            {t.addAnother}
          </a>
          <Link
            href={profileHref}
            className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            {t.viewProfile}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-6">
      <FormMessage error={photoError ?? state.error} />
      <input type="hidden" name="lang" value={lang} />

      {/* Rent vs sale — drives price semantics, and which sheet tab the row
          lands in. */}
      <fieldset>
        <legend className={labelClass}>{t.dealType}</legend>
        <div className="grid grid-cols-2 gap-3">
          {[
            { value: 'rent', label: t.forRent, active: !forSale },
            { value: 'sale', label: t.forSale, active: forSale },
          ].map(opt => (
            <label
              key={opt.value}
              className={`cursor-pointer rounded-lg border px-4 py-2.5 text-center text-sm font-medium transition-colors ${
                opt.active
                  ? 'border-blue-600 bg-blue-50 text-blue-700'
                  : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              <input
                type="radio"
                name="deal"
                value={opt.value}
                checked={opt.active}
                onChange={() => setForSale(opt.value === 'sale')}
                className="sr-only"
              />
              {opt.label}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass} htmlFor="property_type">{t.propertyType}</label>
          <select id="property_type" name="property_type" required defaultValue="" className={inputClass}>
            <option value="" disabled>{t.choose}</option>
            {SUBMITTABLE_TYPES.map(v => (
              <option key={v} value={v}>{forLang(TYPE_LABELS, lang)[v] ?? v}</option>
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
            <option value="" disabled>{t.choose}</option>
            {SUBMITTABLE_DISTRICTS.map(d => (
              <option key={d} value={d}>{lang === 'vi' ? localizeDistrict(d, 'vi') : d}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Only rendered once a district with known wards is chosen — same rule as
          the search filters, so agents never face an empty dropdown. */}
      {neighborhoods.length > 0 && (
        <div>
          <label className={labelClass} htmlFor="neighborhood">
            {t.neighborhood} <span className="text-slate-400 font-normal">({t.optional})</span>
          </label>
          <select id="neighborhood" name="neighborhood" defaultValue="" className={inputClass}>
            <option value="">{t.neighborhoodAny}</option>
            {neighborhoods.map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div>
          <label className={labelClass} htmlFor="bedrooms">
            {t.bedrooms} <span className="text-slate-400 font-normal">({t.optional})</span>
          </label>
          <input id="bedrooms" name="bedrooms" type="number" min="0" max="20" className={inputClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="bathrooms">
            {t.bathrooms} <span className="text-slate-400 font-normal">({t.optional})</span>
          </label>
          <input id="bathrooms" name="bathrooms" type="number" min="0" max="20" className={inputClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="area_sqm">
            {t.area} <span className="text-slate-400 font-normal">({t.optional})</span>
          </label>
          <input id="area_sqm" name="area_sqm" type="number" min="0" placeholder="m²" className={inputClass} />
        </div>
      </div>

      <div>
        <label className={labelClass} htmlFor="price">{t.price}</label>
        {/* The currency select must NOT reuse inputClass: that carries w-full,
            which beats a narrower w-* utility in the generated stylesheet, so
            the dropdown stretched and squeezed the price box to half the row.
            The amount gets the space; the three-letter unit needs almost none. */}
        <div className="flex gap-2">
          <input
            id="price"
            name="price"
            type="text"
            inputMode="decimal"
            required
            className={`${inputClass} flex-1 min-w-0 text-lg py-3 font-medium`}
            placeholder={forSale ? '250,000' : '500'}
          />
          <select
            name="currency"
            defaultValue="USD"
            aria-label="Currency"
            className="w-24 shrink-0 rounded-lg border border-slate-300 bg-white px-2 py-3 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
          >
            <option value="USD">USD</option>
            <option value="VND">VND</option>
          </select>
        </div>
        <p className={hintClass}>{forSale ? t.priceHintSale : t.priceHintRent}</p>
      </div>

      <div>
        <label className={labelClass} htmlFor="title">
          {t.title} <span className="text-slate-400 font-normal">({t.optional})</span>
        </label>
        <input id="title" name="title" type="text" maxLength={120} className={inputClass} />
        <p className={hintClass}>{t.titleHint}</p>
      </div>

      <div>
        <label className={labelClass} htmlFor="description">{t.description}</label>
        <textarea id="description" name="description" rows={6} required className={inputClass} />
        <p className={hintClass}>{t.descriptionHint}</p>
      </div>

      <div>
        <label className={labelClass} htmlFor="photos">{t.photos}</label>
        <input
          ref={fileInputRef}
          id="photos"
          name="photos"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          required={photos.length === 0}
          onChange={e => {
            const picked = Array.from(e.target.files ?? []);
            const valid = picked.filter(
              f => ALLOWED_PHOTO_TYPES.includes(f.type) && f.size <= MAX_PHOTO_BYTES,
            );
            // Selecting again replaces the whole set (native <input type=file>
            // behaviour) — rebuild the input's FileList with only the valid
            // files, so a rejected file (wrong type, or over 5 MB) can't be
            // submitted, and reset order to selection order.
            syncFileInput(valid);
            setPhotoError(valid.length < picked.length ? t.uploadFailed : null);
            setPhotos(valid);
          }}
          className="w-full text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:text-sm file:font-medium file:text-slate-700 hover:file:bg-slate-200"
        />
        <p className={hintClass}>
          {photos.length > 0 ? `${photos.length} / 10` : t.photosHint}
        </p>

        {/* Reorder + remove — order here IS the order photos are submitted
            in, so the first thumbnail becomes the listing's main photo. */}
        {photos.length > 0 && (
          <>
            <p className={`${hintClass} mt-3`}>{t.photoOrderHint}</p>
            <ul className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-3">
              {photos.map((file, i) => (
                <li
                  key={`${file.name}-${file.lastModified}-${i}`}
                  className={`rounded-lg border p-2 ${i === 0 ? 'border-blue-500 bg-blue-50' : 'border-slate-200'}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element -- local object URL, not a remote/optimizable image */}
                  <img src={previews[i]} alt="" className="w-full h-24 object-cover rounded" />
                  {i === 0 && (
                    <p className="mt-2 text-xs font-medium text-blue-700 text-center">★ {t.heroLabel}</p>
                  )}
                  <div className="mt-2 flex items-center justify-between gap-1">
                    <button
                      type="button"
                      onClick={() => movePhoto(i, -1)}
                      disabled={i === 0}
                      aria-label={t.moveEarlier}
                      className="flex-1 rounded border border-slate-300 bg-white py-1 text-xs text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:hover:bg-white"
                    >
                      ←
                    </button>
                    <button
                      type="button"
                      onClick={() => movePhoto(i, 1)}
                      disabled={i === photos.length - 1}
                      aria-label={t.moveLater}
                      className="flex-1 rounded border border-slate-300 bg-white py-1 text-xs text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:hover:bg-white"
                    >
                      →
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => removePhoto(i)}
                    className="mt-1 w-full text-xs text-slate-400 hover:text-red-600"
                  >
                    {t.removePhoto}
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      <button type="submit" disabled={pending} className={buttonClass}>
        {pending ? t.submitting : t.submit}
      </button>
    </form>
  );
}
