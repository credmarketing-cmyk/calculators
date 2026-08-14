import Link from "next/link";
import { ArrowRight, Calculator, TrendingUp, Wrench } from "lucide-react";
import Reveal from "./Reveal";

const tools = [
  {
    icon: Calculator,
    title: "Calculators",
    description:
      "Free electrical, HVAC, fire safety and plumbing calculators to size systems, estimate costs and design projects faster.",
    cta: "Explore Calculators",
    href: "/calculators",
    external: false,
    iconWrap: "bg-brand/8 text-brand-dark",
    glow: "group-hover:shadow-[0_0_0_1px_var(--border-strong),0_20px_50px_-20px_var(--brand-glow)]",
  },
  {
    icon: TrendingUp,
    title: "ROI Calculator",
    description:
      "See the return on investment ZenTrades software delivers for your field service business.",
    cta: "Calculate ROI",
    href: "https://zentrades.pro/pricing",
    external: true,
    iconWrap: "bg-sky-50 text-sky-600",
    glow: "group-hover:shadow-[0_0_0_1px_rgba(14,165,233,0.25),0_20px_50px_-20px_rgba(14,165,233,0.3)]",
  },
];

export default function ToolsHub() {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black_40%,transparent_100%)]" />
      <div className="animate-float pointer-events-none absolute left-1/2 top-[-10rem] h-[36rem] w-[56rem] -translate-x-1/2 rounded-full bg-brand/12 blur-[120px]" />

      <div className="relative mx-auto max-w-5xl px-6 pb-24 pt-20 lg:px-8 lg:pt-28">
        <Reveal className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border-strong bg-surface/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-brand-dark shadow-[0_0_24px_-8px_var(--brand-glow)]">
            <Wrench className="h-3.5 w-3.5" />
            Tools For Trades
          </div>
          <h1 className="mt-6 text-balance text-4xl font-extrabold leading-[1.1] tracking-tight text-foreground sm:text-5xl">
            Free Tools for Trade Professionals
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-balance text-base leading-relaxed text-muted sm:text-lg">
            Pick a toolset built for contractors and engineers — size systems
            and estimate costs, or see what ZenTrades software could return
            for your business.
          </p>
        </Reveal>

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {tools.map(({ icon: Icon, title, description, cta, href, external, iconWrap, glow }, i) => (
            <Reveal key={title} delay={i * 120} className="h-full">
              <div
                className={`group relative flex h-full flex-col rounded-2xl border border-border bg-surface p-8 transition-all duration-300 hover:-translate-y-1.5 hover:border-border-strong ${glow}`}
              >
                <span
                  className={`flex h-12 w-12 items-center justify-center rounded-xl transition-transform duration-300 ease-out group-hover:-rotate-6 group-hover:scale-110 ${iconWrap}`}
                >
                  <Icon className="h-6 w-6" strokeWidth={2} />
                </span>

                <h2 className="mt-6 text-xl font-bold leading-snug text-foreground">
                  {title}
                </h2>
                <p className="mt-2.5 flex-1 text-sm leading-relaxed text-muted">
                  {description}
                </p>

                <Link
                  href={href}
                  {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="group/btn mt-8 inline-flex items-center justify-center gap-2 rounded-full border border-border-strong bg-background/60 py-3 text-sm font-semibold text-foreground transition-all duration-300 hover:border-brand hover:bg-brand hover:text-white hover:shadow-[0_8px_20px_-8px_var(--brand-glow)] active:scale-[0.97]"
                >
                  {cta}
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/btn:translate-x-1" />
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
