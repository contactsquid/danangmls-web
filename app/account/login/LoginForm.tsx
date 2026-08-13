'use client';

import { useActionState } from 'react';
import { signInAction, type ActionState } from '../actions';
import { inputClass, labelClass, buttonClass, FormMessage } from '@/components/account/ui';

const initial: ActionState = {};

export default function LoginForm({ initialError }: { initialError?: string }) {
  const [state, formAction, pending] = useActionState(signInAction, initial);

  return (
    <form action={formAction} className="space-y-4">
      <FormMessage error={state.error ?? initialError} />

      <div>
        <label htmlFor="email" className={labelClass}>Email</label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="password" className={labelClass}>Password</label>
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
        {pending ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  );
}
