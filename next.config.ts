import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/calculators/volumetric-flow-rate-calculator",
        destination: "/calculators/flow-rate-calculator",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
