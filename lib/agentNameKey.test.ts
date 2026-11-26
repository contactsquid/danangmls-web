import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { agentNameKey, VI_ACCENT_FROM, VI_ACCENT_TO } from './agentNameKey';

/** Shared name → key table. The SAME rows sit in a comment in
 *  supabase/migrations/0008_unique_agent_names.sql (public.agent_name_key), and the
 *  last test below fails if the two ever differ. '' = NULL on the SQL side. */
const CASES: [string, string][] = [
  ["Bích Ngọc🏡","bich ngoc"],
  ["bich ngoc","bich ngoc"],
  ["BÍCH  NGỌC","bich ngoc"],
  ["Đào Lệ Tuyền","dao le tuyen"],
  ["ĐẶNG THỊ MAI","dang thi mai"],
  ["Trần Nguyên Lâm","tran nguyen lam"],
  ["Hoàng Vũ Thái Bình","hoang vu thai binh"],
  ["🔥 Phạm  Minh Tâm ❤️","pham minh tam"],
  ["Ms. Vy","ms vy"],
  ["Mr.Bin_arenda","mr bin arenda"],
  ["Vy Tran 0905","vy tran 0905"],
  ["Bích Ngọc Sơn Trà","bich ngoc son tra"],
  ["àáạảã âầấậẩẫ ăằắặẳẵ èéẹẻẽ êềếệểễ ìíịỉĩ","aaaaa aaaaaa aaaaaa eeeee eeeeee iiiii"],
  ["òóọỏõ ôồốộổỗ ơờớợởỡ ùúụủũ ưừứựửữ ỳýỵỷỹ đ","ooooo oooooo oooooo uuuuu uuuuuu yyyyy d"],
  ["ÀÁẠẢÃ ÂẦẤẬẨẪ ĂẰẮẶẲẴ ÈÉẸẺẼ ÊỀẾỆỂỄ ÌÍỊỈĨ","aaaaa aaaaaa aaaaaa eeeee eeeeee iiiii"],
  ["ÒÓỌỎÕ ÔỒỐỘỔỖ ƠỜỚỢỞỠ ÙÚỤỦŨ ƯỪỨỰỬỮ ỲÝỴỶỸ Đ","ooooo oooooo oooooo uuuuu uuuuuu yyyyy d"],
  ["Анна",""],
  ["🏡✨",""],
];

const SQL = readFileSync(join(process.cwd(), 'supabase/migrations/0008_unique_agent_names.sql'), 'utf8');

test('agentNameKey matches the shared table', () => {
  for (const [name, key] of CASES) assert.equal(agentNameKey(name), key, name);
});

test('agentNameKey folds the owner examples to one key', () => {
  assert.equal(agentNameKey('Bích Ngọc🏡'), agentNameKey('bich ngoc'));
  assert.equal(agentNameKey('BÍCH  NGỌC'), 'bich ngoc');
});

test('agentNameKey handles decomposed (NFD) input and empty values', () => {
  assert.equal(agentNameKey('Bích Ngọc'), 'bich ngoc');
  assert.equal(agentNameKey(null), '');
  assert.equal(agentNameKey(undefined), '');
  assert.equal(agentNameKey('   '), '');
});

test('accent map: equal lengths, and each letter folds to its NFD base', () => {
  const from = [...VI_ACCENT_FROM], to = [...VI_ACCENT_TO];
  assert.equal(from.length, 134);
  assert.equal(to.length, 134);
  from.forEach((c, i) => {
    const base = c.replace(/đ/g, 'd').replace(/Đ/g, 'D').normalize('NFD').replace(/[̀-ͯ]/g, '');
    assert.equal(base, to[i], c);
  });
});

test('SQL agent_name_key uses the same accent map as the TypeScript', () => {
  assert.ok(SQL.includes(`'${VI_ACCENT_FROM}'`), 'translate() FROM string differs');
  assert.ok(SQL.includes(`'${VI_ACCENT_TO}'`), 'translate() TO string differs');
});

test('SQL comment carries the same example table', () => {
  const sqlCases = SQL.split('\n')
    .filter(l => l.startsWith('--   ['))
    .map(l => JSON.parse(l.slice(5)) as [string, string]);
  assert.deepEqual(sqlCases, CASES);
});
