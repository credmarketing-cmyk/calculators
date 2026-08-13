import { Mail } from "lucide-react";
import Reveal from "./Reveal";
import NewsletterForm from "./NewsletterForm";

export default function Newsletter() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
      <Reveal
        as="div"
        className="relative overflow-hidden rounded-3xl border border-border-strong bg-surface px-6 py-16 text-center sm:px-12"
      >
        <div className="animate-float pointer-events-none absolute left-1/2 top-1/2 h-[36rem] w-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/10 blur-[140px]" />
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-40 [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,black_20%,transparent_100%)]" />

        <div className="relative">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-border-strong bg-background/60 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-brand-dark transition-transform duration-300 hover:scale-105">
            <Mail className="h-3.5 w-3.5" />
            Newsletter
          </div>

          <h2 className="mx-auto mt-6 max-w-xl text-balance text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            The Kind Of{" "}
            <span className="bg-gradient-to-r from-brand to-brand-dark bg-clip-text text-transparent">
              Newsletter
            </span>{" "}
            You Don&apos;t Ignore.
          </h2>

          <p className="mx-auto mt-4 max-w-lg text-balance text-sm leading-relaxed text-muted sm:text-base">
            Join{" "}
            <span className="font-semibold text-brand-dark">
              5000+ professionals
            </span>{" "}
            who receive weekly insights on the latest codes, technologies,
            and best practices in field service industries.
          </p>

          <div className="mx-auto mt-8 max-w-md">
            <NewsletterForm />
          </div>
        </div>
      </Reveal>
    </section>
  );
}
