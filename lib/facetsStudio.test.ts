import { test } from 'node:test';
import assert from 'node:assert/strict';
import { resolveFacet, facetSlug, facetMatches, listingFieldHref, facetUrl, facetContent, facetsWithInventory, facetInitialFilters } from './facets';
import type { Listing } from './types';

const L = (type: string, bedrooms: string) => ({ type, bedrooms, district: 'Son Tra', title: '', text: '' }) as unknown as Listing;
const STUDIO = { kind: 'bedrooms' as const, value: 'studio' };

test('/studio is the studio bedrooms page, in every language', () => {
  assert.deepEqual(resolveFacet('studio'), STUDIO);
  assert.equal(facetSlug(STUDIO, 'en'), 'studio');
  assert.equal(facetSlug(STUDIO, 'vi'), 'studio');
  assert.equal(facetUrl('rent', 'en', STUDIO), '/for-rent/studio');
  assert.equal(facetUrl('sale', 'vi', STUDIO), '/vi/mua-ban/studio');
  assert.deepEqual(facetInitialFilters(STUDIO), { beds: 'studio' });
});
test('it lists 0-bedroom apartments only', () => {
  assert.equal(facetMatches(L('Apartment', '0'), STUDIO), true);
  assert.equal(facetMatches(L('Apartment', '1'), STUDIO), false);
  assert.equal(facetMatches(L('Commercial', '0'), STUDIO), false);
  assert.equal(facetMatches(L('House', '0'), STUDIO), false);
});
test('the Studio chip links to it', () => {
  assert.equal(listingFieldHref('bedrooms', 'studio', 'rent', 'en'), '/for-rent/studio');
  assert.equal(listingFieldHref('bedrooms', 'studio', 'sale', 'ko'), '/ko/for-sale/studio');
});
test('headings name studio apartments', () => {
  assert.equal(facetContent(STUDIO, 'rent', 'en', 916).h1, 'Studio Apartments for Rent in Da Nang, Vietnam');
  assert.equal(facetContent(STUDIO, 'sale', 'en', 133).h1, 'Studio Apartments for Sale in Da Nang, Vietnam');
  assert.match(facetContent(STUDIO, 'rent', 'vi', 916).h1, /Căn Hộ Studio Cho Thuê/);
  assert.match(facetContent(STUDIO, 'rent', 'ko', 916).h1, /원룸/);
  assert.match(facetContent(STUDIO, 'rent', 'ru', 916).h1, /студи/i);
});
test('the sitemap gets it only while studios exist', () => {
  assert.ok(facetsWithInventory([L('Apartment', '0')]).some(f => f.kind === 'bedrooms' && f.value === 'studio'));
  assert.ok(!facetsWithInventory([L('House', '0'), L('Apartment', '2')]).some(f => f.value === 'studio'));
});
