'use client';

import { usePathname } from 'next/navigation';
import { translations, type Lang, type Translations } from '@/lib/translations';

// The locale is the first path segment. Everything that calls useLanguage() —
// header, grid, cards, hero, FAQs — becomes Korean or Russian the moment a /ko
// or /ru route renders, with no per-component change.
//
// Matched as a whole segment rather than with startsWith: '/vi' as a prefix also
// matches '/video', and that class of bug is silent.
const PREFIXED: Lang[] = ['vi', 'ko', 'ru'];

export function useLanguage(): { lang: Lang; t: Translations } {
  const pathname = usePathname() || '/';
  const first = pathname.split('/')[1];
  const lang: Lang = (PREFIXED as string[]).includes(first) ? (first as Lang) : 'en';
  return { lang, t: translations[lang] };
}
