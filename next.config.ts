import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['xn----gtbbdmbd2ae5b.xn--p1ai'],
    // или используйте remotePatterns (рекомендуется для Next.js 12.3+):
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'xn----gtbbdmbd2ae5b.xn--p1ai',
        port: '',
        pathname: '/api/media/**',
      },
    ],
  },
};

export default nextConfig;
