'use client';

import { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import type { Listing } from '@/lib/types';
import { useLanguage } from './LanguageProvider';
import { addBasemap, MAP_MAX_ZOOM } from '@/lib/mapTiles';
import { pinHtml, popupHtml, POPUP_OPTIONS } from '@/lib/mapMarkers';
import { localizedTitle } from '@/lib/price';
import { declutter, tagWidthPx } from '@/lib/geo/grouping';
import { pointAllowed } from '@/lib/geo/areas';
import { shortPrice } from '@/lib/geo/shortPrice';

// The map on a listing page (Blake, 2026-09-28): this listing's pin, where the map
// view places it, plus the page's similar listings as price tags. Loaded only
// when scrolled near (components/ListingMapSection.tsx) — Leaflet never slows the
// first paint. Replaces an openstreetmap.org embed, which doesn't load from some
// Vietnamese networks.
const xy = (p: { x: number; y: number }) => ({ x: p.x, y: p.y });

export default function ListingLocationMap({ listing, similar }: { listing: Listing; similar: Listing[] }) {
  const { lang, t } = useLanguage();
  const elRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!listing.geo) return;
    let cancelled = false;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let map: any = null;
    (async () => {
      const L = (await import('leaflet')).default;
      if (cancelled || !elRef.current) return;
      // Scroll-wheel zoom off: this map sits mid-page, and the wheel should scroll the page.
      map = L.map(elRef.current, { scrollWheelZoom: false, maxZoom: MAP_MAX_ZOOM });
      addBasemap(L, map);

      const others = similar.filter(s => s.geo);
      const here: [number, number] = [listing.geo![0], listing.geo![1]];
      const points: [number, number][] = [here, ...others.map(s => [s.geo![0], s.geo![1]] as [number, number])];
      if (points.length > 1) map.fitBounds(L.latLngBounds(points), { padding: [40, 40], maxZoom: 16 });
      else map.setView(here, 15);

      // Nudge overlapping similar tags apart, like the map view (this listing stays
      // put), never out of their area or onto water.
      const zoom = map.getZoom();
      const px = (p: [number, number]) => map.project(p, zoom);
      const spots = declutter([
        { id: -1, ...xy(px(here)), w: tagWidthPx(shortPrice(listing.price, lang) ?? '•') * 1.12, h: 30, pinned: true },
        ...others.map((s, i) => ({ id: i, ...xy(px([s.geo![0], s.geo![1]])), w: tagWidthPx(shortPrice(s.price, lang) ?? '•'), h: 28 })),
      ], 60, tg => {
        if (tg.id < 0) return true;
        const ll = map.unproject([tg.x, tg.y], zoom);
        return pointAllowed([ll.lat, ll.lng], others[tg.id].district, others[tg.id].geoArea || null);
      });
      const at = new Map(spots.map(sp => [sp.id, map.unproject([sp.x, sp.y], zoom)]));

      others.forEach((s, i) => {
        L.marker(at.get(i) ?? [s.geo![0], s.geo![1]], {
          icon: L.divIcon({ html: pinHtml(s, lang), className: 'dmls-pin', iconSize: [0, 0] }),
          riseOnHover: true, keyboard: true, title: localizedTitle(s, lang),
        }).bindPopup(() => popupHtml(s, lang, t), POPUP_OPTIONS).addTo(map);
      });
      // This listing last and on top: the dark tag.
      L.marker(here, {
        icon: L.divIcon({ html: pinHtml(listing, lang), className: 'dmls-pin sel main', iconSize: [0, 0] }),
        zIndexOffset: 1000, keyboard: false, title: localizedTitle(listing, lang),
      }).addTo(map);
    })();
    return () => { cancelled = true; if (map) map.remove(); };
  }, [listing, similar, lang, t]);

  return <div ref={elRef} className="w-full h-full bg-slate-100 relative z-0" />;
}
