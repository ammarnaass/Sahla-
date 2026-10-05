/** @type {import('next').NextConfig} */
const nextConfig = {
  // i18n handled by next-intl middleware
  reactStrictMode: true,
  // Preserve node:sqlite and server packages from client bundle
  serverExternalPackages: ['node:sqlite'],
  // Image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
  },
  async rewrites() {
    return [
      {
        source: '/events',
        destination: '/api/events',
      },
    ];
  },
};

export default nextConfig;
