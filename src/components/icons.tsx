import { Flame, Droplets, Zap, Wind, type LucideIcon } from "lucide-react";
import type { CalculatorCategory } from "@/data/calculators";

export const categoryIcon: Record<CalculatorCategory, LucideIcon> = {
  Fire: Flame,
  Plumbing: Droplets,
  Electrical: Zap,
  HVAC: Wind,
};

export const categoryStyles: Record<
  CalculatorCategory,
  { badge: string; iconWrap: string; glow: string }
> = {
  Fire: {
    badge: "bg-orange-50 text-orange-700 border-orange-200",
    iconWrap: "bg-orange-50 text-orange-600",
    glow: "group-hover:shadow-[0_0_0_1px_rgba(249,115,22,0.25),0_16px_40px_-16px_rgba(249,115,22,0.3)]",
  },
  Plumbing: {
    badge: "bg-sky-50 text-sky-700 border-sky-200",
    iconWrap: "bg-sky-50 text-sky-600",
    glow: "group-hover:shadow-[0_0_0_1px_rgba(14,165,233,0.25),0_16px_40px_-16px_rgba(14,165,233,0.3)]",
  },
  Electrical: {
    badge: "bg-amber-50 text-amber-700 border-amber-200",
    iconWrap: "bg-amber-50 text-amber-600",
    glow: "group-hover:shadow-[0_0_0_1px_rgba(245,158,11,0.25),0_16px_40px_-16px_rgba(245,158,11,0.3)]",
  },
  HVAC: {
    badge: "bg-brand/8 text-brand-dark border-brand/25",
    iconWrap: "bg-brand/8 text-brand-dark",
    glow: "group-hover:shadow-[0_0_0_1px_var(--border-strong),0_16px_40px_-16px_var(--brand-glow)]",
  },
};
