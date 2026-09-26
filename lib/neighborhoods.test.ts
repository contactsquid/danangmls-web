import { test } from 'node:test';
import assert from 'node:assert/strict';
import { detectNeighborhood, NEIGHBORHOODS } from './neighborhoods';
import { wardNames } from './geo/areas';

test('the dropdown list matches the boundary file exactly', () => {
  for (const [d, wards] of Object.entries(NEIGHBORHOODS)) assert.deepEqual(wards, wardNames(d), d);
});
test('earliest mention wins, accents ignored, whole words only', () => {
  assert.equal(detectNeighborhood('Near Khue My, 5 min to My An', 'House', 'Ngu Hanh Son'), 'Khue My');
  assert.equal(detectNeighborhood('Nhà ở Mỹ An', '', 'Ngu Hanh Son'), 'My An');
  assert.equal(detectNeighborhood('Tommy Anderson villa', '', 'Ngu Hanh Son'), '');
  assert.equal(detectNeighborhood('Studio in Hai Chau 1', '', 'Hai Chau'), 'Hai Chau 1');
  assert.equal(detectNeighborhood('Villa near An Bang beach', '', 'Hoi An'), 'Cam An');
  assert.equal(detectNeighborhood('My An', '', 'Son Tra'), '');
});
