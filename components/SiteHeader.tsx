'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Logo from './Logo';
import { useLanguage } from './LanguageProvider';
import type { Lang } from '@/lib/translations';

export default function SiteHeader() {
  const pathname = usePathname();
  const isForSale = pathname.startsWith('/for-sale');

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Single row on desktop, two rows on mobile */}
        <div className="flex items-center justify-between h-14 sm:h-16">
          <Link href="/"><Logo /></Link>

          {/* Desktop: toggle + language inline */}
          <div className="hidden sm:flex items-center gap-3">
            <NavToggle isForSale={isForSale} />
            <LangDropdown />
          </div>

          {/* Mobile: language only (toggle moves to row 2) */}
          <div className="flex sm:hidden items-center">
            <LangDropdown />
          </div>
        </div>

        {/* Mobile-only second row: full-width toggle */}
        <div className="flex sm:hidden pb-3">
          <NavToggle isForSale={isForSale} fullWidth />
        </div>

      </div>
    </header>
  );
}

function NavToggle({ isForSale, fullWidth }: { isForSale: boolean; fullWidth?: boolean }) {
  const { t } = useLanguage();
  return (
    <div className={`flex rounded-lg border border-slate-200 overflow-hidden text-sm font-medium ${fullWidth ? 'w-full' : ''}`}>
      <Link
        href="/"
        className={`flex-1 text-center px-4 py-2 whitespace-nowrap transition-colors ${
          !isForSale ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-50'
        }`}
      >
        {t.forRent}
      </Link>
      <Link
        href="/for-sale"
        className={`flex-1 text-center px-4 py-2 whitespace-nowrap border-l border-slate-200 transition-colors ${
          isForSale ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-50'
        }`}
      >
        {t.forSale}
      </Link>
    </div>
  );
}

function LangDropdown() {
  const { lang, setLang } = useLanguage();
  return (
    <select
      value={lang}
      onChange={e => setLang(e.target.value as Lang)}
      className="text-sm border border-slate-200 rounded-lg px-2 py-1.5 text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
    >
      <option value="en">EN</option>
      <option value="vi">VI</option>
    </select>
  );
}
