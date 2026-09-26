import { test } from 'node:test';
import assert from 'node:assert/strict';
import { placeListing, PRECISION, type GeoCoords } from './placement';
import { distanceM, pointInGeometry } from './geometry';
import { DISTRICT_BOUNDARIES } from '../districtBoundaries';

const coords: GeoCoords = {
  buildings: { 'Hiyori Garden Tower': [16.0694, 108.2345], 'Hyatt Regency': [16.01259, 108.26377] },
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

test('district fallback clusters around where listings really are, not mountains or sea', () => {
  const withAnchors: GeoCoords = { ...coords, streets: { 'Son Tra|ho nghinh': [16.0680, 108.2450] }, wards: {} };
  for (let i = 0; i < 100; i++) {
    const p = placeListing({ ...base, slug: `d-${i}` }, withAnchors)!;
    assert.equal(p.geo[2], PRECISION.district);
    assert.ok(distanceM([p.geo[0], p.geo[1]], [16.0680, 108.2450]) <= 501, `d-${i} strayed`);
    assert.ok(pointInGeometry([p.geo[0], p.geo[1]], DISTRICT_BOUNDARIES['Son Tra']));
  }
});
test('with no known streets, district points skip small outlying parts (islands)', () => {
  const empty: GeoCoords = { buildings: {}, wards: {}, streets: {}, misses: [] };
  const g = DISTRICT_BOUNDARIES['Hoi An'];
  if (g.type !== 'MultiPolygon') return;
  const mainland = { type: 'Polygon' as const, coordinates: g.coordinates.reduce((a, b) => (b[0].length > a[0].length ? b : a)) };
  for (let i = 0; i < 100; i++) {
    const p = placeListing({ ...base, district: 'Hoi An', slug: `h-${i}` }, empty)!;
    assert.ok(pointInGeometry([p.geo[0], p.geo[1]], mainland), `h-${i} off the mainland`);
  }
});

test('"near <building>" is labelled near, not at', () => {
  const p = placeListing({ ...base, district: 'Ngu Hanh Son', text: 'Garden house near Hyatt Regency, quiet lane' }, coords)!;
  assert.equal(p.geo[2], PRECISION.nearBuilding);
  assert.equal(p.geoLabel, 'Hyatt Regency');
  assert.ok(distanceM([p.geo[0], p.geo[1]], [16.01259, 108.26377]) <= 301);
});
test('a building outside the listing\'s district is not used', () => {
  // Hyatt Regency is in Ngu Hanh Son; this listing says Son Tra.
  const p = placeListing({ ...base, text: 'Studio in Hyatt Regency' }, coords)!;
  assert.notEqual(p.geo[2], PRECISION.building);
  assert.notEqual(p.geo[2], PRECISION.nearBuilding);
});
