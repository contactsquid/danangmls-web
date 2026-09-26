import { test } from 'node:test';
import assert from 'node:assert/strict';
import { priceLow } from './price';

test('a price range is read as its low end, not both numbers glued together', () => {
  assert.equal(priceLow('$760-$950/month'), 760);        // was read as 760950
  assert.equal(priceLow('$250-$487/month'), 250);
  assert.equal(priceLow('$1,200-$1,500/month'), 1200);
  assert.equal(priceLow('$114,000 - $133,000'), 114000);
  assert.equal(priceLow('$123,880–$268,660'), 123880);   // en dash
});
test('single prices are unchanged', () => {
  assert.equal(priceLow('$950/month'), 950);
  assert.equal(priceLow('$262,000'), 262000);
  assert.equal(priceLow('$1,250,000'), 1250000);
  assert.equal(priceLow('$150,000+'), 150000);
  assert.equal(priceLow('$98,000 (Negotiable)'), 98000);
});
test('no number → 0', () => {
  assert.equal(priceLow(''), 0);
  assert.equal(priceLow('(Price not specified or is negotiable)'), 0);
});
