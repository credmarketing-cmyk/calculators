import type { Metadata } from "next";
import AirConditionerBTUCalculator from "@/components/calculators/pages/AirConditionerBTUCalculator";

export const metadata: Metadata = {
  title: "Air Conditioner BTU Calculator | ZenTrades",
  description:
    "Find the perfect AC unit size for your space. Calculate the right BTU rating from room dimensions, sunlight, occupancy, and insulation quality.",
};

export default function Page() {
  return <AirConditionerBTUCalculator />;
}
