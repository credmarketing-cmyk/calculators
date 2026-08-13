"use client";

import { useMemo, useState } from "react";
import { calculators, categories, type CalculatorCategory } from "@/data/calculators";
import CalculatorCard from "./CalculatorCard";
import Reveal from "./Reveal";
import { cn } from "@/lib/utils";

type Filter = "All" | CalculatorCategory;

export default function CalculatorGrid() {
  const [active, setActive] = useState<Filter>("All");

  const counts = useMemo(() => {
    const map = new Map<Filter, number>();
    map.set("All", calculators.length);
    categories.forEach((cat) => {
      map.set(cat, calculators.filter((c) => c.category === cat).length);
    });
    return map;
  }, []);

  const filtered = useMemo(
    () =>
      active === "All"
        ? calculators
        : calculators.filter((c) => c.category === active),
    [active]
  );

  const filters: Filter[] = ["All", ...categories];

  return (
    <section id="calculators" className="relative mx-auto max-w-7xl px-6 py-24 lg:px-8">
      <Reveal className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          Choose Your Calculator
        </h2>
        <p className="mt-4 text-balance text-base leading-relaxed text-muted">
          Select from our comprehensive collection of professional
          calculators, each designed to deliver accurate results for your
          specific needs.
        </p>
      </Reveal>

      <Reveal
        delay={120}
        as="div"
        className="mt-10 flex flex-wrap items-center justify-center gap-2.5"
      >
        <div role="tablist" aria-label="Filter calculators by trade" className="contents">
          {filters.map((filter) => {
            const isActive = active === filter;
            return (
              <button
                key={filter}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActive(filter)}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-all duration-300 active:scale-95",
                  isActive
                    ? "border-transparent bg-gradient-to-r from-brand to-brand-dark text-white shadow-[0_6px_20px_-6px_var(--brand-glow)]"
                    : "border-border bg-surface text-muted hover:-translate-y-0.5 hover:border-border-strong hover:text-foreground hover:shadow-[0_6px_16px_-10px_rgba(28,20,23,0.3)]"
                )}
              >
                {filter}
                <span
                  key={`${filter}-${counts.get(filter)}`}
                  className={cn(
                    "animate-pop flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[11px] font-bold",
                    isActive ? "bg-white/20 text-white" : "bg-brand/12 text-brand-dark"
                  )}
                >
                  {counts.get(filter)}
                </span>
              </button>
            );
          })}
        </div>
      </Reveal>

      <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {filtered.map((calculator, i) => (
          <Reveal key={calculator.slug} delay={(i % 4) * 90} className="h-full">
            <CalculatorCard calculator={calculator} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
