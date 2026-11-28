import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ownedByPortalSlug } from './crossCityEdit';

test('ownership: any MLS site portal folder proves the poster', () => {
  const h = 'https://images.danang.homes';
  assert.ok(ownedByPortalSlug([`${h}/agent-listings/jane/a.jpg`], 'jane'));
  assert.ok(ownedByPortalSlug([`${h}/saigon-agent-listings/jane/a.jpg`], 'jane'));
  assert.ok(ownedByPortalSlug([`${h}/hanoi-agent-listings/jane/a.jpg`], 'jane'));
  assert.ok(ownedByPortalSlug([`${h}/lotus-agent-listings/jane/a.jpg`], 'jane'));
});

test('ownership: other agents, scraped photos and empty slug do not match', () => {
  const h = 'https://images.danang.homes';
  assert.ok(!ownedByPortalSlug([`${h}/agent-listings/janet/a.jpg`], 'jane'));
  assert.ok(!ownedByPortalSlug([`${h}/saigon-rentals/x.jpg`], 'jane'));
  assert.ok(!ownedByPortalSlug([`${h}/agent-listings/jane/a.jpg`], ''));
});
