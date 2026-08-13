import type { ReactNode } from 'react';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';

// Shared form styling for the account area, so the sign-up, sign-in, reset and
// profile screens stay visually identical without repeating class strings.
export const inputClass =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100';

export const labelClass = 'block text-sm font-medium text-slate-700 mb-1.5';

export const buttonClass =
  'w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors';

export const hintClass = 'mt-1.5 text-xs text-slate-500';

/** Page chrome for the signed-out account screens: centred card, site header
 *  and footer. */
export function AccountShell({
  title,
  subtitle,
  children,
  wide = false,
}: {
  title: string;
  subtitle?: ReactNode;
  children: ReactNode;
  wide?: boolean;
}) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <SiteHeader />
      <main className={`${wide ? 'max-w-2xl' : 'max-w-md'} w-full mx-auto px-4 sm:px-6 py-12 flex-1`}>
        <h1 className="text-2xl font-bold text-slate-900 mb-1">{title}</h1>
        {subtitle && <p className="text-slate-600 text-sm mb-6">{subtitle}</p>}
        <div className="bg-white rounded-xl border border-slate-200 p-6 mt-4">{children}</div>
      </main>
      <SiteFooter />
    </div>
  );
}

/** Inline success / failure banner shown above a form after submission. */
export function FormMessage({ error, notice }: { error?: string; notice?: string }) {
  if (!error && !notice) return null;
  return (
    <p
      role="status"
      className={`mb-4 rounded-lg px-3 py-2 text-sm ${
        error ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'
      }`}
    >
      {error ?? notice}
    </p>
  );
}
