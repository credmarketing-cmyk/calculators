import type { Metadata } from "next";
import FireSprinklerCostCalculator from "@/components/calculators/pages/FireSprinklerCostCalculator";

export const metadata: Metadata = {
  title: "Fire Sprinkler System Installation Cost Calculator | ZenTrades",
  description:
    "Get a quick, accurate fire sprinkler installation estimate for residential and commercial projects — built on NFPA 13, 13R and 13D design logic.",
};

export default function Page() {
  return <FireSprinklerCostCalculator />;
}
