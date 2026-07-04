import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "dev.voc2048.com" },
      { protocol: "https", hostname: "ouob.voc2048.com" },
      { protocol: "https", hostname: "localhost" },
    ],
  },
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
};

export default nextConfig;
