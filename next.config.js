/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
        pathname: '/**',
      },
    ],
  },
  transpilePackages: ['debug', 'supports-color'],
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      'supports-color': false,
    };
    return config;
  },
}

module.exports = nextConfig
