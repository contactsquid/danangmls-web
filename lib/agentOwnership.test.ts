import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildOwnerIndex, groupByNameKey, listingOwnerSlug, phoneKey, shouldAutoApproveClaim, type OwnershipProfile } from './agentOwnership';

const H = 'https://images.danang.homes';
const SCRAPED = [`${H}/lotus-listings/x/1.jpg`];

const profiles: OwnershipProfile[] = [
  // Verified claim on her Facebook name; profile phone in the 0+9 form signup stores.
  { slug: 'vy-tran', display_name: 'Vy Tran', listing_agent_name: 'Vy Tran🏡', phone: '0905897639' },
  // No claim at all: only name + phone can link her scraped rows.
  { slug: 'dao-le-tuyen', display_name: 'Đào Lệ Tuyền', listing_agent_name: null, phone: '0842123456' },
  // Public phone not shown (view nulls it): name alone must not link.
  { slug: 'trung-thanh', display_name: 'Trung Thành', listing_agent_name: null, phone: null },
];
const idx = buildOwnerIndex(profiles);

test('portal upload wins over a verified claim and over name + phone', () => {
  const l = { images: [`${H}/agent-listings/dao-le-tuyen/a.jpg`], agent: 'Vy Tran', agentPhone: '905897639' };
  assert.equal(listingOwnerSlug(l, idx), 'dao-le-tuyen');
});

test('a portal folder with no public profile falls through to the other routes', () => {
  const l = { images: [`${H}/agent-listings/gone-agent/a.jpg`], agent: 'vy tran', agentPhone: '' };
  assert.equal(listingOwnerSlug(l, idx), 'vy-tran');
});

test('verified claim wins over name + phone', () => {
  const both = buildOwnerIndex([
    { slug: 'claimer', display_name: 'Someone', listing_agent_name: 'Đào Lệ Tuyền', phone: null },
    ...profiles,
  ]);
  const l = { images: SCRAPED, agent: 'Đào Lệ Tuyền', agentPhone: '842123456' };
  assert.equal(listingOwnerSlug(l, both), 'claimer');
});

test('name + phone links a scraped row (accents, emoji and an 084 number)', () => {
  const l = { images: SCRAPED, agent: 'Dao Le Tuyen 🌸', agentPhone: '842123456' };
  assert.equal(listingOwnerSlug(l, idx), 'dao-le-tuyen');
});

test('same name with a different phone is not linked', () => {
  const l = { images: SCRAPED, agent: 'Đào Lệ Tuyền', agentPhone: '912000111' };
  assert.equal(listingOwnerSlug(l, idx), null);
});

test('same name with no phone on the listing is not linked', () => {
  assert.equal(listingOwnerSlug({ images: SCRAPED, agent: 'Đào Lệ Tuyền', agentPhone: '' }, idx), null);
  assert.equal(listingOwnerSlug({ images: SCRAPED, agent: 'Đào Lệ Tuyền' }, idx), null);
});

test('no phone on the profile: name alone is not linked', () => {
  assert.equal(listingOwnerSlug({ images: SCRAPED, agent: 'Trung Thành', agentPhone: '905000000' }, idx), null);
});

test('phoneKey keeps 9-digit listing phones as-is (incl. 084) and normalizes profile phones', () => {
  assert.equal(phoneKey('842123456'), '842123456');
  assert.equal(phoneKey('0842123456'), '842123456');
  assert.equal(phoneKey('+84 905 897 639'), '905897639');
  assert.equal(phoneKey(''), '');
  assert.equal(phoneKey(null), '');
});

test('auto-approve: every phone-bearing listing under the name has the profile phone', () => {
  const listings = [
    { images: SCRAPED, agent: 'Bích Ngọc🏡', agentPhone: '905897639' },
    { images: SCRAPED, agent: 'bich ngoc', agentPhone: '905897639' },
    { images: SCRAPED, agent: 'BÍCH NGỌC', agentPhone: '' },           // sale row, no phone: ignored
    { images: SCRAPED, agent: 'Someone Else', agentPhone: '999999999' }, // other name: ignored
  ];
  assert.equal(shouldAutoApproveClaim('Bích Ngọc', '0905 897 639', listings), true);
});

test('auto-approve refused when any listing under the name has another phone', () => {
  const listings = [
    { images: SCRAPED, agent: 'Bích Ngọc', agentPhone: '905897639' },
    { images: SCRAPED, agent: 'Bích Ngọc', agentPhone: '912000111' },
  ];
  assert.equal(shouldAutoApproveClaim('Bích Ngọc', '0905897639', listings), false);
});

test('auto-approve refused with no listings, no phone evidence, or no profile phone', () => {
  const noPhones = [{ images: SCRAPED, agent: 'Bích Ngọc', agentPhone: '' }];
  assert.equal(shouldAutoApproveClaim('Bích Ngọc', '0905897639', []), false);
  assert.equal(shouldAutoApproveClaim('Bích Ngọc', '0905897639', noPhones), false);
  assert.equal(shouldAutoApproveClaim('Bích Ngọc', '', [{ images: SCRAPED, agent: 'Bích Ngọc', agentPhone: '905897639' }]), false);
  assert.equal(shouldAutoApproveClaim('', '0905897639', [{ images: SCRAPED, agent: '', agentPhone: '905897639' }]), false);
});

test('groupByNameKey: exact key only, newest first, most common spelling as the name', () => {
  const ls = [
    { agent: 'Bích Ngọc🏡', date: '2026-11-01' },
    { agent: 'Bích Ngọc🏡', date: '2026-11-20' },
    { agent: 'bich ngoc', date: '2026-11-10' },
    { agent: 'Bích Ngọc Sơn Trà', date: '2026-11-25' },
  ];
  const g = groupByNameKey(ls, 'bich ngoc');
  assert.ok(g);
  assert.equal(g.name, 'Bích Ngọc🏡');
  assert.deepEqual(g.listings.map(l => l.date), ['2026-11-20', '2026-11-10', '2026-11-01']);
  assert.equal(groupByNameKey(ls, 'nobody'), null);
  assert.equal(groupByNameKey(ls, ''), null);
});
