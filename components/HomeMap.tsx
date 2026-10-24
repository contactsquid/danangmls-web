'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import type { Listing } from '@/lib/types';
import { useLanguage } from './LanguageProvider';
import { forLang } from '@/lib/translations';

// Homepage map of the latest listings (Blake, 2026-10-24; ported from saigonmls). Lazy on two levels, like
// the listing-page map: nothing mounts until the section is within ~400px of the
// viewport, and only then is the Leaflet chunk downloaded.
const HomeMapLeaflet = dynamic(() => import('./HomeMapLeaflet'), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-slate-100 animate-pulse" />,
});

// rentTotal / saleTotal: how many listings the site has in all (Blake, 2026-10-24), shown in the legend.
export default function HomeMap({ rentals, forSale, rentTotal, saleTotal }: { rentals: Listing[]; forSale: Listing[]; rentTotal: number; saleTotal: number }) {
  const { lang } = useLanguage();
  const boxRef = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const el = boxRef.current;
    if (!el || near) return;
    const io = new IntersectionObserver(entries => {
      if (entries.some(e => e.isIntersecting)) { setNear(true); io.disconnect(); }
    }, { rootMargin: '400px' });
    io.observe(el);
    return () => io.disconnect();
  }, [near]);

  const listings = [...rentals, ...forSale].filter(l => l.geo);
  if (!listings.length) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div ref={boxRef} className="rounded-xl overflow-hidden border border-slate-200 h-80 sm:h-96">
        {near ? <HomeMapLeaflet listings={listings} /> : <div className="w-full h-full bg-slate-100" />}
      </div>
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-3 text-sm">
        <span className="inline-flex items-center gap-1.5 text-slate-600">
          <span className="inline-block w-3 h-3 rounded-full bg-blue-600" aria-hidden="true" />
          {forLang({ en: 'For rent', vi: 'Cho thuê', ko: '임대', ru: 'Аренда' }, lang)}{' '}
          <span className="font-semibold text-slate-800">({rentTotal.toLocaleString('en-US')})</span>
        </span>
        <span className="inline-flex items-center gap-1.5 text-slate-600">
          <span className="inline-block w-3 h-3 rounded-full bg-emerald-600" aria-hidden="true" />
          {forLang({ en: 'For sale', vi: 'Bán', ko: '매매', ru: 'Продажа' }, lang)}{' '}
          <span className="font-semibold text-slate-800">({saleTotal.toLocaleString('en-US')})</span>
        </span>
      </div>
    </section>
  );
}
