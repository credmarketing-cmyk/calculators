import type { Metadata } from "next";
import PipeVolumeCalculator from "@/components/calculators/pages/PipeVolumeCalculator";

export const metadata: Metadata = {
  title: "Pipe Volume Calculator | Fluid Capacity",
  description:
    "Instantly find pipe volume and fluid capacity by length and diameter. Ideal for plumbers and engineers planning fills, drains and system designs.",
};

export default function Page() {
  return <PipeVolumeCalculator />;
}
