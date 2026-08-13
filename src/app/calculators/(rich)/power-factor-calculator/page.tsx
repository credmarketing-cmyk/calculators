import type { Metadata } from "next";
import PowerFactorCalculator from "@/components/calculators/pages/PowerFactorCalculator";

export const metadata: Metadata = {
  title: "Power Factor Calculator for Electricians",
  description:
    "Calculate power factor, real power and apparent power in seconds. Improve efficiency, reduce losses, and optimize electrical systems with this free tool.",
};

export default function Page() {
  return <PowerFactorCalculator />;
}
