import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    BLOG_NAME: process.env.BLOG_NAME,
  },
};

export default nextConfig;
