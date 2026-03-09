import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  /* config options here */

  images: {
    domains: ['www.dropbox.com', 'dl.dropboxusercontent.com', 'randomuser.me'],
    // или используйте remotePatterns (рекомендуется для Next.js 12.3+):
  },
};
const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
