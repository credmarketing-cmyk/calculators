import type { Metadata } from "next";
import PipeVolumeCalculator from "@/components/calculators/pages/PipeVolumeCalculator";

export const metadata: Metadata = {
  title: "Pipe Volume Calculator | ZenTrades",
  description:
    "Quickly and accurately calculate pipe volume and fluid mass. Simplify your pipe design and installations with real results.",
};

export default function Page() {
  return <PipeVolumeCalculator />;
}
