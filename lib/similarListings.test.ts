import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getSimilarListings } from './similarListings';
import { searchDistricts } from './searchDistricts';
import type { Listing } from './types';

const L = (slug: string, type: string, district: string, price: string, forSale = false) =>
  ({ slug, type, district, price, forSale }) as unknown as Listing;

test('similar listings skip "Price on request" (no number in the price)', () => {
  const current = L('me', 'House', 'Son Tra', '$800/month');
  const all = [current, L('a', 'House', 'Son Tra', ''), L('b', 'House', 'Son Tra', '$700/month'),
    L('c', 'House', 'Son Tra', '(Price not specified)'), L('d', 'House', 'Son Tra', '$900/month'),
    L('e', 'House', 'Hai Chau', '$650/month'), L('f', 'Apartment', 'Son Tra', '$500/month'), L('g', 'House', 'Son Tra', '$1,200/month')];
  assert.deepEqual(getSimilarListings(current, all).map(l => l.slug), ['b', 'd', 'g', 'e']);
});
test('same tiers as before: same type+district, then same type, then same district', () => {
  const current = L('me', 'House', 'Son Tra', '$800/month');
  const all = [L('x', 'Apartment', 'Son Tra', '$1/month'), L('y', 'House', 'Hai Chau', '$2/month'), L('z', 'House', 'Son Tra', '$3/month')];
  assert.deepEqual(getSimilarListings(current, all).map(l => l.slug), ['z', 'y', 'x']);
});
test('never mixes rent and sale, never includes itself', () => {
  const current = L('me', 'House', 'Son Tra', '$800/month');
  assert.deepEqual(getSimilarListings(current, [current, L('s', 'House', 'Son Tra', '$200,000', true)]), []);
});
test('district dropdown leaves out "Not Provided"', () => {
  const ls = [L('a', 'House', 'Son Tra', ''), L('b', 'House', 'Not Provided', ''), L('c', 'House', 'Hai Chau', ''), L('d', 'House', '', '')];
  assert.deepEqual(searchDistricts(ls), ['Hai Chau', 'Son Tra']);
});
