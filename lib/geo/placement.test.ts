import { test } from 'node:test';
import assert from 'node:assert/strict';
import { placeListing, PRECISION, type GeoCoords } from './placement';
import { distanceM, pointInGeometry } from './geometry';
import { DISTRICT_BOUNDARIES } from '../districtBoundaries';
import { inWater, pointAllowed, wardAt } from './areas';

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
test('with no known streets, district points stay off the Cham Islands', () => {
  const empty: GeoCoords = { buildings: {}, wards: {}, streets: {}, misses: [] };
  for (let i = 0; i < 100; i++) {
    const p = placeListing({ ...base, district: 'Hoi An', slug: `h-${i}` }, empty)!;
    assert.notEqual(wardAt([p.geo[0], p.geo[1]]), 'Hoi An|tan hiep', `h-${i}`);
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

// Blake, 2026-09-26: pins stay inside their ward and district, never on water.
test('a listing with a known ward is always placed inside that ward', () => {
  const real: GeoCoords = { buildings: {}, wards: {}, misses: [], streets: {
    // Nguyen Van Thoai runs along My An's edge; this point is in My An.
    'Ngu Hanh Son|nguyen van thoai': [16.0529, 108.2407],
  } };
  for (let i = 0; i < 60; i++) {
    const p = placeListing({ slug: `m-${i}`, district: 'Ngu Hanh Son', neighborhood: 'My An', title: '', text: i % 2 ? 'House on Nguyen Van Thoai Street' : '' }, real)!;
    assert.equal(wardAt([p.geo[0], p.geo[1]]), 'Ngu Hanh Son|my an', `m-${i}`);
    assert.equal(p.geoArea, 'Ngu Hanh Son|my an');
  }
});
test('a street point outside the listing\'s ward is not used; the pin goes in the ward', () => {
  const real: GeoCoords = { buildings: {}, wards: {}, misses: [], streets: { 'Ngu Hanh Son|nguyen van thoai': [16.0529, 108.2407] } };
  const p = placeListing({ slug: 'k-1', district: 'Ngu Hanh Son', neighborhood: 'Khue My', title: '', text: 'House on Nguyen Van Thoai Street' }, real)!;
  assert.equal(p.geo[2], PRECISION.ward);
  assert.equal(wardAt([p.geo[0], p.geo[1]]), 'Ngu Hanh Son|khue my');
});
test('no pin is ever on water or outside its district', () => {
  const riverside: GeoCoords = { buildings: {}, wards: {}, misses: [], streets: {
    'Son Tra|tran hung dao': [16.0650, 108.2300],   // runs along the Han River
    'Hai Chau|bach dang': [16.0700, 108.2245],      // the Hai Chau riverbank
  } };
  for (let i = 0; i < 150; i++) {
    for (const [district, text] of [['Son Tra', 'On Tran Hung Dao Street'], ['Hai Chau', 'On Bach Dang Street'], ['Ngu Hanh Son', '']]) {
      const p = placeListing({ slug: `w-${district}-${i}`, district, neighborhood: '', title: '', text }, riverside)!;
      const at: [number, number] = [p.geo[0], p.geo[1]];
      assert.equal(inWater(at), false, `${district} #${i} on water`);
      assert.ok(pointAllowed(at, district), `${district} #${i} outside district`);
    }
  }
});

// Blake, 2026-09-26: "Fusion" / "Fusion Resort" → Fusion Resort & Villas, Trường Sa.
test('Fusion listings are pinned at Fusion Resort & Villas on Truong Sa', () => {
  const empty: GeoCoords = { buildings: {}, wards: {}, streets: {}, misses: [] };
  for (const [title, text] of [['Luxury Pool Villa at Fusion Resort Da Nang', ''], ['Spacious 4-Bedroom Villa', 'Located in Fusion Villa Danang']]) {
    const p = placeListing({ slug: title, district: 'Ngu Hanh Son', neighborhood: '', title, text }, empty)!;
    assert.equal(p.geo[2], PRECISION.building);
    assert.equal(p.geoLabel, 'Fusion Resort & Villas');
    assert.ok(distanceM([p.geo[0], p.geo[1]], [15.97242, 108.28229]) <= 151);
  }
});
test('Fusion Suites (a different hotel, in Son Tra) is not the resort', () => {
  const empty: GeoCoords = { buildings: {}, wards: {}, streets: {}, misses: [] };
  const p = placeListing({ slug: 'fs', district: 'Son Tra', neighborhood: '', title: 'Studio near Fusion Suites', text: '' }, empty)!;
  assert.notEqual(p.geoLabel, 'Fusion Resort & Villas');
});

// Blake, 2026-09-26: common complexes and landmarks, by verified address.
test('complexes pin at their address', () => {
  const empty: GeoCoords = { buildings: {}, wards: {}, streets: {}, misses: [] };
  const cases: [string, string, string, [number, number], number][] = [
    ['Ngu Hanh Son', 'Villa at Premier Village Resort', 'Premier Village', [16.04362, 108.24966], 151],
    ['Son Tra', '2BR Monarchy apartment, river view', 'Monarchy', [16.05484, 108.23297], 41],
    ['Son Tra', 'House in Euro Village', 'Euro Village', [16.05432, 108.23111], 201],
    ['Hai Chau', 'Luxury 2BR at SAM Towers with river view', 'Sam Towers', [16.09333, 108.21727], 41],
    ['Ngu Hanh Son', 'Sun Cosmo Residence 1BR', 'Sun Cosmo', [16.05043, 108.23331], 51],
    ['Hai Chau', 'Elysia Complex City apartment', 'Elysia', [16.03266, 108.23167], 81],
    ['Ngu Hanh Son', 'Pool villa in One River', 'One River', [15.99095, 108.26142], 401],
    ['Hai Chau', 'Vista Residence 2BR', 'Vista Residence', [16.03295, 108.22207], 41],
  ];
  for (const [district, title, label, at, within] of cases) {
    const p = placeListing({ slug: title, district, neighborhood: '', title, text: '' }, empty)!;
    assert.equal(p.geoLabel, label, title);
    assert.equal(p.geo[2], PRECISION.building, title);
    assert.ok(distanceM([p.geo[0], p.geo[1]], at) <= within, title);
  }
});
test('parks, malls and resorts are always "near" — nobody lives in Asia Park', () => {
  const empty: GeoCoords = { buildings: {}, wards: {}, streets: {}, misses: [] };
  const p = placeListing({ slug: 'ap', district: 'Hai Chau', neighborhood: '', title: 'Apartment by Asia Park', text: '' }, empty)!;
  assert.equal(p.geo[2], PRECISION.nearBuilding);
  assert.equal(p.geoLabel, 'Asia Park');
});

test('"sea vista" is not Vista Residence', () => {
  const empty: GeoCoords = { buildings: {}, wards: {}, streets: {}, misses: [] };
  const p = placeListing({ slug: 'sv', district: 'Hai Chau', neighborhood: '', title: 'Apartment with a sea vista', text: '' }, empty)!;
  assert.notEqual(p.geoLabel, 'Vista Residence');
});
