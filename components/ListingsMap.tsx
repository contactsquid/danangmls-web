'use client';

import { useEffect, useMemo, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import type { Listing } from '@/lib/types';
import { useLanguage } from './LanguageProvider';
import { shortPrice } from '@/lib/geo/shortPrice';
import { convertPrice, localizeDistrict, localizedTitle } from '@/lib/price';
import { listingHref } from '@/lib/facets';

// Map view for ListingsGrid. Loaded with next/dynamic (ssr: false) so list-view
// visitors never download Leaflet. Placement comes precomputed on each listing
// (lib/geo/placement.ts); overlapping pins merge into clusters and spiderfy at
// max zoom.

const esc = (s: string) => s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));

export default function ListingsMap({ listings }: { listings: Listing[] }) {
  const { lang, t } = useLanguage();
  const elRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ref = useRef<{ L: any; map: any; cluster: any } | null>(null);
  // Memoised so the marker effect re-runs only when the filtered set changes.
  const mapped = useMemo(() => listings.filter(l => l.geo), [listings]);
  const unmapped = listings.length - mapped.length;

  // Map + cluster layer, created once.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const L = (await import('leaflet')).default;
      // leaflet.markercluster attaches itself to the global L.
      (window as unknown as { L: typeof L }).L = L;
      await import('leaflet.markercluster');
      if (cancelled || !elRef.current || ref.current) return;
      const map = L.map(elRef.current, { scrollWheelZoom: true }).setView([16.05, 108.22], 12);
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        subdomains: 'abcd', maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
      }).addTo(map);
      const cluster = L.markerClusterGroup({
        chunkedLoading: true, showCoverageOnHover: false, spiderfyOnMaxZoom: true, maxClusterRadius: 50,
        iconCreateFunction: (c: { getChildCount(): number }) => L.divIcon({
          html: `<span>${c.getChildCount()}</span>`, className: 'dmls-cluster', iconSize: L.point(40, 40),
        }),
      });
      map.addLayer(cluster);
      ref.current = { L, map, cluster };
      window.dispatchEvent(new Event('dmls-map-ready'));
    })();
    return () => {
      cancelled = true;
      if (ref.current) { ref.current.map.remove(); ref.current = null; }
    };
  }, []);

  // Markers, rebuilt whenever the filtered set or language changes.
  useEffect(() => {
    const draw = () => {
      if (!ref.current) return;
      const { L, map, cluster } = ref.current;
      cluster.clearLayers();
      const markers = mapped.map(l => {
        const [lat, lng, precision] = l.geo!;
        const tag = shortPrice(l.price, lang) ?? '•';
        const m = L.marker([lat, lng], {
          icon: L.divIcon({ html: `<span>${esc(tag)}</span>`, className: `dmls-pin${precision === 3 ? ' approx' : ''}`, iconSize: [0, 0] }),
          riseOnHover: true,
        });
        m.bindPopup(() => {
          const label = l.geoLabel || '';
          const loc = precision === 0 ? t.mapAtBuilding(label)
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
      });
      cluster.addLayers(markers);
      if (markers.length) map.fitBounds(cluster.getBounds(), { padding: [30, 30], maxZoom: 15 });
    };
    draw();
    window.addEventListener('dmls-map-ready', draw);
    return () => window.removeEventListener('dmls-map-ready', draw);
  }, [mapped, lang, t]);

  return (
    <div>
      <div ref={elRef} className="w-full h-[70vh] min-h-[420px] rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 relative z-0" />
      {unmapped > 0 && <p className="text-xs text-slate-400 mt-2">{t.mapUnmapped(unmapped)}</p>}
    </div>
  );
}
