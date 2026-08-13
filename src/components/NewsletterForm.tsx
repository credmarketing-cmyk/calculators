"use client";

import { useState, type FormEvent } from "react";
import { CheckCircle2, Loader2, ArrowRight } from "lucide-react";

const HUBSPOT_PORTAL_ID = "45865556";
const HUBSPOT_FORM_ID = "5d53e7d7-222e-40f9-a17a-4ca69a2cadb9";

const inputClass =
  "w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm font-medium text-foreground outline-none transition-all duration-200 placeholder:text-muted/60 focus:border-brand focus:shadow-[0_0_0_3px_var(--brand-glow)]";

/**
 * Newsletter signup, submitted via HubSpot's Forms Submission API
 * (portal 45865556, form 5d53e7d7-…) with a custom-styled UI matching
 * the rest of the site, instead of embedding HubSpot's default iframe.
 */
export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    try {
      const res = await fetch(
        `https://api.hsforms.com/submissions/v3/integration/submit/${HUBSPOT_PORTAL_ID}/${HUBSPOT_FORM_ID}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fields: [{ name: "email", value: email }],
            context: { pageName: "Newsletter" },
          }),
        }
      );
      setStatus(res.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="flex items-center justify-center gap-2 rounded-xl border border-border-strong bg-brand/8 px-5 py-3.5 text-sm font-semibold text-brand-dark">
        <CheckCircle2 className="h-4.5 w-4.5" />
        You&apos;re subscribed. Welcome aboard!
      </div>
    );
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="newsletter-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your work email"
          className={`${inputClass} flex-1`}
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-gradient-to-r from-brand to-brand-dark px-6 py-3 text-sm font-bold text-white shadow-[0_10px_30px_-10px_var(--brand-glow)] transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70"
        >
          {status === "loading" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              Subscribe
              <ArrowRight className="h-3.5 w-3.5" />
            </>
          )}
        </button>
      </form>
      {status === "error" && (
        <p className="mt-3 text-center text-xs text-red-500">
          Something went wrong — please try again.
        </p>
      )}
    </div>
  );
}
