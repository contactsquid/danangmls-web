import { getListings, getForSaleListings } from '@/lib/sheets';
import { notFound, redirect } from 'next/navigation';
import SiteHeader from '@/components/SiteHeader';
import ListingDetail from '@/components/ListingDetail';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ slug: string }>;
}

async function getAllListings() {
  const [rentals, forSale] = await Promise.all([getListings(), getForSaleListings()]);
  return [...rentals, ...forSale];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const listings = await getAllListings();
  const listing = listings.find(l => l.slug === slug);
  if (!listing) return { title: 'Listing Not Found' };
  return {
    title: `${listing.title} — DanangMLS`,
    description: listing.text.slice(0, 160) || `${listing.type} in ${listing.district}. ${listing.price}.`,
  };
}

export async function generateStaticParams() {
  const listings = await getAllListings();
  return listings.map(l => ({ slug: l.slug }));
}

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
    notFound();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: listing.title,
    description: listing.text || `${listing.type} in ${listing.district}`,
    url: `https://www.danangmls.com/listing/${listing.slug}`,
    ...(listing.price && { price: listing.price }),
    ...(listing.images[0] && { image: listing.images[0] }),
    address: {
      '@type': 'PostalAddress',
      addressLocality: listing.district || 'Da Nang',
      addressRegion: 'Da Nang',
      addressCountry: 'VN',
    },
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <SiteHeader />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ListingDetail listing={listing} />
    </div>
  );
}
