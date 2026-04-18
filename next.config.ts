import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
    resolveAlias: {
      tailwindcss: path.join(process.cwd(), "node_modules/tailwindcss"),
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "komteksky.norkart.no",
        pathname: "/MinRenovasjon.Api/**",
      },
    ],
  },
};

export default nextConfig;
