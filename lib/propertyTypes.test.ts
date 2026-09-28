import { test } from 'node:test';
import assert from 'node:assert/strict';
import { RENT_TYPES, SALE_TYPES, canonicalType, bedroomOptions, bathroomOptions, bedroomsDisplay } from './propertyTypes';

test('one list of types for search and the add form', () => {
  assert.deepEqual([...RENT_TYPES], ['Apartment', 'Commercial', 'House', 'Villa']);
  assert.deepEqual([...SALE_TYPES], ['Apartment', 'Commercial', 'House', 'Land', 'Villa']);
});
test('scraped types map onto them (Blake, 2026-09-28)', () => {
  assert.equal(canonicalType('Townhouse', true), 'House');
  assert.equal(canonicalType('Shophouse', true), 'House');
  assert.equal(canonicalType('Hotel', true), 'Commercial');
  assert.equal(canonicalType('Hotel Building (Villa/House)', true), 'Commercial');
  assert.equal(canonicalType('Office', true), 'Commercial');
  assert.equal(canonicalType('Retail', false), 'Commercial');
  assert.equal(canonicalType('Studio', false), 'Apartment');
  assert.equal(canonicalType('Land', true), 'Land');
  assert.equal(canonicalType('Land', false), 'Commercial');    // renting land is commercial
  for (const t of ['Apartment', 'House', 'Villa', 'Commercial']) assert.equal(canonicalType(t, false), t);
  assert.equal(canonicalType('house', true), 'House');
});
test('bedroom choices depend on the type', () => {
  assert.equal(bedroomOptions('Apartment')[0], '0');               // Studio
  assert.equal(bedroomOptions('House')[0], '1');                   // no studio houses
  assert.equal(bedroomOptions('Villa')[0], '1');
  assert.equal(bedroomOptions('Commercial')[0], '0');              // 0 BR is normal
  assert.deepEqual(bedroomOptions('Land'), []);
  assert.equal(bedroomOptions('Apartment').at(-1), '10+');
  assert.equal(bathroomOptions('House')[0], '1');
  assert.equal(bathroomOptions('Commercial')[0], '0');
  assert.deepEqual(bathroomOptions('Land'), []);
});
test('what a listing card shows', () => {
  assert.deepEqual(bedroomsDisplay('Apartment', '0'), { studio: true });
  assert.deepEqual(bedroomsDisplay('Apartment', '2'), { count: '2' });
  assert.deepEqual(bedroomsDisplay('Commercial', '0'), { count: '0' });
  assert.equal(bedroomsDisplay('Land', '0'), null);
  assert.equal(bedroomsDisplay('Land', '3'), null);
  assert.equal(bedroomsDisplay('House', '0'), null);                // unknown, not a studio house
  assert.equal(bedroomsDisplay('Villa', ''), null);
  assert.deepEqual(bedroomsDisplay('House', '4'), { count: '4' });
});
