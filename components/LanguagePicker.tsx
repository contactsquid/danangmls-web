'use client';

import { usePathname, useRouter } from 'next/navigation';
import type { Lang } from '@/lib/translations';
import { getLangUrl } from '@/lib/langUrl';
import { LIVE_LOCALES } from '@/lib/locales';
import { useLanguage } from './LanguageProvider';

// Flag AND the language's own name, side by side. A flag alone is a guessing
// game and a two-letter code is worse — someone scanning for their language is
// looking for "Tiếng Việt", not "VI". Sitting next to the search box because
// that is the moment a visitor decides what language to type in.
export default function LanguagePicker({ variant = 'inline', className = '' }: { variant?: 'inline' | 'menu'; className?: string }) {
  const { lang } = useLanguage();
  const pathname = usePathname();
  const router = useRouter();

  const go = (target: string) => {
    if (target === lang) return;
    router.push(getLangUrl(pathname, target as Lang));
  };

  if (variant === 'menu') {
    return (
      <select
        value={lang}
        onChange={(e) => go(e.target.value)}
        aria-label="Language"
        className={`text-sm border border-slate-200 rounded-lg px-2 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white ${className}`}
      >
        {LIVE_LOCALES.map((l) => (
          <option key={l.code} value={l.code}>{`${l.flag} ${l.native}`}</option>
        ))}
      </select>
    );
  }

  return (
    <div className="flex items-center gap-1.5 shrink-0" role="group" aria-label="Language">
      {LIVE_LOCALES.map((l) => {
        const active = l.code === lang;
        return (
          <button
            key={l.code}
            type="button"
            onClick={() => go(l.code)}
            aria-current={active ? 'true' : undefined}
            title={l.english}
            className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-2 text-sm whitespace-nowrap transition-colors ${
              active
                ? 'border-blue-600 bg-blue-50 text-blue-700 font-semibold'
                : 'border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <span aria-hidden="true" className="text-base leading-none">{l.flag}</span>
            <span>{l.native}</span>
          </button>
        );
      })}
    </div>
  );
}
