import type { Lang } from './translations';

// Single source of truth for the language switcher. Adding a language is one
// entry here plus its routes — nothing else in the UI hardcodes the list.
//
// `live` gates whether a locale is offered to visitors. Korean and Russian are
// defined but not live: the enrichment writes ko_/ru_ title and text into the
// sheet from 2026-09-09, but there are no /ko or /ru routes yet, so offering
// them would hand people a flag that leads nowhere. Flip `live` when the routes
// exist — see the 147 `lang === 'vi'` ternaries that have to become a lookup first.
export interface LocaleDef {
  code: string;
  flag: string;
  /** The language's own name — a Korean speaker scans for 한국어, not "Korean". */
  native: string;
  english: string;
  live: boolean;
}

export const LOCALES: LocaleDef[] = [
  { code: 'en', flag: '🇬🇧', native: 'English',    english: 'English',    live: true  },
  { code: 'vi', flag: '🇻🇳', native: 'Tiếng Việt', english: 'Vietnamese', live: true  },
  { code: 'ko', flag: '🇰🇷', native: '한국어',       english: 'Korean',     live: false },
  { code: 'ru', flag: '🇷🇺', native: 'Русский',    english: 'Russian',    live: false },
];

export const LIVE_LOCALES = LOCALES.filter((l) => l.live);

export function localeOf(lang: Lang): LocaleDef {
  return LOCALES.find((l) => l.code === lang) ?? LOCALES[0];
}
