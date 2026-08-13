import type { Metadata } from "next";
import HVACLoadCalculator from "@/components/calculators/pages/HVACLoadCalculator";

export const metadata: Metadata = {
  title: "Free HVAC Load Calculator for Contractors",
  description:
    "Accurately size HVAC systems by calculating heating and cooling loads. Enter building details to get BTU and tonnage for reliable, efficient designs.",
};

export default function Page() {
  return <HVACLoadCalculator />;
}
