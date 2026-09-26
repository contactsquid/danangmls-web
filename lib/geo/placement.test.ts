import { test } from 'node:test';
import assert from 'node:assert/strict';
import { placeListing, PRECISION, type GeoCoords } from './placement';
import { distanceM, pointInGeometry } from './geometry';
import { DISTRICT_BOUNDARIES } from '../districtBoundaries';

const coords: GeoCoords = {
  buildings: { 'Hiyori Garden Tower': [16.0694, 108.2345] },
  wards:     { 'Son Tra|an hai bac': [16.0745, 108.2320] },
  streets:   {
    'Son Tra|ho nghinh':  [16.0680, 108.2450],
    // Deliberately outside Son Tra: must be rejected at placement time.
    'Son Tra|bach dang':  [16.0300, 108.1500],
  },
  misses: [],
};
const base = { slug: 'x-1', district: 'Son Tra', neighborhood: '', title: 'Nice flat', text: '' };

test('no district → not mapped', () => {
  assert.equal(placeListing({ ...base, district: '' }, coords), null);
  assert.equal(placeListing({ ...base, district: 'Not Provided' }, coords), null);
  assert.equal(placeListing({ ...base, district: 'Atlantis' }, coords), null);
});
test('building wins', () => {
  const p = placeListing({ ...base, text: 'Studio in Hiyori, Ho Nghinh Street' }, coords)!;
  assert.equal(p.geo[2], PRECISION.building);
  assert.equal(p.geoLabel, 'Hiyori Garden Tower');
  assert.ok(distanceM([p.geo[0], p.geo[1]], [16.0694, 108.2345]) <= 31);
});
test('street next', () => {
  const p = placeListing({ ...base, text: 'House on Ho Nghinh Street' }, coords)!;
  assert.equal(p.geo[2], PRECISION.street);
  assert.equal(p.geoLabel, 'Ho Nghinh');
});
test('a street coordinate outside the district falls through', () => {
  const p = placeListing({ ...base, text: 'House on Bach Dang Street' }, coords)!;
  assert.equal(p.geo[2], PRECISION.district);
});
test('a street known only in another district is not borrowed', () => {
  const p = placeListing({ ...base, district: 'Hai Chau', text: 'House on Ho Nghinh Street' }, coords)!;
  assert.equal(p.geo[2], PRECISION.district);
});
test('ward next', () => {
  const p = placeListing({ ...base, neighborhood: 'An Hai Bac' }, coords)!;
  assert.equal(p.geo[2], PRECISION.ward);
  assert.equal(p.geoLabel, 'An Hai Bac');
});
test('district fallback is inside the district and stable', () => {
  const a = placeListing(base, coords)!;
  assert.equal(a.geo[2], PRECISION.district);
  assert.equal(a.geoLabel, '');
  assert.ok(pointInGeometry([a.geo[0], a.geo[1]], DISTRICT_BOUNDARIES['Son Tra']));
  assert.deepEqual(placeListing(base, coords), a);
});
