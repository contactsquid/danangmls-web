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
  // Rentals only, from Sheet1 col Y (written by n8n from the RAW post text before
  // enrichment rewrites it). Normalised to 9 local digits, or '' when unknown —
  // ~92% of sub-floor rentals have one. Used to hand sub-floor leads to the agent.
  agentPhone?:  string;
  forSale:      boolean;
  foreignEligible?: boolean;        // For Sale only — true if in a known foreign-approved building
  foreignEligibleBuilding?: string; // Building name for the badge tooltip
  // Map placement, computed in lib/sheets.ts by lib/geo/placement.ts:
  // [lat, lng, precision] with precision 0 building / 1 street / 2 ward / 3 district /
  // 4 near a building (see PRECISION in lib/geo/placement.ts).
  // Absent when the listing has no usable district (not mapped).
  geo?:         [number, number, number];
  geoLabel?:    string; // building / street / ward name; '' for district precision
  geoArea?:     string; // ward key the pin is confined to ('' = its district); the map nudging honours it
}
