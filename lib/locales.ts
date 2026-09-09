import type { Lang } from './translations';

// Single source of truth for the language switcher. Adding a language is one
// entry here plus its routes — nothing else in the UI hardcodes the list.
//
// `live` gates whether a locale is offered to visitors. All four are live as of
// 2026-09-09: /ko and /ru route trees exist, the UI strings are translated, and
// listing bodies fall back to English wherever ko_/ru_ has not been written yet.
// Set a locale false again if its routes are ever removed.
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
  { code: 'ko', flag: '🇰🇷', native: '한국어',       english: 'Korean',     live: true  },
  { code: 'ru', flag: '🇷🇺', native: 'Русский',    english: 'Russian',    live: true  },
];

export const LIVE_LOCALES = LOCALES.filter((l) => l.live);

export function localeOf(lang: Lang): LocaleDef {
  return LOCALES.find((l) => l.code === lang) ?? LOCALES[0];
}
