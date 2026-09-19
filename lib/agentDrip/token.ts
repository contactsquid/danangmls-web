import 'server-only';

import { createHmac, timingSafeEqual } from 'node:crypto';
import { SITE_URL } from '@/lib/supabase/config';

/** Unsubscribe links are signed so a link cannot be forged for someone else's
 *  user id. Without AGENT_DRIP_SECRET nothing can be signed, and the drip
 *  refuses to send rather than emit a link that does not work. */
const SECRET = process.env.AGENT_DRIP_SECRET ?? '';

export const isTokenConfigured = Boolean(SECRET);

function sign(userId: string): string {
  return createHmac('sha256', SECRET).update(`unsub:${userId}`).digest('hex').slice(0, 32);
}

export function unsubscribeUrl(userId: string): string {
  return `${SITE_URL}/api/agent-drip/unsubscribe?u=${userId}&t=${sign(userId)}`;
}

export function verifyUnsubscribe(userId: string, token: string): boolean {
  if (!SECRET || !userId || !token) return false;
  const a = Buffer.from(sign(userId));
  const b = Buffer.from(token);
  return a.length === b.length && timingSafeEqual(a, b);
}
