import type { NextConfig } from "next";

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
