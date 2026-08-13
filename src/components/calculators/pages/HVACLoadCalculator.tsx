"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import LeadGateForm, { isLeadUnlocked } from "./CalculatorLeadGate";
import { useCountUp } from "./useCountUp";
import NewsletterForm from "@/components/NewsletterForm";

const CALCULATOR_NAME = "HVAC Load Calculator";
type Stage = "input" | "gate" | "result";

const CLIMATE_OPTIONS = [
  { label: "Cold (North)", mult: 30 },
  { label: "Moderate", mult: 25 },
  { label: "Hot (South)", mult: 35 },
  { label: "Very Hot (Desert)", mult: 40 },
];
const INSULATION_OPTIONS = [
  { label: "Good", mult: 0.85 },
  { label: "Average", mult: 1 },
  { label: "Poor", mult: 1.2 },
];
const SUN_OPTIONS = [
  { label: "Low", mult: 0.9 },
  { label: "Moderate", mult: 1 },
  { label: "High", mult: 1.15 },
];

function fmt(n: number, digits = 0) {
  if (!Number.isFinite(n)) return "—";
  return n.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: digits });
}

function ChipGroup<T extends number>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { label: string; mult: T }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="chips" role="group" aria-label={label}>
      {options.map((opt) => (
        <button
          key={opt.label}
          className="chip"
          type="button"
          aria-pressed={opt.mult === value}
          onClick={() => onChange(opt.mult)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

export default function HVACLoadCalculator() {
  const [climate, setClimate] = useState(25);
  const [sqft, setSqft] = useState(1800);
  const [ceilingHeight, setCeilingHeight] = useState(8);
  const [insulation, setInsulation] = useState(1);
  const [sun, setSun] = useState(1);

  const computed = useMemo(() => {
    const area = Math.max(0, sqft || 0);
    const height = Math.max(0, ceilingHeight || 0);
    const heightFactor = height > 0 ? height / 8 : 1;

    const base = area * climate * heightFactor;
    const afterInsulation = base * insulation;
    const total = afterInsulation * sun;

    const insulationDelta = afterInsulation - base;
    const sunDelta = total - afterInsulation;

    return {
      base,
      insulationDelta,
      sunDelta,
      total,
      lo: total * 0.9,
      hi: total * 1.1,
      tons: total / 12000,
    };
  }, [climate, sqft, ceilingHeight, insulation, sun]);

  const [stage, setStage] = useState<Stage>("input");
  const [revealKey, setRevealKey] = useState(0);
  const displayLoad = useCountUp(computed.total, revealKey);

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

  const parts = [computed.base, Math.max(0, computed.insulationDelta), Math.max(0, computed.sunDelta)];
  const sum = computed.total || 1;
  const pct = parts.map((v) => (Math.max(0, v) / sum) * 100);
  const labels = ["Base climate & size load", "Insulation adjustment", "Sunlight adjustment"];
  const dots = ["#EE5566", "#F8919C", "rgba(255,255,255,.28)"];

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
                <span className="acc">HVAC load</span>
                <br />
                <span className="tone-soft">sized</span> to the home.
              </h1>
              <p className="lede">
                Accurately size an HVAC system to a home&apos;s needs,
                prevent efficiency problems, and improve customer
                satisfaction.
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
                  <div className="hm-k">Manual J</div>
                  <div className="hm-v">Industry-standard method</div>
                </div>
                <div>
                  <div className="hm-k">500+</div>
                  <div className="hm-v">HVAC contractors</div>
                </div>
                <div>
                  <div className="hm-k">BTU/hr</div>
                  <div className="hm-v">Load measured in</div>
                </div>
              </div>
            </div>

            {/* ============ CALCULATOR ============ */}
            <div id="calculator">
              {stage === "input" && (
                <div className="calc">
                  <div className="calc-hd">
                    <h2>HVAC Load Calculator</h2>
                    <p>Estimate the heating and cooling load for a home.</p>
                  </div>
                  <div className="calc-bd">
                    <div className="step">
                      <div className="step-hd">
                        <span className="step-n">01</span>
                        <span className="step-t">Where is the house located?</span>
                      </div>
                      <ChipGroup label="Climate" options={CLIMATE_OPTIONS} value={climate} onChange={setClimate} />
                    </div>

                    <div className="step">
                      <div className="step-hd">
                        <span className="step-n">02</span>
                        <span className="step-t">Home size</span>
                      </div>
                      <div className="rowf">
                        <div className="field">
                          <label htmlFor="sqft">Square footage (SQFT)</label>
                          <div className="ipwrap">
                            <input id="sqft" type="number" min={0} value={sqft} onChange={(e) => setSqft(e.target.valueAsNumber)} />
                          </div>
                        </div>
                        <div className="field">
                          <label htmlFor="ceilingHeight">Ceiling height (FT)</label>
                          <div className="ipwrap">
                            <input id="ceilingHeight" type="number" min={0} value={ceilingHeight} onChange={(e) => setCeilingHeight(e.target.valueAsNumber)} />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="step">
                      <div className="step-hd">
                        <span className="step-n">03</span>
                        <span className="step-t">How would you rate the insulation?</span>
                      </div>
                      <ChipGroup label="Insulation" options={INSULATION_OPTIONS} value={insulation} onChange={setInsulation} />
                    </div>

                    <div className="step">
                      <div className="step-hd">
                        <span className="step-n">04</span>
                        <span className="step-t">How much sunlight does it get?</span>
                      </div>
                      <ChipGroup label="Sunlight" options={SUN_OPTIONS} value={sun} onChange={setSun} />
                    </div>

                    <div className="calc-go">
                      <button className="btn btn-1" type="button" onClick={handleCalculateClick}>
                        Calculate HVAC load
                        <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                          <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                      <span className="hint">Takes 15 seconds</span>
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
                      <div className="res-lab">Recommended HVAC load</div>
                      <div className="res-num">{fmt(displayLoad)} BTU/hr</div>
                      <div className="res-rng">
                        Likely range <b>{fmt(computed.lo)}</b> — <b>{fmt(computed.hi)}</b>
                      </div>
                    </div>
                    <div className="res-pill">{`≈ ${fmt(computed.tons, 1)} tons`}</div>
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
                        <span className="v">{fmt(parts[i])} BTU/hr</span>
                      </div>
                    ))}
                  </div>

                  <p className="res-foot">
                    Estimate based on simplified area, climate, ceiling
                    height, insulation, and sunlight rules of thumb — not
                    a substitute for a full ACCA Manual J load calculation.
                    Consult an HVAC professional before final equipment
                    sizing.
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
              <h2>What is HVAC load, and how is it calculated?</h2>
              <p>
                HVAC load is simply the amount of heating or cooling a
                building needs to stay at a comfortable indoor
                temperature. It&apos;s the thermal demand of the space,
                measured in British Thermal Units per hour (BTU/hr), or in
                tons.
              </p>
              <p>
                For HVAC load calculation, the industry follows Manual J,
                developed by the <code>ACCA</code>, or the Manual N
                method. Manual J involves a room-by-room analysis of the
                entire house and considers external factors such as the
                square footage of each room, ceiling height, the
                home&apos;s layout, geographical location, sun exposure,
                how many windows and exterior doors there are, the
                presence of skylights, the level of insulation in walls
                and attic, the air tightness of the home, the number of
                occupants, and any heat-generating appliances or
                equipment. With these inputs, you calculate the
                building&apos;s heating and cooling load — a set of
                numbers that indicate how many BTUs per hour of cooling
                and heating are required for that specific building.
              </p>

              <div className="marker" style={{ marginTop: 52 }}>
                Why it matters.
              </div>
              <h2>Why is accurate HVAC load calculation important?</h2>
              <p>
                Getting the HVAC load calculation right helps you select
                an accurately sized unit for a building. If the system is
                undersized, it will fail to reach the desired indoor
                temperature in extreme weather and waste energy. If the
                equipment is oversized, it can cause excess wear and draw
                of power every time it starts up.
              </p>
              <p>
                If you&apos;re an HVAC business owner, this impacts your
                bottom line and reputation. An incorrectly sized
                installation can lead to customer complaints, costly
                warranty repairs, or loss of trust. When your estimated
                HVAC load is accurate, you&apos;ll deliver a solution that
                keeps the client comfortable and happy long-term.
              </p>
              <p>
                Some utility rebate programs in the U.S. now mandate an
                ACCA Manual J load calculation as part of the process for
                homeowners to qualify for HVAC upgrade incentives.
                Similarly, the International Energy Conservation Code
                (IECC) and many local building codes stipulate that new
                residential HVAC installations include documented load
                calculations for code compliance.
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
                  Cost breakdown, notes and terms included
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
              <h3>Residential use</h3>
              <div className="p-tag">
                Lower bills and better comfort for homeowners.
              </div>
              <p className="p-int">
                Choose the right size HVAC equipment and ensure the
                homeowner gets a system that fits their space and
                lifestyle.
              </p>
              <div className="it">
                <div className="it-t">
                  <b>01</b>Accurate sizing for new installation
                </div>
                <div className="it-d">
                  Using the HVAC load calculator, determine the
                  right-sized system for a new construction or a full
                  replacement.
                </div>
              </div>
              <div className="it">
                <div className="it-t">
                  <b>02</b>House renovation
                </div>
                <div className="it-d">
                  In case of new room additions or a change in the layout
                  of the house, adjust the HVAC load capacity precisely to
                  the residential building&apos;s needs.
                </div>
              </div>
              <div className="it">
                <div className="it-t">
                  <b>03</b>Supports upgrades and energy efficiency
                </div>
                <div className="it-d">
                  If there have been window replacements or other
                  upgrades that affect insulation, adjust the size
                  accordingly.
                </div>
              </div>
            </div>

            <div className="panel hot rv">
              <div className="p-eyebrow">Commercial</div>
              <h3>Commercial use</h3>
              <div className="p-tag">
                Improve customer satisfaction and reputation as an HVAC
                company.
              </div>
              <p className="p-int">
                Balance heat gains and losses on a large and dynamic scale
                precisely, without complex computer programs.
              </p>
              <div className="it">
                <div className="it-t">
                  <b>01</b>Accurate HVAC planning of an office building
                </div>
                <div className="it-d">
                  For sufficient heating and cooling, consider the number
                  of people and equipment loads to get the recommended
                  equipment capacity.
                </div>
              </div>
              <div className="it">
                <div className="it-t">
                  <b>02</b>Retail and restaurant HVAC load capacity
                </div>
                <div className="it-d">
                  Dining areas, kitchens, and storefronts have different
                  HVAC load capacities, which you can calculate easily and
                  quickly with the calculator.
                </div>
              </div>
              <div className="it">
                <div className="it-t">
                  <b>03</b>Warehouse and industrial facilities
                </div>
                <div className="it-d">
                  Tall ceilings demand more BTUs. HVAC professionals can
                  factor in high ceilings, ventilation, and
                  heat-producing appliances into load estimates.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================= WHY (factors grid) ======================= */}
      <section className="sec">
        <div className="shell">
          <div className="marker rv">Load factors.</div>
          <h2 className="rv" style={{ maxWidth: "20ch", marginBottom: 44 }}>
            What are the factors that affect HVAC load?
          </h2>
          <div className="why rv">
            <div className="why-c">
              <div className="ico">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M9 1.5L3 9h4l-1 5.5L13 7H9l1-5.5z" stroke="#EE5566" strokeWidth="1.3" strokeLinejoin="round" />
                </svg>
              </div>
              <h3>Climate and location</h3>
              <p>
                Location determines the design temperature for both
                summer and winter. You need more cooling capacity in
                Phoenix than you would in Seattle.
              </p>
            </div>
            <div className="why-c">
              <div className="ico">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 1.6l5.4 2.2v4.1c0 3.1-2.2 5.4-5.4 6.5-3.2-1.1-5.4-3.4-5.4-6.5V3.8L8 1.6z" stroke="#EE5566" strokeWidth="1.3" strokeLinejoin="round" />
                </svg>
              </div>
              <h3>Square footage and volume</h3>
              <p>
                A larger area means more air and surfaces to cool or
                heat. A home with higher ceilings has more air volume and
                a greater need for HVAC load.
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
              <h3>Insulation and building envelope</h3>
              <p>
                Walls, roof, floor, windows, and doors have a huge impact
                on HVAC load. Good insulation and tight construction
                require fewer BTUs.
              </p>
            </div>
            <div className="why-c">
              <div className="ico">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M2.5 13V7M6.8 13V3M11.2 13V9.5M15 13H1" stroke="#EE5566" strokeWidth="1.3" strokeLinecap="round" />
                </svg>
              </div>
              <h3>Sunlight exposure and occupancy</h3>
              <p>
                A room with big west-facing windows may need a slightly
                larger unit. A small house with six family members might
                also need a bigger system.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ======================= FACTORS (reasons list) ======================= */}
      <section className="sec" id="factors">
        <div className="shell">
          <div className="marker rv">Why use it.</div>
          <h2 className="rv" style={{ maxWidth: "22ch", marginBottom: 40 }}>
            Why use ZenTrades&apos; HVAC Load Calculator?
          </h2>
          <div className="fac rv">
            <div className="fac-r">
              <span className="n">01</span>
              <span className="t">Comprehensive inputs for greater accuracy</span>
              <span className="d">
                Our calculator includes key factors that affect load,
                from climate zone to sunlight exposure, without
                over-complicating the process.
              </span>
            </div>
            <div className="fac-r">
              <span className="n">02</span>
              <span className="t">Speed and convenience</span>
              <span className="d">
                No need to perform complex math yourself. Use the
                calculator on your phone and enter your inputs to get an
                accurate value instantly.
              </span>
            </div>
            <div className="fac-r">
              <span className="n">03</span>
              <span className="t">Educational value for your team</span>
              <span className="d">
                The calculator prompts a factor at a time — it subtly
                trains junior technicians or apprentices on what to
                consider when sizing equipment.
              </span>
            </div>
            <div className="fac-r">
              <span className="n">04</span>
              <span className="t">Customer trust and sales advantage</span>
              <span className="d">
                Confidently explain to a customer why a 3-ton unit is
                recommended instead of a 4-ton unit, with a proper method
                and data to back it up.
              </span>
            </div>
          </div>
          <p className="fac-note rv">
            Stop sizing HVAC systems by guesswork — a documented,
            repeatable method builds trust with clients and inspectors
            alike.
          </p>
        </div>
      </section>

      {/* ======================= CLOSING CTA ======================= */}
      <section className="sec">
        <div className="shell">
          <div className="close-w rv">
            <div className="close-hatch" aria-hidden="true" />
            <div className="marker">Ready to get started.</div>
            <h2>Size with data-driven precision</h2>
            <p>
              Stop sizing HVAC systems by guesswork. Use the ZenTrades
              HVAC Load Calculator, and ensure every installation is just
              right — keeping your clients comfortable and your
              reputation strong.
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
