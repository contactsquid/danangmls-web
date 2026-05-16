import { getListings, getForSaleListings } from '@/lib/sheets';
import type { Listing } from '@/lib/types';
import { notFound, redirect } from 'next/navigation';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import ListingDetail from '@/components/ListingDetail';
import type { Metadata } from 'next';

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
  if (!listing) return { title: 'Listing Not Found' };
  const ogImage = getShareableImage(listing.images);
  const description = listing.text.slice(0, 160) || `${listing.type} in ${listing.district}. ${listing.price}.`;
  return {
    title: listing.title,
    description,
    alternates: {
      canonical: `https://danangmls.com/listing/${listing.slug}`,
      languages: { vi: `https://danangmls.com/vi/listing/${listing.slug}` },
    },
    openGraph: {
      title: listing.title,
      description,
      url: `https://danangmls.com/listing/${listing.slug}`,
      images: ogImage ? [{ url: ogImage, alt: `${listing.title} — DanangMLS` }] : [],
      type: 'website',
    },
  };
}

export async function generateStaticParams() {
  // Return empty — ISR generates and caches pages on first request.
  // Pre-building all 1900+ pages exhausts Vercel's build disk quota.
  return [];
}

// The Google-Sheets CSV fetches in lib/sheets.ts use `cache: 'no-store'`,
// which Next 16 treats as dynamic. Without this export, Next throws a
// "Page changed from static to dynamic at runtime" 500 on the first
// cold-cache visit. Marking the route dynamic up front avoids that.
export const dynamic = 'force-dynamic';

export default async function ListingPage({ params }: Props) {
  const { slug } = await params;
  const listings = await getAllListings();
  const listing = listings.find(l => l.slug === slug);
  if (!listing) {
    // Redirect old index-based slugs (e.g. "title-496") to current hash-based slugs
    const prefix = slug.slice(0, slug.lastIndexOf('-'));
    if (prefix) {
      const match = listings.find(l => l.slug.slice(0, l.slug.lastIndexOf('-')) === prefix);
      if (match) redirect(`/listing/${match.slug}`);
    }
    // Redirect stale slugs where the AI re-generated a different title but same Post URL
    // The suffix is a hash of the Post URL, so suffix match = same listing
    const suffix = slug.slice(slug.lastIndexOf('-') + 1);
    if (suffix && suffix.length >= 4) {
      const match = listings.find(l => l.slug.endsWith('-' + suffix));
      if (match) redirect(`/listing/${match.slug}`);
    }
    notFound();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: listing.title,
    description: listing.text || `${listing.type} in ${listing.district}`,
    url: `https://danangmls.com/listing/${listing.slug}`,
    ...(listing.price && { price: listing.price }),
    ...(listing.images[0] && { image: listing.images[0] }),
    ...(listing.bedrooms && { numberOfRooms: listing.bedrooms }),
    address: {
      '@type': 'PostalAddress',
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
      { '@type': 'ListItem', position: 2, name: listing.forSale ? 'For Sale' : 'For Rent', item: `https://danangmls.com/${listing.forSale ? 'for-sale' : ''}` },
      { '@type': 'ListItem', position: 3, name: listing.title },
    ],
  };

  const similarListings = getSimilarListings(listing, listings);

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
      <ListingDetail listing={listing} similarListings={similarListings} />
      <SiteFooter />
    </div>
  );
}
