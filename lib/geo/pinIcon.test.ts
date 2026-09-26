import { test } from 'node:test';
import assert from 'node:assert/strict';
import { pinKind, PIN_ICONS } from './pinIcon';

const l = (type: string, title = '') => ({ type, title, text: '' });

test('each listing type maps to one of five icons', () => {
  assert.equal(pinKind(l('Apartment')), 'apartment');
  assert.equal(pinKind(l('House')), 'house');
  assert.equal(pinKind(l('Townhouse')), 'house');
  assert.equal(pinKind(l('Land')), 'land');
  assert.equal(pinKind(l('Commercial')), 'commercial');
  assert.equal(pinKind(l('Shophouse')), 'commercial');
  assert.equal(pinKind(l('Hotel Building (Villa/House)')), 'commercial');
  assert.equal(pinKind(l('')), 'house');
});
test('villas are recognised from the text, like the villa pages', () => {
  assert.equal(pinKind(l('House', 'Luxury Pool Villa Near Beach')), 'villa');
  assert.equal(pinKind(l('Villa')), 'villa');
});
test('every kind has an icon', () => {
  for (const k of ['apartment', 'house', 'villa', 'land', 'commercial'] as const) assert.match(PIN_ICONS[k], /^<svg/);
});
