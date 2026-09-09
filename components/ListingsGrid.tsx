'use client';

import { useState, useMemo, useEffect } from 'react';
import { Listing } from '@/lib/types';
import { NEIGHBORHOODS } from '@/lib/neighborhoods';
import { resolveFacet, isVilla } from '@/lib/facets';
import { POPULAR_BUILDINGS } from '@/lib/buildingDefs';
import ListingCard from './ListingCard';
import { useLanguage } from './LanguageProvider';
import { localizeType, localizeDistrict } from '@/lib/price';

const PAGE_SIZE = 48;
// Roughly two rows on a desktop grid. These load eagerly so the top of the page
// paints immediately; every card past this point waits until it is scrolled to.
const EAGER_CARDS = 6;

interface Props {
  listings: Listing[];
  types: string[];
  districts: string[];
  mode?: 'rent' | 'sale';
  // Facet landing pages (e.g. /for-rent/house, /for-rent/son-tra) pre-select one
  // filter. The dropdowns stay fully visible/changeable; the seeded value just
  // wins over any stale persisted filter for that dimension on load.
  initialType?: string;
  initialDistrict?: string;
  initialBeds?: string;
  initialForeign?: boolean;
  /** Seeds the search box server-side (building facet pages). */
  initialSearch?: string;
  // When set, `listings` is only the first batch that renders. The full set is
  // pulled from /api/grid-listings once the page has painted, so a visitor is
  // not made to wait on ~4,200 or ~8,000 listings to see 48. Filters operate on
  // whatever has arrived and re-run automatically when the rest lands.
  deferred?: { mode: 'rent' | 'sale'; total: number };
}

