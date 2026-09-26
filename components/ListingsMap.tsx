'use client';

import { useEffect, useMemo, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import type { Listing } from '@/lib/types';
import { useLanguage } from './LanguageProvider';
import { shortPrice } from '@/lib/geo/shortPrice';
import { isFreshForMap } from '@/lib/geo/freshness';
import { declutter, groupPoints, tagWidthPx } from '@/lib/geo/grouping';
import { PIN_ICONS, pinKind } from '@/lib/geo/pinIcon';
import { pointAllowed, wardGeometry, wardKey } from '@/lib/geo/areas';
import { DISTRICT_BOUNDARIES } from '@/lib/districtBoundaries';
import { convertPrice, localizeDistrict, localizedTitle } from '@/lib/price';
import { listingHref } from '@/lib/facets';
import { addBasemap, MAP_MAX_ZOOM } from '@/lib/mapTiles';

// Map view for ListingsGrid. Loaded with next/dynamic (ssr: false) so list-view
// visitors never download Leaflet. Placement comes precomputed on each listing
// (lib/geo/placement.ts); only recent listings are shown (lib/geo/freshness.ts).
//
// Display rules (Blake, 2026-09-26), re-applied on every pan/zoom:
// - fewer than PINS_BELOW listings in view: every listing is a price tag;
// - otherwise listings are binned on a screen grid and only cells holding 11+
//   become a numbered circle (lib/geo/grouping.ts); smaller cells stay tags.
const PINS_BELOW = 100;
const CELL_PX = 72;
// How far a tag may be nudged off its spot so it doesn't cover a neighbour.
const MAX_NUDGE_PX = 90;

const esc = (s: string) => s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));

