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

/**
 * Twitter card images are NOT picked up from a sibling `openGraph` block — the root
 * layout's `twitter.images` default wins instead. So a page that ships a real photo
 * must set BOTH, or it silently shares the site logo.
 *
 * That is exactly what happened: the 2026-09-04 OG pass added a `twitter.images`
 * default in app/layout.tsx, and from then on every shared listing and agent link
 * previewed as the generic logo even though `og:image` was correct (Blake, 2026-09-05).
 *
 * Also falls back to the site default rather than an empty array — an empty
 * `images: []` ships no og:image at all while `twitter:card` promises one.
 */
export function socialImages(url: string | undefined | null, alt: string) {
  return url ? [{ url, alt }] : OG_DEFAULT_IMAGES;
}
