import type { Metadata } from "next";
import DuctStaticPressureCalculator from "@/components/calculators/pages/DuctStaticPressureCalculator";

export const metadata: Metadata = {
  title: "Duct Static Pressure Calculator | ZenTrades",
  description:
    "Optimize HVAC efficiency with our Duct Static Pressure Calculator. Accurately calculate pressure drops, account for fittings, and ensure smooth operation.",
};

export default function Page() {
  return <DuctStaticPressureCalculator />;
}
