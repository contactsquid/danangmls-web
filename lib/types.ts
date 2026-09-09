export interface Listing {
  title:        string;
  text:         string;
  price:        string;
  district:     string;
  bedrooms:     string;
  type:         string;
  agent:        string;
  images:       string[];
  contact:      string;
  postUrl:      string;
  date:         string;
  mlsUrl:       string;
  slug:         string;
  neighborhood: string;
  vi_title:     string;
  vi_text:      string;
  // Written by the n8n enrichment from 2026-09-09, and backfilled over older rows
  // by scripts/backfill-listing-langs.js. Empty on anything not yet processed —
  // read them through localizedTitle/localizedText, which fall back to English.
  ko_title:     string;
  ko_text:      string;
  ru_title:     string;
  ru_text:      string;
  forSale:      boolean;
  foreignEligible?: boolean;        // For Sale only — true if in a known foreign-approved building
  foreignEligibleBuilding?: string; // Building name for the badge tooltip
}
