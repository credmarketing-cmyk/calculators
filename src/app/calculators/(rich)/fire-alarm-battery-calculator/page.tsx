import type { Metadata } from "next";
import FireAlarmBatteryCalculator from "@/components/calculators/pages/FireAlarmBatteryCalculator";

export const metadata: Metadata = {
  title: "Free Fire Alarm Battery Size Calculator",
  description:
    "Quickly size fire alarm standby batteries with our free calculator. Enter load and standby time to get accurate Ah capacity for compliant fire systems.",
};

export default function Page() {
  return <FireAlarmBatteryCalculator />;
}
