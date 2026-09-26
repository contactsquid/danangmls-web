import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isFreshForMap, MAP_MAX_AGE_DAYS } from './freshness';

const now = new Date('2026-09-26T12:00:00+07:00').getTime();
const daysAgo = (d: number) => new Date(now - d * 864e5).toISOString();

test('rentals: 2 weeks', () => {
  assert.equal(MAP_MAX_AGE_DAYS.rent, 14);
  assert.equal(isFreshForMap({ date: daysAgo(13.9), forSale: false }, now), true);
  assert.equal(isFreshForMap({ date: daysAgo(14.1), forSale: false }, now), false);
});
test('for sale: 4 weeks', () => {
  assert.equal(isFreshForMap({ date: daysAgo(27), forSale: true }, now), true);
  assert.equal(isFreshForMap({ date: daysAgo(29), forSale: true }, now), false);
});
test('undated or unparseable listings are not shown (age unknown)', () => {
  assert.equal(isFreshForMap({ date: '', forSale: true }, now), false);
  assert.equal(isFreshForMap({ date: 'soon', forSale: false }, now), false);
});
test('date-only strings from the sheet still parse', () => {
  assert.equal(isFreshForMap({ date: '2026-09-20', forSale: false }, now), true);
});
