import { test } from 'node:test';
import assert from 'node:assert/strict';
import { shortPrice } from './shortPrice';

test('english', () => {
  assert.equal(shortPrice('$650/month', 'en'), '$650');
  assert.equal(shortPrice('$1,200/month', 'en'), '$1.2k');
  assert.equal(shortPrice('$262,000', 'en'), '$262k');
  assert.equal(shortPrice('$1,250,000', 'en'), '$1.3M');
  assert.equal(shortPrice('$500-$550/month', 'en'), '$500');
});
test('vietnamese uses triệu/tỷ with a decimal comma', () => {
  assert.equal(shortPrice('$650/month', 'vi'), '17 tr');
  assert.equal(shortPrice('$262,000', 'vi'), '6,9 tỷ');
});
test('korean uses 만/억', () => {
  assert.equal(shortPrice('$650/month', 'ko'), '87만');
  assert.equal(shortPrice('$262,000', 'ko'), '3.5억');
});
test('russian uses тыс/млн', () => {
  assert.equal(shortPrice('$650/month', 'ru'), '55 тыс');
  assert.equal(shortPrice('$262,000', 'ru'), '22 млн');
});
test('no number → null', () => {
  assert.equal(shortPrice('', 'en'), null);
  assert.equal(shortPrice('(Price not specified or is negotiable)', 'en'), null);
});
