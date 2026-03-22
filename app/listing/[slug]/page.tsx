import { getListings, getForSaleListings } from '@/lib/sheets';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import SiteHeader from '@/components/SiteHeader';
import Carousel from '@/components/Carousel';
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
  if (!listing) notFound();

  const images = listing.images.filter(Boolean);

  // Strip contact block from description (shown separately in the contact card)
  const cleanText = listing.text
    .split('\n')
    .filter(line => !/zalo|whatsapp|danang4homes|danang\.homes|contact information|\+84\s*\d|📞|📱|📧|🌐/i.test(line))
    .join('\n')
    .trim();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: listing.title,
    description: listing.text || `${listing.type} in ${listing.district}`,
    url: `https://danangmls.com/listing/${listing.slug}`,
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

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <Link href="/" className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline mb-6">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to listings
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          {/* Carousel */}
          <Carousel images={images} title={listing.title} />

          <div className="p-6 sm:p-8">
            {/* Price + badges */}
            <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
              <p className="text-3xl font-bold text-slate-900">
                {listing.price || <span className="text-slate-400 text-xl font-normal">Price on request</span>}
              </p>
              <div className="flex flex-wrap gap-2">
                {listing.type && (
                  <span className="bg-blue-50 text-blue-700 text-xs font-medium px-3 py-1 rounded-full">
                    {listing.type}
                  </span>
                )}
                {listing.bedrooms && (
                  <span className="bg-slate-100 text-slate-600 text-xs font-medium px-3 py-1 rounded-full">
                    🛏 {listing.bedrooms} BR
                  </span>
                )}
              </div>
            </div>

            <h1 className="text-xl font-semibold text-slate-800 mb-6">{listing.title}</h1>

            {/* Key details grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6 p-4 bg-slate-50 rounded-xl">
              {listing.district && (
                <div>
                  <p className="text-xs text-slate-400 mb-1">District</p>
                  <p className="font-semibold text-slate-800">📍 {listing.district}</p>
                </div>
              )}
              {listing.bedrooms && (
                <div>
                  <p className="text-xs text-slate-400 mb-1">Bedrooms</p>
                  <p className="font-semibold text-slate-800">{listing.bedrooms} Bedrooms</p>
                </div>
              )}
              {listing.agent && (
                <div>
                  <p className="text-xs text-slate-400 mb-1">Agent</p>
                  <p className="font-semibold text-slate-800">{listing.agent}</p>
                </div>
              )}
            </div>

            {/* Contact */}
            <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-xl">
              <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">📞 Contact Information</h2>
              <div className="space-y-1 text-sm text-slate-700">
                <p>📱 Zalo / WhatsApp: <a href="tel:+84973747373" className="text-blue-600 hover:underline">+84 973 747 373</a></p>
                <p>📧 Email: <a href="mailto:danang4homes@gmail.com" className="text-blue-600 hover:underline">danang4homes@gmail.com</a></p>
                <p>🌐 Website: <a href="https://danang.homes" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">danang.homes</a></p>
              </div>
            </div>

            {/* Description */}
            {cleanText && (
              <div className="mb-8">
                <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">Description</h2>
                <p className="text-slate-700 leading-relaxed whitespace-pre-line">{cleanText}</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
