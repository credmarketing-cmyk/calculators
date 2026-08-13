"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { CheckCircle2, Loader2, Send } from "lucide-react";

const HUBSPOT_PORTAL_ID = "45865556";
const HUBSPOT_FORM_ID = "4850c567-b5ec-4d73-bfb0-a527d61c4d45";

const inputClass =
  "w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm font-medium text-foreground outline-none transition-all duration-200 placeholder:text-muted/60 focus:border-brand focus:shadow-[0_0_0_3px_var(--brand-glow)]";

function Field({
  label,
  htmlFor,
  required,
  children,
}: {
  label: string;
  htmlFor: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-xs font-semibold text-muted">
        {label}
        {required && <span className="text-brand-dark"> *</span>}
      </label>
      {children}
    </div>
  );
}

/**
 * Custom-styled request form, submitted via HubSpot's Forms Submission
 * API (portal 45865556, form 4850c567-…) instead of embedding HubSpot's
 * own iframe — keeps this matching the rest of the site's design.
 */
export default function RequestCalculatorForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const firstname = String(form.get("firstname") || "").trim();
    const email = String(form.get("email") || "").trim();
    const company = String(form.get("company") || "").trim();
    const message = String(form.get("message") || "").trim();
    if (!email) return;

    setStatus("loading");
    try {
      const res = await fetch(
        `https://api.hsforms.com/submissions/v3/integration/submit/${HUBSPOT_PORTAL_ID}/${HUBSPOT_FORM_ID}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fields: [
              { name: "firstname", value: firstname },
              { name: "email", value: email },
              { name: "company", value: company },
              { name: "message", value: message },
            ],
            context: { pageName: "Request Calculator" },
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
      <div className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-border-strong bg-surface p-10 text-center shadow-[0_30px_80px_-30px_rgba(184,40,63,0.22)]">
        <CheckCircle2 className="h-12 w-12 text-brand" strokeWidth={1.5} />
        <h3 className="text-xl font-bold text-foreground">Request received!</h3>
        <p className="max-w-xs text-sm text-muted">
          Our team will reach out shortly to discuss your custom
          calculator.
        </p>
      </div>
    );
  }

  return (
    <div className="relative rounded-3xl border border-border-strong bg-surface p-7 shadow-[0_30px_80px_-30px_rgba(184,40,63,0.22)] transition-shadow duration-500 hover:shadow-[0_30px_90px_-24px_rgba(184,40,63,0.3)] sm:p-9">
      <div className="pointer-events-none absolute -inset-px -z-10 rounded-3xl bg-gradient-to-b from-brand/15 to-transparent opacity-50" />

      <h3 className="text-xl font-bold text-foreground">
        Others are getting their custom calculators made. Why not you?
      </h3>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="First Name" htmlFor="request-firstname">
            <input
              id="request-firstname"
              name="firstname"
              type="text"
              placeholder="John"
              className={inputClass}
            />
          </Field>
          <Field label="Email" htmlFor="request-email" required>
            <input
              id="request-email"
              name="email"
              type="email"
              required
              placeholder="john@companyname.com"
              className={inputClass}
            />
          </Field>
        </div>

        <Field label="Company Name" htmlFor="request-company">
          <input
            id="request-company"
            name="company"
            type="text"
            placeholder="Your Company Name"
            className={inputClass}
          />
        </Field>

        <Field label="Project Details" htmlFor="request-message">
          <textarea
            id="request-message"
            name="message"
            rows={3}
            placeholder="Tell us about your calculator requirements, industry, and specific feature requirements"
            className={`${inputClass} resize-none`}
          />
        </Field>

        <button
          type="submit"
          disabled={status === "loading"}
          className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-brand to-brand-dark py-3 text-sm font-bold text-white shadow-[0_10px_30px_-10px_var(--brand-glow)] transition-transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70"
        >
          {status === "loading" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              Submit
              <Send className="h-3.5 w-3.5" />
            </>
          )}
        </button>

        {status === "error" && (
          <p className="text-center text-xs text-red-500">
            Something went wrong sending your request — please try again or
            email us directly.
          </p>
        )}
      </form>
    </div>
  );
}
