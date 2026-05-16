import { getListings, getForSaleListings } from '@/lib/sheets';
import { notFound } from 'next/navigation';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import ListingDetail from '@/components/ListingDetail';
import type { Metadata } from 'next';
import type { Listing } from '@/lib/types';

interface Props {
  params: Promise<{ slug: string }>;
}

async function getAllListings() {
  const [rentals, forSale] = await Promise.allSettled([getListings(), getForSaleListings()]);
  const r = rentals.status === 'fulfilled' ? rentals.value : [];
  const f = forSale.status === 'fulfilled' ? forSale.value : [];
  return [...r, ...f];
}

function getSimilarListings(current: Listing, all: Listing[], count = 4): Listing[] {
  const candidates = all.filter(l => l.slug !== current.slug && l.forSale === current.forSale);
  const tier1 = candidates.filter(l => l.type === current.type && l.district === current.district);
  const tier2 = candidates.filter(l => l.type === current.type && l.district !== current.district);
  const tier3 = candidates.filter(l => l.type !== current.type && l.district === current.district);
  const results: Listing[] = [];
  for (const tier of [tier1, tier2, tier3]) {
    for (const l of tier) {
      if (results.length >= count) return results;
      results.push(l);
    }
  }
  return results;
}

function getShareableImage(images: string[]): string | undefined {
  return images.find(img => img && !img.includes('fbcdn.net') && !img.includes('facebook.com')) || images[0] || undefined;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const listings = await getAllListings();
  const listing = listings.find(l => l.slug === slug);
  if (!listing) return { title: 'Không tìm thấy' };
  const ogImage = getShareableImage(listing.images);
  const description = listing.text.slice(0, 160) || `${listing.type} tại ${listing.district}. ${listing.price}.`;
  return {
    title: listing.title,
    description,
    alternates: {
      canonical: `https://danangmls.com/vi/listing/${slug}`,
      languages: { en: `https://danangmls.com/listing/${slug}` },
    },
    openGraph: {
      title: listing.title,
      description,
      url: `https://danangmls.com/vi/listing/${slug}`,
      images: ogImage ? [{ url: ogImage, alt: `${listing.title} — DanangMLS` }] : [],
      type: 'website',
      locale: 'vi_VN',
    },
  };
}

export async function generateStaticParams() {
  // Return empty — ISR generates and caches pages on first request.
  // Pre-building all 1900+ pages exhausts Vercel's build disk quota.
  return [];
}

// Refresh in-cache pages hourly so listings stay current after Sheet edits.
// Stale pages still serve instantly; regeneration happens in the background.
export const revalidate = 3600;

// Give the function room to fetch both sheets (~1MB each) from Google Sheets
// on a cold first-visit before Vercel's default 10s timeout kills it. Requires
// Vercel Pro.
export const maxDuration = 60;

export default async function ViListingPage({ params }: Props) {
  const { slug } = await params;
  const listings = await getAllListings();
  const listing = listings.find(l => l.slug === slug);
  if (!listing) notFound();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: listing.title,
    description: listing.text || `${listing.type} tại ${listing.district}`,
    url: `https://danangmls.com/vi/listing/${listing.slug}`,
    ...(listing.price && { price: listing.price }),
    ...(listing.images[0] && { image: listing.images[0] }),
    ...(listing.bedrooms && { numberOfRooms: listing.bedrooms }),
    address: {
      '@type': 'PostalAddress',
      addressLocality: listing.district || 'Đà Nẵng',
      addressRegion: 'Đà Nẵng',
      addressCountry: 'VN',
    },
  };

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: 'https://danangmls.com/vi' },
      { '@type': 'ListItem', position: 2, name: listing.forSale ? 'Mua Bán' : 'Cho Thuê', item: `https://danangmls.com/vi/${listing.forSale ? 'mua-ban' : ''}` },
      { '@type': 'ListItem', position: 3, name: listing.title },
    ],
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <SiteHeader />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <ListingDetail listing={listing} similarListings={getSimilarListings(listing, listings)} />
      <SiteFooter />
    </div>
  );
}
