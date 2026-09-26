// Basemap for every Leaflet map on the site (district boundary maps + the
// listings map view). Esri Light Gray Canvas: base + a separate label layer drawn
// on top. No API key.
//
// History: these were CARTO light_all tiles until CARTO started requiring an API
// key (noticed 2026-09-26) — every district map had been showing an
// "API KEY REQUIRED" watermark instead of streets. Blake chose Esri Light Gray.
// Esri's terms expect commercial sites to use a (free) ArcGIS Location Platform
// account; if we get a key, it goes on these URLs as ?token=.
//
// Light Gray Canvas only has tiles to zoom 16; deeper zooms scale those up.
const ESRI = 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas';

export const MAP_MAX_ZOOM = 18;

export const BASEMAP_LAYERS = [
  `${ESRI}/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}`,
  `${ESRI}/World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}`,
];

export const BASEMAP_OPTIONS = {
  maxNativeZoom: 16,
  maxZoom: MAP_MAX_ZOOM,
  attribution: 'Tiles &copy; Esri &mdash; Esri, HERE, Garmin, &copy; OpenStreetMap contributors',
};

/** Adds the site basemap to a Leaflet map. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function addBasemap(L: any, map: any): void {
  BASEMAP_LAYERS.forEach((url, i) =>
    // Attribution once, on the base layer.
    L.tileLayer(url, i === 0 ? BASEMAP_OPTIONS : { ...BASEMAP_OPTIONS, attribution: '' }).addTo(map));
}
