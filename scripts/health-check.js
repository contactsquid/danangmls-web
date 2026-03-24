#!/usr/bin/env node
/**
 * danangmls.com Site Health Check
 *
 * Checks:
 *   1. Live pages load with reasonable listing counts
 *   2. Random listing detail pages return 200
 *   3. Google Sheet data quality (districts, types, non-real-estate posts)
 *   4. No duplicate slugs
 *
 * Sends a WhatsApp alert via OpenClaw if any issues are found.
 * Exits 0 on pass, 1 on failure.
 *
 * Usage:
 *   node scripts/health-check.js            # full check
 *   node scripts/health-check.js --quiet    # suppress OK output
 */

const { execSync } = require('child_process');
const https = require('https');
const http  = require('http');

const SITE          = 'https://www.danangmls.com';
const SHEET_ID      = '14hGuwUcb308n3h1ODyby97WqHa7uRUyyYAKMHgWnyUE';
const OPENCLAW      = '/Users/alissasparks/.npm-global/bin/openclaw';
const ALERT_TO      = '+15592701522';
const QUIET         = process.argv.includes('--quiet');

const VALID_DISTRICTS = new Set([
  'Hai Chau', 'Thanh Khe', 'Son Tra', 'Ngu Hanh Son',
  'Lien Chieu', 'Cam Le', 'Hoi An', 'Da Nang',
]);
const VALID_TYPES = new Set([
  'House', 'Apartment', 'Villa', 'Land', 'Office',
  'Retail', 'Townhouse', 'Studio', 'Shophouse',
]);
// Check title only — body text often mentions restaurants/food as amenities
const NON_REALESTATE_TITLE_RE = /\b(fish for sale|seafood for sale|shrimp for sale|oranges for sale|sticky rice|chicken for sale|pork for sale|beef for sale|fermented|food for sale)\b/i;
const REALESTATE_RE = /house|apartment|land|villa|property|bedroom|sqm|m²|m2|townhouse|đất|căn hộ|nhà/i;
const MIN_RENTALS   = 100;
const MIN_FOR_SALE  = 50;
const DETAIL_SAMPLE = 5;   // number of listing pages to spot-check

// ─── HTTP helpers ─────────────────────────────────────────────────────────────
function get(url, { followRedirects = true, timeoutMs = 15000 } = {}) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith('https') ? https : http;
    const req = lib.get(url, { timeout: timeoutMs }, res => {
      if (followRedirects && (res.statusCode === 301 || res.statusCode === 302 || res.statusCode === 307)) {
        resolve(get(res.headers.location, { followRedirects, timeoutMs }));
        return;
      }
      let body = '';
      res.on('data', d => body += d);
      res.on('end', () => resolve({ status: res.statusCode, body, headers: res.headers }));
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error(`Timeout fetching ${url}`)); });
  });
}

// ─── CSV parser (mirrors the one in lib/sheets.ts) ───────────────────────────
function parseCSV(text) {
  const rows = [];
  let row = [], field = '', inQuote = false, i = 0;
  while (i < text.length) {
    const ch = text[i];
    if (inQuote) {
      if (ch === '"' && text[i+1] === '"') { field += '"'; i += 2; }
      else if (ch === '"') { inQuote = false; i++; }
      else { field += ch; i++; }
    } else {
      if (ch === '"') { inQuote = true; i++; }
      else if (ch === ',') { row.push(field); field = ''; i++; }
      else if (ch === '\r' && text[i+1] === '\n') { row.push(field); field = ''; rows.push(row); row = []; i += 2; }
      else if (ch === '\n' || ch === '\r') { row.push(field); field = ''; rows.push(row); row = []; i++; }
      else { field += ch; i++; }
    }
  }
  if (field || row.length) { row.push(field); rows.push(row); }
  return rows.filter(r => r.some(c => c.trim()));
}

function col(row, idx) {
  return row && row[idx] != null ? String(row[idx]).trim() : '';
}