export default function ListingsGrid({ listings, types, districts, mode = 'rent', initialType = '', initialDistrict = '', initialBeds = '', initialForeign = false, initialSearch = '', deferred }: Props) {
  // Seeded with the server's first batch; replaced by the full set when it lands.
  const [pool, setPool] = useState<Listing[]>(listings);
  const [poolComplete, setPoolComplete] = useState(!deferred);

  // Depend on the primitive, not the object: `deferred` is a fresh literal from
  // the server component, so keying the effect on it would refetch every render.
  const deferredMode = deferred?.mode;
  useEffect(() => {
    if (!deferredMode) return;
    const ac = new AbortController();
    fetch(`/api/grid-listings?mode=${deferredMode}`, { signal: ac.signal })
      .then((r) => (r.ok ? r.json() : null))
      .then((data: Listing[] | null) => {
        if (Array.isArray(data) && data.length) {
          setPool(data);
          setPoolComplete(true);
        }
      })
      .catch(() => { /* keep the initial batch; the grid still works */ });
    return () => ac.abort();
  }, [deferredMode]);

  const { lang, t } = useLanguage();
  const [search, setSearch]         = useState(initialSearch);
  const [typeFilter, setType]       = useState(initialType);
  const [distFilter, setDist]       = useState(initialDistrict);
  const [hoodFilter, setHood]       = useState('');
  const [bedsFilter, setBeds]       = useState(initialBeds);
  const [priceFilter, setPrice]     = useState('');
  const [foreignOnly, setForeignOnly] = useState(initialForeign);

  // Persist filters in sessionStorage so they survive navigation to a listing
  // detail page and back. Keyed by mode so rent/sale don't bleed into each other.
  const FILTER_STORAGE_KEY = `dmls:listings:${mode}`;
  const [filtersHydrated, setFiltersHydrated] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    // A ?q= arrival (the "popular building" cards) is a fresh, self-contained search.
    // Read it FIRST: persisted dropdown filters must not be restored on top of it, or
    // they silently narrow the result to nothing. A stale beds=5 plus ?q=Sam Tower
    // rendered 0 listings while the search box still read "Sam Tower", so the card
    // promising 42 led to an empty page (reported 2026-09-07).
    let qParam: string | null = null;
    try {
      qParam = new URLSearchParams(window.location.search).get('q');
      // Building facet pages (/for-rent/sam-towers) seed the same search box. The
      // server already filtered for the count and JSON-LD; without this the grid
      // would render every listing under a hero that says 42.
      if (!qParam && initialSearch) qParam = initialSearch;
      if (!qParam) {
        const seg = window.location.pathname.split('/').filter(Boolean).pop() || '';
        const f = resolveFacet(seg);
        if (f && f.kind === 'building') {
          qParam = POPULAR_BUILDINGS.find(b => b.name === f.value)?.search ?? null;
        }
      }
    } catch {}
    try {
      const raw = qParam ? null : window.sessionStorage.getItem(FILTER_STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        // NOTE: free-text `search` is intentionally NOT restored. It's seeded from
        // the ?q building-card links; persisting it made a building click stick and
        // silently filter every later visit. Only the dropdown filters persist.
        if (!initialType     && typeof saved.typeFilter === 'string') setType(saved.typeFilter);
        if (!initialDistrict && typeof saved.distFilter === 'string') setDist(saved.distFilter);
        if (typeof saved.hoodFilter  === 'string')  setHood(saved.hoodFilter);
        if (!initialBeds     && typeof saved.bedsFilter === 'string') setBeds(saved.bedsFilter);
        if (typeof saved.priceFilter === 'string')  setPrice(saved.priceFilter);
        if (!initialForeign && typeof saved.foreignOnly === 'boolean') setForeignOnly(saved.foreignOnly);
      }
    } catch {}
    if (qParam) setSearch(qParam);
    setFiltersHydrated(true);
  }, [FILTER_STORAGE_KEY]);
  useEffect(() => {
    if (!filtersHydrated || typeof window === 'undefined') return;
    try {
      window.sessionStorage.setItem(FILTER_STORAGE_KEY, JSON.stringify({
        typeFilter, distFilter, hoodFilter, bedsFilter, priceFilter, foreignOnly,
      }));
    } catch {}
  }, [FILTER_STORAGE_KEY, filtersHydrated, typeFilter, distFilter, hoodFilter, bedsFilter, priceFilter, foreignOnly]);

  // Neighborhoods available for selected district
  const neighborhoods = distFilter ? (NEIGHBORHOODS[distFilter] || []) : [];

  // Reset neighborhood when district changes
  const handleDistChange = (val: string) => {
    setDist(val);
    setHood('');
  };

  const filtered = useMemo(() => {
    return pool.filter(l => {
      if (search) {
        const q = search.toLowerCase();
        if (
          !l.title.toLowerCase().includes(q) &&
          !l.district.toLowerCase().includes(q) &&
          !l.text.toLowerCase().includes(q)
        ) return false;
      }
      if (typeFilter) {
        // Villa is a subset of House — see isVilla(). Exact type matching returned
        // 1 rental because the enrichment types villas as 'House'.
        const ok = typeFilter.toLowerCase() === 'villa'
          ? isVilla(l as unknown as Listing)
          : l.type.toLowerCase() === typeFilter.toLowerCase();
        if (!ok) return false;
      }
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
      if (foreignOnly && !l.foreignEligible) return false;
      return true;
    });
  }, [pool, search, typeFilter, distFilter, hoodFilter, bedsFilter, priceFilter, foreignOnly]);

  const hasFilters = search || typeFilter || distFilter || hoodFilter || bedsFilter || priceFilter || foreignOnly;
  const clearAll = () => {
    setSearch(''); setType(''); setDist(''); setHood(''); setBeds(''); setPrice(''); setForeignOnly(false); setDisplayCount(PAGE_SIZE);
    if (typeof window !== 'undefined') {
      try { window.sessionStorage.removeItem(FILTER_STORAGE_KEY); } catch {}
    }
  };

  // Paginated "View More" — show 48 at a time.
  const [displayCount, setDisplayCount] = useState(PAGE_SIZE);
  // Reset display count when filters change
  useEffect(() => { setDisplayCount(PAGE_SIZE); }, [search, typeFilter, distFilter, hoodFilter, bedsFilter, priceFilter, foreignOnly]);

  const visible = filtered.slice(0, displayCount);
  const remaining = filtered.length - visible.length;
  const nextBatch = Math.min(PAGE_SIZE, remaining);

  return (
    <div id="listings" className="scroll-mt-20">
      {/* Search + Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 mb-6">
        {/* Search. The language control lived here for a day; it moved to the header
            once that showed a flag and the language's own name, so there is no longer
            a reason to hold width open beside the field. */}
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

          {mode === 'sale' && (
            <label className="inline-flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg text-sm cursor-pointer hover:bg-slate-50 transition-colors">
              <input
                type="checkbox"
                checked={foreignOnly}
                onChange={e => setForeignOnly(e.target.checked)}
                className="rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span className="text-slate-700">
                {lang === 'vi' ? 'Người nước ngoài mua được' : 'Foreign Buyer Eligible'}
              </span>
            </label>
          )}

          {hasFilters && (
            <button onClick={clearAll} className="text-sm text-blue-600 hover:text-blue-800 font-medium px-2">
              {t.clearAll}
            </button>
          )}

          <span className="ml-auto text-sm text-slate-400">
            {t.listingCount(!poolComplete && !hasFilters && deferred ? deferred.total : filtered.length)}
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
            {visible.map((l, i) => <ListingCard key={i} listing={l} priority={i < EAGER_CARDS} />)}
          </div>
          {remaining > 0 && (
            <div className="flex flex-col items-center gap-2 pt-10">
              <button
                onClick={() => setDisplayCount(c => c + PAGE_SIZE)}
                className="px-8 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors shadow-sm"
              >
                {lang === 'vi' ? 'Xem thêm' : 'View more'} (+{nextBatch})
              </button>
              <p className="text-xs text-slate-400">
                {lang === 'vi'
                  ? `Đang hiển thị ${visible.length} trong ${filtered.length}`
                  : `Showing ${visible.length} of ${filtered.length}`}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
