'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Logo from './Logo';
import { useLanguage } from './LanguageProvider';
import LanguagePicker from './LanguagePicker';
import { accountPaths, ACCOUNT_COPY } from '@/lib/accountCopy';
import AccountMenu from './account/AccountMenu';


export default function SiteHeader() {
  const pathname = usePathname();
  const { lang } = useLanguage();
  const isVi = lang === 'vi';
  const isForSale = pathname === '/for-sale' || pathname === '/vi/mua-ban' || pathname.startsWith('/for-sale/') || pathname.startsWith('/vi/mua-ban/');
  const isForRent = pathname === '/for-rent' || pathname === '/vi/thue' || pathname.startsWith('/for-rent/') || pathname.startsWith('/vi/thue/');

  const rentHref = isVi ? '/vi/thue' : '/for-rent';
  const saleHref = isVi ? '/vi/mua-ban' : '/for-sale';

  // Points straight at the add-listing form. No auth check is needed here — the
  // form page itself redirects a signed-out visitor to sign-in with ?next set,
  // so they land back on the form once they are in. Doing it that way keeps the
  // header a static component: checking the session here would make every page
  // on the site wait on an auth round-trip.
  const addListingHref = accountPaths[isVi ? 'vi' : 'en'].newListing;
  const addListingLabel = ACCOUNT_COPY[isVi ? 'vi' : 'en'].addPropertyNav;

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        <div className="flex items-center justify-between h-14 sm:h-16">
          <Link href={isVi ? '/vi' : '/'}><Logo /></Link>

          <div className="hidden sm:flex items-center gap-3">
            <NavToggle isForSale={isForSale} isForRent={isForRent} rentHref={rentHref} saleHref={saleHref} />
            <Link
              href={addListingHref}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white whitespace-nowrap hover:bg-blue-700 transition-colors"
            >
              {addListingLabel}
            </Link>
            <LanguagePicker variant="menu" />
            <AccountMenu lang={isVi ? 'vi' : 'en'} />
          </div>

          {/* Phone: only the logo and the primary action share the top row. Measured
              at 390px the three items came to 383px of content in a 406px row — about
              7px of slack, which is why it read as squished. The language control moves
              down to the row that already exists, where it keeps its full label instead
              of being cut back to a flag. */}
          <div className="flex sm:hidden items-center gap-2">
            <Link
              href={addListingHref}
              className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white whitespace-nowrap hover:bg-blue-700 transition-colors"
            >
              {addListingLabel}
            </Link>
            <AccountMenu lang={isVi ? 'vi' : 'en'} />
          </div>
        </div>

        <div className="flex sm:hidden items-center gap-2 pb-3">
          <div className="flex-1 min-w-0">
            <NavToggle isForSale={isForSale} isForRent={isForRent} rentHref={rentHref} saleHref={saleHref} fullWidth />
          </div>
          <LanguagePicker variant="menu" />
        </div>

      </div>
    </header>
  );
}

function NavToggle({ isForSale, isForRent, rentHref, saleHref, fullWidth }: {
  isForSale: boolean;
  isForRent: boolean;
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
          isForRent ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-50'
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

