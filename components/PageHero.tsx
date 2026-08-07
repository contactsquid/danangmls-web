'use client';

import { useLanguage } from './LanguageProvider';

interface Props {
  mode: 'rent' | 'sale';
  count: number;
  // Facet pages override the H1 + subtitle to reflect the facet.
  h1Override?: string;
  subtitleOverride?: string;
}

// Top page header only (H1 + subtitle). The longer SEO prose now lives at the
// bottom of the page in <PageSeoSection>.
export default function PageHero({ mode, count, h1Override, subtitleOverride }: Props) {
  const { t } = useLanguage();
  const h1 = h1Override ?? (mode === 'rent' ? t.rentH1 : t.saleH1);
  const subtitle = subtitleOverride ?? (mode === 'rent' ? t.rentSubtitle(count) : t.saleSubtitle(count));

  return (
    <div className="bg-gradient-to-br from-blue-700 to-blue-500 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">{h1}</h1>
        <p className="text-blue-100 text-base max-w-2xl">{subtitle}</p>
      </div>
    </div>
  );
}
