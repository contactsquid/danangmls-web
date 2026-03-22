'use client';

import { useLanguage } from './LanguageProvider';

interface Props {
  mode: 'rent' | 'sale';
  count: number;
}

export default function PageHero({ mode, count }: Props) {
  const { t } = useLanguage();

  const h1      = mode === 'rent' ? t.rentH1      : t.saleH1;
  const subtitle = mode === 'rent' ? t.rentSubtitle(count) : t.saleSubtitle(count);
  const h2      = mode === 'rent' ? t.rentH2      : t.saleH2;

  return (
    <>
      <div className="bg-gradient-to-br from-blue-700 to-blue-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">{h1}</h1>
          <p className="text-blue-100 text-base max-w-2xl">{subtitle}</p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8">
        <h2 className="text-lg font-semibold text-slate-700 mb-4">{h2}</h2>
      </div>
    </>
  );
}
