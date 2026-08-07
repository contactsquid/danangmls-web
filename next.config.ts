import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
