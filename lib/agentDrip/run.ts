import 'server-only';

import { createAdminClient } from '@/lib/supabase/server';
import { getListings, getForSaleListings } from '@/lib/sheets';
import { normalizeAgentName } from '@/lib/agents';
import { renderDripEmail, type DripStep } from './copy';
import { isMailerConfigured, sendMail } from './mailer';
import { isTokenConfigured, unsubscribeUrl } from './token';

/**
 * The onboarding drip engine. Rows are created by a database trigger when an
 * agent confirms their email (supabase/migrations/0002_agent_email_drip.sql).
 *
 *   welcome    — right after confirmation (auth callback), cron as the fallback
 *   reminder1  — a week after the welcome, only if the agent has no listing
 *   reminder2  — a week after reminder1, same condition
 *
 * The cron runs once a day, so a step is treated as due 12h early: an email a
 * week after the last one lands on the right morning instead of drifting a day
 * later each time.
 */

const DAY = 24 * 60 * 60 * 1000;
const WEEK_MINUS_HALF_DAY = 7 * DAY - DAY / 2;

/** Portal photos live at `agent-listings/<profile-slug>/…` (see lib/myListings.ts). */
const OWNED_MARKER = 'https://images.danang.homes/agent-listings/';

interface DripRow {
  user_id: string;
  welcome_sent_at: string | null;
  reminder1_sent_at: string | null;
  reminder2_sent_at: string | null;
}

interface ProfileRow {
  id: string;
  slug: string;
  display_name: string;
  status: string;
  is_admin: boolean;
  listing_agent_name: string | null;
  listing_agent_name_verified: boolean;
}

export interface DripResult {
  considered: number;
  sent: { userId: string; step: DripStep }[];
  stopped: { userId: string; reason: string }[];
  failed: { userId: string; step: DripStep; error: string }[];
  /** dry-run only: what WOULD have been sent. */
  wouldSend: { userId: string; step: DripStep }[];
  skipped?: string;
}

const COLUMN: Record<DripStep, 'welcome_sent_at' | 'reminder1_sent_at' | 'reminder2_sent_at'> = {
  welcome: 'welcome_sent_at',
  reminder1: 'reminder1_sent_at',
  reminder2: 'reminder2_sent_at',
};

function nextStep(row: DripRow, now: number): DripStep | null {
  if (!row.welcome_sent_at) return 'welcome';
  if (!row.reminder1_sent_at) {
    return now - Date.parse(row.welcome_sent_at) >= WEEK_MINUS_HALF_DAY ? 'reminder1' : null;
  }
  if (!row.reminder2_sent_at) {
    return now - Date.parse(row.reminder1_sent_at) >= WEEK_MINUS_HALF_DAY ? 'reminder2' : null;
  }
  return null;
}

/** Who has at least one listing: portal-posted (by photo path) or a verified
 *  claim on scraped ones. One pass over both sheets; only called when a
 *  reminder is actually due. */
async function loadListedIndex(): Promise<{ slugs: Set<string>; names: Set<string> }> {
  const [rentals, forSale] = await Promise.all([getListings(), getForSaleListings()]);
  const slugs = new Set<string>();
  const names = new Set<string>();
  for (const l of [...rentals, ...forSale]) {
    const n = normalizeAgentName(l.agent);
    if (n) names.add(n);
    for (const url of l.images) {
      if (url.startsWith(OWNED_MARKER)) {
        slugs.add(url.slice(OWNED_MARKER.length).split('/')[0]);
        break;
      }
    }
  }
  return { slugs, names };
}

