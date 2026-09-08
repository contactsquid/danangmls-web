// Rendered by the loading.tsx files the instant a navigation starts, and
// prefetched by Next for dynamic routes — so a click paints something straight
// away instead of leaving the old page on screen while the server works.
//
// SiteHeader lives in each page rather than the root layout, so the skeleton
// draws a header-shaped bar of its own; without it the whole screen would blank
// out on every navigation, which reads as worse than no feedback at all.

function Bar({ className = '' }: { className?: string }) {
  return <div className={`rounded bg-slate-200 ${className}`} />;
}

function HeaderBar() {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16">
          <Bar className="h-7 w-36" />
          <div className="hidden sm:flex items-center gap-3">
            <Bar className="h-4 w-16" />
            <Bar className="h-4 w-16" />
            <Bar className="h-4 w-20" />
            <Bar className="h-8 w-24 bg-blue-200" />
          </div>
          <Bar className="h-8 w-8 sm:hidden" />
        </div>
      </div>
    </header>
  );
}

function CardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="aspect-[4/3] bg-slate-200" />
      <div className="p-4 flex flex-col gap-2">
        <Bar className="h-4 w-4/5" />
        <Bar className="h-4 w-3/5" />
        <div className="flex gap-2 pt-1">
          <Bar className="h-5 w-16 rounded-full" />
          <Bar className="h-5 w-20 rounded-full" />
        </div>
        <Bar className="h-5 w-24 mt-1" />
      </div>
    </div>
  );
}

export default function PageSkeleton({ variant = 'grid' }: { variant?: 'grid' | 'detail' }) {
  return (
    <div className="min-h-screen bg-slate-50 animate-pulse" aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading…</span>
      <HeaderBar />

      {variant === 'grid' ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <Bar className="h-8 w-72 mb-3" />
          <Bar className="h-4 w-96 mb-6" />
          <div className="flex flex-wrap gap-2 mb-6">
            {Array.from({ length: 6 }).map((_, i) => <Bar key={i} className="h-9 w-28" />)}
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
          </div>
        </div>
      ) : (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
          <Bar className="h-8 w-2/3 mb-4" />
          <div className="aspect-video bg-slate-200 rounded-xl mb-5" />
          <div className="flex flex-wrap gap-2 mb-5">
            {Array.from({ length: 4 }).map((_, i) => <Bar key={i} className="h-6 w-24 rounded-full" />)}
          </div>
          <div className="flex flex-col gap-2">
            {['w-full','w-full','w-5/6','w-4/6'].map((w, i) => <Bar key={i} className={`h-4 ${w}`} />)}
          </div>
        </div>
      )}
    </div>
  );
}
