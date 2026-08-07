import type { BuildingCard } from '@/lib/buildings';

// "Search by popular apartment building" — a thumbnail grid (icekem-style). Each
// card is a full-nav link so the grid remounts and pre-fills its search from ?q.
export default function PopularBuildings({ buildings, lang }: { buildings: BuildingCard[]; lang: 'en' | 'vi' }) {
  if (!buildings.length) return null;
  const heading = lang === 'vi' ? 'Tìm Theo Tòa Căn Hộ Phổ Biến' : 'Search by Popular Apartment Building';
  const sub = lang === 'vi' ? 'Nhấp vào một tòa nhà để xem các căn đang có.' : 'Tap a building to see its available listings.';

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-2 pb-8">
      <h2 className="text-lg font-semibold text-slate-800 mb-1">{heading}</h2>
      <p className="text-sm text-slate-500 mb-4">{sub}</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {buildings.map(b => (
          <a key={b.name} href={b.href} className="group relative rounded-xl overflow-hidden aspect-[4/3] bg-slate-100 shadow-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={b.image}
              alt={`${b.name} — Da Nang`}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-3">
              <p className="text-white font-semibold text-sm leading-tight drop-shadow-md">{b.name}</p>
              <p className="text-white/80 text-xs mt-0.5">
                {b.count} {lang === 'vi' ? 'tin đăng' : b.count === 1 ? 'listing' : 'listings'}
              </p>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
