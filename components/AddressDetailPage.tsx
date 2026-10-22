import Link from 'next/link';
import { notFound, permanentRedirect } from 'next/navigation';
import type { Metadata } from 'next';
import { getListings, getForSaleListings } from '@/lib/sheets';
import { getSimilarListings } from '@/lib/similarListings';
import { getArchivedListing } from '@/lib/archive';
import { getAddressEntry, addressRoute } from '@/lib/addresses';
import { getDistrict } from '@/lib/districts';
import { canonicalType } from '@/lib/propertyTypes';
import { socialImages } from '@/lib/ogImage';
import ListingCard from '@/components/ListingCard';
import ListingMapSection from '@/components/ListingMapSection';
import type { Listing } from '@/lib/types';

// The property-history page for one street address (Blake, 2026-10-22: layout A, with layout C's dark
// "Property record" bar so it is obvious this is a record, not a listing that is available now).
// An address maps to every listing of it over time (lib/addresses.ts); each one is either still live in
// the sheet or kept as an archived copy, and its listing page stays up with an "Off market" badge.

type Kind = 'homedetails' | 'propertydetails';
type Event = { listing: Listing; live: boolean; when: number };

const urlFor = (kind: Kind, addr: string) => `https://danangmls.com/${kind}/${addr}`;
const fmtDate = (t: number) => t ? new Date(t).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';
const isStable = (u: string) => u && !u.includes('fbcdn.net') && !u.includes('facebook.com');

async function resolve(addr: string) {
  const entry = await getAddressEntry(addr);
  if (!entry) return null;
  const [rentals, forSale] = await Promise.allSettled([getListings(), getForSaleListings()]);
  const all: Listing[] = [
    ...(rentals.status === 'fulfilled' ? rentals.value : []),
    ...(forSale.status === 'fulfilled' ? forSale.value : []),
  ];
  const events: Event[] = [];
  for (const slug of entry.slugs) {
    const live = all.find(l => l.slug === slug);
    const listing = live ?? await getArchivedListing(slug);
    if (listing) events.push({ listing, live: Boolean(live), when: Date.parse(listing.date) || 0 });
  }
  if (!events.length) return null;
  events.sort((a, b) => b.when - a.when);   // newest first
  return { entry, events, latest: events[0], all };
}

export async function addressMetadata(kind: Kind, addr: string): Promise<Metadata> {
  const r = await resolve(addr);
  if (!r) return { title: 'Property Not Found' };
  const { entry, latest } = r;
  const l = latest.listing;
  const type = canonicalType(l.type, l.forSale) || 'Property';
  const title = `${entry.address} — ${type} history`;
  const description = `${type}${l.bedrooms ? `, ${l.bedrooms} bedrooms` : ''} at ${entry.address}. Listing and price history on DanangMLS.`;
  const img = l.images.find(isStable) || l.images[0];
  const url = urlFor(addressRoute(l), addr);
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, images: socialImages(img, `${entry.address} — DanangMLS`), type: 'website' },
    twitter: { card: 'summary_large_image', images: socialImages(img, `${entry.address} — DanangMLS`) },
  };
}

function OffMarketBadge() {
  return (
    <span className="absolute top-3.5 left-3.5 inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[13px] font-semibold text-slate-900 shadow">
      <span className="h-2 w-2 rounded-full bg-slate-500" aria-hidden="true" />Off market
    </span>
  );
}

