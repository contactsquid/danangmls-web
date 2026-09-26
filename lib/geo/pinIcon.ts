// Property-type icon shown to the left of the price on each map pin (Blake chose
// the "type icon pill" design, 2026-09-26). Inline SVG strings because Leaflet
// markers are HTML strings, not React.
export type PinKind = 'apartment' | 'house' | 'villa' | 'land' | 'commercial';

const svg = (paths: string) =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;

export const PIN_ICONS: Record<PinKind, string> = {
  apartment: svg('<path d="M5 21V4.5a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1V21"/><path d="M15 9.5h3a1 1 0 0 1 1 1V21"/><path d="M3 21h18"/><path d="M8.5 7.5h3M8.5 11.5h3M8.5 15.5h3"/>'),
  house: svg('<path d="M3.5 10.5 12 3.5l8.5 7"/><path d="M5.5 9v11.5h13V9"/><path d="M10 20.5v-5.5h4v5.5"/>'),
  villa: svg('<path d="M2.5 11 10 5l7.5 6"/><path d="M4.5 9.5v11h11v-11"/><path d="M8.5 20.5V16h3v4.5"/><path d="M19.5 20.5V13"/><path d="M19.5 13c-1.8-.2-2.7-1.4-2.5-3 1.7.1 2.6 1.2 2.5 3Zm0 0c1.8-.2 2.7-1.4 2.5-3-1.7.1-2.6 1.2-2.5 3Z"/>'),
  land: svg('<path d="M4 7.5 12 4l8 3.5v9L12 20l-8-3.5z"/><path d="M12 4v16M4 7.5l8 3.5 8-3.5"/>'),
  commercial: svg('<path d="M4 10v10.5h16V10"/><path d="M3 10h18l-1.6-5.5H4.6z"/><path d="M9.5 20.5V15h5v5.5"/>'),
};

/** Which icon a listing gets. Villa is matched by text, like lib/facets.ts isVilla:
 *  enrichment types most villas as House. */
export function pinKind(l: { type: string; title: string; text: string }): PinKind {
  const type = (l.type || '').toLowerCase();
  if (type === 'villa' || /\bvillas?\b/i.test(`${l.title} ${l.text}`)) return 'villa';
  if (type === 'apartment') return 'apartment';
  if (type === 'land') return 'land';
  if (/commercial|shophouse|hotel|office|retail/.test(type)) return 'commercial';
  return 'house';
}
