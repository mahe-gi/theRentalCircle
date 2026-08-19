import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'media.therentalcircle.in' },
      { protocol: 'https', hostname: 'therentalcircle.in' },
      { protocol: 'https', hostname: 'images.unsplash.com' }
    ],
  },
};

export default nextConfig;
