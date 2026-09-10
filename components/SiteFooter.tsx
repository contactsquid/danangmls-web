'use client';

import Link from 'next/link';
import { useLanguage } from './LanguageProvider';
import { forLang } from '@/lib/translations';

// About/Agents/FAQ/Contact/Privacy/Terms exist in English and Vietnamese only, so
// ko/ru keep the English destinations but get their own labels — a Korean reader
// should still be able to tell what the link is.
const FOOTER_LABELS = {
  en: ['About', 'Agents', 'FAQ', 'Contact', 'Privacy Policy', 'Terms'],
  vi: ['About', 'Agents', 'FAQ', 'Contact', 'Privacy Policy', 'Terms'],
  ko: ['회사 소개', '중개인', '자주 묻는 질문', '문의하기', '개인정보 처리방침', '이용약관'],
  ru: ['О нас', 'Агенты', 'Вопросы и ответы', 'Контакты', 'Политика конфиденциальности', 'Условия'],
} as const;

export default function SiteFooter() {
  const { lang, t } = useLanguage();
  const vi = lang === 'vi';
  const links = vi
    ? [
        { href: '/vi/gioi-thieu',         label: 'Giới thiệu' },
        { href: '/vi/moi-gioi',           label: 'Môi giới' },
        { href: '/vi/lien-he',            label: 'Liên hệ' },
        { href: '/vi/chinh-sach-bao-mat', label: 'Chính sách bảo mật' },
        { href: '/vi/dieu-khoan',         label: 'Điều khoản' },
      ]
    : ['/about', '/agents', '/knowledge', '/contact', '/privacy-policy', '/terms']
        .map((href, i) => ({ href, label: forLang(FOOTER_LABELS, lang)[i] }));
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
