import type { Metadata } from "next";
import FireAlarmBatteryCalculator from "@/components/calculators/pages/FireAlarmBatteryCalculator";

export const metadata: Metadata = {
  title: "Fire Alarm Battery Calculator | ZenTrades",
  description:
    "Determine the needed battery size in ampere-hours quickly and confidently, built on NFPA 72 standby and alarm load calculations.",
};

export default function Page() {
  return <FireAlarmBatteryCalculator />;
}
