import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "media.shamblesroom.com",
        pathname: "/Items/**"
      },
      {
        protocol: "https",
        hostname: "demo.jellyfin.org",
        pathname: "/stable/Items/**"
      },
    ],
  },
};

export default nextConfig;
