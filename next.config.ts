import type { NextConfig } from "next";

const DEFAULT_API_URL = 'http://localhost:4000/api';
const backendApiUrl = (process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_URL).replace(/\/+$/, '');

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    agentFeedback: true,
  },
  reactCompiler: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async rewrites() {
    if (backendApiUrl.startsWith('http://') || backendApiUrl.startsWith('https://')) {
      return [
        {
          source: '/api/:path*',
          destination: `${backendApiUrl}/:path*`,
        },
      ];
    }
    return [];
  },
};

export default nextConfig;

import('@opennextjs/cloudflare').then(m => m.initOpenNextCloudflareForDev());
