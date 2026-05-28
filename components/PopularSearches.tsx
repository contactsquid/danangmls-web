'use client';

import Link from 'next/link';
import { useLanguage } from './LanguageProvider';
import { localizeType, localizeDistrict } from '@/lib/price';

const TYPES = ['House', 'Apartment', 'Villa', 'Studio'];
const AREAS = ['Hai Chau', 'Son Tra', 'Ngu Hanh Son', 'Hoi An'];

const chip =
  'inline-block rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 hover:border-blue-400 hover:text-blue-600 transition-colors';

export default function PopularSearches() {
  const { lang, t } = useLanguage();

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-6">
      <h2 className="text-lg font-semibold text-slate-700 mb-3">{t.popularSearchesTitle}</h2>

      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-slate-500 mb-2">{t.popularByType}</h3>
          <div className="flex flex-wrap gap-2">
            {TYPES.map(ty => (
              <Link key={ty} href={`/for-rent?type=${encodeURIComponent(ty)}`} className={chip}>
                {localizeType(ty, lang)}
              </Link>
            ))}
            <Link href="/for-rent?type=House&beds=3" className={chip}>{t.popular3BedHouses}</Link>
            <Link href="/for-rent?search=furnished" className={chip}>{t.popularFurnished}</Link>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-slate-500 mb-2">{t.popularByBudget}</h3>
          <div className="flex flex-wrap gap-2">
            <Link href="/for-rent?price=u500" className={chip}>{t.under500}</Link>
            <Link href="/for-rent?price=500" className={chip}>{t.r500}</Link>
            <Link href="/for-rent?price=1000" className={chip}>{t.r1000}</Link>
            <Link href="/for-rent?price=2000" className={chip}>{t.r2000}</Link>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-slate-500 mb-2">{t.popularByArea}</h3>
          <div className="flex flex-wrap gap-2">
            {AREAS.map(d => (
              <Link key={d} href={`/for-rent?district=${encodeURIComponent(d)}`} className={chip}>
                {localizeDistrict(d, lang)}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
