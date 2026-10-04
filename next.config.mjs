/** @type {import('next').NextConfig} */
const nextConfig = {
  // i18n handled by next-intl middleware
  reactStrictMode: true,
  // Preserve the legacy server.js from the build
  serverExternalPackages: [],
  // Image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
  },
};

export default nextConfig;
