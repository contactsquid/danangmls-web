import { getListings, getForSaleListings } from '@/lib/sheets';
import { getSimilarListings } from '@/lib/similarListings';
import { schemaRooms } from '@/lib/propertyTypes';
import { notFound, permanentRedirect } from 'next/navigation';
import ListingDetail from '@/components/ListingDetail';
import { getAgentSlugForName } from '@/lib/agents';
import RentalProcessVideo from '@/components/RentalProcessVideo';
import { localizeType, localizeDistrict } from '@/lib/price';
import type { Metadata } from 'next';
import type { Listing } from '@/lib/types';
import { getArchivedListing } from '@/lib/archive';
import { resolveListingRedirect } from '@/lib/redirects';
import { agentHasWhatsApp } from '@/lib/agentChannels';
import { socialImages } from '@/lib/ogImage';

// Russian fallback title for listings without ru_title. Built as a
// label rather than a sentence so it never disagrees in case or gender.
function ruFallbackTitle(listing: Listing): string {
  const verb  = listing.forSale ? 'Продажа' : 'Аренда';
  const type  = listing.type ? localizeType(listing.type, 'ru') : 'Недвижимость';
  const beds  = listing.bedrooms ? `, ${listing.bedrooms} спальни` : '';
  const place = listing.district ? `${localizeDistrict(listing.district, 'ru')}, Дананг` : 'Дананг';
  return `${verb}: ${type}${beds} — ${place}`;
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


function getShareableImage(images: string[]): string | undefined {
  return images.find(img => img && !img.includes('fbcdn.net') && !img.includes('facebook.com')) || images[0] || undefined;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const listings = await getAllListings();
  const listing = listings.find(l => l.slug === slug) ?? await getArchivedListing(slug);
  if (!listing) return { title: 'Не найдено' };
  const displayTitle = listing.ru_title || ruFallbackTitle(listing);
  const ogImage = getShareableImage(listing.images);
  const description = (listing.ru_text || listing.text).slice(0, 160) || `${listing.type} — ${listing.district}. ${listing.price}.`;
  return {
    title: displayTitle,
    description,
    alternates: {
      canonical: `https://danangmls.com/ru/listing/${slug}`,
      languages: {
        en: `https://danangmls.com/listing/${slug}`,
        ru: `https://danangmls.com/ru/listing/${slug}`,
        'x-default': `https://danangmls.com/listing/${slug}`,
      },
    },
    openGraph: {
      title: displayTitle,
      description,
      url: `https://danangmls.com/ru/listing/${slug}`,
      images: socialImages(ogImage, `${displayTitle} — DanangMLS`),
      type: 'website',
      locale: 'ru_RU',
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

export default async function RUListingPage({ params }: Props) {
  const { slug } = await params;
  const listings = await getAllListings();
  // Expired listings keep their URL — a 404 discards the indexing Google
  // already spent on it. Serve the archived copy at 200 with a banner.
  let listing = listings.find(l => l.slug === slug);
  let archived = false;
  if (!listing) {
    // Removed as a duplicate of another row? The property is still listed, just
    // under a different slug — send a real 308 to it rather than serving an
    // archived copy (duplicate content) or a soft 404.
    const to = await resolveListingRedirect(slug, s => listings.some(l => l.slug === s));
    if (to) permanentRedirect(`/ru/listing/${to}`);
    const fromArchive = await getArchivedListing(slug);
    if (fromArchive) { listing = fromArchive; archived = true; }
    else notFound();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: listing.title,
    description: listing.text || `${listing.type} — ${listing.district}`,
    url: `https://danangmls.com/ru/listing/${listing.slug}`,
    ...(listing.price && { price: listing.price }),
    ...(listing.images[0] && { image: listing.images[0] }),
    ...(schemaRooms(listing.type, listing.bedrooms) && { numberOfRooms: schemaRooms(listing.type, listing.bedrooms) }),
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
      { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: 'https://danangmls.com/ru' },
      { '@type': 'ListItem', position: 2, name: listing.forSale ? 'Mua Bán' : 'Cho Thuê', item: `https://danangmls.com/ru/${listing.forSale ? 'mua-ban' : 'thue'}` },
      { '@type': 'ListItem', position: 3, name: listing.title },
    ],
  };

  const agentSlug = await getAgentSlugForName(listing.agent);

  // Only shown when this agent's OWN post text named WhatsApp — never assumed;

  // see lib/agentChannels.ts. Unknown numbers fall back to Zalo + Message.

  const agentWhatsApp = listing.agentPhone ? await agentHasWhatsApp(listing.agentPhone) : false;

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
      <ListingDetail listing={listing} archived={archived} similarListings={getSimilarListings(listing, listings)} agentSlug={agentSlug} agentHasWhatsApp={agentWhatsApp} />
      {!listing.forSale && <RentalProcessVideo />}
    </div>
  );
}
