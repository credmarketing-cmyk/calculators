import type { Metadata } from "next";
import CalculatorGrid from "@/components/CalculatorGrid";

export const metadata: Metadata = {
  title: "All Trade Calculators | ToolsForTrades",
  description:
    "Browse free online calculators for HVAC load, fire alarm batteries, sprinklers, pipe volume, flow rate and more. Save time on every estimate and design.",
};

export default function CalculatorsIndexPage() {
  return (
    <div className="min-h-screen bg-background">
      <main>
        <CalculatorGrid />
      </main>
    </div>
  );
}
