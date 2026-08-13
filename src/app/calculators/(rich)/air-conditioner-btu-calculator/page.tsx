import type { Metadata } from "next";
import AirConditionerBTUCalculator from "@/components/calculators/pages/AirConditionerBTUCalculator";

export const metadata: Metadata = {
  title: "Air Conditioner BTU Calculator | Free Tool",
  description:
    "Estimate the right AC BTU capacity for any room. Factor area, climate, and insulation to avoid oversizing, cut energy bills, and improve comfort.",
};

export default function Page() {
  return <AirConditionerBTUCalculator />;
}
