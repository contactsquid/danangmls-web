import { test } from 'node:test';
import assert from 'node:assert/strict';
import type { Metadata } from 'next';
import { withMapPreview } from './mapPreview';

const base: Metadata = { title: 'X', openGraph: { title: 'OG', url: 'https://danangmls.com/for-rent', images: [{ url: '/og-default.jpg' }] } };
const manifest = ['en-rent', 'en-sale', 'vi-rent', 'en-rent-son-tra'];
const img = (m: Metadata, k: 'openGraph' | 'twitter') =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ((m[k] as any)?.images?.[0]?.url as string | undefined);

test('list-view links keep the normal preview', () => {
  assert.equal(withMapPreview(base, undefined, 'en', 'rent', undefined, manifest), base);
  assert.equal(withMapPreview(base, 'list', 'en', 'rent', undefined, manifest), base);
});
test('?view=map swaps BOTH og and twitter images and keeps the rest', () => {
  const m = withMapPreview(base, 'map', 'en', 'rent', undefined, manifest);
  assert.equal(img(m, 'openGraph'), '/og/map/en-rent.jpg');
  assert.equal(img(m, 'twitter'), '/og/map/en-rent.jpg');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  assert.equal((m.openGraph as any).title, 'OG');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  assert.equal((m.twitter as any).card, 'summary_large_image');
});
test('district pages use their own map when one was captured, else the mode map', () => {
  assert.equal(img(withMapPreview(base, 'map', 'en', 'rent', 'Son Tra', manifest), 'openGraph'), '/og/map/en-rent-son-tra.jpg');
  assert.equal(img(withMapPreview(base, 'map', 'en', 'rent', 'Hoi An', manifest), 'openGraph'), '/og/map/en-rent.jpg');
});
test('Vietnamese pages get the Vietnamese label; Korean and Russian use English', () => {
  assert.equal(img(withMapPreview(base, 'map', 'vi', 'rent', undefined, manifest), 'openGraph'), '/og/map/vi-rent.jpg');
  assert.equal(img(withMapPreview(base, 'map', 'ko', 'sale', undefined, manifest), 'openGraph'), '/og/map/en-sale.jpg');
});
test('nothing captured yet → normal preview', () => {
  assert.equal(withMapPreview(base, 'map', 'en', 'rent', undefined, []), base);
});