// ─── Checks ───────────────────────────────────────────────────────────────────
async function checkPage(url, label, minCount) {
  const issues = [];
  try {
    const { status, body } = await get(url);
    if (status !== 200) {
      issues.push(`${label} returned HTTP ${status}`);
      return issues;
    }
    const match = body.match(/(\d+)\s+listings?/i);
    const count = match ? parseInt(match[1]) : 0;
    if (count < minCount) {
      issues.push(`${label} shows only ${count} listings (expected >= ${minCount})`);
    } else if (!QUIET) {
      console.log(`  ✓ ${label}: ${count} listings`);
    }
  } catch (e) {
    issues.push(`${label} failed to load: ${e.message}`);
  }
  return issues;
}

async function checkDetailPages(slugs, label) {
  const issues = [];
  const sample = slugs.sort(() => Math.random() - 0.5).slice(0, DETAIL_SAMPLE);
  for (const slug of sample) {
    const url = `${SITE}/listing/${slug}`;
    try {
      const { status } = await get(url);
      if (status === 404) {
        issues.push(`Broken listing page (404): /listing/${slug}`);
      } else if (status !== 200) {
        issues.push(`Listing page returned HTTP ${status}: /listing/${slug}`);
      }
    } catch (e) {
      issues.push(`Listing page failed to load: /listing/${slug} — ${e.message}`);
    }
  }
  if (issues.length === 0 && !QUIET) {
    console.log(`  ✓ ${label}: spot-checked ${sample.length} listing pages — all OK`);
  }
  return issues;
}

