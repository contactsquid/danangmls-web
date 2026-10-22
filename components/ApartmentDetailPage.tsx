import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { POPULAR_BUILDINGS, buildingSlug, BUILDING_PAGE_MIN_LISTINGS, type BuildingDef } from '@/lib/buildingDefs';
import { getBuildingHistory, type BuildingEvent } from '@/lib/buildingHistory';
import { unitSummary } from '@/lib/unitDetails';
import { getDistrict } from '@/lib/districts';
import { socialImages } from '@/lib/ogImage';
import ListingCard from '@/components/ListingCard';
import ListingMapSection from '@/components/ListingMapSection';
import type { Listing } from '@/lib/types';

// Building record for an apartment building (Blake, 2026-10-22): the house page's layout A + dark record bar,
// but the history lists UNITS (beds · baths · m² · floor; unit numbers don't matter, the floor does), and the
// title is the building's name. Built from every listing the building has had (lib/buildingHistory.ts).

const SITE = 'https://danangmls.com';
const fmtDate = (t: number) => t ? new Date(t).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';
const usd = (p: string) => { const m = (p || '').match(/\$\s*([\d,]+)/); return m ? Number(m[1].replace(/,/g, '')) : null; };
const median = (xs: number[]) => { const s = [...xs].sort((a, b) => a - b); return s.length ? s[Math.floor((s.length - 1) / 2)] : null; };
const isStable = (u: string) => u && !u.includes('fbcdn.net') && !u.includes('facebook.com');

export function findBuilding(slug: string): BuildingDef | null {
  return POPULAR_BUILDINGS.find(b => buildingSlug(b.name) === slug) ?? null;
}

