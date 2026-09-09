import type { Lang } from '@/lib/translations';
import { localizeDistrict } from '@/lib/price';
import DistrictBoundaryMap from './DistrictBoundaryMap';

// District section shown below the grid on district facet pages: a map with the
// district's real boundary drawn as a bold outline, zoomed to the district.
export default function DistrictMap({ district, lang }: { district: string; lang: Lang }) {
  const label = localizeDistrict(district, lang);
  const heading = lang === 'vi' ? `Bản đồ khu vực ${label}` : `Map of ${label}, Da Nang`;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-8">
      <h2 className="text-lg font-semibold text-slate-800 mb-3">{heading}</h2>
      <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
        <DistrictBoundaryMap district={district} />
      </div>
    </section>
  );
}
