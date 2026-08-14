'use client';

import { useActionState } from 'react';
import { setPasswordAction, type ActionState } from '../actions';
import { inputClass, labelClass, buttonClass, hintClass, FormMessage } from '@/components/account/ui';
import { ACCOUNT_COPY } from '@/lib/accountCopy';
import type { Lang } from '@/lib/translations';

const initial: ActionState = {};

export default function PasswordForm({ lang = 'en' }: { lang?: Lang }) {
  const [state, formAction, pending] = useActionState(setPasswordAction, initial);
  const t = ACCOUNT_COPY[lang];

  return (
    <form action={formAction} className="space-y-4">
      <FormMessage error={state.error} />
      <input type="hidden" name="lang" value={lang} />
      <div>
        <label htmlFor="password" className={labelClass}>{t.newPassword}</label>
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
        {pending ? t.savingPassword : t.savePassword}
      </button>
    </form>
  );
}