const mostCommon = (xs: string[]) => {
  const c = new Map<string, number>();
  for (const x of xs.filter(Boolean)) c.set(x, (c.get(x) ?? 0) + 1);
  return [...c.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? '';
};

export async function apartmentMetadata(slug: string): Promise<Metadata> {
  const b = findBuilding(slug);
  if (!b) return { title: 'Building Not Found' };
  const { events } = await getBuildingHistory(b);
  const url = `${SITE}/apartmentdetails/${slug}`;
  const title = `${b.name} — apartment listing history`;
  const description = `Every ${b.name} apartment listed on DanangMLS: rents, sale prices, beds, baths, size and floor, with the units available now.`;
  const img = b.ogImage || b.image || events[0]?.listing.images.find(isStable);
  return {
    title, description, alternates: { canonical: url },
    openGraph: { title, description, url, type: 'website', images: socialImages(img, `${b.name} — DanangMLS`) },
    twitter: { card: 'summary_large_image', images: socialImages(img, `${b.name} — DanangMLS`) },
  };
}

export default async function ApartmentDetailPage({ slug }: { slug: string }) {
  const b = findBuilding(slug);
  if (!b) notFound();
  const { events, live } = await getBuildingHistory(b);
  if (events.length < BUILDING_PAGE_MIN_LISTINGS) notFound();

  const district = mostCommon(events.map(e => e.listing.district));
  const area = mostCommon(events.map(e => e.listing.neighborhood));
  const liveRent = live.filter(l => !l.forSale), liveSale = live.filter(l => l.forSale);
  const rents = events.filter(e => !e.listing.forSale);
  const typicalRent = ['1', '2', '3'].map(beds => {
    const ps = rents.filter(e => e.unit.beds === beds).map(e => usd(e.listing.price)).filter((x): x is number => x !== null);
    return { beds, n: ps.length, median: median(ps) };
  }).filter(r => r.n >= 2);
  const floors = events.map(e => Number((e.unit.floor || '').match(/^(\d+)/)?.[1])).filter(n => n > 0);
  const first = events[events.length - 1];
  // Skip each listing's FIRST photo: that is where agents put a WhatsApp QR code or a cover card.
  // One photo per listing, so the collage shows different units.
  const photos = [b.image, ...events.map(e => e.listing.images.filter(isStable)[1]).filter(Boolean)].filter(Boolean).slice(0, 3) as string[];
  const mapSource = events.find(e => e.listing.geo && (e.listing.geo[2] === 0 || e.listing.geo[2] === 4)) ?? events.find(e => e.listing.geo);
  const mapListing: Listing | null = mapSource ? { ...mapSource.listing, geoLabel: b.name } : null;
  const districtInfo = getDistrict(district);
  const facet = `/for-rent/${slug}`;

  const ld = {
    '@context': 'https://schema.org',
    '@type': 'ApartmentComplex',
    name: b.name,
    url: `${SITE}/apartmentdetails/${slug}`,
    address: { '@type': 'PostalAddress', addressLocality: district || 'Da Nang', addressRegion: 'Da Nang', addressCountry: 'VN' },
    ...(mapListing?.geo && { geo: { '@type': 'GeoCoordinates', latitude: mapListing.geo[0], longitude: mapListing.geo[1] } }),
    ...(photos.length && { image: photos }),
    numberOfAvailableAccommodationUnits: live.length,
  };

  const row = (e: BuildingEvent) => (
    <tr key={e.listing.slug} className="border-b border-slate-100 last:border-0">
      <td className="px-2 py-3 whitespace-nowrap">{fmtDate(e.when)}</td>
      <td className="px-2 py-3">
        {e.listing.forSale ? 'For sale' : 'For rent'}
        <span className={`ml-2 rounded-full px-2 py-0.5 text-xs font-semibold ${e.live ? 'bg-emerald-50 text-emerald-800' : 'bg-slate-100 text-slate-700'}`}>{e.live ? 'Active' : 'Off market'}</span>
      </td>
      <td className="px-2 py-3">{unitSummary(e.unit)}</td>
      <td className="px-2 py-3 whitespace-nowrap">{e.listing.price || '—'}</td>
      <td className="px-2 py-3">{e.page ? <Link href={`/listing/${e.listing.slug}`} className="font-medium text-blue-700 hover:underline">View</Link> : '—'}</td>
    </tr>
  );

  return (
    <div className="bg-slate-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />

      <div className="bg-slate-900 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
          <p className="text-sm">
            <span className="font-semibold uppercase tracking-wider text-slate-300">Building record</span>
            <span className="mx-2 text-slate-500" aria-hidden="true">·</span>
            <span className="text-slate-200">Every {b.name} apartment listed on DanangMLS, past and present.</span>
          </p>
          <Link href={facet} className="text-sm font-semibold text-blue-300 hover:text-white">See units for rent now →</Link>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-5 pb-16 flex flex-col gap-7">
        <nav aria-label="Breadcrumb" className="flex flex-wrap gap-1.5 text-[13px] text-slate-600">
          <Link href="/" className="text-blue-700 hover:underline">Home</Link><span>/</span>
          <Link href="/for-rent" className="text-blue-700 hover:underline">{district || 'Da Nang'}</Link><span>/</span>
          <span>{b.name}</span>
        </nav>

        {photos.length > 0 && (
          <section aria-label="Photos" className="grid grid-cols-1 sm:grid-cols-3 sm:grid-rows-2 gap-2 rounded-2xl overflow-hidden sm:h-[448px]">
            <div className="relative sm:col-span-2 sm:row-span-2 h-64 sm:h-auto">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photos[0]} alt={`${b.name}, Da Nang`} className="h-full w-full object-cover" />
            </div>
            {photos.slice(1).map((src, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={src} src={src} alt={`Apartment in ${b.name}, photo ${i + 2}`} className="hidden sm:block h-full w-full object-cover" loading="lazy" />
            ))}
          </section>
        )}

        <div className="flex flex-wrap items-start gap-8">
          <div className="flex-[999_1_560px] min-w-0 flex flex-col gap-7">
            <section className="flex flex-col gap-2.5">
              <h1 className="text-3xl font-bold text-slate-900 leading-tight">{b.name}</h1>
              <p className="text-base text-slate-600">{[area, district, 'Da Nang'].filter(Boolean).join(', ')}</p>
              <div className="flex flex-wrap gap-x-5 gap-y-1 pt-1.5 text-base font-semibold text-slate-900">
                <span>Apartment building</span>
                <span>{events.length} listings tracked</span>
                {floors.length > 0 && <span>Listed floors {Math.min(...floors)}–{Math.max(...floors)}</span>}
              </div>
            </section>

            {/* Units available now */}
            {live.length > 0 && (
              <section className="flex flex-col gap-3.5">
                <h2 className="text-xl font-semibold text-slate-900">Units available now</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {live.slice(0, 4).map(l => <ListingCard key={l.slug} listing={l} />)}
                </div>
                {live.length > 4 && <Link href={facet} className="text-sm font-semibold text-blue-700 hover:underline">See all {live.length} units available in {b.name} →</Link>}
              </section>
            )}

            {/* Listing history: one row per unit listed */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-3.5">Listing history</h2>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-left text-slate-600">
                      <th className="px-2 py-2.5 font-semibold">Date</th>
                      <th className="px-2 py-2.5 font-semibold">Event</th>
                      <th className="px-2 py-2.5 font-semibold">Unit</th>
                      <th className="px-2 py-2.5 font-semibold">Price</th>
                      <th className="px-2 py-2.5 font-semibold">Listing</th>
                    </tr>
                  </thead>
                  <tbody>{events.map(row)}</tbody>
                </table>
              </div>
              <p className="mt-3 text-[13px] text-slate-600">Beds, baths, size and floor come from each listing&rsquo;s description; a dash means the listing didn&rsquo;t say.</p>
            </section>

            {/* Building facts, computed from our own listings */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-3.5">Building facts</h2>
              <dl className="grid grid-cols-2 gap-x-6 gap-y-3.5 text-sm">
                <div><dt className="text-slate-600">Location</dt><dd className="mt-0.5 font-semibold">{[area, district].filter(Boolean).join(', ') || 'Da Nang'}</dd></div>
                <div><dt className="text-slate-600">Tracked since</dt><dd className="mt-0.5 font-semibold">{fmtDate(first.when)}</dd></div>
                <div><dt className="text-slate-600">Listings tracked</dt><dd className="mt-0.5 font-semibold">{rents.length} for rent · {events.length - rents.length} for sale</dd></div>
                <div><dt className="text-slate-600">Available now</dt><dd className="mt-0.5 font-semibold">{liveRent.length} for rent · {liveSale.length} for sale</dd></div>
                {typicalRent.map(t => (
                  <div key={t.beds}><dt className="text-slate-600">Typical {t.beds}-bed rent</dt><dd className="mt-0.5 font-semibold">${t.median?.toLocaleString('en-US')}/month <span className="font-normal text-slate-500">({t.n} listings)</span></dd></div>
                ))}
              </dl>
            </section>

            {districtInfo && (
              <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
                <h2 className="text-xl font-semibold text-slate-900 mb-2.5">About {districtInfo.name}</h2>
                <p className="text-[15px] leading-relaxed text-slate-700">{districtInfo.description}</p>
              </section>
            )}
          </div>

          <aside className="flex-[1_1_300px] min-w-0 flex flex-col gap-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 flex flex-col gap-3">
              <span className="text-[13px] font-semibold uppercase tracking-wider text-slate-600">Available now</span>
              <span className="text-2xl font-bold text-slate-900">{live.length} {live.length === 1 ? 'unit' : 'units'}</span>
              <span className="text-sm text-slate-600">{liveRent.length} for rent · {liveSale.length} for sale</span>
              <Link href={facet} className="rounded-xl bg-blue-700 px-4 py-3 text-center font-semibold text-white hover:bg-blue-800">See units for rent</Link>
              {liveSale.length > 0 && <Link href={`/for-sale/${slug}`} className="rounded-xl border border-slate-300 px-4 py-3 text-center font-semibold text-slate-900 hover:bg-slate-50">See units for sale</Link>}
            </div>
            {mapListing?.geo && (
              <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
                <ListingMapSection listing={mapListing} similar={[]} />
              </div>
            )}
          </aside>
        </div>
      </main>
    </div>
  );
}
