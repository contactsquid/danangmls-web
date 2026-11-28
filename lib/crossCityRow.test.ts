import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildCrossCityRow, checkCityDistrict } from './crossCityRow';
import type { ListingSubmission } from './listingSubmit';

const base: ListingSubmission = {
  forSale: true, propertyType: 'Apartment', district: 'District 1', neighborhood: '', bedrooms: '2', bathrooms: '2',
  areaSqm: '', priceAmount: 200000, priceCurrency: 'USD', minTerm: '', title: '', description: 'A bright two-bedroom apartment in the centre.',
  imageUrls: ['https://images.danang.homes/a.jpg', 'https://images.danang.homes/b.jpg'], agentName: 'Vy',
};

test('Saigon sale goes to Saigon For Sale with saigonmls URL and 23 columns', () => {
  const r = buildCrossCityRow(base, 'saigon');
  assert.equal(r.tab, 'Saigon For Sale');
  assert.equal(r.row.length, 23);
  assert.match(r.url, /^https:\/\/saigonmls\.com\/listing\//);
  assert.equal(r.row[3], 'District 1');
  assert.equal(r.row[8], 'https://images.danang.homes/b.jpg');
  assert.equal(r.row[18], r.url);
  assert.match(r.row[0], /Ho Chi Minh City/);
});

test('Da Nang rent uses Sheet1 split image columns', () => {
  const r = buildCrossCityRow({ ...base, forSale: false, district: 'Hai Chau', imageUrls: Array.from({ length: 7 }, (_, i) => `https://x/${i}.jpg`) }, 'danang');
  assert.equal(r.tab, 'Sheet1');
  assert.equal(r.row.length, 23);
  assert.equal(r.row[11], 'https://x/4.jpg');
  assert.equal(r.row[18], 'https://x/5.jpg');
  assert.equal(r.row[17], r.url);
});

test('other cities go to Lotus tabs with the City column', () => {
  const sale = buildCrossCityRow({ ...base, district: 'Nha Trang' }, 'nha-trang');
  assert.equal(sale.tab, 'Lotus For Sale'); assert.equal(sale.row.length, 28); assert.equal(sale.row[27], 'nha-trang');
  const rent = buildCrossCityRow({ ...base, forSale: false }, 'da-lat');
  assert.equal(rent.tab, 'Lotus For Rent'); assert.equal(rent.row.length, 31); assert.equal(rent.row[30], 'da-lat');
  assert.match(rent.url, /^https:\/\/lotusmls\.com\//);
});

test('district + city checks', () => {
  assert.equal(checkCityDistrict('saigon', 'District 1'), null);
  assert.equal(checkCityDistrict('saigon', 'Hai Chau'), 'district');
  assert.equal(checkCityDistrict('nope', 'x'), 'city');
  assert.equal(checkCityDistrict('da-lat', 'Ward 1'), null);
  assert.equal(checkCityDistrict('da-lat', ''), 'district');
});
