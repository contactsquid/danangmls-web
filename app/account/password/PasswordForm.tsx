'use client';

import { useActionState } from 'react';
import { setPasswordAction, type ActionState } from '../actions';
import { inputClass, labelClass, buttonClass, hintClass, FormMessage } from '@/components/account/ui';

const initial: ActionState = {};

export default function PasswordForm() {
  const [state, formAction, pending] = useActionState(setPasswordAction, initial);

  return (
    <form action={formAction} className="space-y-4">
      <FormMessage error={state.error} />
      <div>
        <label htmlFor="password" className={labelClass}>New password</label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          className={inputClass}
        />
        <p className={hintClass}>At least 8 characters.</p>
      </div>
      <button type="submit" disabled={pending} className={buttonClass}>
        {pending ? 'Saving…' : 'Save password'}
      </button>
    </form>
  );
}
