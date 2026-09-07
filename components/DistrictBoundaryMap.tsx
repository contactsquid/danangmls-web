'use client';

import { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import { DISTRICT_BOUNDARIES } from '@/lib/districtBoundaries';

// Client-only Leaflet map: a clean light basemap with the district's real
// boundary drawn as a bold outline, zoomed to fit. No API key (CARTO/OSM tiles).
export default function DistrictBoundaryMap({ district }: { district: string }) {
  const elRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapRef = useRef<any>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const L = (await import('leaflet')).default;
      if (cancelled || !elRef.current || mapRef.current) return;

      const map = L.map(elRef.current, { scrollWheelZoom: false });
      mapRef.current = map;

      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        subdomains: 'abcd',
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
      }).addTo(map);

      const geom = DISTRICT_BOUNDARIES[district];
      if (geom) {
        const layer = L.geoJSON(geom as GeoJSON.GeoJsonObject, {
          style: { color: '#2563eb', weight: 4, opacity: 1, fillColor: '#3b82f6', fillOpacity: 0.12 },
        }).addTo(map);
        map.fitBounds(layer.getBounds(), { padding: [22, 22] });
      } else {
        map.setView([16.05, 108.22], 12);
      }
    })();

    return () => {
      cancelled = true;
      if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; }
    };
  }, [district]);

  return <div ref={elRef} className="w-full h-[380px] sm:h-[460px] bg-slate-100" />;
}
