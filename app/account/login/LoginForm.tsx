'use client';

import { useActionState } from 'react';
import { signInAction, type ActionState } from '../actions';
import { inputClass, labelClass, buttonClass, FormMessage } from '@/components/account/ui';
import { ACCOUNT_COPY } from '@/lib/accountCopy';
import type { Lang } from '@/lib/translations';

const initial: ActionState = {};

export default function LoginForm({
  initialError,
  lang = 'en',
  next,
}: {
  initialError?: string;
  lang?: Lang;
  /** Where to send the agent after signing in — set when they arrived from a
   *  page that needed auth, e.g. the "Add property" button. Validated
   *  server-side by safeNext() before it is used. */
  next?: string;
}) {
  const [state, formAction, pending] = useActionState(signInAction, initial);
  const t = ACCOUNT_COPY[lang];

  return (
    <form action={formAction} className="space-y-4">
      <FormMessage error={state.error ?? initialError} />
      <input type="hidden" name="lang" value={lang} />
      {next && <input type="hidden" name="next" value={next} />}

      <div>
        <label htmlFor="email" className={labelClass}>{t.email}</label>
        <input id="email" name="email" type="email" required autoComplete="email" className={inputClass} />
      </div>

      <div>
        <label htmlFor="password" className={labelClass}>{t.password}</label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className={inputClass}
        />
      </div>

      <button type="submit" disabled={pending} className={buttonClass}>
        {pending ? t.signingIn : t.signIn}
      </button>
    </form>
  );
}
