import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    BLOG_NAME: process.env.BLOG_NAME,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
