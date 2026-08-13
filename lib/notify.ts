import 'server-only';

/**
 * Moderation notifications for the agent portal.
 *
 * The portal is deliberately post-hoc moderated: agents sign up, confirm their
 * email and are live immediately — nobody waits in an approval queue. That only
 * works if a human is actually told when something happens, so these pings ARE
 * the moderation mechanism, not a nicety.
 *
 * Channel-agnostic on purpose. AGENT_SIGNUP_NOTIFY_URL points at whatever you
 * like — an n8n webhook that emails or Telegrams, a Slack incoming webhook, a
 * Zapier catch hook. Leave it unset and notifications are silently skipped,
 * which keeps the portal working (unmoderated) rather than breaking signups.
 */

export type NotifyEvent =
  | {
      type: 'agent_signup';
      display_name: string;
      email: string;
    }
  | {
      type: 'listing_claim';
      display_name: string;
      profile_url: string;
      claimed_name: string;
      /** How many sheet listings that claim would attach. A big number on a new
       *  account is the signal worth looking at. */
      matching_listings: number;
    };

/**
 * Fire-and-forget. Never throws and never blocks the user's request: a signup
 * must not fail because a webhook is down. Call it inside `after()` so it runs
 * once the response has already been sent.
 */
export async function notifyAdmins(event: NotifyEvent): Promise<void> {
  const url = process.env.AGENT_SIGNUP_NOTIFY_URL;
  if (!url) return;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...event,
        site: 'danangmls.com',
        admin_url: 'https://danangmls.com/admin/agents',
        at: new Date().toISOString(),
      }),
      // A hung webhook must not pin a serverless function open.
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) {
      console.error(`[notify] ${event.type} webhook returned ${res.status}`);
    }
  } catch (err) {
    console.error(`[notify] ${event.type} webhook failed:`, err);
  }
}
