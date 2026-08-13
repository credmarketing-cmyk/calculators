"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import LeadGateForm, { isLeadUnlocked } from "./CalculatorLeadGate";
import { useCountUp } from "./useCountUp";
import NewsletterForm from "@/components/NewsletterForm";

const CALCULATOR_NAME = "Duct Static Pressure Calculator";
type Stage = "input" | "gate" | "result";

// Standard design friction rate: ~0.1 in. w.c. per 100 ft of ducted run.
const FRICTION_RATE_PER_100FT = 0.1;
const FITTING_LOSS = 0.08;

function fmt(n: number, digits = 2) {
  if (!Number.isFinite(n)) return "—";
  return n.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: digits });
}

function ChipGroup<T extends string | number>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { label: string; value: T }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="chips" role="group" aria-label={label}>
      {options.map((opt) => (
        <button
          key={String(opt.value)}
          className="chip"
          type="button"
          aria-pressed={opt.value === value}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

export default function DuctStaticPressureCalculator() {
  const [ductwork, setDuctwork] = useState<"Ducted" | "Unducted">("Ducted");
  const [ductLength, setDuctLength] = useState(80);
  const [basePressure, setBasePressure] = useState(0.2);
  const [hoodExhaust, setHoodExhaust] = useState<"Yes" | "No">("No");
  const [hoodPressure, setHoodPressure] = useState(0.8);
  const [fittings, setFittings] = useState(4);

  const computed = useMemo(() => {
    const base = Math.max(0, basePressure || 0);
    const length = Math.max(0, ductLength || 0);
    const fittingCount = Math.max(0, fittings || 0);
    const hood = Math.max(0, hoodPressure || 0);

    const frictionLoss = ductwork === "Ducted" ? (length / 100) * FRICTION_RATE_PER_100FT : 0;
    const fittingsLoss = fittingCount * FITTING_LOSS;
    const hoodLoss = hoodExhaust === "Yes" ? hood : 0;

    const total = base + frictionLoss + fittingsLoss + hoodLoss;

    return { base, frictionLoss, fittingsLoss, hoodLoss, total, withinRange: total <= 0.5 };
  }, [ductwork, ductLength, basePressure, hoodExhaust, hoodPressure, fittings]);

  const [stage, setStage] = useState<Stage>("input");
  const [revealKey, setRevealKey] = useState(0);
  const displayTotal = useCountUp(computed.total * 100, revealKey);

  const resultRef = useRef<HTMLDivElement>(null);
  function reveal() {
    setStage("result");
    setRevealKey((k) => k + 1);
    resultRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }
  function handleCalculateClick() {
    if (isLeadUnlocked()) reveal();
    else setStage("gate");
  }
  function handleEditInputs() {
    setStage("input");
  }

  const pageRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const root = pageRef.current;
    if (!root) return;
    const els = root.querySelectorAll(".rv");
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.06 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const parts = [computed.base, computed.frictionLoss, computed.fittingsLoss, computed.hoodLoss];
  const sum = computed.total || 1;
  const pct = parts.map((v) => (Math.max(0, v) / sum) * 100);
  const labels = ["Base static pressure", "Duct friction loss", "Fittings", "Hood exhaust"];
  const dots = ["#EE5566", "#F8919C", "rgba(255,255,255,.62)", "rgba(255,255,255,.28)"];

  return (
    <div ref={pageRef}>
      {/* ======================= HERO ======================= */}
      <header className="hero">
        <div className="hero-bg" aria-hidden="true" />

        <div className="shell">
          <div className="hero-grid">
            <div>
              <span className="badge">
                <i />
                Calculators
              </span>
              <h1>
                <span className="acc">Duct static pressure</span>
                <br />
                <span className="tone-soft">calculated</span> instantly.
              </h1>
              <p className="lede">
                Ensure your HVAC system runs efficiently by accurately
                calculating total static pressure with our
                user-friendly tool.
              </p>
              <div className="hero-cta">
                <a className="btn btn-1" href="#calculator">
                  Start estimating
                  <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                    <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
                <a className="btn btn-2" href="#how">
                  How it works
                </a>
                <Link className="btn btn-3" href="/calculators#calculators">
                  Explore tools
                  <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                    <path d="M3.5 10.5l7-7M5 3.5h5.5V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              </div>
              <div className="hero-meta">
                <div>
                  <div className="hm-k">0.5&quot; WC</div>
                  <div className="hm-v">Typical design target</div>
                </div>
                <div>
                  <div className="hm-k">500+</div>
                  <div className="hm-v">HVAC contractors</div>
                </div>
                <div>
                  <div className="hm-k">0.08&quot;</div>
                  <div className="hm-v">Loss per fitting</div>
                </div>
              </div>
            </div>

            {/* ============ CALCULATOR ============ */}
            <div id="calculator">
              {stage === "input" && (
                <div className="calc">
                  <div className="calc-hd">
                    <h2>Duct Static Pressure Calculator</h2>
                    <p>Enter your system details to calculate total static pressure.</p>
                  </div>
                  <div className="calc-bd">
                    <div className="step">
                      <div className="step-hd">
                        <span className="step-n">01</span>
                        <span className="step-t">Ductwork</span>
                      </div>
                      <ChipGroup
                        label="Ductwork type"
                        options={[
                          { label: "Ducted", value: "Ducted" as const },
                          { label: "Unducted", value: "Unducted" as const },
                        ]}
                        value={ductwork}
                        onChange={setDuctwork}
                      />
                      <div className="rowf" style={{ marginTop: 18 }}>
                        <div className="field">
                          <label htmlFor="ductLength">Length of duct (ft)</label>
                          <div className="ipwrap">
                            <input id="ductLength" type="number" min={0} value={ductLength} onChange={(e) => setDuctLength(e.target.valueAsNumber)} />
                          </div>
                        </div>
                        <div className="field">
                          <label htmlFor="basePressure">Static pressure (inches)</label>
                          <div className="ipwrap">
                            <input id="basePressure" type="number" min={0} step={0.01} value={basePressure} onChange={(e) => setBasePressure(e.target.valueAsNumber)} />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="step">
                      <div className="step-hd">
                        <span className="step-n">02</span>
                        <span className="step-t">Kitchen hood exhaust?</span>
                      </div>
                      <ChipGroup
                        label="Kitchen hood exhaust"
                        options={[
                          { label: "Yes", value: "Yes" as const },
                          { label: "No", value: "No" as const },
                        ]}
                        value={hoodExhaust}
                        onChange={setHoodExhaust}
                      />
                      <div className="field" style={{ marginTop: 18 }}>
                        <label htmlFor="hoodPressure">Static pressure from hood exhaust</label>
                        <div className="ipwrap">
                          <input id="hoodPressure" type="number" min={0} step={0.01} value={hoodPressure} onChange={(e) => setHoodPressure(e.target.valueAsNumber)} />
                        </div>
                      </div>
                    </div>

                    <div className="step">
                      <div className="step-hd">
                        <span className="step-n">03</span>
                        <span className="step-t">Fittings</span>
                      </div>
                      <div className="field">
                        <label htmlFor="fittings">Number of fittings (× 0.08&quot;)</label>
                        <div className="ipwrap">
                          <input id="fittings" type="number" min={0} value={fittings} onChange={(e) => setFittings(e.target.valueAsNumber)} />
                        </div>
                      </div>
                    </div>

                    <div className="calc-go">
                      <button className="btn btn-1" type="button" onClick={handleCalculateClick}>
                        Calculate total pressure
                        <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                          <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                      <span className="hint">Takes 10 seconds</span>
                    </div>
                  </div>
                </div>
              )}

              {stage === "gate" && (
                <div className="result on" aria-live="polite" ref={resultRef}>
                  <LeadGateForm calculatorName={CALCULATOR_NAME} onUnlock={reveal} />
                  <div className="result-back">
                    <button type="button" onClick={handleEditInputs}>
                      ← Edit inputs
                    </button>
                  </div>
                </div>
              )}

              {stage === "result" && (
                <div className="result on" aria-live="polite" ref={resultRef}>
                  <div className="res-top">
                    <div>
                      <div className="res-lab">Total static pressure</div>
                      <div className="res-num">{fmt(displayTotal / 100)}&quot; WC</div>
                      <div className="res-rng">
                        Design target <b>≤ 0.50&quot; WC</b>
                      </div>
                    </div>
                    <div className="res-pill">{computed.withinRange ? "WITHIN RANGE" : "ABOVE TARGET"}</div>
                  </div>

                  <div className="bar" aria-hidden="true">
                    {pct.map((p, i) => (
                      <i key={i} style={{ width: `${p.toFixed(1)}%` }} />
                    ))}
                  </div>

                  <div className="brk">
                    {labels.map((label, i) => (
                      <div className="brk-r" key={label}>
                        <i style={{ background: dots[i] }} />
                        <span className="k">{label}</span>
                        <span className="s">{Math.round(pct[i])}%</span>
                        <span className="v">{fmt(parts[i])}&quot;</span>
                      </div>
                    ))}
                  </div>

                  <p className="res-foot">
                    Estimate only, using a standard 0.1&quot; WC per 100 ft
                    design friction rate and 0.08&quot; per fitting. Most
                    well-designed systems run at or below 0.5&quot; WC at
                    design airflow — verify against manufacturer specs and
                    a field-measured static reading.
                  </p>

                  <div className="result-back">
                    <button type="button" onClick={handleEditInputs}>
                      ← Edit inputs
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ======================= ABOUT / HOW ======================= */}
      <section className="sec" id="how" style={{ borderTop: 0 }}>
        <div className="shell">
          <div className="art">
            <div className="rv">
              <div className="marker">What it does.</div>
              <h2>Estimate duct static pressure instantly</h2>
              <p>
                Static pressure in HVAC ductwork is essentially the air
                resistance that a blower must overcome to push air through
                the system. It&apos;s measured in inches of water column
                (in. w.c.). In duct design, keeping total static pressure
                within limits is critical for energy-efficient, quiet
                airflow. High static pressure forces the blower to work
                harder, increasing energy use and noise, and can even shut
                down or damage equipment — while very low static pressure
                may indicate leaks or oversized ducts.
              </p>
              <p>
                The Duct Static Pressure Calculator is a free tool to
                quickly calculate the total static pressure for any duct
                system design. It automates the process so you can focus
                on system planning and diagnostics in seconds, saving time
                and avoiding manual math errors.
              </p>

              <div className="marker" style={{ marginTop: 52 }}>
                How you measure it.
              </div>
              <h2>Measuring HVAC duct static pressure</h2>
              <p>
                As mentioned, static pressure is the resistance to
                airflow in ductwork. To measure total static pressure,
                HVAC professionals drill test ports in the return and
                supply ducts and use a dual-port digital manometer. One
                probe measures the negative return-side pressure, and the
                other measures the positive supply-side pressure. The
                Total External Static Pressure (TESP) is simply the sum
                of those readings, treating the return pressure as a
                positive number. For example, if the supply side reads
                +0.30&quot; WC and the return side reads -0.20&quot; WC,
                the total static is 0.50&quot; WC. Most well-designed
                systems run at or below about 0.5&quot; WC at design
                airflow, so anything higher signals too much resistance.
              </p>
              <p>
                A digital manometer reads pressures in inches of water
                column — the standard HVAC unit. Most dual-port gauges
                display both port pressures simultaneously. In our
                calculator, you simply enter the measured static in
                inches, and set the Ductwork type: Ducted or Unducted.
                Unducted means the equipment is open and there&apos;s no
                duct run; Ducted applies a friction rate to the duct run
                and adds pressure loss based on duct length.
              </p>
            </div>

            <aside className="aside rv" id="software">
              <div className="p-eyebrow">For contractors</div>
              <h3>Building an estimate for a client?</h3>
              <p className="sub">
                Send branded, professional quotes in one click with
                ZenTrades.
              </p>
              <ul>
                <li>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2.5 7.5l3 3 6-7" stroke="#EE5566" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Static pressure breakdown included
                </li>
                <li>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2.5 7.5l3 3 6-7" stroke="#EE5566" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Used by 500+ HVAC contractors
                </li>
                <li>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2.5 7.5l3 3 6-7" stroke="#EE5566" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Export this estimate straight to ZenTrades
                </li>
              </ul>
              <a className="btn btn-dark" href="https://zentrades.pro" target="_blank" rel="noopener noreferrer">
                Explore software
                <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                  <path d="M3.5 10.5l7-7M5 3.5h5.5V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </aside>
          </div>
        </div>
      </section>

      {/* ======================= AUDIENCE ======================= */}
      <section className="sec" id="audience">
        <div className="shell">
          <div className="marker rv">Who it&apos;s for.</div>
          <div className="two">
            <div className="panel rv">
              <div className="p-eyebrow">Residential</div>
              <h3>For homeowners</h3>
              <div className="p-tag">
                Improve system efficiency and ensure reliable performance
                with accurate calculations.
              </div>
              <p className="p-int">
                Streamline furnace static pressure assessment and optimize
                HVAC system design for residential projects.
              </p>
              <div className="it">
                <div className="it-t">
                  <b>01</b>Assess furnace static pressure
                </div>
                <div className="it-d">
                  HVAC technicians can enter the equipment&apos;s external
                  static pressure and duct length to calculate the static
                  pressure of a new furnace.
                </div>
              </div>
              <div className="it">
                <div className="it-t">
                  <b>02</b>Optimize duct system design
                </div>
                <div className="it-d">
                  Verify a duct design meets static pressure requirements,
                  then adjust duct length to keep airflow balanced
                  throughout the house.
                </div>
              </div>
              <div className="it">
                <div className="it-t">
                  <b>03</b>Accurate measurement
                </div>
                <div className="it-d">
                  Calculating a proper static pressure helps the HVAC
                  system run efficiently, giving homeowners consistent
                  comfort and lower operating costs.
                </div>
              </div>
            </div>

            <div className="panel hot rv">
              <div className="p-eyebrow">Commercial</div>
              <h3>For contractors and facility teams</h3>
              <div className="p-tag">
                Optimize system performance and minimize pressure loss
                with accurate calculation.
              </div>
              <p className="p-int">
                Ensure accurate static pressure calculation by accounting
                for duct length, components, and kitchen hood exhaust.
              </p>
              <div className="it">
                <div className="it-t">
                  <b>01</b>Standard friction rate
                </div>
                <div className="it-d">
                  The calculator applies a standard friction rate so the
                  calculated pressure drop stays accurate for longer duct
                  runs and additional components.
                </div>
              </div>
              <div className="it">
                <div className="it-t">
                  <b>02</b>Additional components
                </div>
                <div className="it-d">
                  Duct fittings and elements like dampers and vents all
                  contribute to pressure loss — the calculator accounts
                  for a more accurate total.
                </div>
              </div>
              <div className="it">
                <div className="it-t">
                  <b>03</b>Estimating for bids and proposals
                </div>
                <div className="it-d">
                  Kitchen hood fans often add 0.625&quot;–1.50&quot; of
                  static pressure. Simply check &quot;Hood Exhaust&quot; and
                  it&apos;s included in the total.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================= WHY ======================= */}
      <section className="sec">
        <div className="shell">
          <div className="marker rv">Why use it.</div>
          <h2 className="rv" style={{ maxWidth: "22ch", marginBottom: 44 }}>
            Why use our Duct Static Pressure Calculator?
          </h2>
          <div className="why rv">
            <div className="why-c">
              <div className="ico">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M9 1.5L3 9h4l-1 5.5L13 7H9l1-5.5z" stroke="#EE5566" strokeWidth="1.3" strokeLinejoin="round" />
                </svg>
              </div>
              <h3>Accounts for the small losses</h3>
              <p>
                Our calculator automatically includes standard losses. We
                approximate each fitting at 0.08&quot;, which covers
                registers, grilles, and filters — so no loss is missed.
              </p>
            </div>
            <div className="why-c">
              <div className="ico">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 1.6l5.4 2.2v4.1c0 3.1-2.2 5.4-5.4 6.5-3.2-1.1-5.4-3.4-5.4-6.5V3.8L8 1.6z" stroke="#EE5566" strokeWidth="1.3" strokeLinejoin="round" />
                </svg>
              </div>
              <h3>Ideal for on-site use</h3>
              <p>
                No app required. Run quick calculations during an
                inspection, right from your phone.
              </p>
            </div>
            <div className="why-c">
              <div className="ico">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 5h10M3 11h10" stroke="#EE5566" strokeWidth="1.3" strokeLinecap="round" />
                  <circle cx="6" cy="5" r="2" fill="#FDEEF0" stroke="#EE5566" strokeWidth="1.3" />
                  <circle cx="10" cy="11" r="2" fill="#FDEEF0" stroke="#EE5566" strokeWidth="1.3" />
                </svg>
              </div>
              <h3>No unit confusion</h3>
              <p>
                All inputs and outputs use inches of water column, the
                HVAC industry standard — no converting between Pa, psi, or
                other units.
              </p>
            </div>
            <div className="why-c">
              <div className="ico">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M2.5 13V7M6.8 13V3M11.2 13V9.5M15 13H1" stroke="#EE5566" strokeWidth="1.3" strokeLinecap="round" />
                </svg>
              </div>
              <h3>Considers hood pressure</h3>
              <p>
                It&apos;s common to forget a kitchen hood&apos;s impact. By
                toggling &quot;Hood Exhaust,&quot; its static is added to
                the total automatically.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ======================= FACTORS ======================= */}
      <section className="sec" id="factors">
        <div className="shell">
          <div className="marker rv">Influencing factors.</div>
          <h2 className="rv" style={{ maxWidth: "22ch", marginBottom: 40 }}>
            Common factors influencing duct static pressure
          </h2>
          <div className="fac rv">
            <div className="fac-r">
              <span className="n">01</span>
              <span className="t">Duct size (friction loss)</span>
              <span className="d">
                Longer ducts create more friction. The calculator uses
                industry-standard values to translate length into
                pressure.
              </span>
            </div>
            <div className="fac-r">
              <span className="n">02</span>
              <span className="t">Base static pressure</span>
              <span className="d">
                Enter the equipment&apos;s external static pressure,
                measured in inches of water — this already reflects
                internal losses like the coil pressure drop.
              </span>
            </div>
            <div className="fac-r">
              <span className="n">03</span>
              <span className="t">Fittings and components</span>
              <span className="d">
                Every elbow, tee, filter, or grille adds resistance. We
                use 0.08&quot; per fitting as a simplifying rule.
              </span>
            </div>
            <div className="fac-r">
              <span className="n">04</span>
              <span className="t">Kitchen hood exhaust</span>
              <span className="d">
                The calculator accounts for a kitchen hood by letting you
                enter its required static pressure.
              </span>
            </div>
            <div className="fac-r">
              <span className="n">05</span>
              <span className="t">System design target</span>
              <span className="d">
                Keeping total static pressure below about 0.5&quot; WC at
                design airflow ensures the blower delivers the desired
                airflow without extra strain.
              </span>
            </div>
          </div>
          <p className="fac-note rv">
            Working through these factors helps you spot excess resistance
            before it becomes a comfort complaint or an equipment failure.
          </p>
        </div>
      </section>

      {/* ======================= CLOSING CTA ======================= */}
      <section className="sec">
        <div className="shell">
          <div className="close-w rv">
            <div className="close-hatch" aria-hidden="true" />
            <div className="marker">Ready to get started.</div>
            <h2>Save time and ensure accuracy</h2>
            <p>
              Try our Duct Static Pressure Calculator today. Just enter
              your values and press Calculate to instantly see the total
              system pressure in inches of water column — fast,
              professional-grade calculations from ZenTrades.
            </p>
            <div className="hero-cta">
              <a className="btn btn-1" href="#calculator">
                Try the calculator
                <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                  <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
              <a className="btn btn-2" href="https://zentrades.pro" target="_blank" rel="noopener noreferrer">
                See ZenTrades software
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ======================= NEWSLETTER ======================= */}
      <section className="news">
        <div className="shell">
          <span className="badge rv">
            <i />
            Newsletter
          </span>
          <h2 className="rv">
            The kind of newsletter you <span className="acc">don&apos;t ignore</span>
          </h2>
          <p className="rv">
            Join 5,000+ professionals getting weekly insight on codes,
            technology and best practice across field service industries.
          </p>
          <div className="nf rv">
            <NewsletterForm />
          </div>
          <div className="nf-note rv">One email a week · Unsubscribe anytime</div>
        </div>
      </section>
    </div>
  );
}
