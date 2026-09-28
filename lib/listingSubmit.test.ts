import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateSubmission, autoTitle, needsRooms, BEDROOM_OPTIONS, BATHROOM_OPTIONS, type ListingSubmission } from './listingSubmit';

const base: ListingSubmission = {
  forSale: false, propertyType: 'Apartment', district: 'Son Tra', neighborhood: '', bedrooms: '2', bathrooms: '1',
  areaSqm: '', priceAmount: 500, priceCurrency: 'USD', minTerm: '', title: '', description: 'A bright two-bedroom apartment near the beach.',
  imageUrls: ['https://images.danang.homes/x.jpg'], agentName: 'Vy',
};

test('bedrooms and bathrooms are dropdown values: Studio (0) to 10+, 1 to 8+', () => {
  assert.equal(BEDROOM_OPTIONS[0], '0');
  assert.equal(BEDROOM_OPTIONS.at(-1), '10+');
  assert.deepEqual(BATHROOM_OPTIONS, ['1', '2', '3', '4', '5', '6', '7', '8+']);
});
test('homes require both; the add form checks bathrooms, the edit form does not', () => {
  assert.equal(validateSubmission({ ...base, bedrooms: '' }, { requireBathrooms: true }).code, 'bedrooms');
  assert.equal(validateSubmission({ ...base, bathrooms: '' }, { requireBathrooms: true }).code, 'bathrooms');
  assert.equal(validateSubmission({ ...base, bedrooms: '7.5' }, { requireBathrooms: true }).code, 'bedrooms');
  assert.equal(validateSubmission({ ...base, bedrooms: '0' }, { requireBathrooms: true }).ok, true);   // studio
  assert.equal(validateSubmission({ ...base, bathrooms: '' }).ok, true);                             // edit form
});
test('land and commercial need neither', () => {
  for (const t of ['Land', 'Office', 'Retail', 'Shophouse']) {
    assert.equal(needsRooms(t), false, t);
    assert.equal(validateSubmission({ ...base, propertyType: t, bedrooms: '', bathrooms: '' }, { requireBathrooms: true }).ok, true, t);
  }
  for (const t of ['House', 'Apartment', 'Villa', 'Townhouse', 'Studio']) assert.equal(needsRooms(t), true, t);
});
test('auto-titles say "Studio", never "0-Bedroom"', () => {
  assert.equal(autoTitle({ ...base, bedrooms: '0' }), 'Studio Apartment for Rent in Son Tra, Da Nang');
  assert.equal(autoTitle({ ...base, propertyType: 'Studio', bedrooms: '0' }), 'Studio for Rent in Son Tra, Da Nang');
  assert.equal(autoTitle({ ...base, bedrooms: '3' }), '3-Bedroom Apartment for Rent in Son Tra, Da Nang');
  assert.equal(autoTitle({ ...base, bedrooms: '10+' }), '10+ Bedroom Apartment for Rent in Son Tra, Da Nang');
});
