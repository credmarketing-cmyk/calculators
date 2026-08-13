import type { Metadata } from "next";
import HVACLoadCalculator from "@/components/calculators/pages/HVACLoadCalculator";

export const metadata: Metadata = {
  title: "HVAC Load Calculator | ZenTrades",
  description:
    "Accurately size HVAC systems with our free HVAC load calculator. Factors climate, insulation, sunlight, and more for reliable BTU results.",
};

export default function Page() {
  return <HVACLoadCalculator />;
}
