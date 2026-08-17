import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/calculators/volumetric-flow-rate-calculator",
        destination: "/calculators/flow-rate-calculator",
        permanent: true,
      },
      {
        // Some browsers request /favicon.ico directly regardless of the
        // <link rel="icon"> tag; forward it to the generated icon route.
        source: "/favicon.ico",
        destination: "/icon",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
