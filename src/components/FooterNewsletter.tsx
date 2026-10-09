"use client";

import { useState, type FormEvent } from "react";
import { CheckCircle2, Loader2, MoveRight } from "lucide-react";
import { subscribeToNewsletter } from "./NewsletterForm";

/** Compact dark-theme newsletter signup for the site footer. */
export default function FooterNewsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    try {
      setStatus((await subscribeToNewsletter(email, "Footer Newsletter")) ? "success" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <p className="flex items-center gap-2 text-sm font-semibold text-white">
        <CheckCircle2 className="h-4.5 w-4.5 text-brand" />
        You&apos;re subscribed. Welcome aboard!
      </p>
    );
  }

  return (
    <div className="w-full max-w-[410px]">
      <form onSubmit={handleSubmit} className="flex">
        <label htmlFor="footer-newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="footer-newsletter-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="min-w-0 flex-1 rounded-l-lg bg-white px-3.5 py-2.5 text-sm font-medium text-[#1f2124] outline-none placeholder:text-[#77767b] focus:shadow-[0_0_0_3px_rgba(238,85,102,0.45)]"
        />
        <button
          type="submit"
          aria-label="Subscribe"
          disabled={status === "loading"}
          className="flex w-[88px] shrink-0 items-center justify-center rounded-r-lg border border-white/80 bg-[#121212] text-white transition-colors hover:bg-brand disabled:opacity-70"
        >
          {status === "loading" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <MoveRight className="h-5 w-5" />
          )}
        </button>
      </form>
      {status === "error" && (
        <p className="mt-2 text-xs text-[#f6bfc3]">Something went wrong — please try again.</p>
      )}
    </div>
  );
}
