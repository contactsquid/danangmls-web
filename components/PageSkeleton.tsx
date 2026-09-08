// Rendered by the loading.tsx files the instant a navigation starts, and
// prefetched by Next for dynamic routes — so a click paints something straight
// away instead of leaving the old page on screen while the server works.
//
// SiteHeader and SiteFooter now live in the root layout, so they stay on screen
// through the transition and the skeleton only stands in for the content area.

function Bar({ className = '' }: { className?: string }) {
  return <div className={`rounded bg-slate-200 ${className}`} />;
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
    <div className="flex-1 bg-slate-50 animate-pulse" aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading…</span>

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
