'use client';

import { useLanguage } from './LanguageProvider';
import { renderInline } from '@/lib/inlineFormat';

// Styled FAQ accordion (native <details>, no JS) + FAQPage JSON-LD for rich
// results, with a property photo alongside so the section isn't text-only.
export default function PageFaq({ mode, image, faqOverride }: { mode: 'rent' | 'sale'; image?: string; faqOverride?: { heading: string; faq: { q: string; a: string }[] } }) {
  const { t } = useLanguage();
  const heading = faqOverride?.heading ?? (mode === 'rent' ? t.rentFaqHeading : t.saleFaqHeading);
  const faqs = faqOverride?.faq ?? (mode === 'rent' ? t.rentFaq : t.saleFaq);
  if (!faqs || faqs.length === 0) return null;

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a.replace(/\*+/g, '') },
    })),
  };

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-6 text-center">{heading}</h2>
      <div className="grid lg:grid-cols-[300px_1fr] gap-8 items-stretch">
        {image && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={image}
            alt="Property in Da Nang, Vietnam"
            loading="lazy"
            className="w-full rounded-2xl object-cover shadow-sm border border-slate-200 aspect-[16/10] lg:aspect-auto lg:h-full"
          />
        )}
        <div className="space-y-3">
          {faqs.map((f, i) => (
            <details key={i} className="group bg-white rounded-xl border border-slate-200 shadow-sm open:shadow-md transition-shadow">
              <summary className="flex items-center justify-between gap-3 cursor-pointer list-none [&::-webkit-details-marker]:hidden px-5 py-4 font-semibold text-slate-800">
                <span>{f.q}</span>
                <svg className="w-5 h-5 shrink-0 text-blue-500 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-5 pb-5 -mt-1 text-sm text-slate-600 leading-relaxed">
                {renderInline(f.a)}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
