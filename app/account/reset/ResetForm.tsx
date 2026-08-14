'use client';

import { useActionState } from 'react';
import { resetPasswordAction, type ActionState } from '../actions';
import { inputClass, labelClass, buttonClass, FormMessage } from '@/components/account/ui';
import { ACCOUNT_COPY } from '@/lib/accountCopy';
import type { Lang } from '@/lib/translations';

const initial: ActionState = {};

export default function ResetForm({ lang = 'en' }: { lang?: Lang }) {
  const [state, formAction, pending] = useActionState(resetPasswordAction, initial);
  const t = ACCOUNT_COPY[lang];

  if (state.notice) return <FormMessage notice={state.notice} />;

  return (
    <form action={formAction} className="space-y-4">
      <FormMessage error={state.error} />
      <input type="hidden" name="lang" value={lang} />
      <div>
        <label htmlFor="email" className={labelClass}>{t.email}</label>
        <input id="email" name="email" type="email" required autoComplete="email" className={inputClass} />
      </div>
      <button type="submit" disabled={pending} className={buttonClass}>
        {pending ? t.sending : t.sendResetLink}
      </button>
    </form>
  );
}
