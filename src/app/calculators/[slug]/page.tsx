import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { calculators } from "@/data/calculators";
import { calculatorRegistry } from "@/data/calculatorRegistry";
import CalculatorShell from "@/components/calculators/CalculatorShell";
import ComingSoon from "@/components/calculators/ComingSoon";

// Calculators that have graduated to their own dedicated route (with the
// richer editorial page design) live under src/app/calculators/<slug>/ and
// must be excluded here so the two routes don't collide.
const MIGRATED_SLUGS = new Set([
  "fire-sprinkler-installation-cost-calculator",
  "fire-alarm-battery-calculator",
  "power-factor-calculator",
  "air-conditioner-btu-calculator",
  "duct-static-pressure-calculator",
  "pipe-volume-calculator",
  "flow-rate-calculator",
  "hvac-load-calculator",
]);

export function generateStaticParams() {
  return calculators
    .filter((c) => !MIGRATED_SLUGS.has(c.slug))
    .map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const calculator = calculators.find((c) => c.slug === slug);
  if (!calculator) return {};

  return {
    title: `${calculator.title} | ZenTrades`,
    description: calculator.description,
  };
}

export default async function CalculatorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (MIGRATED_SLUGS.has(slug)) notFound();
  const calculator = calculators.find((c) => c.slug === slug);
  if (!calculator) notFound();

  const Tool = calculatorRegistry[slug];

  return (
    <CalculatorShell calculator={calculator}>
      {Tool ? <Tool /> : <ComingSoon title={calculator.title} />}
    </CalculatorShell>
  );
}
