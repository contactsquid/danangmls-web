// Property types and room options, shared by search, the agent listing forms and
// every place a listing's bedrooms are shown (Blake, 2026-09-28). Client-safe.

/** Search dropdowns and the add-listing form use exactly these. */
export const RENT_TYPES = ['Apartment', 'Commercial', 'House', 'Villa'] as const;
export const SALE_TYPES = ['Apartment', 'Commercial', 'House', 'Land', 'Villa'] as const;
export const propertyTypesFor = (forSale: boolean): readonly string[] => (forSale ? SALE_TYPES : RENT_TYPES);

/** Scraped/legacy types onto the list above: townhouses and shophouses are houses,
 *  hotels/offices/retail are commercial, a studio is an apartment, and land for
 *  rent is commercial (nobody rents land for anything else). Unknown → unchanged. */
export function canonicalType(raw: string, forSale: boolean): string {
  const t = (raw || '').trim().toLowerCase();
  if (!t) return raw;
  if (/hotel|office|retail|commercial|warehouse|factory/.test(t)) return 'Commercial';
  if (t === 'land') return forSale ? 'Land' : 'Commercial';
  if (/apartment|studio|condo/.test(t)) return 'Apartment';
  if (t === 'villa') return 'Villa';
  if (/house/.test(t)) return 'House';            // house, townhouse, shophouse
  return raw;
}

const upTo = (from: number) => [...Array.from({ length: 10 - from }, (_, i) => String(from + i)), '10+'];

/** Bedrooms dropdown for a type. "0" is shown as "Studio" for apartments and as
 *  "0" for commercial; houses and villas start at 1; land has no bedrooms. */
export function bedroomOptions(type: string): string[] {
  if (type === 'Apartment' || type === 'Commercial') return upTo(0);
  if (type === 'House' || type === 'Villa') return upTo(1);
  return [];
}

export function bathroomOptions(type: string): string[] {
  const homes = ['1', '2', '3', '4', '5', '6', '7', '8+'];
  if (type === 'Commercial') return ['0', ...homes];
  if (type === 'Apartment' || type === 'House' || type === 'Villa') return homes;
  return [];
}

/** What a listing shows for bedrooms: "Studio" for a 0-bedroom apartment, the count
 *  otherwise — or nothing for land, and for a house/villa recorded as 0 (that's an
 *  unknown count, there's no such thing as a studio house). */
export function bedroomsDisplay(type: string, bedrooms: string): { studio: true } | { count: string } | null {
  const b = String(bedrooms ?? '').trim();
  if (!b || type === 'Land') return null;
  if (b === '0') {
    if (type === 'Apartment') return { studio: true };
    if (type === 'Commercial') return { count: '0' };
    return null;
  }
  return { count: b };
}

/** The bedrooms chip text ("Studio", "3 BR", "0 BR") or null for no chip. */
export function bedroomsLabel(type: string, bedrooms: string, t: { br: string; studio: string }): string | null {
  const d = bedroomsDisplay(type, bedrooms);
  return !d ? null : 'studio' in d ? t.studio : `${d.count} ${t.br}`;
}

/** Vietnamese title fragment: " studio" / " 3 phòng ngủ" / "" (never "0 phòng ngủ"). */
export function bedroomsViPhrase(type: string, bedrooms: string): string {
  const d = bedroomsDisplay(type, bedrooms);
  return !d ? '' : 'studio' in d ? ' studio' : d.count === '0' ? '' : ` ${d.count} phòng ngủ`;
}

/** schema.org numberOfRooms: a studio is 1 room; omit for land / unknown / 0. */
export function schemaRooms(type: string, bedrooms: string): string | undefined {
  const d = bedroomsDisplay(type, bedrooms);
  return !d ? undefined : 'studio' in d ? '1' : d.count === '0' ? undefined : d.count;
}
