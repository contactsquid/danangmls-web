export default function Logo({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Pin icon */}
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="14" cy="12" r="10" fill="#2563EB" />
        <circle cx="14" cy="12" r="4" fill="white" />
        <path d="M14 22 L14 28" stroke="#2563EB" strokeWidth="3" strokeLinecap="round" />
      </svg>
      {/* Wordmark */}
      <span className="font-bold text-xl tracking-tight text-slate-900">
        Danang<span className="text-blue-600">MLS</span>
      </span>
    </div>
  );
}
