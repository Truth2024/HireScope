import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['www.dropbox.com'],
    // или используйте remotePatterns (рекомендуется для Next.js 12.3+):
  },
};

export default nextConfig;
