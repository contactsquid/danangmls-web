import { getListings, getForSaleListings } from '@/lib/sheets';
import { notFound } from 'next/navigation';
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
  if (!listing) return { title: 'Không tìm thấy' };
  return {
    title: `${listing.title} | DanangMLS`,
    description: listing.text.slice(0, 160) || `${listing.type} tại ${listing.district}. ${listing.price}.`,
    alternates: {
      canonical: `https://danangmls.com/vi/listing/${slug}`,
      languages: { en: `https://danangmls.com/listing/${slug}` },
    },
  };
}

export async function generateStaticParams() {
  const listings = await getAllListings();
  return listings.map(l => ({ slug: l.slug }));
}

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
    address: {
      '@type': 'PostalAddress',
      addressLocality: listing.district || 'Đà Nẵng',
      addressRegion: 'Đà Nẵng',
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
