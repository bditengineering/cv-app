/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.fallback = { fs: false };

    return config;
  },
  reactStrictMode: true,
  swcMinify: false,
  experimental: {
    appDir: true,
  },
  productionBrowserSourceMaps: true,
};

module.exports = nextConfig;
