import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isPageTarget } from './redirects';
import { getLangUrl } from './langUrl';

test('rent/sale page targets are accepted, anything else is not (open-redirect guard)', () => {
  assert.equal(isPageTarget('for-rent/commercial'), true);
  assert.equal(isPageTarget('for-sale'), true);
  assert.equal(isPageTarget('//evil.com'), false);
  assert.equal(isPageTarget('for-rent/../admin'), false);
  assert.equal(isPageTarget('https://evil.com'), false);
  assert.equal(isPageTarget('agents'), false);
});
test('a page target lands in the visitor language', () => {
  assert.equal(getLangUrl('/for-rent/commercial', 'en'), '/for-rent/commercial');
  assert.match(getLangUrl('/for-rent/commercial', 'vi'), /^\/vi\/thue\//);
  assert.equal(getLangUrl('/for-rent/commercial', 'ko'), '/ko/for-rent/commercial');
});
