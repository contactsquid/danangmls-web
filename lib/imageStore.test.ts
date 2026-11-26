import { test } from 'node:test';
import assert from 'node:assert/strict';
import { portalUploaderSlug } from './imageStore';

test('photos uploaded through any of the four portals name the posting profile', () => {
  const h = 'https://images.danang.homes';
  assert.equal(portalUploaderSlug([`${h}/agent-listings/duong-quoc-binh/a.jpg`]), 'duong-quoc-binh');        // danangmls.com
  assert.equal(portalUploaderSlug([`${h}/saigon-agent-listings/an-nguyen/a.jpg`]), 'an-nguyen');            // saigonmls.com
  assert.equal(portalUploaderSlug([`${h}/hanoi-agent-listings/minh/a.jpg`]), 'minh');                       // hanoimls.com
  assert.equal(portalUploaderSlug([`${h}/lotus-agent-listings/vy-tran/a.jpg`]), 'vy-tran');                 // lotusmls.com
});

test('scraped photos and look-alike paths are not portal uploads', () => {
  const h = 'https://images.danang.homes';
  assert.equal(portalUploaderSlug([`${h}/rentals/abc.jpg`, `${h}/hanoi-rentals/x.jpg`]), null);
  assert.equal(portalUploaderSlug([`https://evil.example/agent-listings/vy-tran/a.jpg`]), null);
  assert.equal(portalUploaderSlug([`${h}/agent-listings/a.jpg`]), null);                                    // no slug folder
  assert.equal(portalUploaderSlug([]), null);
});

test('the first portal photo decides', () => {
  const h = 'https://images.danang.homes';
  assert.equal(portalUploaderSlug([`${h}/rentals/x.jpg`, `${h}/agent-listings/b/1.jpg`]), 'b');
});
