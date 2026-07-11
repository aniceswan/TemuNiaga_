/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@temuniaga/ui", "@temuniaga/database", "@temuniaga/contracts", "@temuniaga/shared-types"],
};

module.exports = nextConfig;
