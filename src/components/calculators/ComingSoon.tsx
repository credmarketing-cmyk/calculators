import Link from "next/link";
import { Hammer, ArrowRight } from "lucide-react";

export default function ComingSoon({ title }: { title: string }) {
  return (
    <div className="rounded-3xl border border-dashed border-border-strong bg-surface p-10 text-center sm:p-14">
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand/8 text-brand-dark">
        <Hammer className="h-7 w-7" strokeWidth={2} />
      </span>
      <h2 className="mt-5 text-xl font-bold text-foreground">
        {title} is being built
      </h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted">
        We&apos;re rolling out our calculators one at a time to make sure
        every formula is accurate. This one is on the way — in the meantime,
        request it directly and we&apos;ll notify you the moment it&apos;s
        live.
      </p>
      <Link
        href="/#custom"
        className="group mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand to-brand-dark px-6 py-3 text-sm font-bold text-white shadow-[0_8px_24px_-8px_var(--brand-glow)] transition-transform hover:scale-[1.03] active:scale-[0.97]"
      >
        Request This Calculator
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </Link>
    </div>
  );
}
