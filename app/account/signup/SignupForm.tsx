'use client';

import { forLang } from '@/lib/translations';

import { useActionState, useState, startTransition } from 'react';
import { signUpAction, type ActionState } from '../actions';
import { inputClass, labelClass, buttonClass, hintClass, FormMessage } from '@/components/account/ui';
import { ACCOUNT_COPY, AGENT_NAME_COPY } from '@/lib/accountCopy';
import { FOOTER_PAGES } from '@/lib/footerPages';
import type { Lang } from '@/lib/translations';

const initial: ActionState = {};

export default function SignupForm({ lang = 'en' }: { lang?: Lang }) {
  const [state, formAction, pending] = useActionState(signUpAction, initial);
  const t = forLang(ACCOUNT_COPY, lang);
  const nameT = forLang(AGENT_NAME_COPY, lang);

  // The last submitted form, kept in the browser only (never echoed by the server). The "Are these yours?"
  // answer resubmits it with claim_choice added, and the fields are refilled from
  // it so a "No" (choose another name) does not mean retyping everything.
  const [last, setLast] = useState<FormData | null>(null);
  const prev = (key: string) => {
    const v = last?.get(key);
    return typeof v === 'string' ? v : undefined;
  };
  const submit = (fd: FormData) => {
    setLast(fd);
    formAction(fd);
  };
  const answer = (choice: 'yes' | 'no') => {
    if (!last) return;
    // A copy, so `last` (used for the refill) never carries the one-off answer.
    const fd = new FormData();
    for (const [k, v] of last.entries()) fd.append(k, v);
    fd.set('claim_choice', choice);
    startTransition(() => formAction(fd));
  };

  // On success the form is replaced by the "check your inbox" notice — leaving
  // the fields on screen invites a confused second submission.
  if (state.notice) {
    return <FormMessage notice={state.notice} />;
  }

  // Scraped listings exist under this name: ask before creating the account.
  if (state.claimPrompt) {
    const p = state.claimPrompt;
    return (
      <div className="space-y-4">
        <p className="text-sm font-medium text-slate-800">{nameT.claimPrompt(p.count, p.name)}</p>
        <ul className="space-y-1.5 text-sm">
          {p.samples.map(s => (
            <li key={s.url}>
              <a href={s.url} target="_blank" rel="noopener" className="text-blue-600 hover:underline">{s.title}</a>
            </li>
          ))}
        </ul>
        <div className="flex flex-col gap-2 sm:flex-row">
          <button type="button" disabled={pending} onClick={() => answer('yes')} className={buttonClass}>
            {nameT.claimYes}
          </button>
          <button
            type="button"
            disabled={pending}
            onClick={() => answer('no')}
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
          >
            {nameT.claimNo}
          </button>
        </div>
      </div>
    );
  }

  return (
    <form action={submit} className="space-y-4">
      <FormMessage error={state.error} />
      <input type="hidden" name="lang" value={lang} />

      <div>
        <label htmlFor="display_name" className={labelClass}>{t.fullName}</label>
        <input
          id="display_name"
          name="display_name"
          defaultValue={prev('display_name')}
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
          defaultValue={prev('email')}
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          className={inputClass}
        />
      </div>

      {/* Required. Agents were reaching a live listing with no number behind it
          (three of nine before 2026-09-24), so it is asked for at the front door
          rather than left to a profile page they may never open. The server
          re-validates it — `required` here is only the first line. */}
      <div>
        <label htmlFor="phone" className={labelClass}>{t.phone}</label>
        <input
          id="phone"
          name="phone"
          defaultValue={prev('phone')}
          type="tel"
          required
          autoComplete="tel"
          placeholder="0905 897 639"
          className={inputClass}
        />
        <p className={hintClass}>{t.signupPhoneHint}</p>
      </div>

      <div>
        <label htmlFor="password" className={labelClass}>{t.password}</label>
        <input
          id="password"
          name="password"
          defaultValue={prev('password')}
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          className={inputClass}
        />
        <p className={hintClass}>{t.passwordHint}</p>
      </div>

      {/* Consent (Nghị định 13/2023/NĐ-CP): explicit, unticked by default, states the purpose and links the
          policy. The server re-checks it and records when and to which policy version it was given. */}
      <label className="flex items-start gap-2 text-sm text-slate-600">
        <input type="checkbox" name="consent" required defaultChecked={prev('consent') === 'on'} className="mt-1 h-4 w-4 shrink-0 rounded border-slate-300" />
        <span>
          {t.consentPre}
          <a href={FOOTER_PAGES.privacy[lang]} target="_blank" rel="noopener" className="text-blue-600 hover:underline">{t.consentLink}</a>
          {t.consentPost}
        </span>
      </label>

      <button type="submit" disabled={pending} className={buttonClass}>
        {pending ? t.creatingAccount : t.createAccount}
      </button>
    </form>
  );
}
