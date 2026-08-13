import type { Metadata } from "next";
import DuctStaticPressureCalculator from "@/components/calculators/pages/DuctStaticPressureCalculator";

export const metadata: Metadata = {
  title: "Duct Static Pressure Calculator | HVAC Tool",
  description:
    "Calculate duct static pressure and airflow to diagnose HVAC issues. Use this free tool to balance systems, reduce noise and improve performance.",
};

export default function Page() {
  return <DuctStaticPressureCalculator />;
}
