import type { Metadata } from "next";
import PowerFactorCalculator from "@/components/calculators/pages/PowerFactorCalculator";

export const metadata: Metadata = {
  title: "Power Factor Calculator | ZenTrades",
  description:
    "Calculate power factor and apparent power accurately from true power, apparent power, or phase angle. Improve energy efficiency and reduce electrical losses.",
};

export default function Page() {
  return <PowerFactorCalculator />;
}
