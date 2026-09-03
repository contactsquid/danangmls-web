/**
 * Site-wide default Open Graph image.
 *
 * Next replaces the parent `openGraph` object wholesale when a route defines its
 * own — inherited fields are NOT merged in (see the generate-metadata docs:
 * "All openGraph fields ... are inherited ... because the page doesn't set
 * openGraph metadata"). So every page that declares `openGraph` must spread this
 * in explicitly, or it ships a card with no image while `twitter:card` is
 * `summary_large_image`.
 *
 * Listing and agent pages deliberately override this with their own photo.
 */
export const OG_DEFAULT_IMAGE = {
  url: '/og-default.jpg',
  width: 1200,
  height: 630,
  alt: 'DanangMLS — houses and apartments for rent and sale in Da Nang, Vietnam',
} as const;

export const OG_DEFAULT_IMAGES = [OG_DEFAULT_IMAGE];
