'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import type { Listing } from '@/lib/types';
import { useLanguage } from './LanguageProvider';
import { locationLine } from '@/lib/mapMarkers';
import { facetUrl } from '@/lib/facets';
import { localizeDistrict } from '@/lib/price';

// Lazy on two levels (Blake: the map must not slow the page): nothing mounts until
// the section is within ~400px of the viewport, and only then is the Leaflet chunk
// downloaded.
const ListingLocationMap = dynamic(() => import('./ListingLocationMap'), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-slate-100 animate-pulse" />,
});

export default function ListingMapSection({ listing, similar }: { listing: Listing; similar: Listing[] }) {
  const { lang, t } = useLanguage();
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

  if (!listing.geo) return null;
  const mode = listing.forSale ? 'sale' : 'rent';
  const seeAll = `${facetUrl(mode, lang, { kind: 'district', value: listing.district })}?view=map`;
  const hasSimilar = similar.some(s => s.geo);

  return (
    <div>
      <div ref={boxRef} className="rounded-xl overflow-hidden border border-slate-200 h-72 sm:h-80">
        {near ? <ListingLocationMap listing={listing} similar={similar} /> : <div className="w-full h-full bg-slate-100" />}
      </div>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-slate-500">
        <span>📍 {locationLine(listing, lang, t)}</span>
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-full bg-slate-900" aria-hidden="true" />{t.mapThisListing}
        </span>
        {hasSimilar && (
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-block w-3 h-3 rounded-full bg-white border border-slate-300" aria-hidden="true" />{t.mapSimilar}
          </span>
        )}
        <a href={seeAll} className="ml-auto text-blue-600 hover:underline">{t.mapSeeAll(localizeDistrict(listing.district, lang))}</a>
      </div>
    </div>
  );
}
