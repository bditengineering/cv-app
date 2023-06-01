/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    try {
      config.resolve.fallback = { fs: false };
    } catch (e) { }

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
