import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateSubmission, autoTitle, type ListingSubmission } from './listingSubmit';

const base: ListingSubmission = {
  forSale: false, propertyType: 'Apartment', district: 'Son Tra', neighborhood: '', bedrooms: '2', bathrooms: '1',
  areaSqm: '', priceAmount: 500, priceCurrency: 'USD', minTerm: '', title: '', description: 'A bright two-bedroom apartment near the beach.',
  imageUrls: ['https://images.danang.homes/x.jpg'], agentName: 'Vy',
};

test('homes require both; the add form checks bathrooms, the edit form does not', () => {
  assert.equal(validateSubmission({ ...base, bedrooms: '' }, { requireBathrooms: true }).code, 'bedrooms');
  assert.equal(validateSubmission({ ...base, bathrooms: '' }, { requireBathrooms: true }).code, 'bathrooms');
  assert.equal(validateSubmission({ ...base, bedrooms: '7.5' }, { requireBathrooms: true }).code, 'bedrooms');
  assert.equal(validateSubmission({ ...base, bedrooms: '0' }, { requireBathrooms: true }).ok, true);   // studio
  assert.equal(validateSubmission({ ...base, bathrooms: '' }).ok, true);                             // edit form
});
test('rooms follow the type: none for land, 0 allowed for commercial, no studio houses', () => {
  const sale = { ...base, forSale: true, priceAmount: 100_000 };
  assert.equal(validateSubmission({ ...sale, propertyType: 'Land', bedrooms: '', bathrooms: '' }, { requireBathrooms: true }).ok, true);
  assert.equal(validateSubmission({ ...base, propertyType: 'Commercial', bedrooms: '0', bathrooms: '0' }, { requireBathrooms: true }).ok, true);
  assert.equal(validateSubmission({ ...base, propertyType: 'House', bedrooms: '0' }, { requireBathrooms: true }).code, 'bedrooms');
  assert.equal(validateSubmission({ ...base, propertyType: 'Land' }).code, 'type');          // not for rent
  assert.equal(validateSubmission({ ...base, propertyType: 'Townhouse' }).code, 'type');     // not a type any more
});
test('auto-titles say "Studio", never "0-Bedroom"', () => {
  assert.equal(autoTitle({ ...base, bedrooms: '0' }), 'Studio Apartment for Rent in Son Tra, Da Nang');
  assert.equal(autoTitle({ ...base, propertyType: 'Commercial', bedrooms: '0' }), 'Commercial for Rent in Son Tra, Da Nang');
  assert.equal(autoTitle({ ...base, bedrooms: '3' }), '3-Bedroom Apartment for Rent in Son Tra, Da Nang');
  assert.equal(autoTitle({ ...base, bedrooms: '10+' }), '10+ Bedroom Apartment for Rent in Son Tra, Da Nang');
});
