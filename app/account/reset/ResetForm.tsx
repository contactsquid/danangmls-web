'use client';

import { useActionState } from 'react';
import { resetPasswordAction, type ActionState } from '../actions';
import { inputClass, labelClass, buttonClass, FormMessage } from '@/components/account/ui';

const initial: ActionState = {};

export default function ResetForm() {
  const [state, formAction, pending] = useActionState(resetPasswordAction, initial);

  if (state.notice) return <FormMessage notice={state.notice} />;

  return (
    <form action={formAction} className="space-y-4">
      <FormMessage error={state.error} />
      <div>
        <label htmlFor="email" className={labelClass}>Email</label>
        <input id="email" name="email" type="email" required autoComplete="email" className={inputClass} />
      </div>
      <button type="submit" disabled={pending} className={buttonClass}>
        {pending ? 'Sending…' : 'Send reset link'}
      </button>
    </form>
  );
}
