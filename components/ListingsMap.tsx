'use client';

import { useEffect, useMemo, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import type { Listing } from '@/lib/types';
import { useLanguage } from './LanguageProvider';
import { shortPrice } from '@/lib/geo/shortPrice';
import { isFreshForMap } from '@/lib/geo/freshness';
import { convertPrice, localizeDistrict, localizedTitle } from '@/lib/price';
import { listingHref } from '@/lib/facets';
import { addBasemap, MAP_MAX_ZOOM } from '@/lib/mapTiles';

// Map view for ListingsGrid. Loaded with next/dynamic (ssr: false) so list-view
// visitors never download Leaflet. Placement comes precomputed on each listing
// (lib/geo/placement.ts); only recent listings are shown (lib/geo/freshness.ts).
//
// Two display modes, re-chosen on every pan/zoom (Blake, 2026-09-26: "too many
// circled counts instead of the pricing"): with fewer than PINS_BELOW listings in
// view, every listing is its own price tag; otherwise tags merge into count
// bubbles that spiderfy at max zoom.
const PINS_BELOW = 100;

const esc = (s: string) => s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));

export default function ListingsMap({ listings, mode }: { listings: Listing[]; mode: 'rent' | 'sale' }) {
  const { lang, t } = useLanguage();
  const elRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ref = useRef<{ L: any; map: any; cluster: any; pins: any } | null>(null);
  // Memoised so the marker effect re-runs only when the filtered set changes.
  const fresh = useMemo(() => {
    const now = Date.now();
    return listings.filter(l => isFreshForMap(l, now));
  }, [listings]);
  const mapped = useMemo(() => fresh.filter(l => l.geo), [fresh]);
  const unmapped = fresh.length - mapped.length;

  // Map + both marker layers, created once.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const L = (await import('leaflet')).default;
      // leaflet.markercluster attaches itself to the global L.
      (window as unknown as { L: typeof L }).L = L;
      await import('leaflet.markercluster');
      if (cancelled || !elRef.current || ref.current) return;
      const map = L.map(elRef.current, { scrollWheelZoom: true, maxZoom: MAP_MAX_ZOOM }).setView([16.05, 108.22], 12);
      addBasemap(L, map);
      const cluster = L.markerClusterGroup({
        chunkedLoading: true, showCoverageOnHover: false, spiderfyOnMaxZoom: true, maxClusterRadius: 50,
        iconCreateFunction: (c: { getChildCount(): number }) => L.divIcon({
          html: `<span>${c.getChildCount()}</span>`, className: 'dmls-cluster', iconSize: L.point(40, 40),
        }),
      });
      ref.current = { L, map, cluster, pins: L.layerGroup() };
      window.dispatchEvent(new Event('dmls-map-ready'));
    })();
    return () => {
      cancelled = true;
      if (ref.current) { ref.current.map.remove(); ref.current = null; }
    };
  }, []);

  // Markers, rebuilt whenever the filtered set or language changes.
  useEffect(() => {
    const makeMarker = (l: Listing) => {
      const { L } = ref.current!;
      const [lat, lng, precision] = l.geo!;
      const tag = shortPrice(l.price, lang) ?? '•';
      const m = L.marker([lat, lng], {
        icon: L.divIcon({ html: `<span>${esc(tag)}</span>`, className: 'dmls-pin', iconSize: [0, 0] }),
        riseOnHover: true,
      });
      m.bindPopup(() => {
        const label = l.geoLabel || '';
        const loc = precision === 0 ? t.mapAtBuilding(label)
          : precision === 4 ? t.mapNearBuilding(label)
          : precision === 1 ? t.mapOnStreet(label)
          : precision === 2 ? t.mapInWard(label)
          : t.mapApprox(localizeDistrict(l.district, lang));
        const img = l.images[0] ? `<img src="${esc(l.images[0])}" alt="" loading="lazy">` : '';
        const beds = l.bedrooms ? `🛏 ${esc(l.bedrooms)} ${esc(t.br)} · ` : '';
        return `<a href="${esc(listingHref(l.slug, lang))}">${img}<div class="b">`
          + `<div class="p">${esc(l.price ? convertPrice(l.price, lang) : '')}</div>`
          + `<div class="t">${esc(localizedTitle(l, lang))}</div>`
          + `<div class="m">${beds}${esc(loc)}</div></div></a>`;
      }, { className: 'dmls-popup', maxWidth: 240, minWidth: 240 });
      return m;
    };

    // Price tags or bubbles, depending on how many listings are in view.
    const refresh = () => {
      if (!ref.current) return;
      const { map, cluster, pins } = ref.current;
      const view = map.getBounds();
      const inView = mapped.filter(l => view.contains([l.geo![0], l.geo![1]]));
      if (inView.length < PINS_BELOW) {
        if (map.hasLayer(cluster)) map.removeLayer(cluster);
        // Pad the area a little so a short pan doesn't reveal an empty edge.
        const around = view.pad(0.25);
        pins.clearLayers();
        for (const l of mapped) if (around.contains([l.geo![0], l.geo![1]])) pins.addLayer(makeMarker(l));
        if (!map.hasLayer(pins)) map.addLayer(pins);
      } else {
        if (map.hasLayer(pins)) { map.removeLayer(pins); pins.clearLayers(); }
        if (!map.hasLayer(cluster)) map.addLayer(cluster);
      }
    };

    let attachedTo: { off(ev: string, fn: () => void): void } | null = null;
    const start = () => {
      if (!ref.current || attachedTo) return;
      const { map, cluster } = ref.current;
      cluster.clearLayers();
      cluster.addLayers(mapped.map(makeMarker));
      map.on('moveend', refresh);
      attachedTo = map;
      if (mapped.length) map.fitBounds(cluster.getBounds(), { padding: [30, 30], maxZoom: 15 });
      refresh();   // fitBounds may not move the map (no moveend), so choose the mode now too
    };

    start();
    window.addEventListener('dmls-map-ready', start);
    return () => {
      window.removeEventListener('dmls-map-ready', start);
      attachedTo?.off('moveend', refresh);
    };
  }, [mapped, lang, t]);

  return (
    <div>
      <div ref={elRef} className="w-full h-[70vh] min-h-[420px] rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 relative z-0" />
      <p className="text-xs text-slate-500 mt-2">{t.mapFresh(fresh.length, mode === 'sale')}</p>
      {unmapped > 0 && <p className="text-xs text-slate-400 mt-1">{t.mapUnmapped(unmapped)}</p>}
    </div>
  );
}
