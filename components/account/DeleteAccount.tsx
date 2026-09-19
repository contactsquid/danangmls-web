'use client';

import { useActionState, useState } from 'react';
import { deleteAccountAction } from '@/app/account/actions';
import { ACCOUNT_COPY } from '@/lib/accountCopy';
import { forLang, type Lang } from '@/lib/translations';

/**
 * Self-serve account deletion.
 *
 * Collapsed behind a plain text link rather than sitting open as a red button:
 * this is the last thing on a settings page and nobody should be one stray click
 * from deleting their profile. Opening it reveals what will happen, then requires
 * the word typed exactly — the confirmation word is localised, so it cannot be
 * completed by muscle memory from another site.
 *
 * The server action re-verifies the session against the auth server and re-checks
 * the typed word; nothing here is trusted.
 */
export default function DeleteAccount({ lang }: { lang: Lang }) {
  const t = forLang(ACCOUNT_COPY, lang);
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(deleteAccountAction, {});

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-sm text-slate-400 hover:text-red-600 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 rounded"
      >
        {t.deleteTitle}
      </button>
    );
  }

  return (
    <div className="mt-2 w-full rounded-xl border border-red-200 bg-red-50 p-4">
      <h2 className="text-sm font-semibold text-red-900 mb-1">{t.deleteTitle}</h2>
      <p className="text-sm text-red-800 leading-relaxed mb-3">{t.deleteBody}</p>

      <form action={formAction} className="flex flex-wrap items-start gap-2">
        <input type="hidden" name="lang" value={lang} />
        <label className="sr-only" htmlFor="confirm-delete">
          {t.deleteConfirmLabel}
        </label>
        <input
          id="confirm-delete"
          name="confirm"
          autoComplete="off"
          placeholder={t.deleteConfirmWord}
          aria-describedby={state?.error ? 'delete-error' : undefined}
          className="rounded-lg border border-red-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500"
        />
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
        >
          {t.deleteButton}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="px-2 py-2 text-sm text-slate-600 hover:underline"
        >
          {t.cancel}
        </button>
      </form>

      <p className="mt-2 text-xs text-red-700">{t.deleteConfirmLabel}</p>
      {state?.error && (
        <p id="delete-error" role="alert" className="mt-2 text-sm font-medium text-red-700">
          {state.error}
        </p>
      )}
    </div>
  );
}
