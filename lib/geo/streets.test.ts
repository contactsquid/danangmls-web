import { test } from 'node:test';
import assert from 'node:assert/strict';
import { extractStreet, normalizeName } from './streets';

test('english "X Street"', () => {
  assert.deepEqual(extractStreet('Beautiful house on Nguyen Van Thoai Street, near beach'),
    { name: 'Nguyen Van Thoai', key: 'nguyen van thoai' });
});
test('leading stop words are stripped', () => {
  assert.deepEqual(extractStreet('Located Near Tran Cao Van St. in Thanh Khe'),
    { name: 'Tran Cao Van', key: 'tran cao van' });
});
test('numbered streets keep their number', () => {
  assert.deepEqual(extractStreet('Apartment at An Thuong 2 Street'),
    { name: 'An Thuong 2', key: 'an thuong 2' });
});
test('vietnamese "đường X"', () => {
  assert.deepEqual(extractStreet('Nhà mặt tiền đường Lê Duẩn giá tốt'),
    { name: 'Lê Duẩn', key: 'le duan' });
});
test('a street whose name starts with Duong is not mistaken for the prefix', () => {
  assert.equal(extractStreet('Near Duong Thi Xuan Quy Street')?.key, 'duong thi xuan quy');
});
test('junk is rejected', () => {
  assert.equal(extractStreet('Main Street vibes'), null);
  assert.equal(extractStreet('Price Street'), null);
  assert.equal(extractStreet('Quiet alley close to the beach'), null);
});
test('normalizeName folds diacritics and đ', () => {
  assert.equal(normalizeName('  Đống  Đa '), 'dong da');
});
