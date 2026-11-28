import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveCombo, comboPath } from './districtCombos';

test('resolves district + type and rejects non-district / non-sub', () => {
  const c = resolveCombo('hai-chau', 'apartment');
  assert.equal(c?.district, 'Hai Chau');
  assert.equal(comboPath('rent', c!), '/for-rent/hai-chau/apartment');
  assert.equal(resolveCombo('apartment', 'hai-chau'), null);
  assert.equal(resolveCombo('hai-chau', 'son-tra'), null);
});

test('localized paths', () => {
  const c = resolveCombo('hai-chau', 'apartment')!;
  assert.equal(comboPath('rent', c, 'vi'), '/vi/thue/hai-chau/can-ho');
  assert.equal(comboPath('sale', c, 'ru'), '/ru/for-sale/hai-chau/apartment');
});
