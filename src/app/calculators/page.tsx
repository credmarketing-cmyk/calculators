import type { Metadata } from "next";
import Hero from "@/components/Hero";
import CalculatorGrid from "@/components/CalculatorGrid";
import CustomCalculatorCTA from "@/components/CustomCalculatorCTA";
import Newsletter from "@/components/Newsletter";

export const metadata: Metadata = {
  title: "All Trade Calculators | ToolsForTrades",
  description:
    "Browse free online calculators for HVAC load, fire alarm batteries, sprinklers, pipe volume, flow rate and more. Save time on every estimate and design.",
};

export default function CalculatorsIndexPage() {
  return (
    <div className="min-h-screen bg-background">
      <main>
        <Hero />
        <CalculatorGrid />
        <CustomCalculatorCTA />
        <Newsletter />
      </main>
    </div>
  );
}
