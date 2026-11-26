/**
 * Agent-name comparison keys. Client-safe: no server imports, so the signup form,
 * server actions and tests can all share it.
 *
 * Two keys, for two different jobs:
 *
 * - `normalizeAgentName` keeps diacritics. It is the join key for an
 *   admin-verified `listing_agent_name` claim, where "Lâm" and "Lam" may well be
 *   different people and we only forgive what Facebook adds (emoji, casing,
 *   stray spacing).
 *
 * - `agentNameKey` is looser: accents, emoji and punctuation all go. It decides
 *   whether two PROFILES would read as the same name on the site ("Bích Ngọc🏡",
 *   "bich ngoc" and "BÍCH  NGỌC" are one name to a visitor), and it is the name
 *   half of the name + phone link for scraped listings.
 *
 * `agentNameKey` MUST stay in step with `public.agent_name_key(text)` in
 * supabase/migrations/0008_unique_agent_names.sql, which backs the UNIQUE index on
 * agent_profiles. lib/agentNameKey.test.ts checks the accent map and the shared
 * example table against that file, so an edit to one side fails the tests.
 */

/** Pictographs and their joiners. Letters, punctuation and diacritics untouched. */
const PICTOGRAPHS = /[\p{Extended_Pictographic}‍️⃣]/gu;

/** Agent names in the sheet arrive with inconsistent spacing and casing
 *  (they originate from scraped Facebook posts), so every comparison against
 *  them goes through this.
 *
 *  Emoji are stripped too. Facebook agents routinely decorate their display
 *  names — "Vy Tran🏡✨", "A. Nhật🌟" — and 1,078 distinct names across the sheet
 *  carry them. Exact matching missed every one: Vy Tran alone had 23 listings
 *  split off from her own 235 by nothing but a house and a sparkle.
 *
 *  Only pictographs and their joiners go; letters, punctuation and diacritics
 *  are untouched, so "Ms. Vy" and "Phan Vy" stay the distinct people they are. */
export function normalizeAgentName(name: string | null | undefined): string {
  return (name ?? '')
    .replace(PICTOGRAPHS, '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ');
}

/** Vietnamese letters with their ASCII base, lowercase then uppercase. Identical
 *  to the two translate() strings in 0008_unique_agent_names.sql (the test
 *  compares them). An explicit map rather than NFD stripping, because Postgres
 *  has no unaccent here and both sides must fold exactly the same characters. */
export const VI_ACCENT_FROM =
  'àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ'
  + 'ÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ';
export const VI_ACCENT_TO =
  'aaaaaaaaaaaaaaaaaeeeeeeeeeeeiiiiiooooooooooooooooouuuuuuuuuuuyyyyyd'
  + 'AAAAAAAAAAAAAAAAAEEEEEEEEEEEIIIIIOOOOOOOOOOOOOOOOOUUUUUUUUUUUYYYYYD';

const FROM = [...VI_ACCENT_FROM];
const TO = [...VI_ACCENT_TO];
const ACCENT_MAP = new Map(FROM.map((c, i) => [c, TO[i]]));

/**
 * The name key: NFC, Vietnamese accents folded (đ → d), lowercase, then every run
 * of anything that is not a-z or 0-9 (emoji, punctuation, spaces, other scripts)
 * becomes one space, trimmed.
 *
 * "Bích Ngọc🏡", "bich ngoc" and "BÍCH  NGỌC" all give "bich ngoc".
 *
 * Returns '' for a name with no Latin letters or digits (a purely Cyrillic or
 * Korean name). The SQL function returns NULL there, which the unique index
 * ignores, and callers here skip '' — such names are not policed, rather than
 * all colliding with each other on the empty key.
 */
export function agentNameKey(name: string | null | undefined): string {
  let out = '';
  for (const ch of String(name ?? '').normalize('NFC')) out += ACCENT_MAP.get(ch) ?? ch;
  return out.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}
