'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Logo from './Logo';

export default function SiteHeader() {
  const pathname = usePathname();
  const isForSale = pathname.startsWith('/for-sale');

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/"><Logo /></Link>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* For Rent / For Sale toggle */}
          <div className="flex rounded-lg border border-slate-200 overflow-hidden text-sm font-medium">
            <Link
              href="/"
              className={`px-3 py-1.5 transition-colors ${
                !isForSale
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              For Rent
            </Link>
            <Link
              href="/for-sale"
              className={`px-3 py-1.5 border-l border-slate-200 transition-colors ${
                isForSale
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              For Sale
            </Link>
          </div>

          {/* Language dropdown — placeholder until EN/VI content is ready */}
          <select
            className="text-sm border border-slate-200 rounded-lg px-2 py-1.5 text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            defaultValue="en"
          >
            <option value="en">EN</option>
            <option value="vi">VI</option>
          </select>
        </div>
      </div>
    </header>
  );
}
