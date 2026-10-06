import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export', // every page pre-rendered to HTML in /out
  trailingSlash: false, // /about, /buy: matches the live site's URLs
  images: { unoptimized: true }, // images are pre-optimized by scripts/optimize-images.mjs
  productionBrowserSourceMaps: false,
};

export default nextConfig;
