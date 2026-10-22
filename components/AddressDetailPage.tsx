import { getListings, getForSaleListings } from '@/lib/sheets';
import { getSimilarListings } from '@/lib/similarListings';
import { listingOfferLd, listingImagesLd } from '@/lib/listingSchema';
import { getArchivedListing } from '@/lib/archive';
import { isBelowServiceFloor } from '@/lib/agentContact';
import { agentHasWhatsApp, agentFallbackForPost } from '@/lib/agentChannels';
import { getAddressEntry, addressRoute } from '@/lib/addresses';
import { getAgentSlugForName } from '@/lib/agents';
import { notFound, permanentRedirect } from 'next/navigation';
import ListingDetail from '@/components/ListingDetail';
import type { Metadata } from 'next';
import type { Listing } from '@/lib/types';
import { socialImages } from '@/lib/ogImage';

type Kind = 'homedetails' | 'propertydetails';

async function resolve(addr: string) {
  const entry = await getAddressEntry(addr);
  if (!entry) return null;
  const [rentals, forSale] = await Promise.allSettled([getListings(), getForSaleListings()]);
  const all: Listing[] = [
    ...(rentals.status === 'fulfilled' ? rentals.value : []),
    ...(forSale.status === 'fulfilled' ? forSale.value : []),
  ];
  const live = all.find(l => l.slug === entry.slug);
  const listing = live ?? await getArchivedListing(entry.slug);
  return listing ? { entry, listing, all, archived: !live } : null;
}

const urlFor = (kind: Kind, addr: string) => `https://danangmls.com/${kind}/${addr}`;

export async function addressMetadata(kind: Kind, addr: string): Promise<Metadata> {
  const r = await resolve(addr);
  if (!r) return { title: 'Property Not Found' };
  const { entry, listing } = r;
  const title = `${entry.address} — ${listing.title}`;
  const description = listing.text.slice(0, 160) || `${listing.type} at ${entry.address}. ${listing.price}.`;
  const img = listing.images.find(i => i && !i.includes('fbcdn.net') && !i.includes('facebook.com')) || listing.images[0];
  const url = urlFor(addressRoute(listing), addr);
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, images: socialImages(img, `${entry.address} — DanangMLS`), type: 'website' },
    twitter: { card: 'summary_large_image', images: socialImages(img, `${entry.address} — DanangMLS`) },
  };
}

export default async function AddressDetailPage({ kind, addr }: { kind: Kind; addr: string }) {
  const r = await resolve(addr);
  if (!r) notFound();
  const { entry, all, archived } = r;
  let { listing } = r;
  const right = addressRoute(listing);
  if (right !== kind) permanentRedirect(`/${right}/${addr}`);

  const url = urlFor(kind, addr);
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: listing.title,
    description: listing.text || `${listing.type} in ${listing.district}`,
    url,
    ...listingOfferLd(listing, url, archived),
    ...listingImagesLd(listing),
    address: {
      '@type': 'PostalAddress',
      streetAddress: entry.address.split(',')[0].trim(),
      addressLocality: listing.district || 'Da Nang',
      addressRegion: 'Da Nang',
      addressCountry: 'VN',
    },
  };
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://danangmls.com' },
      { '@type': 'ListItem', position: 2, name: listing.forSale ? 'For Sale' : 'For Rent', item: `https://danangmls.com/${listing.forSale ? 'for-sale' : 'for-rent'}` },
      { '@type': 'ListItem', position: 3, name: entry.address },
    ],
  };

  const similarListings = getSimilarListings(listing, all);
  const agentSlug = await getAgentSlugForName(listing.agent);
  const fallback = !listing.agentPhone && isBelowServiceFloor(listing)
    ? await agentFallbackForPost(listing.postUrl)
    : { phone: '', messenger: '' };
  if (fallback.phone) listing = { ...listing, agentPhone: fallback.phone };
  const agentWhatsApp = listing.agentPhone ? await agentHasWhatsApp(listing.agentPhone) : false;

  return (
    <div className="bg-slate-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <ListingDetail listing={listing} archived={archived} similarListings={similarListings} agentSlug={agentSlug} agentHasWhatsApp={agentWhatsApp} agentMessenger={fallback.messenger} agentBorrowed={Boolean(fallback.phone || fallback.messenger)} address={entry.address} />
    </div>
  );
}
