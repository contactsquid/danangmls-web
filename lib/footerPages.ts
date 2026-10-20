// The footer pages in all four languages (Blake, 2026-10-20: every footer page exists in en/vi/ko/ru
// and the language switcher stays on the same page). One table drives the language switcher
// (lib/langUrl.ts), the footer links, the sitemap and every page's hreflang alternates, so a URL can
// never be wired in one place and missed in another.
import type { Lang } from './translations';

const BASE = 'https://danangmls.com';

export const FOOTER_PAGES = {
  about:     { en: '/about',          vi: '/vi/gioi-thieu',         ko: '/ko/about',          ru: '/ru/about' },
  agents:    { en: '/agents',         vi: '/vi/moi-gioi',           ko: '/ko/agents',         ru: '/ru/agents' },
  knowledge: { en: '/knowledge',      vi: '/vi/hoi-dap',            ko: '/ko/knowledge',      ru: '/ru/knowledge' },
  contact:   { en: '/contact',        vi: '/vi/lien-he',            ko: '/ko/contact',        ru: '/ru/contact' },
  privacy:   { en: '/privacy-policy', vi: '/vi/chinh-sach-bao-mat', ko: '/ko/privacy-policy', ru: '/ru/privacy-policy' },
  terms:     { en: '/terms',          vi: '/vi/dieu-khoan',         ko: '/ko/terms',          ru: '/ru/terms' },
} as const;

export type FooterPage = keyof typeof FOOTER_PAGES;

/** Metadata `alternates` for one footer page in one language: its canonical plus all four hreflang twins. */
export function footerAlternates(page: FooterPage, lang: Lang) {
  const p = FOOTER_PAGES[page];
  return {
    canonical: `${BASE}${p[lang]}`,
    languages: { en: `${BASE}${p.en}`, vi: `${BASE}${p.vi}`, ko: `${BASE}${p.ko}`, ru: `${BASE}${p.ru}`, 'x-default': `${BASE}${p.en}` },
  };
}
