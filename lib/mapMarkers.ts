// Price-tag pins and listing popups, shared by the listings map view
// (components/ListingsMap.tsx) and each listing page's location map
// (components/ListingLocationMap.tsx). HTML strings because Leaflet markers are.
import type { Listing } from './types';
import type { Translations } from './translations';
import { PIN_ICONS, pinKind } from './geo/pinIcon';
import { shortPrice } from './geo/shortPrice';
import { bedroomsLabel } from './propertyTypes';
import { convertPrice, localizeDistrict, localizedTitle } from './price';
import { listingHref } from './facets';

type Lang = 'en' | 'vi' | 'ko' | 'ru';

export const esc = (s: string) => s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));

/** The price tag's inner HTML: type icon + short price. */
export function pinHtml(l: Listing, lang: Lang, price = shortPrice(l.price, lang) ?? '•'): string {
  return `<span>${PIN_ICONS[pinKind(l)]}${esc(price)}</span>`;
}

/** "At Sam Towers" / "On Ho Nghinh Street" / "In My An" / "Approximate location: Son Tra". */
export function locationLine(l: Listing, lang: Lang, t: Translations): string {
  const [, , precision] = l.geo ?? [0, 0, 3];
  const label = l.geoLabel || '';
  return precision === 0 ? t.mapAtBuilding(label)
    : precision === 4 ? t.mapNearBuilding(label)
    : precision === 1 ? t.mapOnStreet(label)
    : precision === 2 ? t.mapInWard(label)
    : t.mapApprox(localizeDistrict(l.district, lang));
}

/** The small listing card shown when a pin is clicked. */
export function popupHtml(l: Listing, lang: Lang, t: Translations): string {
  const img = l.images[0] ? `<img src="${esc(l.images[0])}" alt="" loading="lazy">` : '';
  const bl = bedroomsLabel(l.type, l.bedrooms, t);   // Studio / 3 BR / none for land
  const beds = bl ? `🛏 ${esc(bl)} · ` : '';
  return `<a href="${esc(listingHref(l.slug, lang))}">${img}<div class="b">`
    + `<div class="p">${esc(l.price ? convertPrice(l.price, lang) : '')}</div>`
    + `<div class="t">${esc(localizedTitle(l, lang))}</div>`
    + `<div class="m">${beds}${esc(locationLine(l, lang, t))}</div></div></a>`;
}

export const POPUP_OPTIONS = { className: 'dmls-popup', maxWidth: 240, minWidth: 240, offset: [0, -34] as [number, number] };
