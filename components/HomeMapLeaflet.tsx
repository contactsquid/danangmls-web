'use client';

import { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import type { Listing } from '@/lib/types';
import { useLanguage } from './LanguageProvider';
import { addBasemap, DANANG_CENTER, MAP_MAX_ZOOM } from '@/lib/mapTiles';
import { pinHtml, popupHtml, POPUP_OPTIONS } from '@/lib/mapMarkers';
import { localizedTitle } from '@/lib/price';
import { declutter, tagWidthPx } from '@/lib/geo/grouping';
import { pointAllowed } from '@/lib/geo/areas';
import { shortPrice } from '@/lib/geo/shortPrice';

// The homepage map (Blake, 2026-10-24): the latest rentals and for-sale listings —
// the 12 newest of each — as price tags, nudged apart so none hides another. Loaded only when scrolled
// near (components/HomeMap.tsx).
export default function HomeMapLeaflet({ listings }: { listings: Listing[] }) {
  const { lang, t } = useLanguage();
  const elRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let map: any = null;
    (async () => {
      const L = (await import('leaflet')).default;
      if (cancelled || !elRef.current) return;
      // Scroll-wheel zoom off: the map sits mid-page, and the wheel should scroll it.
      map = L.map(elRef.current, { scrollWheelZoom: false, maxZoom: MAP_MAX_ZOOM });
      addBasemap(L, map);
      const placed = listings.filter(l => l.geo);
      const points = placed.map(l => [l.geo![0], l.geo![1]] as [number, number]);
      if (points.length > 1) {
        // Fit all pins, then one level closer (Blake, 2026-09-30): a single far-out
        // listing (Hoi An, Hue) otherwise shrinks the whole city to a corner.
        // The outliers sit just off-screen; the map can still be dragged to them.
        map.fitBounds(L.latLngBounds(points), { padding: [50, 50], maxZoom: 15, animate: false });
        map.setZoom(Math.min(map.getZoom() + 1, 15), { animate: false });
      }
      else map.setView(points[0] ?? DANANG_CENTER, points.length ? 15 : 12);
      // Nudge overlapping tags apart, like the map view — never out of their area
      // or onto water.
      const zoom = map.getZoom();
      const spots = declutter(placed.map((l, i) => {
        const p = map.project([l.geo![0], l.geo![1]], zoom);
        return { id: i, x: p.x, y: p.y, w: tagWidthPx(shortPrice(l.price, lang) ?? '•'), h: 28 };
      }), 60, tg => {
        const ll = map.unproject([tg.x, tg.y], zoom);
        return pointAllowed([ll.lat, ll.lng], placed[tg.id].district, placed[tg.id].geoArea || null);
      });
      const at = new Map(spots.map(sp => [sp.id, map.unproject([sp.x, sp.y], zoom)]));
      placed.forEach((l, i) => {
        L.marker(at.get(i) ?? [l.geo![0], l.geo![1]], {
          icon: L.divIcon({ html: pinHtml(l, lang), className: `dmls-pin${l.forSale ? ' sale' : ''}`, iconSize: [0, 0] }),
          riseOnHover: true, keyboard: true, title: localizedTitle(l, lang),
        }).bindPopup(() => popupHtml(l, lang, t), POPUP_OPTIONS).addTo(map);
      });
    })();
    return () => { cancelled = true; if (map) map.remove(); };
  }, [listings, lang, t]);

  return <div ref={elRef} className="w-full h-full bg-slate-100 relative z-0" />;
}
