'use client';

/**
 * Client-side reporting of listing views and contact clicks.
 *
 * `sendBeacon` rather than `fetch`: a contact button navigates away immediately
 * (zalo.me, wa.me, sms:, an external site), and a normal fetch is cancelled when
 * the page unloads — which would lose exactly the clicks that matter most.
 * sendBeacon hands the request to the browser to deliver regardless.
 *
 * Every failure path is silent. This is telemetry; it must never interrupt a
 * visitor trying to contact an agent.
 */

export type StatKind = 'view' | 'zalo' | 'whatsapp' | 'sms' | 'website';

export function reportStat(slug: string, kind: StatKind, agent?: string | null): void {
  if (typeof window === 'undefined' || !slug) return;
  try {
    const payload = JSON.stringify({ slug, kind, agent: agent ?? null });
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/stat', new Blob([payload], { type: 'application/json' }));
      return;
    }
    // Older browsers: keepalive gives fetch the same survive-the-unload property.
    void fetch('/api/stat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload,
      keepalive: true,
    }).catch(() => {});
  } catch {
    // ignore
  }
}
