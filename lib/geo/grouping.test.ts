import { test } from 'node:test';
import assert from 'node:assert/strict';
import { groupPoints, MIN_GROUP } from './grouping';

const at = (n: number, x: number, y: number, id0 = 0) =>
  Array.from({ length: n }, (_, i) => ({ id: id0 + i, x: x + (i % 5), y: y + Math.floor(i / 5) }));

test('a crowd of 10 stays as 10 price tags', () => {
  const r = groupPoints(at(10, 10, 10), 64);
  assert.equal(MIN_GROUP, 11);
  assert.equal(r.singles.length, 10);
  assert.equal(r.groups.length, 0);
});
test('11 in one cell become one numbered circle', () => {
  const r = groupPoints(at(11, 10, 10), 64);
  assert.equal(r.singles.length, 0);
  assert.equal(r.groups.length, 1);
  assert.equal(r.groups[0].ids.length, 11);
});
test('cells are judged separately', () => {
  const r = groupPoints([...at(12, 10, 10), ...at(3, 300, 300, 100)], 64);
  assert.equal(r.groups.length, 1);
  assert.deepEqual(r.singles.sort((a, b) => a - b), [100, 101, 102]);
});
test('a group sits at the average of its members', () => {
  const pts = at(11, 0, 0);
  const g = groupPoints(pts, 64).groups[0];
  assert.equal(g.x, pts.reduce((s, p) => s + p.x, 0) / 11);
});

import { declutter, tagWidthPx } from './grouping';

const overlaps = (a: { x: number; y: number; w: number; h: number }, b: typeof a) =>
  Math.abs(a.x - b.x) * 2 < a.w + b.w && Math.abs(a.y - b.y) * 2 < a.h + b.h;

test('tags that would overlap are nudged apart', () => {
  // Ten is the most that can share a spot now that circles start at 11.
  const tags = Array.from({ length: 10 }, (_, i) => ({ id: i, x: 100 + i * 3, y: 100, w: 70, h: 28 }));
  const out = declutter(tags, 90);
  for (let i = 0; i < out.length; i++) for (let j = i + 1; j < out.length; j++) assert.ok(!overlaps(out[i], out[j]), `${i} overlaps ${j}`);
  for (const t of out) assert.ok(Math.hypot(t.x - tags[t.id].x, t.y - tags[t.id].y) <= 91);
});
test('tags that already fit are left exactly where they are', () => {
  const tags = [{ id: 0, x: 0, y: 0, w: 70, h: 28 }, { id: 1, x: 200, y: 0, w: 70, h: 28 }];
  assert.deepEqual(declutter(tags, 60).map(t => [t.x, t.y]), [[0, 0], [200, 0]]);
});
test('pinned tags (an open popup) never move', () => {
  const tags = [{ id: 0, x: 0, y: 0, w: 70, h: 28, pinned: true }, { id: 1, x: 2, y: 0, w: 70, h: 28 }];
  const out = declutter(tags, 60);
  assert.deepEqual([out[0].x, out[0].y], [0, 0]);
});
test('tag width grows with the price text', () => {
  assert.ok(tagWidthPx('$2.5k') > tagWidthPx('$90'));
});
