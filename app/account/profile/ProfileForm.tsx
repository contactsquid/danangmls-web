'use client';

import { useActionState, useState } from 'react';
import { updateProfileAction, type ActionState } from '../actions';
import AgentAvatar from '@/components/AgentAvatar';
import { inputClass, labelClass, buttonClass, hintClass, FormMessage } from '@/components/account/ui';
import { ACCOUNT_COPY } from '@/lib/accountCopy';
import ClaimListingsField from '@/components/account/ClaimListingsField';
import type { Lang } from '@/lib/translations';
import type { OwnAgentProfile } from '@/lib/agents';

const initial: ActionState = {};

// Mirrors ALLOWED_PHOTO_TYPES / MAX_PHOTO_BYTES in app/account/actions.ts.
// Checked here too so a bad file never reaches the server action — the
// action's own check is a safety net, not the primary UX (a large-enough
// file can blow past next.config.ts's serverActions.bodySizeLimit before the
// action code even runs, which surfaces as a raw crash, not our nice error).
const ALLOWED_PHOTO_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_PHOTO_BYTES = 5 * 1024 * 1024;

export default function ProfileForm({
  profile,
  lang = 'en',
}: {
  profile: OwnAgentProfile;
  lang?: Lang;
}) {
  const [state, formAction, pending] = useActionState(updateProfileAction, initial);
  const t = ACCOUNT_COPY[lang];

  const startsIndependent =
    !profile.workplace || profile.workplace.toLowerCase() === 'independent';

  const [independent, setIndependent] = useState(startsIndependent);
  const [agency, setAgency] = useState(startsIndependent ? '' : profile.workplace);
  const [preview, setPreview] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);

  return (
    <form action={formAction} className="space-y-5">
      <FormMessage error={photoError ?? state.error} notice={state.notice} />
      <input type="hidden" name="lang" value={lang} />

      {/* Photo */}
      <div>
        <span className={labelClass}>{t.profilePhoto}</span>
        <div className="flex items-center gap-4">
          <AgentAvatar
            src={preview ?? profile.photo_url}
            name={profile.display_name}
            className="w-16 h-16 shrink-0"
          />
          <input
            id="photo"
            name="photo"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={e => {
              const file = e.target.files?.[0];
              if (!file) { setPhotoError(null); setPreview(null); return; }
              if (!ALLOWED_PHOTO_TYPES.includes(file.type)) {
                setPhotoError(t.errors.photoType);
                e.target.value = '';
                setPreview(null);
                return;
              }
              if (file.size > MAX_PHOTO_BYTES) {
                setPhotoError(t.errors.photoSize);
                e.target.value = '';
                setPreview(null);
                return;
              }
              setPhotoError(null);
              setPreview(URL.createObjectURL(file));
            }}
            className="text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:text-sm file:font-medium file:text-slate-700 hover:file:bg-slate-200"
          />
        </div>
        <p className={hintClass}>{t.photoHint}</p>
      </div>

      {/* Name */}
      <div>
        <label htmlFor="display_name" className={labelClass}>{t.fullName}</label>
        <input
          id="display_name"
          name="display_name"
          type="text"
          required
          maxLength={80}
          defaultValue={profile.display_name}
          className={inputClass}
        />
        <p className={hintClass}>{t.slugHint(profile.slug)}</p>
      </div>

      {/* Workplace */}
      <fieldset>
        <legend className={labelClass}>{t.workplace}</legend>
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="radio"
              name="workplace_mode"
              checked={independent}
              onChange={() => setIndependent(true)}
              className="text-blue-600"
            />
            {t.independentRadio}
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="radio"
              name="workplace_mode"
              checked={!independent}
              onChange={() => setIndependent(false)}
              className="text-blue-600"
            />
            {t.agencyRadio}
          </label>
        </div>
        {!independent && (
          <input
            type="text"
            value={agency}
            onChange={e => setAgency(e.target.value)}
            maxLength={120}
            placeholder={t.agencyName}
            aria-label={t.agencyName}
            className={`${inputClass} mt-2`}
          />
        )}
        {/* The action reads a single resolved value. */}
        <input
          type="hidden"
          name="workplace"
          value={independent ? 'Independent' : agency.trim()}
        />
      </fieldset>

      {/* Bio */}
      <div>
        <label htmlFor="bio" className={labelClass}>{t.bio}</label>
        <textarea
          id="bio"
          name="bio"
          rows={5}
          maxLength={2000}
          defaultValue={profile.bio}
          placeholder={t.bioPlaceholder}
          className={inputClass}
        />
        <p className={hintClass}>{t.bioHint}</p>
      </div>

      {/* Phone — stored, deliberately not published */}
      <div>
        <label htmlFor="phone" className={labelClass}>{t.phone}</label>
        <input
          id="phone"
          name="phone"
          type="tel"
          defaultValue={profile.phone ?? ''}
          placeholder="+84 …"
          className={inputClass}
        />
        <p className={hintClass}>{t.phoneHint}</p>
      </div>

      {/* Listing name claim — search, preview, confirm. */}
      <ClaimListingsField
        lang={lang}
        currentName={profile.listing_agent_name ?? ''}
        verified={profile.listing_agent_name_verified}
      />

      <button type="submit" disabled={pending} className={buttonClass}>
        {pending ? t.savingProfile : t.saveProfile}
      </button>
    </form>
  );
}
