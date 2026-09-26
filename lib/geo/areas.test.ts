import { test } from 'node:test';
import assert from 'node:assert/strict';
import { pointAllowed, wardKey, wardAt, randomAllowedPoint, inWater, wardNames } from './areas';
import { hashSeed } from './geometry';

const MY_AN_LAND: [number, number] = [16.0529, 108.2407];     // Nguyen Van Thoai, My An
const HAN_RIVER: [number, number] = [16.0612, 108.2275];      // under Dragon Bridge
const EAST_SEA: [number, number] = [16.0500, 108.2600];       // off My Khe beach

test('water is never allowed, river or sea', () => {
  assert.equal(inWater(HAN_RIVER), true);
  assert.equal(pointAllowed(HAN_RIVER, 'Son Tra'), false);
  assert.equal(pointAllowed(HAN_RIVER, 'Hai Chau'), false);
  assert.equal(pointAllowed(EAST_SEA, 'Ngu Hanh Son'), false);
});
test('a point must be inside the district, and inside the ward when one is given', () => {
  assert.equal(pointAllowed(MY_AN_LAND, 'Ngu Hanh Son'), true);
  assert.equal(pointAllowed(MY_AN_LAND, 'Hai Chau'), false);
  assert.equal(pointAllowed(MY_AN_LAND, 'Ngu Hanh Son', 'Ngu Hanh Son|my an'), true);
  assert.equal(pointAllowed(MY_AN_LAND, 'Ngu Hanh Son', 'Ngu Hanh Son|khue my'), false);
});
test('ward keys resolve from listing neighborhoods, accents or not', () => {
  assert.equal(wardKey('Ngu Hanh Son', 'My An'), 'Ngu Hanh Son|my an');
  assert.equal(wardKey('Ngu Hanh Son', 'Mỹ An'), 'Ngu Hanh Son|my an');
  assert.equal(wardKey('Son Tra', 'My An'), null);
  assert.equal(wardKey('Hai Chau', ''), null);
  assert.equal(wardAt(MY_AN_LAND), 'Ngu Hanh Son|my an');
});
test('random points are always allowed', () => {
  for (let i = 0; i < 100; i++) {
    const w = randomAllowedPoint('Ngu Hanh Son', 'Ngu Hanh Son|my an', hashSeed(`w${i}`))!;
    assert.ok(pointAllowed(w, 'Ngu Hanh Son', 'Ngu Hanh Son|my an'), `ward #${i}`);
    const d = randomAllowedPoint('Son Tra', null, hashSeed(`d${i}`))!;
    assert.ok(pointAllowed(d, 'Son Tra'), `district #${i}`);
  }
});
test('every district has its real wards, in the dropdown order', () => {
  const nhs = wardNames('Ngu Hanh Son');
  assert.deepEqual(nhs, ['Hoa Hai', 'Hoa Quy', 'Khue My', 'My An']);
  assert.ok(wardNames('Hai Chau').includes('Thach Thang'));
  assert.ok(!wardNames('Son Tra').includes('Nam Duong'));   // it's in Hai Chau
});
test('district-only scatter stays off outlying islands (Cham Islands / Tan Hiep)', () => {
  for (let i = 0; i < 200; i++) {
    const p = randomAllowedPoint('Hoi An', null, hashSeed(`h${i}`))!;
    assert.notEqual(wardAt(p), 'Hoi An|tan hiep', `#${i}`);
  }
  // …but a listing that names Tan Hiep does go there.
  assert.equal(wardAt(randomAllowedPoint('Hoi An', 'Hoi An|tan hiep', 1)!), 'Hoi An|tan hiep');
});
