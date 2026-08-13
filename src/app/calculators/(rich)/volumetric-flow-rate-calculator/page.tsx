import type { Metadata } from "next";
import VolumetricFlowRateCalculator from "@/components/calculators/pages/VolumetricFlowRateCalculator";

export const metadata: Metadata = {
  title: "Volumetric Flow Rate Calculator | ZenTrades",
  description:
    "Calculate flow rates precisely using our volumetric flow rate calculator. Fast, unit-flexible, and perfect for plumbing, HVAC, and fire safety pros.",
};

export default function Page() {
  return <VolumetricFlowRateCalculator />;
}
