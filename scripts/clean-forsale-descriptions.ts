// One-off cleanup of the For Sale sheet's descriptions (Blake, 2026-09-28):
//   - the leaked enrichment-prompt lines ("1. Translate into English…", "2. At the end
//     of the description…contact details:") — lib/promptEcho.ts
//   - the scraped agents' own phone/Zalo numbers — lib/agentPhones.ts
// in the EN / VI / KO / RU description columns (B, W, Y, AA). The site already strips
// both on read; this cleans the sheet itself.
//
//   npx tsx scripts/clean-forsale-descriptions.ts            # dry run: counts + samples
//   npx tsx scripts/clean-forsale-descriptions.ts --write    # backup, then write
//
// Other jobs delete For Sale rows hourly, so row numbers can shift. Right before
// writing, each row is re-read and only written if its post URL (col T) and the cell
// are still exactly what was cleaned. Every original value is backed up first.
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { stripPromptEcho } from '../lib/promptEcho';
import { stripAgentPhones } from '../lib/agentPhones';

const require = createRequire(import.meta.url);
const { google } = require(path.join(process.env.HOME!, '.openclaw/scripts/node_modules/googleapis'));

const SPREADSHEET_ID = '14hGuwUcb308n3h1ODyby97WqHa7uRUyyYAKMHgWnyUE';
const TAB = 'For Sale';
const COLS: Record<string, number> = { B: 1, W: 22, Y: 24, AA: 26 };   // text, vi_text, ko_text, ru_text
const POST_URL = 19;                                                     // col T
const CREDS = path.join(process.env.HOME!, '.openclaw/credentials/google');
const WRITE = process.argv.includes('--write');

async function auth() {
  const { client_id, client_secret, redirect_uris } = JSON.parse(fs.readFileSync(path.join(CREDS, 'oauth-client.json'), 'utf8')).installed;
  const client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
  const tokenPath = path.join(CREDS, 'oauth-token.json');
  const token = JSON.parse(fs.readFileSync(tokenPath, 'utf8'));
  client.setCredentials(token);
  if (token.expiry_date && token.expiry_date < Date.now() + 5 * 60_000) {
    const { credentials } = await client.refreshAccessToken();
    client.setCredentials(credentials);
    fs.writeFileSync(tokenPath, JSON.stringify(credentials, null, 2));
  }
  return client;
}

const clean = (s: string) => stripAgentPhones(stripPromptEcho(s));

async function readRows(sheets: any): Promise<string[][]> {
  const res = await sheets.spreadsheets.values.get({ spreadsheetId: SPREADSHEET_ID, range: `'${TAB}'!A:AA`, valueRenderOption: 'FORMATTED_VALUE' });
  return res.data.values ?? [];
}

(async () => {
  const sheets = google.sheets({ version: 'v4', auth: await auth() });
  const rows = await readRows(sheets);
  type Edit = { row: number; col: string; url: string; before: string; after: string };
  const edits: Edit[] = [];
  rows.forEach((r, i) => {
    if (i === 0) return;                                   // header
    for (const [col, idx] of Object.entries(COLS)) {
      const before = r[idx] ?? '';
      const after = clean(before);
      if (after !== before) edits.push({ row: i + 1, col, url: r[POST_URL] ?? '', before, after });
    }
  });
  const byCol = edits.reduce<Record<string, number>>((c, e) => ({ ...c, [e.col]: (c[e.col] ?? 0) + 1 }), {});
  console.log(`${rows.length - 1} rows; ${edits.length} cells to clean`, byCol);
  // Show what goes: lines that were removed or shortened.
  const shown = [...edits].sort(() => 0.5 - Math.random()).slice(0, 12);
  for (const e of shown) {
    const kept = new Set(e.after.split('\n'));
    const gone = e.before.split('\n').filter(l => !kept.has(l));
    const now = e.after.split('\n').filter(l => !new Set(e.before.split('\n')).has(l));
    console.log(`\n--- ${e.col}${e.row}\n  REMOVED/EDITED: ${gone.map(l => JSON.stringify(l.slice(0, 160))).join(' / ')}${now.length ? `\n  BECAME:         ${now.map(l => JSON.stringify(l.slice(0, 160))).join(' / ')}` : ''}`);
  }
  if (!WRITE) { console.log('\n(dry run — pass --write to apply)'); return; }

  const backup = path.join(process.env.HOME!, '.openclaw/backups', `forsale-descriptions-${new Date().toISOString().replace(/[:.]/g, '-')}.json`);
  fs.mkdirSync(path.dirname(backup), { recursive: true });
  fs.writeFileSync(backup, JSON.stringify(edits.map(({ row, col, url, before }) => ({ row, col, url, before })), null, 1));
  console.log('backup:', backup);

  // Re-read right before writing; only write cells whose row is unchanged.
  const now = await readRows(sheets);
  const safe = edits.filter(e => (now[e.row - 1]?.[POST_URL] ?? '') === e.url && (now[e.row - 1]?.[COLS[e.col]] ?? '') === e.before);
  console.log(`${safe.length} of ${edits.length} cells unchanged since read — writing those`);
  for (let i = 0; i < safe.length; i += 400) {
    const chunk = safe.slice(i, i + 400);
    await sheets.spreadsheets.values.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      // RAW: text like "+84 973…" or "- Area" must stay literal, never a formula.
      requestBody: { valueInputOption: 'RAW', data: chunk.map(e => ({ range: `'${TAB}'!${e.col}${e.row}`, values: [[e.after]] })) },
    });
    console.log(`wrote ${Math.min(i + 400, safe.length)}/${safe.length}`);
  }
  const skipped = edits.length - safe.length;
  if (skipped) console.log(`${skipped} cells skipped (row moved or edited meanwhile) — re-run to catch them`);
})();
