'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

// Instant navigation feedback that costs no round trip.
//
// These routes are force-dynamic, so Next cannot prerender their loading shell:
// the prefetch that would make loading.tsx paint immediately is itself a live
// server request (~0.8s measured). Click before it lands and nothing happens,
// which reads as "did my click register?".
//
// This bar starts on the click itself — before any request — and is derived from
// the pathname rather than synced to it, so the new route committing clears it
// with no effect and no extra render pass.
export default function NavProgress() {
  const pathname = usePathname();
  // The path we were on when a navigation began. Once pathname moves off it, the
  // navigation has committed and the bar is done.
  const [from, setFrom] = useState<string | null>(null);
  const active = from !== null && from === pathname;

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as HTMLElement | null)?.closest?.('a');
      if (!a) return;
      const href = a.getAttribute('href');
      if (!href || a.target === '_blank' || a.hasAttribute('download')) return;
      if (href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
      let url: URL;
      try { url = new URL(href, window.location.href); } catch { return; }
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname && url.search === window.location.search) return;
      setFrom(window.location.pathname);
      // Safety net: if a navigation is cancelled or fails, do not leave the bar up.
      window.setTimeout(() => setFrom((f) => (f === window.location.pathname ? null : f)), 15000);
    }
    document.addEventListener('click', onClick, { capture: true });
    return () => document.removeEventListener('click', onClick, { capture: true });
  }, []);

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-x-0 top-0 z-50 h-0.5 transition-opacity duration-200 ${active ? 'opacity-100' : 'opacity-0'}`}
    >
      <div className={`h-full bg-blue-600 ${active ? 'nav-progress-run' : 'w-0'}`} />
      <style>{`
        @keyframes nav-progress { 0% { width: 0 } 40% { width: 62% } 80% { width: 86% } 100% { width: 94% } }
        .nav-progress-run { animation: nav-progress 2.2s cubic-bezier(.22,.68,.36,1) forwards; }
        @media (prefers-reduced-motion: reduce) { .nav-progress-run { animation-duration: 0s; width: 94% } }
      `}</style>
    </div>
  );
}