export default async function AddressDetailPage({ kind, addr }: { kind: Kind; addr: string }) {
  const r = await resolve(addr);
  if (!r) notFound();
  const { entry, events, latest, all } = r;
  const l = latest.listing;
  const right = addressRoute(l);
  if (right !== kind) permanentRedirect(`/${right}/${addr}`);

  const onMarket = events.some(e => e.live);
  const current = events.find(e => e.live);
  const type = canonicalType(l.type, l.forSale) || 'Property';
  const [street, ...rest] = entry.address.split(',').map(s => s.trim());
  const locality = rest.join(', ');
  const photos = (l.images.filter(isStable).length ? l.images.filter(isStable) : l.images).slice(0, 3);
  const district = getDistrict(l.district);
  const similar = getSimilarListings(l, all);
  // The address's own pin (from Blake's Maps link or the street) beats the listing's estimate.
  const mapListing: Listing = entry.geo
    ? { ...l, geo: [entry.geo.lat, entry.geo.lng, entry.geo.precision], geoLabel: entry.geo.precision === 0 ? '' : (entry.geo.label || street), geoArea: '' }
    : l;
  const first = events[events.length - 1];
  const mode = l.forSale ? 'for-sale' : 'for-rent';
  const listingHref = (e: Event) => `/listing/${e.listing.slug}`;

  const url = urlFor(kind, addr);
  const placeLd = {
    '@context': 'https://schema.org',
    '@type': kind === 'homedetails' ? 'House' : 'Place',
    name: entry.address,
    url,
    address: { '@type': 'PostalAddress', streetAddress: street, addressLocality: l.district || 'Da Nang', addressRegion: 'Da Nang', addressCountry: 'VN' },
    ...(mapListing.geo && { geo: { '@type': 'GeoCoordinates', latitude: mapListing.geo[0], longitude: mapListing.geo[1] } }),
    ...(kind === 'homedetails' && /^\d+$/.test(String(l.bedrooms)) && { numberOfBedrooms: Number(l.bedrooms) }),
    ...(photos.length && { image: photos }),
  };
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://danangmls.com' },
      { '@type': 'ListItem', position: 2, name: l.district || 'Da Nang', item: `https://danangmls.com/${mode}` },
      { '@type': 'ListItem', position: 3, name: entry.address },
    ],
  };

  return (
    <div className="bg-slate-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(placeLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      {/* Layout C's record bar: this is a property's history, not what is available now. */}
      <div className="bg-slate-900 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
          <p className="text-sm">
            <span className="font-semibold uppercase tracking-wider text-slate-300">Property record</span>
            <span className="mx-2 text-slate-500" aria-hidden="true">·</span>
            <span className="text-slate-200">{onMarket ? 'History of this address. It also has a current listing.' : 'History of this address. It is not currently listed.'}</span>
          </p>
          <Link href={`/${mode}`} className="text-sm font-semibold text-blue-300 hover:text-white">
            {l.forSale ? 'See homes for sale now' : 'See homes for rent now'} →
          </Link>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-5 pb-16 flex flex-col gap-7">
        <nav aria-label="Breadcrumb" className="flex flex-wrap gap-1.5 text-[13px] text-slate-600">
          <Link href="/" className="text-blue-700 hover:underline">Home</Link><span>/</span>
          <Link href={`/${mode}`} className="text-blue-700 hover:underline">{l.district || 'Da Nang'}</Link><span>/</span>
          <span>{street}</span>
        </nav>

        {/* 3 · Photos */}
        {photos.length > 0 && (
          <section aria-label="Photos" className="grid grid-cols-1 sm:grid-cols-3 sm:grid-rows-2 gap-2 rounded-2xl overflow-hidden sm:h-[448px]">
            <div className="relative sm:col-span-2 sm:row-span-2 h-64 sm:h-auto">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photos[0]} alt={`${type} at ${entry.address}`} className="h-full w-full object-cover" />
              {!onMarket && <OffMarketBadge />}
            </div>
            {photos.slice(1).map((src, i) => (
              <div key={src} className="relative hidden sm:block">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt={`${type} at ${entry.address}, photo ${i + 2}`} className="h-full w-full object-cover" loading="lazy" />
                {i === photos.length - 2 && l.images.length > photos.length && (
                  <Link href={listingHref(latest)} className="absolute right-3 bottom-3 rounded-lg bg-white px-3 py-2 text-[13px] font-semibold text-slate-900 hover:bg-slate-100">
                    See all {l.images.length} photos
                  </Link>
                )}
              </div>
            ))}
          </section>
        )}

        <div className="flex flex-wrap items-start gap-8">
          <div className="flex-[999_1_560px] min-w-0 flex flex-col gap-7">

            {/* 1 · Header */}
            <section className="flex flex-col gap-2.5">
              <h1 className="text-3xl font-bold text-slate-900 leading-tight">{street}</h1>
              <p className="text-base text-slate-600">{locality}</p>
              <div className="flex flex-wrap gap-x-5 gap-y-1 pt-1.5 text-base font-semibold text-slate-900">
                <span>{type}</span>
                {/^\d+$/.test(String(l.bedrooms)) && <span>{l.bedrooms} bedrooms</span>}
                {l.district && <span>{l.district}</span>}
              </div>
              <p className="text-[15px] text-slate-600">
                {onMarket && current
                  ? <>Listed {current.listing.forSale ? 'for sale' : 'for rent'} at <strong className="text-slate-900">{current.listing.price}</strong></>
                  : <>Off market · last listed {l.forSale ? 'for sale' : 'for rent'} at <strong className="text-slate-900">{l.price}</strong> on {fmtDate(latest.when)}</>}
              </p>
            </section>

            {/* 2 · Price history */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-3.5">Price history</h2>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-left text-slate-600">
                      <th className="px-2 py-2.5 font-semibold">Date</th>
                      <th className="px-2 py-2.5 font-semibold">Event</th>
                      <th className="px-2 py-2.5 font-semibold">Price</th>
                      <th className="px-2 py-2.5 font-semibold">Listing</th>
                    </tr>
                  </thead>
                  <tbody>
                    {events.map(e => (
                      <tr key={e.listing.slug} className="border-b border-slate-100 last:border-0">
                        <td className="px-2 py-3 whitespace-nowrap">{fmtDate(e.when)}</td>
                        <td className="px-2 py-3">
                          Listed {e.listing.forSale ? 'for sale' : 'for rent'}
                          <span className={`ml-2 rounded-full px-2 py-0.5 text-xs font-semibold ${e.live ? 'bg-emerald-50 text-emerald-800' : 'bg-slate-100 text-slate-700'}`}>
                            {e.live ? 'Active' : 'Off market'}
                          </span>
                        </td>
                        <td className="px-2 py-3 whitespace-nowrap">{e.listing.price || '—'}</td>
                        <td className="px-2 py-3"><Link href={listingHref(e)} className="font-medium text-blue-700 hover:underline">View listing</Link></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-[13px] text-slate-600">Each time this address is listed again, a new row is added here.</p>
            </section>

            {/* 4 · Facts */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-3.5">Property facts</h2>
              <dl className="grid grid-cols-2 gap-x-6 gap-y-3.5 text-sm">
                <div><dt className="text-slate-600">Property type</dt><dd className="mt-0.5 font-semibold">{type}</dd></div>
                {/^\d+$/.test(String(l.bedrooms)) && <div><dt className="text-slate-600">Bedrooms</dt><dd className="mt-0.5 font-semibold">{l.bedrooms}</dd></div>}
                {l.district && <div><dt className="text-slate-600">District</dt><dd className="mt-0.5 font-semibold">{l.district}</dd></div>}
                {l.neighborhood && <div><dt className="text-slate-600">Area</dt><dd className="mt-0.5 font-semibold">{l.neighborhood}</dd></div>}
                <div><dt className="text-slate-600">First listed on DanangMLS</dt><dd className="mt-0.5 font-semibold">{fmtDate(first.when)}</dd></div>
                <div><dt className="text-slate-600">Times listed</dt><dd className="mt-0.5 font-semibold">{events.length}</dd></div>
              </dl>
            </section>

            {/* 6 · Neighborhood */}
            {district && (
              <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
                <h2 className="text-xl font-semibold text-slate-900 mb-2.5">About {district.name}</h2>
                <p className="text-[15px] leading-relaxed text-slate-700">{district.description}</p>
              </section>
            )}
          </div>

          {/* Side card + map */}
          <aside className="flex-[1_1_300px] min-w-0 flex flex-col gap-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 flex flex-col gap-3">
              <span className="text-[13px] font-semibold uppercase tracking-wider text-slate-600">Status</span>
              <span className="text-2xl font-bold text-slate-900">{onMarket ? (current?.listing.forSale ? 'For sale' : 'For rent') : 'Off market'}</span>
              <span className="text-sm text-slate-600">
                {onMarket ? `Listed at ${current?.listing.price}` : `Last ${l.forSale ? 'price' : 'rent'}: ${l.price} · ${fmtDate(latest.when)}`}
              </span>
              <Link href={listingHref(current ?? latest)} className="rounded-xl bg-blue-700 px-4 py-3 text-center font-semibold text-white hover:bg-blue-800">
                {onMarket ? 'View current listing' : 'View original listing'}
              </Link>
              <Link href={`/${mode}`} className="rounded-xl border border-slate-300 px-4 py-3 text-center font-semibold text-slate-900 hover:bg-slate-50">
                {l.forSale ? 'Find similar homes for sale' : 'Find similar homes for rent'}
              </Link>
            </div>
            {mapListing.geo && (
              <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
                <ListingMapSection listing={mapListing} similar={similar} />
              </div>
            )}
          </aside>
        </div>

        {/* 5 · Similar homes */}
        {similar.length > 0 && (
          <section className="flex flex-col gap-3.5">
            <h2 className="text-xl font-semibold text-slate-900">
              {l.forSale ? 'Similar homes for sale' : 'Similar homes for rent'}{l.district ? ` in ${l.district}` : ''}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {similar.map(s => <ListingCard key={s.slug} listing={s} />)}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
