import Link from 'next/link';
import { renderInline } from '@/lib/inlineFormat';

export interface TypeHeroContent {
  h1: string;
  subtitle: string;
  h2: string;
  h2mid: string;
  intro: string[];
  h2b: string;
  /** Contextual cross-links (sibling type + all rentals) rendered as a prose line. */
  crossLinks: { label: string; href: string; strong?: boolean }[];
  crossLead: string; // e.g. "Prefer an apartment?" — plain lead text before the links
}

/**
 * Hero for the type-scoped rental landing pages (/houses-for-rent,
 * /apartments-for-rent + VI). Language is determined by the route, so copy is
 * passed in explicitly rather than via the LanguageProvider context.
 */
export default function TypeHero({ content }: { content: TypeHeroContent }) {
  const { h1, subtitle, h2, h2mid, intro, h2b, crossLinks, crossLead } = content;
  return (
    <>
      <div className="bg-gradient-to-br from-blue-700 to-blue-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">{h1}</h1>
          <p className="text-blue-100 text-base max-w-2xl">{subtitle}</p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8">
        <h2 className="text-lg font-semibold text-slate-700 mb-3">{h2}</h2>
        {intro.length > 0 && (
          <div className="text-sm text-slate-600 leading-relaxed space-y-3 mb-4">
            <p>{renderInline(intro[0])}</p>
            {h2mid && <h2 className="text-lg font-semibold text-slate-700 pt-2">{h2mid}</h2>}
            {intro.slice(1).map((p, i) => <p key={i}>{renderInline(p)}</p>)}
          </div>
        )}
        {/* Internal silo: link to the sibling type page + all rentals */}
        <p className="text-sm text-slate-600 mb-6">
          {crossLead}{' '}
          {crossLinks.map((l, i) => (
            <span key={l.href}>
              <Link href={l.href} className="text-blue-600 hover:underline font-medium">{l.label}</Link>
              {i < crossLinks.length - 1 ? ' · ' : '.'}
            </span>
          ))}
        </p>
        {h2b && <h2 className="text-lg font-semibold text-slate-700 mb-4">{h2b}</h2>}
      </div>
    </>
  );
}
