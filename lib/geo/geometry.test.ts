import { test } from 'node:test';
import assert from 'node:assert/strict';
import type { Geometry } from 'geojson';
import { hashSeed, pointInGeometry, randomPointIn, offsetPoint, distanceM } from './geometry';
import { DISTRICT_BOUNDARIES } from '../districtBoundaries';

// 1°x1° square at lng 0..1, lat 0..1 with a hole at 0.4..0.6
const square: Geometry = { type: 'Polygon', coordinates: [
  [[0, 0], [1, 0], [1, 1], [0, 1], [0, 0]],
  [[0.4, 0.4], [0.6, 0.4], [0.6, 0.6], [0.4, 0.6], [0.4, 0.4]],
] };

test('point in polygon respects holes', () => {
  assert.equal(pointInGeometry([0.2, 0.2], square), true);
  assert.equal(pointInGeometry([0.5, 0.5], square), false);
  assert.equal(pointInGeometry([1.5, 0.5], square), false);
});
test('multipolygon matches any part', () => {
  const multi: Geometry = { type: 'MultiPolygon', coordinates: [
    [[[0, 0], [1, 0], [1, 1], [0, 1], [0, 0]]],
    [[[5, 5], [6, 5], [6, 6], [5, 6], [5, 5]]],
  ] };
  assert.equal(pointInGeometry([5.5, 5.5], multi), true);
});
test('scattered points always land inside every real district', () => {
  for (const [name, g] of Object.entries(DISTRICT_BOUNDARIES)) {
    for (let i = 0; i < 200; i++) {
      const p = randomPointIn(g, hashSeed(`${name}-${i}`));
      assert.ok(pointInGeometry(p, g), `${name} #${i} outside`);
    }
  }
});
test('deterministic by seed', () => {
  const g = DISTRICT_BOUNDARIES['Son Tra'];
  assert.deepEqual(randomPointIn(g, hashSeed('abc')), randomPointIn(g, hashSeed('abc')));
  assert.notDeepEqual(randomPointIn(g, hashSeed('abc')), randomPointIn(g, hashSeed('abd')));
});
test('offsets stay within the radius and are deterministic', () => {
  const c: [number, number] = [16.06, 108.22];
  for (let i = 0; i < 200; i++) {
    const p = offsetPoint(c, hashSeed(`s${i}`), 150);
    assert.ok(distanceM(c, p) <= 151);
  }
  assert.deepEqual(offsetPoint(c, 7, 150), offsetPoint(c, 7, 150));
});
