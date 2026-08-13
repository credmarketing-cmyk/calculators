export type CalculatorCategory = "Fire" | "Plumbing" | "Electrical" | "HVAC";

export interface Calculator {
  slug: string;
  title: string;
  description: string;
  category: CalculatorCategory;
}

export const calculators: Calculator[] = [
  {
    slug: "fire-alarm-battery-calculator",
    title: "Fire Alarm Battery Calculator",
    description:
      "Use our fire alarm battery calculator for free and know the suitable battery type for your fire alarm systems.",
    category: "Fire",
  },
  {
    slug: "power-factor-calculator",
    title: "Power Factor Calculator",
    description:
      "Use our free power factor calculator to calculate power factor and apparent power accurately. Improve energy efficiency and reduce electrical losses today.",
    category: "Electrical",
  },
  {
    slug: "air-conditioner-btu-calculator",
    title: "Air Conditioner BTU Calculator",
    description:
      "Use our free Air Conditioner BTU Calculator to find the perfect unit size for your space. Achieve accurate cooling power and save on energy bills.",
    category: "HVAC",
  },
  {
    slug: "fire-sprinkler-installation-cost-calculator",
    title: "Fire Sprinkler Installation Cost Calculator",
    description:
      "Use our free Fire Sprinkler Installation Cost Calculator. Get quick and accurate cost estimates for both residential and commercial projects.",
    category: "Fire",
  },
  {
    slug: "duct-static-pressure-calculator",
    title: "Duct Static Pressure Calculator",
    description:
      "Optimize HVAC efficiency with our Duct Static Pressure Calculator. Accurately calculate pressure drops, account for fittings, and ensure smooth operation.",
    category: "HVAC",
  },
  {
    slug: "pipe-volume-calculator",
    title: "Pipe Volume Calculator",
    description:
      "Use the Pipe Volume Calculator to quickly and accurately calculate pipe volume and fluid mass. Simplify your pipe design and installations with real results.",
    category: "Plumbing",
  },
  {
    slug: "flow-rate-calculator",
    title: "Volumetric Flow Rate Calculator",
    description:
      "Calculate flow rates precisely using our volumetric flow rate calculator. It is fast, unit-flexible, and perfect for plumbing, HVAC, and fire safety pros.",
    category: "Plumbing",
  },
  {
    slug: "hvac-load-calculator",
    title: "HVAC Load Calculator",
    description:
      "Accurately size HVAC systems with our free HVAC load calculator. Ideal for pros, it factors climate, insulation, sunlight, and more for reliable BTU results.",
    category: "HVAC",
  },
];

export const categories: CalculatorCategory[] = [
  "Fire",
  "Plumbing",
  "Electrical",
  "HVAC",
];
