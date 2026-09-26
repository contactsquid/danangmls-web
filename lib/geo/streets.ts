/** Lowercase, diacritic-free, single-spaced — the lookup key for names. */
export function normalizeName(s: string): string {
  return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd').replace(/Đ/g, 'D')
    .toLowerCase().replace(/\s+/g, ' ').trim();
}

// Words that precede a street name in listing copy but are never part of one.
const STOP = new Set(['near', 'on', 'at', 'off', 'located', 'main', 'front', 'the', 'a',
  'big', 'quiet', 'beach', 'walking', 'private', 'frontage', 'facing', 'busy', 'wide',
  'from', 'to', 'in', 'of', 'and', 'price', 'alley', 'lane', 'beautiful', 'new', 'house',
  'villa', 'apartment', 'via', 'close']);

const TOKEN = String.raw`(?:\p{Lu}\p{Ll}*|\d{1,3})`;
// "Nguyen Van Thoai Street", "Tran Cao Van St.", "An Thuong 2 Road"
const EN = new RegExp(String.raw`((?:${TOKEN}\s+){1,5})(?:Street|St\.?|Road|Rd\.?)(?!\p{L})`, 'gu');
// "đường Lê Duẩn" — only the accented word: "Duong" alone is a common surname/street start.
const VI = new RegExp(String.raw`[đĐ]ường\s+((?:${TOKEN}(?:\s+|$)){2,5})`, 'gu');

function clean(raw: string): string | null {
  const tokens = raw.trim().split(/\s+/);
  while (tokens.length && STOP.has(tokens[0].toLowerCase())) tokens.shift();
  if (tokens.length < 2 || /^\d/.test(tokens[0])) return null;
  if (tokens.some(t => STOP.has(t.toLowerCase()))) return null;
  return tokens.join(' ');
}

/** First street name mentioned in a listing's text, or null. */
export function extractStreet(text: string): { name: string; key: string } | null {
  for (const re of [EN, VI]) {
    for (const m of text.matchAll(re)) {
      const name = clean(m[1]);
      if (name) return { name, key: normalizeName(name) };
    }
  }
  return null;
}
