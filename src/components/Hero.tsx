import Link from "next/link";
import { ArrowRight, Wrench } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black_40%,transparent_100%)]" />
      <div className="animate-float pointer-events-none absolute left-1/2 top-[-10rem] h-[36rem] w-[56rem] -translate-x-1/2 rounded-full bg-brand/12 blur-[120px]" />
      <div
        className="animate-float pointer-events-none absolute right-[-10rem] top-40 h-72 w-72 rounded-full bg-brand-2/10 blur-[100px]"
        style={{ animationDelay: "1.2s" }}
      />

      <div className="relative mx-auto max-w-5xl px-6 pb-24 pt-20 text-center lg:px-8 lg:pt-28">
        <div className="animate-fade-up group inline-flex items-center gap-2 rounded-full border border-border-strong bg-surface/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-brand-dark shadow-[0_0_24px_-8px_var(--brand-glow)] transition-transform duration-300 hover:scale-105">
          <Wrench className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-rotate-12" />
          Tools For Trades
        </div>

        <h1
          className="animate-fade-up mt-6 text-balance text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl"
          style={{ animationDelay: "80ms" }}
        >
          <span className="bg-gradient-to-r from-brand to-brand-dark bg-clip-text text-transparent">
            Calculators For
          </span>{" "}
          <span className="text-foreground">Field Service Pros</span>
        </h1>

        <p
          className="animate-fade-up mx-auto mt-6 max-w-2xl text-balance text-base leading-relaxed text-muted sm:text-lg"
          style={{ animationDelay: "160ms" }}
        >
          Access 50+ specialized calculators designed by experts. From
          financial planning to engineering calculations, get accurate
          results in seconds with our professional-grade tools.
        </p>

        <div
          className="animate-fade-up mt-10 flex items-center justify-center"
          style={{ animationDelay: "240ms" }}
        >
          <Link
            href="#custom"
            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-brand to-brand-dark px-8 py-3.5 text-sm font-bold text-white shadow-[0_8px_30px_-8px_var(--brand-glow)] transition-transform duration-300 hover:scale-[1.04] hover:shadow-[0_12px_36px_-8px_var(--brand-glow)] active:scale-[0.97]"
          >
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />
            <span className="relative">Request Calculator</span>
            <ArrowRight className="relative h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
