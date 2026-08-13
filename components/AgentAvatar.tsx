/** Agent profile photo, with an initials fallback so a photo-less profile still
 *  renders as a deliberate design rather than a broken image box. */
export default function AgentAvatar({
  src,
  name,
  className = 'w-12 h-12',
}: {
  src: string | null;
  name: string;
  className?: string;
}) {
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- matches the plain <img> used across this codebase
      <img
        src={src}
        alt={`${name} — real estate agent in Da Nang, Vietnam`}
        loading="lazy"
        className={`${className} rounded-full object-cover bg-slate-100 border border-slate-200`}
      />
    );
  }

  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0]?.toUpperCase() ?? '')
    .join('');

  return (
    <div
      aria-hidden="true"
      className={`${className} rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center text-slate-600 font-semibold`}
    >
      {initials || '?'}
    </div>
  );
}
