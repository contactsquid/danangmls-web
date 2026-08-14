'use client';

import { useActionState, useState } from 'react';
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

export default function ListingForm({ lang, profileSlug }: { lang: Lang; profileSlug: string }) {
  const t = LISTING_FORM_COPY[lang];
  const [state, formAction, pending] = useActionState(submitListingAction, initial);

  const [forSale, setForSale] = useState(false);
  const [district, setDistrict] = useState('');
  const [photoCount, setPhotoCount] = useState(0);

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
      <FormMessage error={state.error} />
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
          <label className={labelClass} htmlFor="bedrooms">{t.bedrooms}</label>
          <input id="bedrooms" name="bedrooms" type="number" min="0" max="20" className={inputClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="bathrooms">{t.bathrooms}</label>
          <input id="bathrooms" name="bathrooms" type="number" min="0" max="20" className={inputClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="area_sqm">{t.area}</label>
          <input id="area_sqm" name="area_sqm" type="number" min="0" placeholder="m²" className={inputClass} />
        </div>
      </div>

      <div>
        <label className={labelClass} htmlFor="price">{t.price}</label>
        <div className="flex gap-2">
          <input
            id="price"
            name="price"
            type="text"
            inputMode="numeric"
            required
            className={inputClass}
            placeholder={forSale ? '250000' : '500'}
          />
          <select name="currency" defaultValue="USD" className={`${inputClass} w-28 shrink-0`}>
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
          id="photos"
          name="photos"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          required
          onChange={e => setPhotoCount(e.target.files?.length ?? 0)}
          className="w-full text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:text-sm file:font-medium file:text-slate-700 hover:file:bg-slate-200"
        />
        <p className={hintClass}>
          {photoCount > 0 ? `${photoCount} / 10` : t.photosHint}
        </p>
      </div>

      <button type="submit" disabled={pending} className={buttonClass}>
        {pending ? t.submitting : t.submit}
      </button>
    </form>
  );
}
