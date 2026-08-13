import { Zap, Wrench, Clock3, Cloud } from "lucide-react";
import Reveal from "./Reveal";
import RequestCalculatorForm from "./RequestCalculatorForm";

const reasons = [
  {
    icon: Zap,
    title: "Get Answers Fast",
    body: "Skip the spreadsheets. Our tools give you instant, accurate results built for your day-to-day.",
  },
  {
    icon: Wrench,
    title: "Designed for the Real World",
    body: "Built with input from real tradespeople to get you tools that save time.",
  },
  {
    icon: Clock3,
    title: "Up and Running On The Same Day",
    body: "Tell us what you need, and we'll turn it into a working calculator fast.",
  },
  {
    icon: Cloud,
    title: "No Setup Needed",
    body: "We host everything. You just share the link or use it right on our site.",
  },
];

export default function CustomCalculatorCTA() {
  return (
    <section id="custom" className="relative overflow-hidden border-y border-border py-24">
      <div className="pointer-events-none absolute left-1/2 top-0 h-full w-full max-w-5xl -translate-x-1/2 bg-[radial-gradient(ellipse_50%_50%_at_50%_0%,var(--brand-glow),transparent_70%)] opacity-40" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Need a Custom Calculator?
          </h2>
          <p className="mt-4 text-balance text-base leading-relaxed text-muted">
            Our team of experts can create specialized calculators tailored
            to your industry needs. Contact us to discuss your requirements
            and get a free consultation.
          </p>
        </Reveal>

        <div className="mt-16 grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-start lg:gap-16">
          {/* Custom-styled request form, submitted via HubSpot's Forms API */}
          <Reveal delay={100} className="mx-auto w-full max-w-lg lg:mx-0 lg:max-w-none">
            <RequestCalculatorForm />
          </Reveal>

          {/* Reasons */}
          <Reveal delay={200}>
            <p className="text-xs font-bold uppercase tracking-widest text-brand-dark">
              Why Field Service Pros Use Our Calculators
            </p>
            <ul className="mt-6 space-y-6">
              {reasons.map(({ icon: Icon, title, body }, i) => (
                <Reveal key={title} as="li" delay={260 + i * 90} className="flex gap-4">
                  <span className="group mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border-strong bg-brand/8 text-brand-dark transition-transform duration-300 hover:scale-110 hover:-rotate-6">
                    <Icon className="h-5 w-5" strokeWidth={2} />
                  </span>
                  <div>
                    <h4 className="font-bold text-foreground">{title}</h4>
                    <p className="mt-1 text-sm leading-relaxed text-muted">
                      {body}
                    </p>
                  </div>
                </Reveal>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
