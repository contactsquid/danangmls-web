import { test } from 'node:test';
import assert from 'node:assert/strict';
import { unitDetails, unitSummary } from './unitDetails';

const u = (title: string, text = '', bedrooms = '') => unitDetails({ title, text, bedrooms });

test('reads baths, size and floor from real Sam Towers wording', () => {
  assert.deepEqual(u('Spacious Corner Apartment', '2 bathrooms, 85 square meters on the 24th floor', '2'), { beds: '2', baths: 2, sizeM2: 85, floor: '24th floor' });
  assert.equal(u('Apt', 'Located on the 14th-floor with bay views').floor, '14th floor');
  assert.equal(u('Apt', 'Diện tích 70m², tầng 12').sizeM2, 70);
  assert.equal(u('Apt', 'Diện tích 70m², tầng 12').floor, '12th floor');
  assert.equal(u('Apt', 'High-floor unit with river view').floor, 'High floor');
  assert.equal(u('Apt', '3rd floor').floor, '3rd floor');
  assert.equal(u('Apt', '11th floor').floor, '11th floor');
});
test('ignores numbers that are not unit details', () => {
  assert.equal(u('Apt', 'Land plot 5000 m2').sizeM2, undefined);   // out of apartment range
  assert.equal(u('Apt', 'Building has 37 floors').floor, undefined);
});
test('summary shows only what is known', () => {
  assert.equal(unitSummary({ beds: '2', baths: 2, sizeM2: 85, floor: '24th floor' }), '2 beds · 2 baths · 85 m² · 24th floor');
  assert.equal(unitSummary({ beds: '1' }), '1 bed');
  assert.equal(unitSummary({}), '—');
});
