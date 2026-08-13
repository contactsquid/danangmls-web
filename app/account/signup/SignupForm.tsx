'use client';

import { useActionState } from 'react';
import { signUpAction, type ActionState } from '../actions';
import { inputClass, labelClass, buttonClass, hintClass, FormMessage } from '@/components/account/ui';

const initial: ActionState = {};

export default function SignupForm() {
  const [state, formAction, pending] = useActionState(signUpAction, initial);

  // On success the form is replaced by the "check your inbox" notice — leaving
  // the fields on screen invites a confused second submission.
  if (state.notice) {
    return <FormMessage notice={state.notice} />;
  }

  return (
    <form action={formAction} className="space-y-4">
      <FormMessage error={state.error} />

      <div>
        <label htmlFor="display_name" className={labelClass}>Full name</label>
        <input
          id="display_name"
          name="display_name"
          type="text"
          required
          maxLength={80}
          autoComplete="name"
          placeholder="Nguyen Van A"
          className={inputClass}
        />
        <p className={hintClass}>This is the name shown on your public profile.</p>
      </div>

      <div>
        <label htmlFor="email" className={labelClass}>Email</label>
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
        <label htmlFor="password" className={labelClass}>Password</label>
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
        {pending ? 'Creating account…' : 'Create account'}
      </button>
    </form>
  );
}
