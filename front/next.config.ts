import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  typescript: {
    // ignoreBuildErrors: true,
  },
  // Désactive l'overlay et les indicateurs de développement
  devIndicators: {
    position: 'bottom-right',
  },
};

export default nextConfig;
