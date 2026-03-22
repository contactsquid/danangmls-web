import { getListings } from '@/lib/sheets';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const listings = await getListings();
  const listing = listings.find(l => l.slug === slug);
  if (!listing) return { title: 'Listing Not Found' };
  return {
    title: `${listing.title} — DanangMLS`,
    description: listing.text.slice(0, 160) || `${listing.type} in ${listing.district}. ${listing.price}.`,
  };
}

export async function generateStaticParams() {
  const listings = await getListings();
  return listings.map(l => ({ slug: l.slug }));
}

export default async function ListingPage({ params }: Props) {
  const { slug } = await params;
  const listings = await getListings();
  const listing = listings.find(l => l.slug === slug);
  if (!listing) notFound();

  const images = listing.images.filter(Boolean);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <Link href="/" className="text-xl font-bold text-gray-900">DanangMLS</Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <Link href="/" className="text-sm text-blue-600 hover:underline mb-6 inline-block">
          ← Back to listings
        </Link>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Image gallery */}
          {images.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
              {images.slice(0, 4).map((img, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={i}
                  src={img}
                  alt={`${listing.title} — photo ${i + 1}`}
                  className={`w-full object-cover ${i === 0 && images.length === 1 ? 'sm:col-span-2' : ''} ${i === 0 ? 'aspect-video' : 'aspect-video'}`}
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
              ))}
            </div>
          )}

          <div className="p-6">
            {/* Type badge */}
            {listing.type && (
              <span className="inline-block bg-blue-50 text-blue-700 text-xs font-medium px-2 py-1 rounded-full mb-3">
                {listing.type}
              </span>
            )}

            <h1 className="text-2xl font-bold text-gray-900 mb-4">{listing.title}</h1>

            {/* Key details */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-xl">
              {listing.price && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">Price</p>
                  <p className="font-semibold text-blue-600">{listing.price}</p>
                </div>
              )}
              {listing.district && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">District</p>
                  <p className="font-semibold text-gray-900">{listing.district}</p>
                </div>
              )}
              {listing.bedrooms && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">Bedrooms</p>
                  <p className="font-semibold text-gray-900">{listing.bedrooms} BR</p>
                </div>
              )}
              {listing.agent && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">Agent</p>
                  <p className="font-semibold text-gray-900">{listing.agent}</p>
                </div>
              )}
            </div>

            {/* Description */}
            {listing.text && (
              <div className="mb-6">
                <h2 className="text-sm font-semibold text-gray-700 mb-2">Description</h2>
                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{listing.text}</p>
              </div>
            )}

            {/* CTA */}
            {listing.mlsUrl && (
              <a
                href={listing.mlsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-blue-600 text-white font-medium px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors"
              >
                View Original Listing →
              </a>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
