import { test } from 'node:test';
import assert from 'node:assert/strict';
import { stripAgentPhones } from './agentPhones';

const DNH = '📞 Zalo / WhatsApp: +84 973 747 373\n📧 Email: danang4homes@gmail.com\n🌐 Website: danang.homes';

test('the sentence carrying an agent number goes; the rest of the line stays', () => {
  assert.equal(stripAgentPhones('Main road. - Area: 33.3 m² - Price: 2.65 billion VND. Please contact 0905656145.'),
    'Main road. - Area: 33.3 m² - Price: 2.65 billion VND.');
  assert.equal(stripAgentPhones('For sale at just over 5 billion VND. Please contact via Zalo 0763 670 375 for more details.\n' + DNH),
    'For sale at just over 5 billion VND.\n' + DNH);
  assert.equal(stripAgentPhones('Price: 2.55 billion VND negotiable. Contact: 0968032233 Duc. Great neighbourhood.'),
    'Price: 2.55 billion VND negotiable. Great neighbourhood.');
});
test('a line that is just an agent contact goes entirely', () => {
  assert.equal(stripAgentPhones('Nice house.\n- Contact to view: 0905 114401 (Zalo).\n' + DNH), 'Nice house.\n' + DNH);
  assert.equal(stripAgentPhones('💰 Price: 2.4 billion.\n☎️ 0935 1010 61 – Mrs. Tram Anh\n' + DNH), '💰 Price: 2.4 billion.\n' + DNH);
  assert.equal(stripAgentPhones('Good price. Call Canh at 0708 14 11 14 for more details.'), 'Good price.');
  assert.equal(stripAgentPhones('Great spot. Contact 0905.049.529 to view. Serious seller.'), 'Great spot. Serious seller.');
});
test('+84 formats count too', () => {
  assert.equal(stripAgentPhones('30 million VND/month.\n📞 Contact/Zalo: +84775 420 992\nViewings daily.'), '30 million VND/month.\nViewings daily.');
});
test('the Da Nang Homes number is never removed', () => {
  assert.equal(stripAgentPhones(DNH), DNH);
  assert.equal(stripAgentPhones('Call 0973 747 373 today.'), 'Call 0973 747 373 today.');
});
test('prices, areas and dates are not phone numbers', () => {
  for (const t of ['Price: 3.750 billion VND. Area 55 m².', 'Land 1,250 m², 0.95 billion', 'Built 2026, lot 0123', 'Price 12.5 billion (1250000000 VND)'])
    assert.equal(stripAgentPhones(t), t);
});
test('works on translated copies', () => {
  assert.equal(stripAgentPhones('Giá 2,4 tỷ. Liên hệ 0935101061 chị Trâm Anh.\n' + DNH), 'Giá 2,4 tỷ.\n' + DNH);
});
test('descriptions written as one long " - " line only lose the phone segment', () => {
  assert.equal(stripAgentPhones('House for sale - Alley on Vo Duy Ninh Street - 88m2 - 3 bedrooms - price 5.x billion VND negotiable - just a few hundred meters from the beach - Call me to view the house 0708.16.15.16'),
    'House for sale - Alley on Vo Duy Ninh Street - 88m2 - 3 bedrooms - price 5.x billion VND negotiable - just a few hundred meters from the beach');
  assert.equal(stripAgentPhones('Beach land 96m2 - frontage 7.5m road - price 7.7 billion VND negotiable - Contact: 0708.1615.16 (Beach Land Specialist Son Tra)'),
    'Beach land 96m2 - frontage 7.5m road - price 7.7 billion VND negotiable');
  assert.equal(stripAgentPhones('Anh Thái - Specializing in Beautiful Real Estate in Da Nang - 0908.6666.14 - Only 7.45 billion VND gets you a 3.5-story house.'),
    'Anh Thái - Specializing in Beautiful Real Estate in Da Nang - Only 7.45 billion VND gets you a 3.5-story house.');
  assert.equal(stripAgentPhones('Great corner lot | Contact: 0902753374; Zalo: 0387338804'), 'Great corner lot');
});
