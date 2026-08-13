import type { Metadata } from "next";
import FireSprinklerCostCalculator from "@/components/calculators/pages/FireSprinklerCostCalculator";

export const metadata: Metadata = {
  title: "Fire Sprinkler Installation Cost Calculator Free",
  description:
    "Get quick fire sprinkler installation cost ranges for residential and commercial projects. Enter area, hazard level, and labor to estimate budgets instantly.",
};

export default function Page() {
  return <FireSprinklerCostCalculator />;
}
