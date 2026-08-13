import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
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
};

export default nextConfig;
