// Which contact apps a scraped agent is KNOWN to use, keyed by their phone number.
//
// Blake's eyeball check of the real Facebook posts puts WhatsApp at roughly 50%,
// and it is what foreign customers actually have — "it takes us a bit longer to
// even know what Zalo is". But the agent's own wording lives only in the raw post:
// enrichment rewrites it into English and appends our own contact block, leaving a
// whatsapp-ish token in just 2 of ~12,000 sheet rows. So the sheet cannot answer
// this, and we must never guess — a wa.me link to an unregistered number fails
// silently, rebuilding the dead end the handoff exists to remove.
//
// ~/.openclaw/scripts/prededupe-staging.js captures the wording from STAGING,
// before enrichment, and publishes this map the moment new evidence lands.
//
// Keyed by phone, not agent name: the channel belongs to the number, and scraped
// names vary by emoji, word order and diacritics. Absence means "unknown", never
// "no" — so an unknown number simply shows Zalo + Message, as it does today.
const CHANNELS_URL = 'https://images.danang.homes/agents/channels.json';
const TTL_MS = 5 * 60 * 1000;

type ChannelMap = Map<string, Set<string>>;

let cache: ChannelMap | null = null;
let cachedAt = 0;
let inflight: Promise<ChannelMap> | null = null;

const PHONE_RE = /^[35789]\d{8}$/;

async function loadChannels(): Promise<ChannelMap> {
  const now = Date.now();
  if (cache && now - cachedAt < TTL_MS) return cache;
  if (inflight) return inflight;

  inflight = (async () => {
    const next: ChannelMap = new Map();
    try {
      // NOT cache:'no-store'. This is called from a page that sets
      // `export const revalidate = 300`, and no-store there flips the route from
      // static to dynamic at runtime — Next throws and EVERY listing page 500s.
      // That exact combination took the site down once already this month.
      // lib/redirects.ts can use no-store only because it runs in Proxy, not a page.
      // Freshness is unaffected: the module-memory cache above is the real TTL.
      const res = await fetch(CHANNELS_URL, { next: { revalidate: 300 } });
      if (res.ok) {
        const j = (await res.json()) as Record<string, unknown>;
        for (const [phone, list] of Object.entries(j ?? {})) {
          if (!PHONE_RE.test(phone) || !Array.isArray(list)) continue;
          next.set(phone, new Set(list.filter(c => typeof c === 'string')));
        }
      }
      // A 404 is normal until the first agent names a channel.
      cache = next;
      cachedAt = Date.now();
    } catch {
      // Keep whatever we had rather than dropping every known channel on a blip.
      if (!cache) { cache = next; cachedAt = Date.now(); }
    } finally {
      inflight = null;
    }
    return cache ?? next;
  })();

  return inflight;
}

/**
 * True only when this number's own post text named WhatsApp. Unknown numbers
 * return false, which hides the button rather than risking a link that silently
 * fails.
 */
export async function agentHasWhatsApp(local9: string): Promise<boolean> {
  if (!local9 || !PHONE_RE.test(local9)) return false;
  const map = await loadChannels();
  return map.get(local9)?.has('whatsapp') ?? false;
}