export async function runDrip(opts: { dryRun?: boolean; onlyUserId?: string; welcomeOnly?: boolean } = {}): Promise<DripResult> {
  const result: DripResult = { considered: 0, sent: [], stopped: [], failed: [], wouldSend: [] };

  const admin = createAdminClient();
  if (!admin) return { ...result, skipped: 'SUPABASE_SERVICE_ROLE_KEY not set' };
  if (!opts.dryRun && !(isMailerConfigured && isTokenConfigured)) {
    return { ...result, skipped: 'mailer or AGENT_DRIP_SECRET not configured' };
  }

  let q = admin
    .from('agent_email_drip')
    .select('user_id, welcome_sent_at, reminder1_sent_at, reminder2_sent_at')
    .is('stopped_at', null);
  if (opts.onlyUserId) q = q.eq('user_id', opts.onlyUserId);
  const { data: rows, error } = await q;
  if (error) throw new Error(`drip select failed: ${error.message}`);
  if (!rows?.length) return result;

  const { data: profiles, error: pErr } = await admin
    .from('agent_profiles')
    .select('id, slug, display_name, status, is_admin, listing_agent_name, listing_agent_name_verified')
    .in('id', rows.map(r => r.user_id));
  if (pErr) throw new Error(`profile select failed: ${pErr.message}`);
  const byId = new Map<string, ProfileRow>((profiles ?? []).map(p => [p.id, p as ProfileRow]));

  const stop = async (userId: string, reason: string) => {
    result.stopped.push({ userId, reason });
    if (opts.dryRun) return;
    await admin
      .from('agent_email_drip')
      .update({ stopped_at: new Date().toISOString(), stop_reason: reason })
      .eq('user_id', userId)
      .is('stopped_at', null);
  };

  const now = Date.now();
  let listed: Awaited<ReturnType<typeof loadListedIndex>> | null = null;

  for (const row of rows as DripRow[]) {
    result.considered++;
    const step = nextStep(row, now);
    if (!step || (opts.welcomeOnly && step !== 'welcome')) continue;

    const profile = byId.get(row.user_id);
    if (!profile) { await stop(row.user_id, 'suspended'); continue; }
    if (profile.is_admin) { await stop(row.user_id, 'admin'); continue; }
    if (profile.status !== 'active') { await stop(row.user_id, 'suspended'); continue; }

    if (step !== 'welcome') {
      listed ??= await loadListedIndex();
      const claimed = profile.listing_agent_name_verified
        ? listed.names.has(normalizeAgentName(profile.listing_agent_name))
        : false;
      if (listed.slugs.has(profile.slug) || claimed) {
        await stop(row.user_id, 'listed');
        continue;
      }
    }

    if (opts.dryRun) {
      result.wouldSend.push({ userId: row.user_id, step });
      continue;
    }

    // Claim before sending: the atomic update only matches while the column is
    // still null, so the auth callback and the cron cannot both send this step.
    const col = COLUMN[step];
    const { data: claimedRows, error: cErr } = await admin
      .from('agent_email_drip')
      .update({ [col]: new Date().toISOString() })
      .eq('user_id', row.user_id)
      .is(col, null)
      .is('stopped_at', null)
      .select('user_id');
    if (cErr || !claimedRows?.length) continue;

    try {
      const { data: userData, error: uErr } = await admin.auth.admin.getUserById(row.user_id);
      const email = userData?.user?.email;
      if (uErr || !email) throw new Error(uErr?.message ?? 'no email on account');

      const unsub = unsubscribeUrl(row.user_id);
      const mail = renderDripEmail(step, { name: profile.display_name, email, unsubscribeUrl: unsub });
      await sendMail({ to: email, ...mail, unsubscribeUrl: unsub });

      if (step === 'reminder2') {
        await admin
          .from('agent_email_drip')
          .update({ stopped_at: new Date().toISOString(), stop_reason: 'completed' })
          .eq('user_id', row.user_id);
      }
      result.sent.push({ userId: row.user_id, step });
    } catch (err) {
      // Un-claim so tomorrow's run retries it, rather than silently losing the email.
      await admin.from('agent_email_drip').update({ [col]: null }).eq('user_id', row.user_id);
      const message = err instanceof Error ? err.message : String(err);
      console.error(`[agent-drip] ${step} to ${row.user_id} failed:`, message);
      result.failed.push({ userId: row.user_id, step, error: message });
    }
  }

  return result;
}

/** Called from the auth callback so the welcome goes out at confirmation time.
 *  Never throws — a mail hiccup must not break the agent's sign-in. */
export async function sendWelcomeNow(userId: string): Promise<void> {
  try {
    await runDrip({ onlyUserId: userId, welcomeOnly: true });
  } catch (err) {
    console.error('[agent-drip] welcome failed:', err);
  }
}
