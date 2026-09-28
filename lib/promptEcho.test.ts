import { test } from 'node:test';
import assert from 'node:assert/strict';
import { stripPromptEcho } from './promptEcho';

const CONTACT = '📞 Zalo / WhatsApp: +84 973 747 373\n📧 Email: danang4homes@gmail.com\n🌐 Website: danang.homes';

test('the leaked "1. Translate…" label is removed, the description kept', () => {
  assert.equal(stripPromptEcho('1. Translate into English and write a better version:\nEXTREMELY RARE - RICE FIELD VIEW'), 'EXTREMELY RARE - RICE FIELD VIEW');
  assert.equal(stripPromptEcho('1. Translate into English and write a better version.\nBeautiful house'), 'Beautiful house');
  // Label and description on the same line: only the label goes.
  assert.equal(stripPromptEcho('1. Translated into English: Price reduced: 7 billion VND'), 'Price reduced: 7 billion VND');
  assert.equal(stripPromptEcho('1. Translated & Enhanced Description:\nA prime lot'), 'A prime lot');
  assert.equal(stripPromptEcho('1. Translated from Vietnamese and improved: Paved alley land plot'), 'Paved alley land plot');
});
test('the leaked "2. At the end… contact details:" line is removed, the contact block kept', () => {
  const t = `A lovely house.\nContact for a viewing.\n\n2. At the end of the description please use our contact details:\n${CONTACT}`;
  assert.equal(stripPromptEcho(t), `A lovely house.\nContact for a viewing.\n\n${CONTACT}`);
});
test('translated copies (vi / ko / ru) are cleaned the same way', () => {
  assert.equal(stripPromptEcho('1. Dịch sang tiếng Anh và viết phiên bản tốt hơn.\nNhà đẹp\n2. Cuối phần mô tả vui lòng sử dụng thông tin liên hệ của chúng tôi:\n📞 Zalo'), 'Nhà đẹp\n📞 Zalo');
  assert.equal(stripPromptEcho('1. Mô tả được dịch và cải thiện:\nNhà đẹp'), 'Nhà đẹp');
  assert.equal(stripPromptEcho('1. 영어로 번역하고 더 나은 버전을 작성합니다.\n좋은 집\n2. 설명 마지막 부분에 저희 연락처를 사용해 주세요:\n📞'), '좋은 집\n📞');
  assert.equal(stripPromptEcho('1. Перевод на английский и улучшенная версия:\nДом\n2. В конце описания, пожалуйста, используйте наши контактные данные:\n📞'), 'Дом\n📞');
});
test('ordinary descriptions are untouched', () => {
  for (const t of ['1. Spacious living room\n2. Two bedrooms', 'Price reduced: 7 billion VND', '1. 가격 인하: 70억 VND', '']) assert.equal(stripPromptEcho(t), t);
});
