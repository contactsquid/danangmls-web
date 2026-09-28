import type { NextConfig } from "next";

// Property types were cut to Apartment / Commercial / House / Villa (+ Land for
// sale) on 2026-09-28 (lib/propertyTypes.ts). The retired type pages move
// permanently so their rankings follow: townhouses and shophouses are houses,
// hotels/offices/retail are commercial, land for rent is
// commercial. /studio is the studio-apartments page (a bedrooms facet), not a
// retired type. ko/ru reuse the English slugs.
const RETIRED_EN: Record<string, string> = {
  townhouse: 'house', shophouse: 'house', hotel: 'commercial', office: 'commercial', retail: 'commercial',
};
const RETIRED_VI: Record<string, string> = {
  'nha-pho': 'nha', shophouse: 'nha', 'van-phong': 'thuong-mai', 'mat-bang': 'thuong-mai',
};
const RETIRED_TYPE_REDIRECTS = [
  ...['/for-rent', '/for-sale', '/ko/for-rent', '/ko/for-sale', '/ru/for-rent', '/ru/for-sale'].flatMap(base =>
    Object.entries(RETIRED_EN).map(([from, to]) => ({ source: `${base}/${from}`, destination: `${base}/${to}`, permanent: true }))),
  ...['/vi/thue', '/vi/mua-ban'].flatMap(base =>
    Object.entries(RETIRED_VI).map(([from, to]) => ({ source: `${base}/${from}`, destination: `${base}/${to}`, permanent: true }))),
  // Land for rent is commercial.
  { source: '/for-rent/land', destination: '/for-rent/commercial', permanent: true },
  { source: '/ko/for-rent/land', destination: '/ko/for-rent/commercial', permanent: true },
  { source: '/ru/for-rent/land', destination: '/ru/for-rent/commercial', permanent: true },
  { source: '/vi/thue/dat', destination: '/vi/thue/thuong-mai', permanent: true },
];

const nextConfig: NextConfig = {
  experimental: {
    // Next defaults the client-side Router Cache for DYNAMIC segments to 0, so
    // every navigation refetches the whole segment. Measured on production:
    // going /for-rent -> /for-sale -> /for-rent -> /for-sale re-downloaded
    // 1.38MB (brotli) and took 3.1s, 3.5s, 3.4s — the repeat visits cost exactly
    // as much as the first. These grids are big and change on the order of
    // hours, and the server already caches sheet data for 10 minutes, so holding
    // a fetched segment for 5 minutes within a session is well inside the
    // staleness the site already has. A reload still bypasses it entirely.
    staleTimes: {
      dynamic: 300,
      static: 300,
    },
    serverActions: {
      // Agent profile photos are submitted through a Server Action, and the
      // default cap is 1MB — smaller than a phone photo. The action itself
      // rejects anything over 5MB with a readable error; the extra megabyte of
      // headroom here is for multipart overhead.
      bodySizeLimit: '6mb',
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  async redirects() {
    // The short-lived type pages were folded into the unified facet system.
    return [
      { source: '/houses-for-rent', destination: '/for-rent/house', permanent: true },
      { source: '/apartments-for-rent', destination: '/for-rent/apartment', permanent: true },
      { source: '/vi/thue-nha', destination: '/vi/thue/nha', permanent: true },
      { source: '/vi/thue-can-ho', destination: '/vi/thue/can-ho', permanent: true },
      ...RETIRED_TYPE_REDIRECTS,
    ];
  },
  async headers() {
    // Baseline security headers — previously unset sitewide.
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },
};

export default nextConfig;
