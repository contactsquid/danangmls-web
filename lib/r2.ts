import 'server-only';

import { createHash, createHmac } from 'node:crypto';

/**
 * Uploads agent-submitted listing photos to Cloudflare R2.
 *
 * Why R2 and not Supabase Storage: the listings themselves live in the Google
 * Sheet, and every other image in that sheet is already an images.danang.homes
 * URL. Putting portal photos anywhere else would split the image store in two
 * for no benefit — and `isServableImage` in lib/sheets.ts specifically trusts
 * that host.
 *
 * Signed by hand with SigV4 rather than pulling in @aws-sdk/client-s3: the SDK
 * is several megabytes for one PUT, which matters in a serverless function.
 * Ported from ~/.openclaw/scripts/video-editor/shorts-helpers.js (r2Upload),
 * which has been uploading rehosted listing images for months.
 */

interface R2Config {
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucket: string;
  endpoint: string;
  publicUrl: string;
}

function readConfig(): R2Config | null {
  const raw = process.env.R2_CONFIG_JSON;
  if (!raw) return null;
  try {
    const c = JSON.parse(raw) as R2Config;
    if (!c.accessKeyId || !c.secretAccessKey || !c.bucket || !c.endpoint || !c.publicUrl) {
      console.error('[r2] R2_CONFIG_JSON is missing required fields');
      return null;
    }
    return c;
  } catch {
    console.error('[r2] R2_CONFIG_JSON is not valid JSON');
    return null;
  }
}

export const isR2Configured = Boolean(process.env.R2_CONFIG_JSON);

const sha256hex = (data: Buffer | string) => createHash('sha256').update(data).digest('hex');
const hmac = (key: Buffer | string, data: string) => createHmac('sha256', key).update(data).digest();

/** Image content types we accept, mapped to the extension R2 stores them under.
 *  `isServableImage` rejects extension-less images.danang.homes URLs (an old
 *  rehost bug saved HTML as "images"), so the extension is load-bearing. */
const EXTENSIONS: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

export function extensionFor(contentType: string): string | null {
  return EXTENSIONS[contentType.toLowerCase().split(';')[0].trim()] ?? null;
}

/**
 * PUTs one object and returns its public URL.
 * Throws on failure — callers decide whether a failed photo aborts the submission.
 */
export async function r2Upload(body: Buffer, contentType: string, key: string): Promise<string> {
  const cfg = readConfig();
  if (!cfg) throw new Error('R2 is not configured (R2_CONFIG_JSON missing)');

  const host = new URL(cfg.endpoint).host;
  const now = new Date();
  const dateStamp = now.toISOString().slice(0, 10).replace(/-/g, '');
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, '').slice(0, 15) + 'Z';
  const payloadHash = sha256hex(body);

  const headers: Record<string, string> = {
    host,
    'x-amz-content-sha256': payloadHash,
    'x-amz-date': amzDate,
    'content-type': contentType,
  };

  const signedHeaders = Object.keys(headers).sort().join(';');
  const canonicalHeaders = Object.keys(headers).sort().map(k => `${k}:${headers[k]}\n`).join('');
  const path = `/${cfg.bucket}/${key}`;
  const canonicalRequest = ['PUT', path, '', canonicalHeaders, signedHeaders, payloadHash].join('\n');

  const scope = `${dateStamp}/auto/s3/aws4_request`;
  const stringToSign = ['AWS4-HMAC-SHA256', amzDate, scope, sha256hex(canonicalRequest)].join('\n');

  const signingKey = hmac(hmac(hmac(hmac(`AWS4${cfg.secretAccessKey}`, dateStamp), 'auto'), 's3'), 'aws4_request');
  const signature = createHmac('sha256', signingKey).update(stringToSign).digest('hex');

  const authorization =
    `AWS4-HMAC-SHA256 Credential=${cfg.accessKeyId}/${scope}, ` +
    `SignedHeaders=${signedHeaders}, Signature=${signature}`;

  const res = await fetch(`${cfg.endpoint}${path}`, {
    method: 'PUT',
    headers: { ...headers, Authorization: authorization },
    body: new Uint8Array(body),
    // A stalled upload must not pin the function open for the platform timeout.
    signal: AbortSignal.timeout(30_000),
  });

  if (!res.ok) {
    const detail = (await res.text().catch(() => '')).slice(0, 200);
    throw new Error(`R2 upload failed (${res.status}): ${detail}`);
  }

  return `${cfg.publicUrl.replace(/\/$/, '')}/${key}`;
}
