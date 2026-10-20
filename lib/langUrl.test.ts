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
  assert.equal(getLangUrl('/knowledge', 'vi'), '/vi/hoi-dap');
  assert.equal(getLangUrl('/vi/hoi-dap', 'en'), '/knowledge');
  assert.equal(getLangUrl('/vi/hoi-dap', 'ko'), '/ko/knowledge');
});
test('footer pages and agent profiles have Korean/Russian twins (Blake, 2026-10-20)', () => {
  assert.equal(getLangUrl('/about', 'ko'), '/ko/about');
  assert.equal(getLangUrl('/vi/gioi-thieu', 'ru'), '/ru/about');
  assert.equal(getLangUrl('/agents', 'ko'), '/ko/agents');
  assert.equal(getLangUrl('/vi/moi-gioi', 'ru'), '/ru/agents');
  assert.equal(getLangUrl('/ko/agents', 'vi'), '/vi/moi-gioi');
  assert.equal(getLangUrl('/ru/agent/vy-tran', 'vi'), '/vi/moi-gioi/vy-tran');
  assert.equal(getLangUrl('/ko/knowledge', 'ru'), '/ru/knowledge');
  assert.equal(getLangUrl('/ru/privacy-policy', 'en'), '/privacy-policy');
  assert.equal(getLangUrl('/vi/hoi-dap', 'ko'), '/ko/knowledge');
});
test('no Korean/Russian twin (account pages): stay on the English page, not the homepage', () => {
  assert.equal(getLangUrl('/account/signup', 'ko'), '/account/signup');
  assert.equal(getLangUrl('/vi/tai-khoan/dang-nhap', 'ru'), '/account/login');
});
test('home, rent/sale and listings still map as before', () => {
  assert.equal(getLangUrl('/', 'vi'), '/vi');
  assert.equal(getLangUrl('/vi', 'en'), '/');
  assert.equal(getLangUrl('/for-rent', 'vi'), '/vi/thue');
  assert.equal(getLangUrl('/vi/listing/x', 'ko'), '/ko/listing/x');
});
