import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getLangUrl } from './langUrl';

test('footer pages keep the page when switching language (Blake, 2026-10-20)', () => {
  assert.equal(getLangUrl('/about', 'vi'), '/vi/gioi-thieu');
  assert.equal(getLangUrl('/vi/gioi-thieu', 'en'), '/about');
  assert.equal(getLangUrl('/agents', 'vi'), '/vi/moi-gioi');
  assert.equal(getLangUrl('/contact', 'vi'), '/vi/lien-he');
  assert.equal(getLangUrl('/agent/vy-tran', 'vi'), '/vi/moi-gioi/vy-tran');
  assert.equal(getLangUrl('/vi/moi-gioi/vy-tran', 'en'), '/agent/vy-tran');
  assert.equal(getLangUrl('/account/listings/abc/edit', 'vi'), '/vi/tai-khoan/tin-dang/abc/sua');
});
test('no Korean/Russian twin: stay on the English page, not the homepage', () => {
  assert.equal(getLangUrl('/about', 'ko'), '/about');
  assert.equal(getLangUrl('/vi/gioi-thieu', 'ru'), '/about');
  assert.equal(getLangUrl('/knowledge', 'ko'), '/knowledge');
});
test('home, rent/sale and listings still map as before', () => {
  assert.equal(getLangUrl('/', 'vi'), '/vi');
  assert.equal(getLangUrl('/vi', 'en'), '/');
  assert.equal(getLangUrl('/for-rent', 'vi'), '/vi/thue');
  assert.equal(getLangUrl('/vi/listing/x', 'ko'), '/ko/listing/x');
});
