/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  experimental: {
    serverActions: true,
  },
  images: { domains: ["cdn.discordapp.com"] },
};

module.exports = nextConfig;
