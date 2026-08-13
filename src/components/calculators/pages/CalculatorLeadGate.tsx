"use client";

import { useState, type FormEvent } from "react";
import { Lock, Loader2 } from "lucide-react";

const STORAGE_KEY = "zt_calculator_lead";

// Dedicated calculator-lead form (all fields required on the HubSpot side).
const HUBSPOT_PORTAL_ID = "45865556";
const HUBSPOT_LEAD_FORM_ID = "0b960b9e-ff7e-486a-ba69-f635424c6970";

export function isLeadUnlocked() {
  if (typeof window === "undefined") return false;
  return !!window.localStorage.getItem(STORAGE_KEY);
}

async function submitLead(data: { name: string; email: string; company: string; calculator: string }) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...data, ts: Date.now() }));
  } catch {
    // localStorage unavailable (private mode etc.) — not fatal, just won't persist.
  }

  try {
    const res = await fetch(
      `https://api.hsforms.com/submissions/v3/integration/submit/${HUBSPOT_PORTAL_ID}/${HUBSPOT_LEAD_FORM_ID}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fields: [
            { name: "firstname", value: data.name },
            { name: "email", value: data.email },
            { name: "company", value: data.company },
          ],
          context: { pageName: `${data.calculator} — Calculator Lead` },
        }),
      }
    );
    if (!res.ok) {
      // eslint-disable-next-line no-console
      console.error("HubSpot lead submission failed:", res.status, await res.text());
    }
  } catch (err) {
    // Best-effort — never block the user from seeing their result over a
    // network hiccup, but log it so a broken form ID doesn't fail silently.
    // eslint-disable-next-line no-console
    console.error("HubSpot lead submission error:", err);
  }
}

/**
 * A short Name/Email/Company form that unlocks a calculator's result. The
 * parent decides when to show it (see the input/gate/result stage pattern
 * in each calculator page) — this component only knows how to submit and
 * report back via onUnlock. Once submitted on any calculator, the unlock is
 * remembered site-wide via localStorage, so returning visitors — and every
 * other gated calculator — never see the form again.
 */
export default function LeadGateForm({
  calculatorName,
  onUnlock,
}: {
  calculatorName: string;
  onUnlock: () => void;
}) {
  const [status, setStatus] = useState<"idle" | "loading">("idle");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const name = String(form.get("name") || "").trim();
    const email = String(form.get("email") || "").trim();
    const company = String(form.get("company") || "").trim();
    if (!name || !email || !company) return;

    setStatus("loading");
    submitLead({ name, email, company, calculator: calculatorName }).finally(() => {
      setStatus("idle");
      onUnlock();
    });
  }

  return (
    <div className="lead-gate">
      <div className="lead-gate-lock">
        <Lock size={15} strokeWidth={2} />
        Unlock your instant estimate
      </div>

      <p className="lead-gate-copy">
        Enter your details once and every ZenTrades calculator unlocks — no
        repeat forms, no spam.
      </p>

      <form onSubmit={handleSubmit} className="lead-gate-form">
        <div className="rowf">
          <div className="field">
            <label htmlFor="lead-name">
              Name<span className="lead-gate-req"> *</span>
            </label>
            <div className="ipwrap">
              <input id="lead-name" name="name" type="text" required placeholder="Jane Smith" autoComplete="name" />
            </div>
          </div>
          <div className="field">
            <label htmlFor="lead-company">
              Company<span className="lead-gate-req"> *</span>
            </label>
            <div className="ipwrap">
              <input
                id="lead-company"
                name="company"
                type="text"
                required
                placeholder="Acme Fire & Safety"
                autoComplete="organization"
              />
            </div>
          </div>
        </div>
        <div className="field" style={{ marginTop: 18 }}>
          <label htmlFor="lead-email">
            Email<span className="lead-gate-req"> *</span>
          </label>
          <div className="ipwrap">
            <input
              id="lead-email"
              name="email"
              type="email"
              required
              placeholder="you@company.com"
              autoComplete="email"
            />
          </div>
        </div>

        <button className="btn btn-1 lead-gate-submit" type="submit" disabled={status === "loading"}>
          {status === "loading" ? (
            <Loader2 size={14} className="lead-gate-spin" />
          ) : (
            <>
              Show my estimate
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
