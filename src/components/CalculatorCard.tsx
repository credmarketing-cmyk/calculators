"use client";

import Link from "next/link";
import { useRef, type MouseEvent } from "react";
import { ArrowRight } from "lucide-react";
import type { Calculator } from "@/data/calculators";
import { categoryIcon, categoryStyles } from "./icons";
import { cn } from "@/lib/utils";

export default function CalculatorCard({ calculator }: { calculator: Calculator }) {
  const Icon = categoryIcon[calculator.category];
  const styles = categoryStyles[calculator.category];
  const cardRef = useRef<HTMLDivElement>(null);

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--spot-x", `${e.clientX - rect.left}px`);
    el.style.setProperty("--spot-y", `${e.clientY - rect.top}px`);
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className={cn(
        "spotlight group relative flex h-full flex-col rounded-2xl border border-border bg-surface p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-border-strong",
        styles.glow
      )}
    >
      <div className="flex items-start justify-between">
        <span
          className={cn(
            "flex h-11 w-11 items-center justify-center rounded-xl transition-transform duration-300 ease-out group-hover:-rotate-6 group-hover:scale-110",
            styles.iconWrap
          )}
        >
          <Icon className="h-5 w-5" strokeWidth={2} />
        </span>
        <span
          className={cn(
            "rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide",
            styles.badge
          )}
        >
          {calculator.category}
        </span>
      </div>

      <h3 className="mt-5 text-lg font-bold leading-snug text-foreground">
        {calculator.title}
      </h3>
      <p className="mt-2.5 flex-1 text-sm leading-relaxed text-muted">
        {calculator.description}
      </p>

      <Link
        href={`/calculators/${calculator.slug}`}
        className="group/btn mt-6 inline-flex items-center justify-center gap-2 rounded-full border border-border-strong bg-background/60 py-2.5 text-sm font-semibold text-foreground transition-all duration-300 hover:border-brand hover:bg-brand hover:text-white hover:shadow-[0_8px_20px_-8px_var(--brand-glow)] active:scale-[0.97]"
      >
        Calculate Now
        <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/btn:translate-x-1" />
      </Link>
    </div>
  );
}
