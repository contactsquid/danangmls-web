'use client';

import { useActionState, useState } from 'react';
import { updateProfileAction, type ActionState } from '../actions';
import AgentAvatar from '@/components/AgentAvatar';
import { inputClass, labelClass, buttonClass, hintClass, FormMessage } from '@/components/account/ui';
import type { OwnAgentProfile } from '@/lib/agents';

const initial: ActionState = {};

export default function ProfileForm({ profile }: { profile: OwnAgentProfile }) {
  const [state, formAction, pending] = useActionState(updateProfileAction, initial);

  const startsIndependent =
    !profile.workplace || profile.workplace.toLowerCase() === 'independent';

  const [independent, setIndependent] = useState(startsIndependent);
  const [agency, setAgency] = useState(startsIndependent ? '' : profile.workplace);
  const [preview, setPreview] = useState<string | null>(null);

  return (
    <form action={formAction} className="space-y-5">
      <FormMessage error={state.error} notice={state.notice} />

      {/* Photo */}
      <div>
        <span className={labelClass}>Profile photo</span>
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
              setPreview(file ? URL.createObjectURL(file) : null);
            }}
            className="text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:text-sm file:font-medium file:text-slate-700 hover:file:bg-slate-200"
          />
        </div>
        <p className={hintClass}>JPEG, PNG, or WebP. Up to 5 MB.</p>
      </div>

      {/* Name */}
      <div>
        <label htmlFor="display_name" className={labelClass}>Full name</label>
        <input
          id="display_name"
          name="display_name"
          type="text"
          required
          maxLength={80}
          defaultValue={profile.display_name}
          className={inputClass}
        />
        <p className={hintClass}>
          Your profile lives at <code className="text-slate-600">/agent/{profile.slug}</code>.
          Changing your name here does not change that address.
        </p>
      </div>

      {/* Workplace */}
      <fieldset>
        <legend className={labelClass}>Where you work</legend>
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="radio"
              name="workplace_mode"
              checked={independent}
              onChange={() => setIndependent(true)}
              className="text-blue-600"
            />
            Independent agent
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="radio"
              name="workplace_mode"
              checked={!independent}
              onChange={() => setIndependent(false)}
              className="text-blue-600"
            />
            Agency or company
          </label>
        </div>
        {!independent && (
          <input
            type="text"
            value={agency}
            onChange={e => setAgency(e.target.value)}
            maxLength={120}
            placeholder="Agency name"
            aria-label="Agency name"
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
        <label htmlFor="bio" className={labelClass}>About you</label>
        <textarea
          id="bio"
          name="bio"
          rows={5}
          maxLength={2000}
          defaultValue={profile.bio}
          placeholder="Areas you cover, languages you speak, the kind of property you specialise in…"
          className={inputClass}
        />
        <p className={hintClass}>
          Shown on your public profile. Profiles with a real bio and active listings rank
          far better in search than empty ones.
        </p>
      </div>

      {/* Phone — stored, deliberately not published */}
      <div>
        <label htmlFor="phone" className={labelClass}>Phone / Zalo</label>
        <input
          id="phone"
          name="phone"
          type="tel"
          defaultValue={profile.phone ?? ''}
          placeholder="+84 …"
          className={inputClass}
        />
        <p className={hintClass}>
          For DanangMLS to reach you only — this is <strong>not</strong> shown on your public
          profile. Enquiries come through DanangMLS.
        </p>
      </div>

      {/* Listing name claim */}
      <div>
        <label htmlFor="listing_agent_name" className={labelClass}>
          Name your listings are posted under
        </label>
        <input
          id="listing_agent_name"
          name="listing_agent_name"
          type="text"
          maxLength={120}
          defaultValue={profile.listing_agent_name ?? ''}
          placeholder="Exactly as it appears on your listings"
          className={inputClass}
        />
        {profile.listing_agent_name_verified ? (
          <p className="mt-1.5 text-xs text-emerald-700">
            ✓ Verified — your listings appear on your public profile.
          </p>
        ) : (
          <p className={hintClass}>
            DanangMLS checks this before your listings appear on your profile, so nobody can
            claim someone else’s properties. Usually within a day.
          </p>
        )}
      </div>

      <button type="submit" disabled={pending} className={buttonClass}>
        {pending ? 'Saving…' : 'Save profile'}
      </button>
    </form>
  );
}
