import Link from 'next/link';
import { LISTING_FORM_COPY } from '@/lib/listingFormCopy';
import { accountPaths } from '@/lib/accountCopy';
import type { Lang } from '@/lib/translations';
import type { Listing } from '@/lib/types';

/** The agent's own listings, with an edit link each. Shared by both languages. */
export default function MyListingsView({ listings, lang }: { listings: Listing[]; lang: Lang }) {
  const t = LISTING_FORM_COPY[lang];
  const base = lang === 'vi' ? '/vi/tai-khoan/tin-dang' : '/account/listings';
  const publicBase = lang === 'vi' ? '/vi/listing' : '/listing';

  if (listings.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-slate-600 mb-4">{t.noListingsYet}</p>
        <Link href={accountPaths[lang].newListing} className="text-blue-600 hover:underline">
          {t.pageTitle}
        </Link>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-slate-100">
      {listings.map(l => (
        <li key={l.slug} className="flex items-center gap-4 py-3">
          {l.images[0] && (
            // eslint-disable-next-line @next/next/no-img-element -- matches the plain <img> used across this codebase
            <img src={l.images[0]} alt="" className="w-16 h-16 rounded-lg object-cover shrink-0 bg-slate-100" />
          )}
          <div className="min-w-0 flex-1">
            <Link href={`${publicBase}/${l.slug}`} className="font-medium text-slate-900 hover:underline line-clamp-1">
              {l.title}
            </Link>
            <p className="text-sm text-slate-500">
              {l.price}{l.district ? ` · ${l.district}` : ''}
            </p>
          </div>
          <Link
            href={lang === 'vi' ? `${base}/${l.slug}/sua` : `${base}/${l.slug}/edit`}
            className="shrink-0 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            {t.editThis}
          </Link>
        </li>
      ))}
    </ul>
  );
}
