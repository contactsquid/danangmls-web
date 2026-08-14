import 'server-only';

import { createSign } from 'node:crypto';

/**
 * Minimal Google Sheets writer for agent-submitted listings.
 *
 * Listings live in the Google Sheet — that decision predates the portal and is
 * deliberate (one source, unchanged rendering, the n8n pipeline keeps working).
 * So a portal submission is an append to the same tab the scrapers write to.
 *
 * Hand-rolled JWT rather than `googleapis`: that package is tens of megabytes
 * and pulls in the whole discovery layer for what is, here, two HTTP calls.
 * node:crypto can sign RS256 directly.
 */

interface ServiceAccount {
  client_email: string;
  private_key: string;
}

const SPREADSHEET_ID = '14hGuwUcb308n3h1ODyby97WqHa7uRUyyYAKMHgWnyUE';
const SCOPE = 'https://www.googleapis.com/auth/spreadsheets';

export const isSheetsConfigured = Boolean(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);

function readServiceAccount(): ServiceAccount | null {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!raw) return null;
  try {
    const sa = JSON.parse(raw) as ServiceAccount;
    if (!sa.client_email || !sa.private_key) {
      console.error('[sheets-write] service account JSON missing client_email/private_key');
      return null;
    }
    // Env vars frequently carry the key with literal \n rather than newlines.
    return { ...sa, private_key: sa.private_key.replace(/\\n/g, '\n') };
  } catch {
    console.error('[sheets-write] GOOGLE_SERVICE_ACCOUNT_JSON is not valid JSON');
    return null;
  }
}

const b64url = (input: Buffer | string) =>
  Buffer.from(input).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

/** Access tokens last an hour; caching one avoids a token round-trip per submit.
 *  Module scope survives between invocations on a warm lambda and is simply
 *  re-fetched on a cold one. */
let cachedToken: { token: string; expiresAt: number } | null = null;

async function getAccessToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expiresAt - 60_000) return cachedToken.token;

  const sa = readServiceAccount();
  if (!sa) throw new Error('Google service account is not configured');

  const now = Math.floor(Date.now() / 1000);
  const header = b64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const claims = b64url(
    JSON.stringify({
      iss: sa.client_email,
      scope: SCOPE,
      aud: 'https://oauth2.googleapis.com/token',
      iat: now,
      exp: now + 3600,
    }),
  );

  const signer = createSign('RSA-SHA256');
  signer.update(`${header}.${claims}`);
  const signature = b64url(signer.sign(sa.private_key));
  const assertion = `${header}.${claims}.${signature}`;

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion,
    }),
    signal: AbortSignal.timeout(15_000),
  });

  if (!res.ok) {
    throw new Error(`Google token request failed (${res.status}): ${(await res.text()).slice(0, 200)}`);
  }

  const data = (await res.json()) as { access_token: string; expires_in: number };
  cachedToken = { token: data.access_token, expiresAt: Date.now() + data.expires_in * 1000 };
  return data.access_token;
}

/**
 * Appends one row to a tab.
 *
 * USER_ENTERED (not RAW) so the Date cell lands as a real date rather than a
 * text string — the rentals pipeline was bitten by exactly that before.
 *
 * `values.append` is used with an explicit A:Z range. Note the known gotcha
 * recorded in danangmls-rentals-missing-date-fix: append aligns to the first
 * column of the given range, so the row array must be positionally complete
 * from column A — no sparse arrays, use '' for empty cells.
 */
export async function appendRow(tabName: string, row: string[]): Promise<void> {
  const token = await getAccessToken();

  // Anchor the append at A1, NOT a broad "A:Z". Given a wide range, Sheets runs
  // its own table detection to decide which column the table starts in — and on
  // this sheet it decided column O, writing an entire listing 14 columns to the
  // right (title into Post URL, price into Telegram, and a 404 for the agent).
  // An A1 anchor pins the table's left edge to column A.
  const range = encodeURIComponent(`${tabName}!A1`);

  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${range}:append` +
      `?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS&includeValuesInResponse=false`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ values: [row] }),
      signal: AbortSignal.timeout(20_000),
    },
  );

  if (!res.ok) {
    throw new Error(`Sheet append failed (${res.status}): ${(await res.text()).slice(0, 300)}`);
  }

  // Belt and braces: confirm where it actually landed. Table detection is
  // Google's, not ours, so rather than trust the anchor we check the reported
  // range and repair the row if it started anywhere but column A. A silently
  // misaligned row corrupts the sheet AND 404s the listing, so it is worth the
  // one extra call in the failure case.
  const data = (await res.json()) as { updates?: { updatedRange?: string } };
  const updatedRange = data.updates?.updatedRange ?? '';
  const cell = updatedRange.split('!')[1] ?? '';
  const startColumn = cell.match(/^([A-Z]+)/)?.[1];
  const startRow = cell.match(/^[A-Z]+(\d+)/)?.[1];

  if (startColumn && startColumn !== 'A' && startRow) {
    console.error(
      `[sheets-write] append landed at column ${startColumn} (${updatedRange}) — repairing row ${startRow}`,
    );
    await repairRow(token, tabName, Number(startRow), row);
  }
}

/** Rewrites a misaligned row into columns A… and clears whatever the bad append
 *  scattered to the right of it. */
async function repairRow(token: string, tabName: string, rowNumber: number, row: string[]): Promise<void> {
  const lastColumn = String.fromCharCode('A'.charCodeAt(0) + row.length - 1); // 23 cols → 'W'
  const target = encodeURIComponent(`${tabName}!A${rowNumber}:${lastColumn}${rowNumber}`);

  const put = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${target}` +
      `?valueInputOption=USER_ENTERED`,
    {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ values: [row] }),
      signal: AbortSignal.timeout(20_000),
    },
  );
  if (!put.ok) {
    throw new Error(`Sheet repair failed (${put.status}): ${(await put.text()).slice(0, 300)}`);
  }

  const clearFrom = String.fromCharCode(lastColumn.charCodeAt(0) + 1); // 'X'
  await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/` +
      `${encodeURIComponent(`${tabName}!${clearFrom}${rowNumber}:AZ${rowNumber}`)}:clear`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: '{}',
      signal: AbortSignal.timeout(20_000),
    },
  );
}
