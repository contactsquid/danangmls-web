'use client';

import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { Listing } from '@/lib/types';
import { NEIGHBORHOODS } from '@/lib/neighborhoods';
import ListingCard from './ListingCard';
import { useLanguage } from './LanguageProvider';
import { localizeType, localizeDistrict } from '@/lib/price';

const PAGE_SIZE = 24;

interface Props {
  listings: Listing[];
  types: string[];
  districts: string[];
  mode?: 'rent' | 'sale';
}

export default function ListingsGrid({ listings, types, districts, mode = 'rent' }: Props) {
  const { lang, t } = useLanguage();
  const [search, setSearch]         = useState('');
  const [typeFilter, setType]       = useState('');
  const [distFilter, setDist]       = useState('');
  const [hoodFilter, setHood]       = useState('');
  const [bedsFilter, setBeds]       = useState('');
  const [priceFilter, setPrice]     = useState('');

  // Neighborhoods available for selected district
  const neighborhoods = distFilter ? (NEIGHBORHOODS[distFilter] || []) : [];

  // Reset neighborhood when district changes
  const handleDistChange = (val: string) => {
    setDist(val);
    setHood('');
  };

  const filtered = useMemo(() => {
    return listings.filter(l => {
      if (search) {
        const q = search.toLowerCase();
        if (
          !l.title.toLowerCase().includes(q) &&
          !l.district.toLowerCase().includes(q) &&
          !l.text.toLowerCase().includes(q)
        ) return false;
      }
      if (typeFilter && l.type.toLowerCase() !== typeFilter.toLowerCase()) return false;
      if (distFilter && !l.district.toLowerCase().includes(distFilter.toLowerCase())) return false;
      if (hoodFilter) {
        const haystack = (l.title + ' ' + l.text).toLowerCase();
        if (!haystack.includes(hoodFilter.toLowerCase()) && l.neighborhood !== hoodFilter) return false;
      }
      if (bedsFilter && l.bedrooms !== bedsFilter) return false;
      if (priceFilter) {
        const num = parseInt(l.price.replace(/[^0-9]/g, '')) || 0;
        // Rent ranges
        if (priceFilter === 'u500'  && !(num > 0 && num < 500))           return false;
        if (priceFilter === '500'   && !(num >= 500 && num < 1000))       return false;
        if (priceFilter === '1000'  && !(num >= 1000 && num < 2000))      return false;
        if (priceFilter === '2000'  && !(num >= 2000 && num < 3000))      return false;
        if (priceFilter === '3000'  && num < 3000)                        return false;
        // For-sale ranges
        if (priceFilter === 'u100k' && !(num > 0 && num < 100000))        return false;
        if (priceFilter === '100k'  && !(num >= 100000 && num < 300000))  return false;
        if (priceFilter === '300k'  && !(num >= 300000 && num < 500000))  return false;
        if (priceFilter === '500k'  && !(num >= 500000 && num < 1000000)) return false;
        if (priceFilter === '1m'    && num < 1000000)                     return false;
      }
      return true;
    });
  }, [listings, search, typeFilter, distFilter, hoodFilter, bedsFilter, priceFilter]);

  const hasFilters = search || typeFilter || distFilter || hoodFilter || bedsFilter || priceFilter;
  const clearAll = () => { setSearch(''); setType(''); setDist(''); setHood(''); setBeds(''); setPrice(''); setDisplayCount(PAGE_SIZE); };

  // Infinite scroll
  const [displayCount, setDisplayCount] = useState(PAGE_SIZE);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Reset display count when filters change
  useEffect(() => { setDisplayCount(PAGE_SIZE); }, [search, typeFilter, distFilter, hoodFilter, bedsFilter, priceFilter]);

  const loadMore = useCallback(() => {
    setDisplayCount(c => Math.min(c + PAGE_SIZE, filtered.length));
  }, [filtered.length]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) loadMore(); },
      { rootMargin: '300px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [loadMore]);

  const visible = filtered.slice(0, displayCount);

  return (
    <div>
      {/* Search + Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 mb-6">
        {/* Search */}
        <div className="relative mb-3">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Filter row */}
        <div className="flex flex-wrap gap-2 items-center">
          <select value={typeFilter} onChange={e => setType(e.target.value)}
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
            <option value="">{t.allTypes}</option>
            {types.map(ty => <option key={ty} value={ty}>{localizeType(ty, lang)}</option>)}
          </select>

          <select value={distFilter} onChange={e => handleDistChange(e.target.value)}
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
            <option value="">{t.allDistricts}</option>
            {districts.map(d => <option key={d} value={d}>{localizeDistrict(d, lang)}</option>)}
          </select>

          {/* Neighborhood — only shown when a district with known wards is selected */}
          {neighborhoods.length > 0 && (
            <select value={hoodFilter} onChange={e => setHood(e.target.value)}
              className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
              <option value="">{t.allNeighborhoods}</option>
              {neighborhoods.map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          )}

          <select value={bedsFilter} onChange={e => setBeds(e.target.value)}
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
            <option value="">{t.anyBeds}</option>
            {['1','2','3','4','5','6'].map(n => <option key={n} value={n}>{n} {t.br}</option>)}
          </select>

          <select value={priceFilter} onChange={e => setPrice(e.target.value)}
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
            <option value="">{t.anyPrice}</option>
            {mode === 'rent' ? <>
              <option value="u500">{t.under500}</option>
              <option value="500">{t.r500}</option>
              <option value="1000">{t.r1000}</option>
              <option value="2000">{t.r2000}</option>
              <option value="3000">{t.r3000}</option>
            </> : <>
              <option value="u100k">{t.under100k}</option>
              <option value="100k">{t.s100k}</option>
              <option value="300k">{t.s300k}</option>
              <option value="500k">{t.s500k}</option>
              <option value="1m">{t.s1m}</option>
            </>}
          </select>

          {hasFilters && (
            <button onClick={clearAll} className="text-sm text-blue-600 hover:text-blue-800 font-medium px-2">
              {t.clearAll}
            </button>
          )}

          <span className="ml-auto text-sm text-slate-400">
            {t.listingCount(filtered.length)}
          </span>
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-slate-400">
          <svg className="w-12 h-12 mx-auto mb-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-lg font-medium text-slate-500">{t.noListings}</p>
          <button onClick={clearAll} className="mt-3 text-blue-600 text-sm hover:underline">{t.clearFilters}</button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {visible.map((l, i) => <ListingCard key={i} listing={l} />)}
          </div>
          {displayCount < filtered.length && (
            <div ref={sentinelRef} className="flex justify-center py-8">
              <div className="w-6 h-6 border-2 border-blue-300 border-t-blue-600 rounded-full animate-spin" />
            </div>
          )}
        </>
      )}
    </div>
  );
}
