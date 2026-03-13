import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'dummyimage.com',
      },
      {
        protocol: 'https',
        hostname: 'rickandmortyapi.com',
      },
    ],
    minimumCacheTTL: 3600,
    formats: ['image/webp'],
  },
};

export default nextConfig;