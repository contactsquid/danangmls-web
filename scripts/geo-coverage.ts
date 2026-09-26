// How many listings land at each map precision. npx tsx scripts/geo-coverage.ts
import { getListings, getForSaleListings } from '../lib/sheets';

const NAMES = ['building', 'street', 'ward', 'district', 'nearBuilding'];
(async () => {
  for (const [mode, list] of [['rent', await getListings()], ['sale', await getForSaleListings()]] as const) {
    const c: Record<string, number> = { none: 0, building: 0, nearBuilding: 0, street: 0, ward: 0, district: 0 };
    for (const l of list) c[l.geo ? NAMES[l.geo[2]] : 'none']++;
    const mapped = list.length - c.none;
    console.log(mode, 'total', list.length, 'mapped', mapped, c,
      'finer-than-district', `${Math.round((100 * (mapped - c.district)) / Math.max(mapped, 1))}%`);
  }
})();
