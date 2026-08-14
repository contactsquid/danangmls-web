'use client';

import { useActionState } from 'react';
import { signUpAction, type ActionState } from '../actions';
import { inputClass, labelClass, buttonClass, hintClass, FormMessage } from '@/components/account/ui';
import { ACCOUNT_COPY } from '@/lib/accountCopy';
import type { Lang } from '@/lib/translations';

const initial: ActionState = {};

export default function SignupForm({ lang = 'en' }: { lang?: Lang }) {
  const [state, formAction, pending] = useActionState(signUpAction, initial);
  const t = ACCOUNT_COPY[lang];

  // On success the form is replaced by the "check your inbox" notice — leaving
  // the fields on screen invites a confused second submission.
  if (state.notice) {
    return <FormMessage notice={state.notice} />;
  }

  return (
    <form action={formAction} className="space-y-4">
      <FormMessage error={state.error} />
      <input type="hidden" name="lang" value={lang} />

      <div>
        <label htmlFor="display_name" className={labelClass}>{t.fullName}</label>
        <input
          id="display_name"
          name="display_name"
          type="text"
          required
          maxLength={80}
          autoComplete="name"
          placeholder={t.namePlaceholder}
          className={inputClass}
        />
        <p className={hintClass}>{t.fullNameHint}</p>
      </div>

      <div>
        <label htmlFor="email" className={labelClass}>{t.email}</label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="password" className={labelClass}>{t.password}</label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          className={inputClass}
        />
        <p className={hintClass}>{t.passwordHint}</p>
      </div>

      <button type="submit" disabled={pending} className={buttonClass}>
        {pending ? t.creatingAccount : t.createAccount}
      </button>
    </form>
  );
}
