'use client';

import Link from 'next/link';
import { useLanguage } from './LanguageProvider';
import { forLang } from '@/lib/translations';
import { FOOTER_PAGES, type FooterPage } from '@/lib/footerPages';

// Footer labels per language (Vietnamese labels are inline below).
const FOOTER_LABELS = {
  en: ['About', 'Agents', 'FAQ', 'Contact', 'Privacy Policy', 'Terms'],
  vi: ['About', 'Agents', 'FAQ', 'Contact', 'Privacy Policy', 'Terms'],
  ko: ['회사 소개', '중개인', '자주 묻는 질문', '문의하기', '개인정보 처리방침', '이용약관'],
  ru: ['О нас', 'Агенты', 'Вопросы и ответы', 'Контакты', 'Политика конфиденциальности', 'Условия'],
} as const;

export default function SiteFooter() {
  const { lang, t } = useLanguage();
  // Every footer page exists in all four languages (lib/footerPages.ts), so each language links its own.
  const order: FooterPage[] = ['about', 'agents', 'knowledge', 'contact', 'privacy', 'terms'];
  const labels = lang === 'vi'
    ? ['Giới thiệu', 'Môi giới', 'Hỏi đáp', 'Liên hệ', 'Chính sách bảo mật', 'Điều khoản']
    : forLang(FOOTER_LABELS, lang);
  const links = order.map((page, i) => ({ href: FOOTER_PAGES[page][lang], label: labels[i] }));
  return (
    <footer className="border-t border-slate-200 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col gap-3">
        <nav className="flex flex-wrap justify-center gap-x-5 gap-y-1 text-xs text-slate-400">
          {links.map(l => (
            <Link key={l.href} href={l.href} className="hover:text-slate-600 transition-colors">{l.label}</Link>
          ))}
        </nav>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400">
          <span>{t.rights(new Date().getFullYear())}</span>
          <span>{t.updated}</span>
        </div>
      </div>
    </footer>
  );
}
