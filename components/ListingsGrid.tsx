'use client';

import { useState, useMemo } from 'react';
import { Listing } from '@/lib/types';
import { NEIGHBORHOODS } from '@/lib/neighborhoods';
import ListingCard from './ListingCard';

interface Props {
  listings: Listing[];
  types: string[];
  districts: string[];
  mode?: 'rent' | 'sale';
}

export default function ListingsGrid({ listings, types, districts, mode = 'rent' }: Props) {
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
  const clearAll = () => { setSearch(''); setType(''); setDist(''); setHood(''); setBeds(''); setPrice(''); };

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
            placeholder="Search by title, district, or keyword..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Filter row */}
        <div className="flex flex-wrap gap-2 items-center">
          <select value={typeFilter} onChange={e => setType(e.target.value)}
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
            <option value="">All Types</option>
            {types.map(t => <option key={t} value={t}>{t}</option>)}
          </select>

          <select value={distFilter} onChange={e => handleDistChange(e.target.value)}
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
            <option value="">All Districts</option>
            {districts.map(d => <option key={d} value={d}>{d}</option>)}
          </select>

          {/* Neighborhood — only shown when a district with known wards is selected */}
          {neighborhoods.length > 0 && (
            <select value={hoodFilter} onChange={e => setHood(e.target.value)}
              className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
              <option value="">All Neighborhoods</option>
              {neighborhoods.map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          )}

          <select value={bedsFilter} onChange={e => setBeds(e.target.value)}
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
            <option value="">Any Beds</option>
            {['1','2','3','4','5','6'].map(n => <option key={n} value={n}>{n} BR</option>)}
          </select>

          <select value={priceFilter} onChange={e => setPrice(e.target.value)}
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
            <option value="">Any Price</option>
            {mode === 'rent' ? <>
              <option value="u500">Under $500</option>
              <option value="500">$500 – $1,000</option>
              <option value="1000">$1,000 – $2,000</option>
              <option value="2000">$2,000 – $3,000</option>
              <option value="3000">$3,000+</option>
            </> : <>
              <option value="u100k">Under $100,000</option>
              <option value="100k">$100,000 – $300,000</option>
              <option value="300k">$300,000 – $500,000</option>
              <option value="500k">$500,000 – $1,000,000</option>
              <option value="1m">$1,000,000+</option>
            </>}
          </select>

          {hasFilters && (
            <button onClick={clearAll} className="text-sm text-blue-600 hover:text-blue-800 font-medium px-2">
              Clear all
            </button>
          )}

          <span className="ml-auto text-sm text-slate-400">
            {filtered.length} {filtered.length === 1 ? 'listing' : 'listings'}
          </span>
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-slate-400">
          <svg className="w-12 h-12 mx-auto mb-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-lg font-medium text-slate-500">No listings match your search</p>
          <button onClick={clearAll} className="mt-3 text-blue-600 text-sm hover:underline">Clear filters</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((l, i) => <ListingCard key={i} listing={l} />)}
        </div>
      )}
    </div>
  );
}
