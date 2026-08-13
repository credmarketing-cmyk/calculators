"use client";

import type { ReactNode } from "react";

export function CalculatorField({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-foreground">{label}</span>
      {hint && <span className="mt-0.5 block text-xs text-muted">{hint}</span>}
      <div className="mt-2">{children}</div>
    </label>
  );
}

export function NumberInput({
  value,
  onChange,
  min,
  step,
  suffix,
}: {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  step?: number;
  suffix?: string;
}) {
  return (
    <div className="relative">
      <input
        type="number"
        inputMode="decimal"
        value={Number.isFinite(value) ? value : ""}
        min={min}
        step={step ?? "any"}
        onChange={(e) => onChange(e.target.valueAsNumber)}
        className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 pr-16 text-sm font-medium text-foreground outline-none transition-all duration-200 focus:border-brand focus:shadow-[0_0_0_3px_var(--brand-glow)]"
      />
      {suffix && (
        <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted">
          {suffix}
        </span>
      )}
    </div>
  );
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { label: string; value: T }[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <div className="inline-flex rounded-xl border border-border bg-background p-1">
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all duration-200 ${
              active
                ? "bg-gradient-to-r from-brand to-brand-dark text-white shadow-[0_4px_14px_-6px_var(--brand-glow)]"
                : "text-muted hover:text-foreground"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
