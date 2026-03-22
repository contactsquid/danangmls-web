'use client';

import { useState, useMemo } from 'react';
import { Listing } from '@/lib/types';
import ListingCard from './ListingCard';

interface Props {
  listings: Listing[];
  types: string[];
  districts: string[];
}

export default function ListingsGrid({ listings, types, districts }: Props) {
  const [search, setSearch]   = useState('');
  const [typeFilter, setType] = useState('');
  const [distFilter, setDist] = useState('');
  const [bedsFilter, setBeds] = useState('');

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
      if (bedsFilter && l.bedrooms !== bedsFilter) return false;
      return true;
    });
  }, [listings, search, typeFilter, distFilter, bedsFilter]);

  const hasFilters = search || typeFilter || distFilter || bedsFilter;

  const clearAll = () => { setSearch(''); setType(''); setDist(''); setBeds(''); };

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
          <select
            value={typeFilter}
            onChange={e => setType(e.target.value)}
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="">All Types</option>
            {types.map(t => <option key={t} value={t}>{t}</option>)}
          </select>

          <select
            value={distFilter}
            onChange={e => setDist(e.target.value)}
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="">All Districts</option>
            {districts.map(d => <option key={d} value={d}>{d}</option>)}
          </select>

          <select
            value={bedsFilter}
            onChange={e => setBeds(e.target.value)}
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="">Any Beds</option>
            {['1','2','3','4','5','6'].map(n => <option key={n} value={n}>{n} BR</option>)}
          </select>

          {hasFilters && (
            <button
              onClick={clearAll}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium px-2"
            >
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
          <button onClick={clearAll} className="mt-3 text-blue-600 text-sm hover:underline">
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((l, i) => <ListingCard key={i} listing={l} />)}
        </div>
      )}
    </div>
  );
}
