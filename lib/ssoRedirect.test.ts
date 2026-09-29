import { test } from 'node:test';
import assert from 'node:assert/strict';
import { safeLandingPath, ssoTokenType } from './ssoRedirect';

const O = 'https://saigonmls.com';
test('only paths on this site are allowed after an SSO login', () => {
  assert.equal(safeLandingPath('/account/listings?x=1', O), '/account/listings?x=1');
  assert.equal(safeLandingPath('/\\evil.com', O), '/account');        // browsers read this as //evil.com
  assert.equal(safeLandingPath('/\\\\evil.com/x', O), '/account');
  assert.equal(safeLandingPath('//evil.com', O), '/account');
  assert.equal(safeLandingPath('https://evil.com', O), '/account');
  assert.equal(safeLandingPath(null, O), '/account');
});
test('only the one-time magic-link token is accepted', () => {
  assert.equal(ssoTokenType('magiclink'), 'magiclink');
  assert.equal(ssoTokenType(null), 'magiclink');
  for (const t of ['recovery', 'signup', 'email_change', 'invite', 'email']) assert.equal(ssoTokenType(t), null, t);
});
