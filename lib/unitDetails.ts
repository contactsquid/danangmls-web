// Unit details for an apartment listing, read from its title and description: bathrooms, size, floor.
// The sheet has no columns for these, so they come from the text (measured on Sam Towers 2026-10-22:
// baths in ~48% of descriptions, size ~63%, floor ~30%). Blake: unit numbers don't matter, the floor does.
import type { Listing } from './types';

export type UnitDetails = { beds?: string; baths?: number; sizeM2?: number; floor?: string };

const BATHS = /\b(\d)\s*(?:-\s*)?(?:bath(?:room)?s?|wc|toilets?)\b|(\d)\s*(?:phòng tắm|nhà vệ sinh|wc)/i;
const SIZE = /\b(\d{2,3}(?:[.,]\d)?)\s*(?:m2|m²|sqm|square\s*met(?:er|re)s?)(?![a-z0-9])/i;   // not \b: "m²" ends in a non-word char
const FLOOR_NUM = /\b(\d{1,2})(?:st|nd|rd|th)?[- ]floor\b|\bfloor\s*(\d{1,2})\b|\btầng\s*(\d{1,2})\b/i;
const FLOOR_BAND = /\b(high|low|mid(?:dle)?)[- ]floor\b|\btầng\s*(cao|thấp|trung)\b/i;

const ordinal = (n: number) => `${n}${n % 100 >= 11 && n % 100 <= 13 ? 'th' : ['th', 'st', 'nd', 'rd'][n % 10] ?? 'th'}`;

export function unitDetails(l: Pick<Listing, 'title' | 'text' | 'bedrooms'> & { vi_text?: string }): UnitDetails {
  const t = `${l.title} ${l.text || ''} ${l.vi_text || ''}`;
  const d: UnitDetails = {};
  // "0" in the sheet means unknown far more often than studio (an 85 m² "0-bed"), so only the word counts.
  if (l.bedrooms && /^[1-9]\d*$/.test(String(l.bedrooms))) d.beds = String(l.bedrooms);
  else if (/studio/i.test(t)) d.beds = 'Studio';
  const b = t.match(BATHS);
  if (b) { const n = Number(b[1] || b[2]); if (n >= 1 && n <= 6) d.baths = n; }
  const s = t.match(SIZE);
  if (s) { const n = Number(s[1].replace(',', '.')); if (n >= 20 && n <= 500) d.sizeM2 = Math.round(n); }
  const f = t.match(FLOOR_NUM);
  if (f) { const n = Number(f[1] || f[2] || f[3]); if (n >= 1 && n <= 60) d.floor = `${ordinal(n)} floor`; }
  else {
    const band = t.match(FLOOR_BAND);
    if (band) {
      const w = (band[1] || band[2] || '').toLowerCase();
      d.floor = /high|cao/.test(w) ? 'High floor' : /low|thấp/.test(w) ? 'Low floor' : 'Mid floor';
    }
  }
  return d;
}

/** "2 beds · 2 baths · 85 m² · 24th floor" — only the parts we know. */
export function unitSummary(d: UnitDetails): string {
  const parts = [
    d.beds ? (d.beds === 'Studio' ? 'Studio' : `${d.beds} ${d.beds === '1' ? 'bed' : 'beds'}`) : '',
    d.baths ? `${d.baths} ${d.baths === 1 ? 'bath' : 'baths'}` : '',
    d.sizeM2 ? `${d.sizeM2} m²` : '',
    d.floor || '',
  ].filter(Boolean);
  return parts.join(' · ') || '—';
}
