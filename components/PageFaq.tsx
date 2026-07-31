'use client';

import { useLanguage } from './LanguageProvider';

// Rent-page FAQ block: renders the visible Q&A (adds subheadings + keyword-rich
// main content for on-page SEO) and emits FAQPage structured data. Placed below
// the listings grid so it doesn't push the directory down.
export default function PageFaq() {
  const { t } = useLanguage();
  const faq = t.rentFaq;
  if (!faq?.length) return null;

  const strip = (s: string) => s.replace(/\*\*/g, '').replace(/\*/g, '');
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: strip(f.a) },
    })),
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10 border-t border-slate-100">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <h2 className="text-xl font-bold text-slate-900 mb-6">{t.rentFaqHeading}</h2>
      <div className="space-y-6 max-w-3xl">
        {faq.map((f, i) => (
          <div key={i}>
            <h3 className="text-base font-semibold text-slate-800 mb-1">{f.q}</h3>
            <p className="text-sm text-slate-600 leading-relaxed">{strip(f.a)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
