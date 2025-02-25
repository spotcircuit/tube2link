/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  images: {
    domains: ['i.ytimg.com', 'img.youtube.com'],
    unoptimized: false, // Enable image optimization for production
  },
  eslint: {
    ignoreDuringBuilds: false, // Enable ESLint checking during builds
  },
  typescript: {
    ignoreBuildErrors: false, // Enable TypeScript checking during builds
  },
  poweredByHeader: false, // Remove X-Powered-By header for security
  compress: true, // Enable compression
  generateEtags: true, // Enable ETags for caching
  productionBrowserSourceMaps: false, // Disable source maps in production for better performance
};

module.exports = nextConfig;
