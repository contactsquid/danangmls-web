import { getListings, getForSaleListings } from '@/lib/sheets';
import { notFound } from 'next/navigation';
import ListingDetail from '@/components/ListingDetail';
import { getAgentSlugForName } from '@/lib/agents';
import RentalProcessVideo from '@/components/RentalProcessVideo';
import { localizeType, localizeDistrict } from '@/lib/price';
import type { Metadata } from 'next';
import type { Listing } from '@/lib/types';
import { getArchivedListing } from '@/lib/archive';
import { socialImages } from '@/lib/ogImage';

// Korean fallback title for listings without ko_title. Reads as a Korean
// search phrase ("다낭 하이쩌우 침실 3개 주택 임대") rather than a translated
// English sentence, so <title> is never left in English.
function koFallbackTitle(listing: Listing): string {
  const verb  = listing.forSale ? '매매' : '임대';
  const type  = listing.type ? localizeType(listing.type, 'ko') : '부동산';
  const beds  = listing.bedrooms ? `침실 ${listing.bedrooms}개` : '';
  const place = listing.district ? localizeDistrict(listing.district, 'ko') : '';
  return ['다낭', place, beds, type, verb].filter(Boolean).join(' ');
}

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
  const listing = listings.find(l => l.slug === slug) ?? await getArchivedListing(slug);
  if (!listing) return { title: '찾을 수 없음' };
  const displayTitle = listing.ko_title || koFallbackTitle(listing);
  const ogImage = getShareableImage(listing.images);
  const description = (listing.ko_text || listing.text).slice(0, 160) || `${listing.type} — ${listing.district}. ${listing.price}.`;
  return {
    title: displayTitle,
    description,
    alternates: {
      canonical: `https://danangmls.com/ko/listing/${slug}`,
      languages: {
        en: `https://danangmls.com/listing/${slug}`,
        ko: `https://danangmls.com/ko/listing/${slug}`,
        'x-default': `https://danangmls.com/listing/${slug}`,
      },
    },
    openGraph: {
      title: displayTitle,
      description,
      url: `https://danangmls.com/ko/listing/${slug}`,
      images: socialImages(ogImage, `${displayTitle} — DanangMLS`),
      type: 'website',
      locale: 'ko_KR',
    },
    twitter: {
      card: 'summary_large_image',
      images: socialImages(ogImage, `${displayTitle} — DanangMLS`),
    },
  };
}

export async function generateStaticParams() {
  // Return empty — ISR generates and caches pages on first request.
  // Pre-building all 1900+ pages exhausts Vercel's build disk quota.
  return [];
}

// ISR re-enabled 2026-07-02. See app/listing/[slug]/page.tsx for the full note:
// the 2026-07-01 OOM revert's two root causes (per-render re-parse + N× parse
// under regeneration bursts) are now fixed in lib/sheets.ts (parsed-listings
// cache + in-flight de-dup), so caching these pages is safe.
// Lowered 3600 -> 300 (2026-08-13): see app/listing/[slug]/page.tsx — caps how
// long a wrongly-cached notFound() on a brand-new listing can persist.
export const revalidate = 300;

export default async function KOListingPage({ params }: Props) {
  const { slug } = await params;
  const listings = await getAllListings();
  // Expired listings keep their URL — a 404 discards the indexing Google
  // already spent on it. Serve the archived copy at 200 with a banner.
  let listing = listings.find(l => l.slug === slug);
  let archived = false;
  if (!listing) {
    const fromArchive = await getArchivedListing(slug);
    if (fromArchive) { listing = fromArchive; archived = true; }
    else notFound();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: listing.title,
    description: listing.text || `${listing.type} — ${listing.district}`,
    url: `https://danangmls.com/ko/listing/${listing.slug}`,
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
      { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: 'https://danangmls.com/ko' },
      { '@type': 'ListItem', position: 2, name: listing.forSale ? 'Mua Bán' : 'Cho Thuê', item: `https://danangmls.com/ko/${listing.forSale ? 'mua-ban' : 'thue'}` },
      { '@type': 'ListItem', position: 3, name: listing.title },
    ],
  };

  const agentSlug = await getAgentSlugForName(listing.agent);

  return (
    <div className="bg-slate-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <ListingDetail listing={listing} archived={archived} similarListings={getSimilarListings(listing, listings)} agentSlug={agentSlug} />
      {!listing.forSale && <RentalProcessVideo />}
    </div>
  );
}
