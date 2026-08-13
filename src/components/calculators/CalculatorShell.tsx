import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Calculator } from "@/data/calculators";
import { categoryIcon, categoryStyles } from "@/components/icons";
import { cn } from "@/lib/utils";

export default function CalculatorShell({
  calculator,
  children,
}: {
  calculator: Calculator;
  children: React.ReactNode;
}) {
  const Icon = categoryIcon[calculator.category];
  const styles = categoryStyles[calculator.category];

  return (
    <div className="min-h-screen bg-background">
      <div className="relative overflow-hidden border-b border-border">
        <div className="pointer-events-none absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,black_30%,transparent_100%)]" />
        <div className="animate-float pointer-events-none absolute left-1/2 top-[-8rem] h-[28rem] w-[44rem] -translate-x-1/2 rounded-full bg-brand/10 blur-[110px]" />

        <div className="relative mx-auto max-w-4xl px-6 pb-14 pt-10 lg:px-8">
          <Link
            href="/calculators#calculators"
            className="group inline-flex items-center gap-1.5 text-sm font-semibold text-muted transition-colors hover:text-brand-dark"
          >
            <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
            All Calculators
          </Link>

          <div className="mt-6 flex items-start gap-4">
            <span
              className={cn(
                "flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl",
                styles.iconWrap
              )}
            >
              <Icon className="h-7 w-7" strokeWidth={2} />
            </span>
            <div>
              <span
                className={cn(
                  "inline-block rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide",
                  styles.badge
                )}
              >
                {calculator.category}
              </span>
              <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                {calculator.title}
              </h1>
              <p className="mt-2 max-w-2xl text-balance text-base leading-relaxed text-muted">
                {calculator.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-6 py-14 lg:px-8">{children}</div>
    </div>
  );
}
