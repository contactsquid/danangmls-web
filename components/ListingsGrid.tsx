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
  const [search, setSearch]       = useState('');
  const [typeFilter, setType]     = useState('');
  const [distFilter, setDist]     = useState('');
  const [bedsFilter, setBeds]     = useState('');

  const filtered = useMemo(() => {
    return listings.filter(l => {
      if (search) {
        const q = search.toLowerCase();
        if (!l.title.toLowerCase().includes(q) && !l.district.toLowerCase().includes(q) && !l.text.toLowerCase().includes(q)) return false;
      }
      if (typeFilter && l.type.toLowerCase() !== typeFilter.toLowerCase()) return false;
      if (distFilter && !l.district.toLowerCase().includes(distFilter.toLowerCase())) return false;
      if (bedsFilter && l.bedrooms !== bedsFilter) return false;
      return true;
    });
  }, [listings, search, typeFilter, distFilter, bedsFilter]);

  const hasFilters = search || typeFilter || distFilter || bedsFilter;

  return (
    <div>
      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6 flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Search listings..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 min-w-48 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={typeFilter}
          onChange={e => setType(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Types</option>
          {types.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <select
          value={distFilter}
          onChange={e => setDist(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Districts</option>
          {districts.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        <select
          value={bedsFilter}
          onChange={e => setBeds(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Any Beds</option>
          {['1','2','3','4','5','6'].map(n => <option key={n} value={n}>{n} BR</option>)}
        </select>
        {hasFilters && (
          <button
            onClick={() => { setSearch(''); setType(''); setDist(''); setBeds(''); }}
            className="text-sm text-gray-500 hover:text-gray-700 px-2"
          >
            Clear
          </button>
        )}
      </div>

      {/* Count */}
      <p className="text-sm text-gray-500 mb-4">
        {filtered.length} {filtered.length === 1 ? 'listing' : 'listings'}
        {hasFilters ? ' matching your search' : ' available'}
      </p>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg">No listings match your filters.</p>
          <button onClick={() => { setSearch(''); setType(''); setDist(''); setBeds(''); }} className="mt-3 text-blue-600 text-sm hover:underline">
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((l, i) => <ListingCard key={i} listing={l} />)}
        </div>
      )}
    </div>
  );
}
