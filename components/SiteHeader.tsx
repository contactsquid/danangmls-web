'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Logo from './Logo';
import { useLanguage } from './LanguageProvider';
import type { Lang } from '@/lib/translations';

function getLangUrl(pathname: string, targetLang: Lang): string {
  if (targetLang === 'vi') {
    if (pathname === '/') return '/vi';
    if (pathname === '/for-sale') return '/vi/mua-ban';
    if (pathname.startsWith('/listing/')) return '/vi' + pathname;
    return '/vi';
  } else {
    if (pathname === '/vi') return '/';
    if (pathname === '/vi/mua-ban') return '/for-sale';
    if (pathname.startsWith('/vi/listing/')) return pathname.replace('/vi', '');
    return '/';
  }
}

export default function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { lang, t } = useLanguage();
  const isVi = lang === 'vi';
  const isForSale = pathname === '/for-sale' || pathname === '/vi/mua-ban';

  const rentHref = isVi ? '/vi' : '/';
  const saleHref = isVi ? '/vi/mua-ban' : '/for-sale';

  const handleLangChange = (target: Lang) => {
    router.push(getLangUrl(pathname, target));
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        <div className="flex items-center justify-between h-14 sm:h-16">
          <Link href={isVi ? '/vi' : '/'}><Logo /></Link>

          <div className="hidden sm:flex items-center gap-3">
            <NavToggle isForSale={isForSale} rentHref={rentHref} saleHref={saleHref} />
            <LangDropdown lang={lang} onChange={handleLangChange} />
          </div>

          <div className="flex sm:hidden items-center">
            <LangDropdown lang={lang} onChange={handleLangChange} />
          </div>
        </div>

        <div className="flex sm:hidden pb-3">
          <NavToggle isForSale={isForSale} rentHref={rentHref} saleHref={saleHref} fullWidth />
        </div>

      </div>
    </header>
  );
}

function NavToggle({ isForSale, rentHref, saleHref, fullWidth }: {
  isForSale: boolean;
  rentHref: string;
  saleHref: string;
  fullWidth?: boolean;
}) {
  const { t } = useLanguage();
  return (
    <div className={`flex rounded-lg border border-slate-200 overflow-hidden text-sm font-medium ${fullWidth ? 'w-full' : ''}`}>
      <Link
        href={rentHref}
        className={`flex-1 text-center px-4 py-2 whitespace-nowrap transition-colors ${
          !isForSale ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-50'
        }`}
      >
        {t.forRent}
      </Link>
      <Link
        href={saleHref}
        className={`flex-1 text-center px-4 py-2 whitespace-nowrap border-l border-slate-200 transition-colors ${
          isForSale ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-50'
        }`}
      >
        {t.forSale}
      </Link>
    </div>
  );
}

function LangDropdown({ lang, onChange }: { lang: Lang; onChange: (l: Lang) => void }) {
  return (
    <select
      value={lang}
      onChange={e => onChange(e.target.value as Lang)}
      className="text-sm border border-slate-200 rounded-lg px-2 py-1.5 text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
    >
      <option value="en">EN</option>
      <option value="vi">VI</option>
    </select>
  );
}