async function fetchSheet(sheetName) {
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetName)}`;
  const { body } = await get(url);
  return parseCSV(body);
}

function slugifyCheck(text, postUrl) {
  let h = 0;
  for (let i = 0; i < postUrl.length; i++) {
    h = (Math.imul(31, h) + postUrl.charCodeAt(i)) >>> 0;
  }
  const suffix = h.toString(36).slice(0, 6) || '0';
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60) + '-' + suffix;
}

async function checkSheetData() {
  const issues = [];

  // ── Rentals (Sheet1) ────────────────────────────────────────────────
  const rentalRows = (await fetchSheet('Sheet1')).slice(1).filter(r => col(r, 0));
  const rentalSlugs = [];
  let rentalBadDistrict = 0, rentalBadType = 0, rentalNonRealestate = 0, rentalNoImage = 0;

  for (const r of rentalRows) {
    const title    = col(r, 0);
    const text     = col(r, 1);
    const district = col(r, 3);
    const type     = col(r, 5);
    const postUrl  = col(r, 14);
    const img1     = col(r, 7);

    const districtClean = district.replace(/not provided|unknown|n\/a/gi, '').trim();
    if (districtClean && !VALID_DISTRICTS.has(districtClean)) rentalBadDistrict++;
    if (type && !VALID_TYPES.has(type)) rentalBadType++;
    if (NON_REALESTATE_TITLE_RE.test(title)) rentalNonRealestate++;
    if (!img1) rentalNoImage++;
    rentalSlugs.push(slugifyCheck(title, postUrl));
  }

  if (rentalBadDistrict > 0)    issues.push(`Rentals: ${rentalBadDistrict} listings with invalid district values`);
  if (rentalBadType > 0)        issues.push(`Rentals: ${rentalBadType} listings with invalid type values`);
  if (rentalNonRealestate > 0)  issues.push(`Rentals: ${rentalNonRealestate} non-real-estate listings detected`);
  if (rentalNoImage > 5)        issues.push(`Rentals: ${rentalNoImage} listings with no images`);

  const rentalDupSlugs = rentalSlugs.filter((s, i) => rentalSlugs.indexOf(s) !== i);
  if (rentalDupSlugs.length > 0) issues.push(`Rentals: ${rentalDupSlugs.length} duplicate slugs detected`);

  if (issues.length === 0 && !QUIET) {
    console.log(`  ✓ Sheet1/Rentals: ${rentalRows.length} rows — districts, types, images OK`);
  }

  // ── For Sale ────────────────────────────────────────────────────────
  const fsRows = (await fetchSheet('For Sale')).slice(1).filter(r => col(r, 0));
  const fsSlugs = [];
  let fsBadDistrict = 0, fsBadType = 0, fsNonRealestate = 0, fsNoImage = 0;

  for (const r of fsRows) {
    const title    = col(r, 0);
    const text     = col(r, 1);
    const district = col(r, 3);
    const type     = col(r, 5);
    const postUrl  = col(r, 19);
    const img1     = col(r, 7);

    const districtClean = district.replace(/not provided|unknown|n\/a/gi, '').trim();
    if (districtClean && !VALID_DISTRICTS.has(districtClean)) fsBadDistrict++;
    if (type && !VALID_TYPES.has(type)) fsBadType++;
    if (NON_REALESTATE_TITLE_RE.test(title) || !REALESTATE_RE.test(title + ' ' + text)) fsNonRealestate++;
    if (!img1) fsNoImage++;
    fsSlugs.push(slugifyCheck(title, postUrl));
  }

  if (fsBadDistrict > 0)   issues.push(`For Sale: ${fsBadDistrict} listings with invalid district values`);
  if (fsBadType > 0)       issues.push(`For Sale: ${fsBadType} listings with invalid type values`);
  if (fsNonRealestate > 0) issues.push(`For Sale: ${fsNonRealestate} non-real-estate listings detected`);
  if (fsNoImage > 5)       issues.push(`For Sale: ${fsNoImage} listings with no images`);

  const fsDupSlugs = fsSlugs.filter((s, i) => fsSlugs.indexOf(s) !== i);
  if (fsDupSlugs.length > 0) issues.push(`For Sale: ${fsDupSlugs.length} duplicate slugs detected`);

  if (issues.filter(i => i.startsWith('For Sale')).length === 0 && !QUIET) {
    console.log(`  ✓ For Sale sheet: ${fsRows.length} rows — districts, types, images OK`);
  }

  // Return slugs for detail page spot-check
  return { issues, rentalSlugs, fsSlugs };
}

// ─── Alert ────────────────────────────────────────────────────────────────────
function sendAlert(message) {
  try {
    execSync(`${OPENCLAW} message send --channel whatsapp --target ${ALERT_TO} --message ${JSON.stringify(message)}`, {
      stdio: 'pipe',
    });
    console.log('  📲 Alert sent via WhatsApp');
  } catch (e) {
    console.error('  ⚠️  Failed to send WhatsApp alert:', e.message);
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  const started = Date.now();
  console.log(`\n🔍 danangmls.com health check — ${new Date().toISOString()}`);

  const allIssues = [];

  console.log('\n[1/3] Checking live pages...');
  allIssues.push(...await checkPage(`${SITE}/`,         'Rentals page',  MIN_RENTALS));
  allIssues.push(...await checkPage(`${SITE}/for-sale`, 'For Sale page', MIN_FOR_SALE));

  console.log('\n[2/3] Validating sheet data...');
  const { issues: sheetIssues, rentalSlugs, fsSlugs } = await checkSheetData();
  allIssues.push(...sheetIssues);

  console.log('\n[3/3] Spot-checking listing detail pages...');
  allIssues.push(...await checkDetailPages(rentalSlugs, 'Rentals'));
  allIssues.push(...await checkDetailPages(fsSlugs,     'For Sale'));

  const elapsed = ((Date.now() - started) / 1000).toFixed(1);
  console.log(`\n⏱  Completed in ${elapsed}s`);

  if (allIssues.length === 0) {
    console.log('✅ All checks passed.\n');
  } else {
    console.log(`\n❌ ${allIssues.length} issue(s) found:`);
    allIssues.forEach(i => console.log(`   • ${i}`));
    console.log('');

    const msg = `⚠️ danangmls.com health check found ${allIssues.length} issue(s):\n` +
      allIssues.map(i => `• ${i}`).join('\n') +
      `\n\nCheck: ${new Date().toISOString()}`;
    sendAlert(msg);
    process.exit(1);
  }
}

main().catch(err => {
  console.error('\n💥 Health check crashed:', err.message);
  sendAlert(`💥 danangmls.com health check crashed: ${err.message}`);
  process.exit(1);
});
