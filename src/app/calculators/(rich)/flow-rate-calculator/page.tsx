import type { Metadata } from "next";
import VolumetricFlowRateCalculator from "@/components/calculators/pages/VolumetricFlowRateCalculator";

export const metadata: Metadata = {
  title: "Flow Rate Calculator for Piping Systems",
  description:
    "Calculate flow rate, velocity and cross-sectional area for pipes. Improve pump sizing, line design and process efficiency with this free calculator.",
};

export default function Page() {
  return <VolumetricFlowRateCalculator />;
}
