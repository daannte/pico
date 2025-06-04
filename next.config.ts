import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "media.shamblesroom.com",
        pathname: "/Items/**"
      },
    ],
  },
};

export default nextConfig;
