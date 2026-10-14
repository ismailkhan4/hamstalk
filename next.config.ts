import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/sw.js",
        headers: [
          {
            key: "Cache-Control",
            value: "no-cache, no-store, must-revalidate",
          },
          { key: "Content-Type", value: "text/javascript; charset=utf-8" },
        ],
      },
    ]
  },
  turbopack: {
    root: import.meta.dirname,
  },
}

export default nextConfig
