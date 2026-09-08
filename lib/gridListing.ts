import { Listing } from './types';

// The listings grids are client components that receive EVERY listing so they can
// filter/search instantly in the browser. Shipping the full listing objects for
// ~4,900 rows was ~26MB of HTML (dominated by 65k+ image URLs + full descriptions).
// toGridListing trims each listing to only what a grid CARD renders and what the
// client-side FILTERS read — capping images and truncating the search text. The
// listing DETAIL page still loads the full listing (all images, full text), so
// nothing is lost there.
//
// Card uses:   title, price, district, type, bedrooms, slug, forSale,
//              foreignEligible, foreignEligibleBuilding, images, vi_title
// Filters use: title, district, text (search + neighborhood), type, bedrooms,
//              price, neighborhood, foreignEligible
const GRID_IMAGE_CAP = 5;      // cards rarely need more; big payload cut
// Measured 2026-09-08: at 800 this field alone was 4.25MB of the 11.0MB /for-sale
// payload (38.8%) — the single largest thing on the wire. 300 keeps the opening of
// each description, which is where the searchable specifics live, and takes roughly
// 2MB off every grid load. The trade is that a term buried deep in a long listing
// description is no longer matched by the client-side filter.
const SEARCH_TEXT_CAP = 300;

export function toGridListing(l: Listing): Listing {
  return {
    ...l,
    images: l.images.slice(0, GRID_IMAGE_CAP),
    text: l.text.length > SEARCH_TEXT_CAP ? l.text.slice(0, SEARCH_TEXT_CAP) : l.text,
    // Fields not read by any card or filter — drop from the client payload.
    vi_text: '',
    agent: '',
    contact: '',
    postUrl: '',
    date: '',
    mlsUrl: '',
  };
}

export function toGridListings(listings: Listing[]): Listing[] {
  return listings.map(toGridListing);
}