export default function ListingsMap({ listings, mode, district = '', neighborhood = '' }: {
  listings: Listing[]; mode: 'rent' | 'sale';
  /** The grid's district / neighborhood filters: their outline is drawn on the map. */
  district?: string; neighborhood?: string;
}) {
  const { lang, t } = useLanguage();
  const elRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ref = useRef<{ L: any; map: any; layer: any } | null>(null);
  // Memoised so the marker effect re-runs only when the filtered set changes.
  const fresh = useMemo(() => {
    const now = Date.now();
    return listings.filter(l => isFreshForMap(l, now));
  }, [listings]);
  const mapped = useMemo(() => fresh.filter(l => l.geo), [fresh]);
  const unmapped = fresh.length - mapped.length;

  // The map, created once.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const L = (await import('leaflet')).default;
      if (cancelled || !elRef.current || ref.current) return;
      const map = L.map(elRef.current, { scrollWheelZoom: true, maxZoom: MAP_MAX_ZOOM }).setView([16.05, 108.22], 12);
      addBasemap(L, map);
      ref.current = { L, map, layer: L.layerGroup().addTo(map) };
      window.dispatchEvent(new Event('dmls-map-ready'));
    })();
    return () => {
      cancelled = true;
      if (ref.current) { ref.current.map.remove(); ref.current = null; }
    };
  }, []);

  // Markers, rebuilt whenever the filtered set or language changes.
  useEffect(() => {
    // Tag markers are cached by listing index and reused across pans: opening a
    // popup auto-pans the map, and recreating its marker would close the popup.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const tags = new Map<number, any>();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let groupMarkers: any[] = [];

    const prices = new Map<number, string>();
    const priceOf = (i: number) => {
      let p = prices.get(i);
      if (p === undefined) { p = shortPrice(mapped[i].price, lang) ?? '•'; prices.set(i, p); }
      return p;
    };

    const tagFor = (i: number) => {
      const cached = tags.get(i);
      if (cached) return cached;
      const { L } = ref.current!;
      const l = mapped[i];
      const [lat, lng, precision] = l.geo!;
      const price = priceOf(i);
      const m = L.marker([lat, lng], {
        icon: L.divIcon({ html: `<span>${PIN_ICONS[pinKind(l)]}${esc(price)}</span>`, className: 'dmls-pin', iconSize: [0, 0] }),
        riseOnHover: true,
        keyboard: true,
        title: localizedTitle(l, lang),
      });
      m.bindPopup(() => {
        const label = l.geoLabel || '';
        const loc = precision === 0 ? t.mapAtBuilding(label)
          : precision === 4 ? t.mapNearBuilding(label)
          : precision === 1 ? t.mapOnStreet(label)
          : precision === 2 ? t.mapInWard(label)
          : t.mapApprox(localizeDistrict(l.district, lang));
        const img = l.images[0] ? `<img src="${esc(l.images[0])}" alt="" loading="lazy">` : '';
        // '0' is a land plot, a commercial space or a studio: no bedroom count to show.
        const beds = l.bedrooms && l.bedrooms !== '0' ? `🛏 ${esc(l.bedrooms)} ${esc(t.br)} · ` : '';
        return `<a href="${esc(listingHref(l.slug, lang))}">${img}<div class="b">`
          + `<div class="p">${esc(l.price ? convertPrice(l.price, lang) : '')}</div>`
          + `<div class="t">${esc(localizedTitle(l, lang))}</div>`
          + `<div class="m">${beds}${esc(loc)}</div></div></a>`;
      }, { className: 'dmls-popup', maxWidth: 240, minWidth: 240, offset: [0, -34] });
      // The open listing's tag turns dark, so you can see which pin the card belongs to.
      m.on('popupopen', () => m.getElement()?.classList.add('sel'));
      m.on('popupclose', () => m.getElement()?.classList.remove('sel'));
      tags.set(i, m);
      return m;
    };

    const refresh = () => {
      if (!ref.current) return;
      const { L, map, layer } = ref.current;
      const zoom = map.getZoom();
      const view = map.getBounds();
      // Pad the drawn area a little so a short pan doesn't reveal an empty edge.
      const around = view.pad(0.25);
      const near: number[] = [];
      let inView = 0;
      mapped.forEach((l, i) => {
        const p: [number, number] = [l.geo![0], l.geo![1]];
        if (around.contains(p)) near.push(i);
        if (view.contains(p)) inView++;
      });

      let showTags = near;
      const groups: { at: unknown; ids: number[] }[] = [];
      const circlesPx: { x: number; y: number }[] = [];
      if (inView >= PINS_BELOW && zoom < MAP_MAX_ZOOM) {
        const r = groupPoints(near.map(i => {
          const p = map.project([mapped[i].geo![0], mapped[i].geo![1]], zoom);
          return { id: i, x: p.x, y: p.y };
        }), CELL_PX);
        showTags = r.singles;
        for (const g of r.groups) {
          groups.push({ at: map.unproject([g.x, g.y], zoom), ids: g.ids });
          // A tag's anchor is its pointer tip and its body sits ~20px above it, so
          // shift the circle's footprint down to compare like with like.
          circlesPx.push({ x: g.x, y: g.y + 20 });
        }
      }

      // Nudge overlapping tags apart (screen pixels at this zoom). The tag whose
      // popup is open stays put so its card doesn't jump.
      // Circles are fixed obstacles (negative ids) so tags aren't nudged under them.
      const spots = declutter([
        ...circlesPx.map((c, k) => ({ id: -1 - k, x: c.x, y: c.y, w: 58, h: 58, pinned: true })),
        ...showTags.map(i => {
          const p = map.project([mapped[i].geo![0], mapped[i].geo![1]], zoom);
          return { id: i, x: p.x, y: p.y, w: tagWidthPx(priceOf(i)), h: 28, pinned: !!tags.get(i)?.isPopupOpen() };
        }),
      ], MAX_NUDGE_PX, t => {
        // A nudged tag must stay inside its ward/district and off water, like its pin.
        if (t.id < 0) return true;
        const l = mapped[t.id];
        const ll = map.unproject([t.x, t.y], zoom);
        return pointAllowed([ll.lat, ll.lng], l.district, l.geoArea || null);
      }).filter(s => s.id >= 0);

      // Tags: add what's newly needed, drop what isn't, move the rest into place.
      const want = new Set(showTags);
      for (const [i, m] of tags) if (!want.has(i) && layer.hasLayer(m)) layer.removeLayer(m);
      for (const s of spots) {
        const m = tagFor(s.id);
        if (!s.pinned) m.setLatLng(map.unproject([s.x, s.y], zoom));
        if (!layer.hasLayer(m)) layer.addLayer(m);
      }

      // Circles carry no state, so they are simply redrawn.
      for (const m of groupMarkers) layer.removeLayer(m);
      groupMarkers = groups.map(g => {
        const m = L.marker(g.at, {
          icon: L.divIcon({ html: `<span>${g.ids.length}</span>`, className: 'dmls-cluster', iconSize: L.point(46, 46) }),
          keyboard: true,
          title: String(g.ids.length),
          zIndexOffset: 1000,
        });
        m.on('click', () => map.fitBounds(L.latLngBounds(g.ids.map(i => [mapped[i].geo![0], mapped[i].geo![1]])), { padding: [40, 40], maxZoom: MAP_MAX_ZOOM }));
        layer.addLayer(m);
        return m;
      });
    };

    let attachedTo: { off(ev: string, fn: () => void): void } | null = null;
    const start = () => {
      if (!ref.current || attachedTo) return;
      const { L, map, layer } = ref.current;
      layer.clearLayers();
      map.on('moveend', refresh);
      attachedTo = map;
      if (mapped.length) {
        map.fitBounds(L.latLngBounds(mapped.map(l => [l.geo![0], l.geo![1]])), { padding: [30, 30], maxZoom: 15 });
      }
      refresh();   // fitBounds may not move the map (no moveend), so draw now too
    };

    start();
    window.addEventListener('dmls-map-ready', start);
    return () => {
      window.removeEventListener('dmls-map-ready', start);
      attachedTo?.off('moveend', refresh);
    };
  }, [mapped, lang, t]);

  // Outline of the filtered neighborhood (its ward) or district.
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let outline: any = null;
    const draw = () => {
      if (!ref.current || outline) return;
      const { L, map } = ref.current;
      const ward = district && neighborhood ? wardKey(district, neighborhood) : null;
      const geom = ward ? wardGeometry(ward) : district ? DISTRICT_BOUNDARIES[district] : null;
      if (!geom) return;
      outline = L.geoJSON(geom, {
        interactive: false,
        style: { color: '#2563eb', weight: 3, opacity: 0.9, fillColor: '#3b82f6', fillOpacity: 0.06 },
      }).addTo(map);
    };
    draw();
    window.addEventListener('dmls-map-ready', draw);
    return () => {
      window.removeEventListener('dmls-map-ready', draw);
      if (outline && ref.current) ref.current.map.removeLayer(outline);
    };
  }, [district, neighborhood]);

  return (
    <div>
      <div ref={elRef} data-listings-map className="w-full h-[70vh] min-h-[420px] rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 relative z-0" />
      <p className="text-xs text-slate-500 mt-2">{t.mapFresh(fresh.length, mode === 'sale')}</p>
      {unmapped > 0 && <p className="text-xs text-slate-400 mt-1">{t.mapUnmapped(unmapped)}</p>}
    </div>
  );
}
