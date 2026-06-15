'use client';

import Link from 'next/link';
import { useLanguage } from './LanguageProvider';

export default function SiteFooter() {
  const { lang, t } = useLanguage();
  const vi = lang === 'vi';
  const links = [
    { href: '/about',           label: vi ? 'Giới thiệu'         : 'About' },
    { href: '/contact',         label: vi ? 'Liên hệ'            : 'Contact' },
    { href: '/privacy-policy',  label: vi ? 'Chính sách bảo mật' : 'Privacy Policy' },
    { href: '/terms',           label: vi ? 'Điều khoản'         : 'Terms' },
  ];
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
