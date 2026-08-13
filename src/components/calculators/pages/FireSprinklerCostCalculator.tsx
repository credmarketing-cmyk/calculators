"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import LeadGateForm, { isLeadUnlocked } from "./CalculatorLeadGate";
import { useCountUp } from "./useCountUp";
import NewsletterForm from "@/components/NewsletterForm";

const CALCULATOR_NAME = "Fire Sprinkler Installation Cost Calculator";
type Stage = "input" | "gate" | "result";

const HEAD_COST = 145; // installed cost per head incl. fittings

const HAZARD_OPTIONS = [
  { label: "Light", mult: 1 },
  { label: "Ordinary", mult: 1.18 },
  { label: "Extra", mult: 1.42 },
];
const SYSTEM_OPTIONS = [
  { label: "Wet pipe", mult: 1 },
  { label: "Dry pipe", mult: 1.22 },
  { label: "Pre-action", mult: 1.38 },
  { label: "Deluge", mult: 1.5 },
];
const MATERIAL_OPTIONS = [
  { label: "CPVC", mult: 1 },
  { label: "Steel", mult: 1.16 },
  { label: "Copper", mult: 1.42 },
];

function money(n: number) {
  return "$" + Math.round(n).toLocaleString("en-US");
}

function ChipGroup({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { label: string; mult: number }[];
  value: number;
  onChange: (mult: number) => void;
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
          {opt.label} <small>×{opt.mult.toFixed(2)}</small>
        </button>
      ))}
    </div>
  );
}

export default function FireSprinklerCostCalculator() {
  const [area, setArea] = useState(2000);
  const [heads, setHeads] = useState(18);
  const [labor, setLabor] = useState(5);
  const [matCost, setMatCost] = useState(4);
  const [hazard, setHazard] = useState(1);
  const [system, setSystem] = useState(1);
  const [material, setMaterial] = useState(1);

  const computed = useMemo(() => {
    const a = Math.max(0, area || 0);
    const h = Math.max(0, heads || 0);
    const l = Math.max(0, labor || 0);
    const m = Math.max(0, matCost || 0);

    const laborBase = a * l;
    const matBase = a * m * material;
    const headsCost = h * HEAD_COST;
    const adjust = (laborBase + matBase) * (hazard * system - 1);
    const total = laborBase + matBase + headsCost + adjust;

    const parts = [laborBase, matBase, headsCost, adjust];
    const sum = total || 1;
    const pct = parts.map((p) => (Math.max(0, p) / sum) * 100);

    return {
      parts,
      pct,
      total,
      lo: total * 0.88,
      hi: total * 1.12,
      perSqFt: a > 0 ? total / a : 0,
    };
  }, [area, heads, labor, matCost, hazard, system, material]);

  // input -> gate -> result. Inputs and the result are mutually exclusive
  // views (the result replaces the calculator, it doesn't sit below it).
  const [stage, setStage] = useState<Stage>("input");
  const [revealKey, setRevealKey] = useState(0);
  const displayTotal = useCountUp(computed.total, revealKey);

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

  // Scroll-reveal for every .rv element on the page.
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

  const labels = ["Labor", "Pipe & materials", "Sprinkler heads", "Hazard & system adjustment"];
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
                <span className="acc">Fire sprinkler installation</span>
                <br />
                <span className="tone-soft">cost,</span> settled in a minute.
              </h1>
              <p className="lede">
                Get a quick, accurate installation estimate for residential
                and commercial projects — built on NFPA 13, 13R and 13D
                design logic. No sign-up, no waiting on quotes.
              </p>
              <div className="hero-cta">
                <a className="btn btn-1" href="#calculator">
                  Start estimating
                  <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                    <path
                      d="M2 7h10M8 3l4 4-4 4"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </a>
                <a className="btn btn-2" href="#how">
                  How it works
                </a>
                <Link className="btn btn-3" href="/#calculators">
                  Explore tools
                  <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                    <path
                      d="M3.5 10.5l7-7M5 3.5h5.5V9"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Link>
              </div>
              <div className="hero-meta">
                <div>
                  <div className="hm-k">$2.7k–5k</div>
                  <div className="hm-v">NFPA avg · 2,000 sq ft home</div>
                </div>
                <div>
                  <div className="hm-k">500+</div>
                  <div className="hm-v">Fire system contractors</div>
                </div>
                <div>
                  <div className="hm-k">13 / 13R / 13D</div>
                  <div className="hm-v">Standards covered</div>
                </div>
              </div>
            </div>

            {/* ============ CALCULATOR ============ */}
            <div id="calculator">
              {stage === "input" && (
                <div className="calc">
                  <div className="calc-hd">
                    <h2>Find out your project cost</h2>
                    <p>Plan better. Spend smarter. Start with a quick estimate.</p>
                  </div>
                  <div className="calc-bd">
                    <div className="step">
                      <div className="step-hd">
                        <span className="step-n">01</span>
                        <span className="step-t">Project size</span>
                      </div>
                      <div className="rowf">
                        <div className="field">
                          <label htmlFor="area">Area (square feet)</label>
                          <div className="ipwrap">
                            <input
                              id="area"
                              type="number"
                              min={1}
                              value={area}
                              placeholder="e.g. 2000"
                              onChange={(e) => setArea(e.target.valueAsNumber)}
                            />
                          </div>
                        </div>
                        <div className="field">
                          <label htmlFor="heads">Sprinkler heads (quantity)</label>
                          <div className="ipwrap">
                            <input
                              id="heads"
                              type="number"
                              min={0}
                              value={heads}
                              placeholder="e.g. 12"
                              onChange={(e) => setHeads(e.target.valueAsNumber)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="step">
                      <div className="step-hd">
                        <span className="step-n">02</span>
                        <span className="step-t">Hazard level</span>
                      </div>
                      <ChipGroup
                        label="Hazard level"
                        options={HAZARD_OPTIONS}
                        value={hazard}
                        onChange={setHazard}
                      />
                    </div>

                    <div className="step">
                      <div className="step-hd">
                        <span className="step-n">03</span>
                        <span className="step-t">System type</span>
                      </div>
                      <ChipGroup
                        label="System type"
                        options={SYSTEM_OPTIONS}
                        value={system}
                        onChange={setSystem}
                      />
                    </div>

                    <div className="step">
                      <div className="step-hd">
                        <span className="step-n">04</span>
                        <span className="step-t">Pipe material</span>
                      </div>
                      <ChipGroup
                        label="Pipe material"
                        options={MATERIAL_OPTIONS}
                        value={material}
                        onChange={setMaterial}
                      />
                    </div>

                    <div className="step">
                      <div className="step-hd">
                        <span className="step-n">05</span>
                        <span className="step-t">Your rates</span>
                      </div>
                      <div className="rowf">
                        <div className="field">
                          <label htmlFor="labor">Labor cost (per sq ft)</label>
                          <div className="ipwrap">
                            <span>$</span>
                            <input
                              id="labor"
                              type="number"
                              min={0}
                              step={0.5}
                              value={labor}
                              placeholder="e.g. 5"
                              onChange={(e) => setLabor(e.target.valueAsNumber)}
                            />
                          </div>
                        </div>
                        <div className="field">
                          <label htmlFor="matcost">Material cost (per sq ft)</label>
                          <div className="ipwrap">
                            <span>$</span>
                            <input
                              id="matcost"
                              type="number"
                              min={0}
                              step={0.5}
                              value={matCost}
                              placeholder="e.g. 4"
                              onChange={(e) => setMatCost(e.target.valueAsNumber)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="calc-go">
                      <button className="btn btn-1" type="button" onClick={handleCalculateClick}>
                        Calculate total cost
                        <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                          <path
                            d="M2 7h10M8 3l4 4-4 4"
                            stroke="currentColor"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
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
                      <div className="res-lab">Estimated installed cost</div>
                      <div className="res-num">{money(displayTotal)}</div>
                      <div className="res-rng">
                        Likely range <b>{money(computed.lo)}</b> — <b>{money(computed.hi)}</b>
                      </div>
                    </div>
                    <div className="res-pill">{`$${computed.perSqFt.toFixed(2)} / sq ft`}</div>
                  </div>

                  <div className="bar" aria-hidden="true">
                    {computed.pct.map((p, i) => (
                      <i key={i} style={{ width: `${p.toFixed(1)}%` }} />
                    ))}
                  </div>

                  <div className="brk">
                    {labels.map((label, i) => (
                      <div className="brk-r" key={label}>
                        <i style={{ background: dots[i] }} />
                        <span className="k">{label}</span>
                        <span className="s">{Math.round(computed.pct[i])}%</span>
                        <span className="v">{money(computed.parts[i])}</span>
                      </div>
                    ))}
                  </div>

                  <p className="res-foot">
                    Budget estimate only. Figures follow NFPA 13/13R/13D
                    design logic and typical installed averages — final
                    pricing depends on water supply, local fire codes, and
                    site access. Verify against a stamped design before
                    issuing a quote.
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

      {/* ======================= PLAN BAND ======================= */}
      <section className="plan" aria-hidden="true">
        <div className="plan-in">
          <div className="plan-cap">
            <span>Typical branch line layout</span>
            <span>
              <b>NFPA 13</b> · Pendent heads @ 12&apos;-0&quot; o.c.
            </span>
          </div>
        </div>
        <svg viewBox="0 0 1400 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <g id="hd">
              <circle r="6.5" fill="#FFFFFF" stroke="#EE5566" strokeWidth="1.2" />
              <circle r="1.9" fill="#EE5566" />
              <path
                d="M-10 0h3.5M6.5 0h3.5M0-10v3.5M0 6.5v3.5"
                stroke="#EE5566"
                strokeWidth="1.2"
              />
            </g>
          </defs>
          <path d="M0 116h1400" stroke="#0B0B0C" strokeWidth="1.8" opacity=".34" />
          <g stroke="#0B0B0C" strokeWidth="1" opacity=".24">
            <path d="M110 116V56M270 116V56M430 116V56M590 116V56M750 116V56M910 116V56M1070 116V56M1230 116V56M1350 116V56" />
            <path d="M190 116v48M350 116v48M510 116v48M670 116v48M830 116v48M990 116v48M1150 116v48M1310 116v48" />
          </g>
          <g className="hd-live">
            <use href="#hd" x="110" y="56" /><use href="#hd" x="270" y="56" /><use href="#hd" x="430" y="56" />
            <use href="#hd" x="590" y="56" /><use href="#hd" x="750" y="56" /><use href="#hd" x="910" y="56" />
            <use href="#hd" x="1070" y="56" /><use href="#hd" x="1230" y="56" /><use href="#hd" x="1350" y="56" />
          </g>
          <g className="hd-live" style={{ animationDelay: ".15s" }}>
            <use href="#hd" x="190" y="164" /><use href="#hd" x="350" y="164" /><use href="#hd" x="510" y="164" />
            <use href="#hd" x="670" y="164" /><use href="#hd" x="830" y="164" /><use href="#hd" x="990" y="164" />
            <use href="#hd" x="1150" y="164" /><use href="#hd" x="1310" y="164" />
          </g>
          <g>
            <circle cx="40" cy="116" r="11" fill="#FFFFFF" stroke="#EE5566" strokeWidth="1.4" />
            <path d="M34 116h12M40 110v12" stroke="#EE5566" strokeWidth="1.4" />
          </g>
          <g opacity=".34">
            <path d="M110 30h160" stroke="#0B0B0C" strokeWidth="1" />
            <path d="M110 25v10M270 25v10" stroke="#0B0B0C" strokeWidth="1" />
            <text x="158" y="21" fontFamily="var(--display)" fontSize="11" fill="#0B0B0C">
              12&apos;-0&quot;
            </text>
          </g>
        </svg>
      </section>

      {/* ======================= ABOUT / HOW ======================= */}
      <section className="sec" id="how" style={{ borderTop: 0 }}>
        <div className="shell">
          <div className="art">
            <div className="rv">
              <div className="marker">What it does.</div>
              <h2>Estimate fire sprinkler installation costs in minutes</h2>
              <p>
                Estimating a fire sprinkler installation — and making sure
                the water supply holds up — gets complicated fast, because
                so many factors move the final budget. <code>NFPA 13</code>{" "}
                (commercial), <code>13R</code> (multifamily) and{" "}
                <code>13D</code> (one- and two-family homes) each carry
                different design requirements that change both material and
                labor.
              </p>
              <p>
                According to the National Fire Protection Association, a
                standard system for a 2,000 sq ft home runs roughly{" "}
                <b>$2,700–$5,000</b>. This calculator brings precision to
                that number. Enter the project details — area, hazard level,
                system type, labor rate — and you get an instant,
                NFPA-aligned cost range for residential, commercial, and
                industrial buildings. It helps builders and facility
                managers budget in line with NFPA 13/13R/13D and local
                codes, before quotes are finalized.
              </p>
              <p>
                Sprinkler heads are the core of any water-based suppression
                system, and their count drives both performance and price. A
                larger building or a higher hazard classification needs more
                heads and more pipe, which raises cost accordingly. By
                accounting for hazard classification and system type — wet,
                dry, pre-action, deluge — the estimate reflects real design
                requirements rather than a flat per-foot guess.
              </p>

              <div className="marker" style={{ marginTop: 52 }}>
                How you use it.
              </div>
              <h2>Working the calculator</h2>
              <p>
                Costing an installation by hand is slow. This tool automates
                it with built-in logic aligned to NFPA codes: vary the
                square footage, hazard level, material cost or head count,
                and watch each factor move the price in real time. That
                saves hours of spreadsheet work and takes the guesswork out
                of quoting.
              </p>
              <p>
                Whether you&apos;re designing a new home system under{" "}
                <code>NFPA 13D</code> or specifying a commercial project
                under <code>NFPA 13</code>, you get an up-to-date average
                cost. It&apos;s the quickest route to a budget number you
                can defend.
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
                    <path
                      d="M2.5 7.5l3 3 6-7"
                      stroke="#EE5566"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Cost breakdown, notes and terms included
                </li>
                <li>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path
                      d="M2.5 7.5l3 3 6-7"
                      stroke="#EE5566"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Used by 500+ fire system contractors
                </li>
                <li>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path
                      d="M2.5 7.5l3 3 6-7"
                      stroke="#EE5566"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Export this estimate straight to ZenTrades
                </li>
              </ul>
              <a className="btn btn-dark" href="https://zentrades.pro" target="_blank" rel="noopener noreferrer">
                Explore software
                <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                  <path
                    d="M3.5 10.5l7-7M5 3.5h5.5V9"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
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
                Make informed decisions and improve property safety with
                precision.
              </div>
              <p className="p-int">
                Estimate sprinkler costs for your home — new build or safety
                upgrade — without chasing multiple contractor quotes.
              </p>
              <div className="it">
                <div className="it-t">
                  <b>01</b>New home construction
                </div>
                <div className="it-d">
                  Gauge sprinkler costs for a single-family residence
                  quickly, based on square footage, system type, material
                  and hazard level.
                </div>
              </div>
              <div className="it">
                <div className="it-t">
                  <b>02</b>Home renovation
                </div>
                <div className="it-d">
                  Estimate the cost of retrofitting an existing building.
                  Retrofits usually run higher than new construction because
                  of installation labor and access challenges.
                </div>
              </div>
              <div className="it">
                <div className="it-t">
                  <b>03</b>Insurance and resale planning
                </div>
                <div className="it-d">
                  See how sprinklers affect home value. With upfront costs
                  in hand, you can weigh safety as a selling point.
                </div>
              </div>
            </div>

            <div className="panel hot rv">
              <div className="p-eyebrow">Commercial</div>
              <h3>For contractors and facility teams</h3>
              <div className="p-tag">
                Optimize budget accuracy and drive project efficiency with
                accurate cost insights.
              </div>
              <p className="p-int">
                Streamline commercial estimation at any scale, from office
                fit-outs to high-hazard facilities.
              </p>
              <div className="it">
                <div className="it-t">
                  <b>01</b>New office and warehouse projects
                </div>
                <div className="it-d">
                  Set budgets for commercial occupancies under NFPA 13.
                  Ordinary-hazard occupancies use a lower density;
                  high-hazard raises design demand.
                </div>
              </div>
              <div className="it">
                <div className="it-t">
                  <b>02</b>High-hazard environments
                </div>
                <div className="it-d">
                  For manufacturing plants, restaurants or storage areas
                  needing dry-pipe, pre-action or deluge systems, the higher
                  equipment cost is factored in.
                </div>
              </div>
              <div className="it">
                <div className="it-t">
                  <b>03</b>Bids and proposals
                </div>
                <div className="it-d">
                  Generate quick preliminary quotes. Toggle material options
                  to produce a range you can present, sharpen a competitive
                  bid, and clarify scope before detailed design.
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
          <h2 className="rv" style={{ maxWidth: "20ch", marginBottom: 44 }}>
            Built for the way estimates actually get made
          </h2>
          <div className="why rv">
            <div className="why-c">
              <div className="ico">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M9 1.5L3 9h4l-1 5.5L13 7H9l1-5.5z"
                    stroke="#EE5566"
                    strokeWidth="1.3"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3>Fast, accurate total cost</h3>
              <p>
                Uses industry benchmarks for new installations, including
                high-rise work, so instant estimates reflect real-world
                averages rather than rounded rules of thumb.
              </p>
            </div>
            <div className="why-c">
              <div className="ico">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M8 1.6l5.4 2.2v4.1c0 3.1-2.2 5.4-5.4 6.5-3.2-1.1-5.4-3.4-5.4-6.5V3.8L8 1.6z"
                    stroke="#EE5566"
                    strokeWidth="1.3"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3>Aligned to NFPA standards</h3>
              <p>
                Calculations follow NFPA 13/13R/13D guidelines and local
                fire codes — separating light-hazard office space from
                extra-hazard manufacturing so density requirements are
                respected.
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
              <h3>Parameters you control</h3>
              <p>
                Run what-if scenarios — see exactly how adding sprinkler
                heads moves the budget. Those comparisons help you optimize
                design choices and avoid surprise expenses.
              </p>
            </div>
            <div className="why-c">
              <div className="ico">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M2.5 13V7M6.8 13V3M11.2 13V9.5M15 13H1"
                    stroke="#EE5566"
                    strokeWidth="1.3"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <h3>Compare scenarios instantly</h3>
              <p>
                Fire protection engineer or homeowner, the interface bridges
                detailed NFPA calculation and plain-language budgeting
                without losing technical depth.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ======================= FACTORS ======================= */}
      <section className="sec" id="factors">
        <div className="shell">
          <div className="marker rv">Cost factors.</div>
          <h2 className="rv" style={{ maxWidth: "18ch", marginBottom: 40 }}>
            What actually moves the number
          </h2>
          <div className="fac rv">
            <div className="fac-r">
              <span className="n">01</span>
              <span className="t">Building size</span>
              <span className="d">
                More area means more sprinklers and more pipe — the single
                largest driver of total cost.
              </span>
            </div>
            <div className="fac-r">
              <span className="n">02</span>
              <span className="t">Occupancy hazard class</span>
              <span className="d">
                Design density follows hazard. Light-hazard offices and
                apartments cost less to cover than a warehouse holding
                flammable goods, because required flow rates are lower.
              </span>
            </div>
            <div className="fac-r">
              <span className="n">03</span>
              <span className="t">System type</span>
              <span className="d">
                Wet-pipe is the simplest design. Dry-pipe, pre-action and
                deluge systems add parts and labor.
              </span>
            </div>
            <div className="fac-r">
              <span className="n">04</span>
              <span className="t">Pipe material</span>
              <span className="d">
                Steel or copper pipe raises cost noticeably, so material
                choice carries real weight in the estimate.
              </span>
            </div>
            <div className="fac-r">
              <span className="n">05</span>
              <span className="t">Sprinkler head count</span>
              <span className="d">
                Unusual layouts — sloped ceilings, obstructions — need
                special heads or tighter spacing, pushing the count and the
                total up.
              </span>
            </div>
          </div>
          <p className="fac-note rv">
            Working through these factors helps you justify a proposal and
            tune a design to hit budget targets without sacrificing fire
            safety.
          </p>
        </div>
      </section>

      {/* ======================= CLOSING CTA ======================= */}
      <section className="sec">
        <div className="shell">
          <div className="close-w rv">
            <div className="close-hatch" aria-hidden="true" />
            <div className="marker">Ready to get started.</div>
            <h2>Get your custom estimate today</h2>
            <p>
              Enter your project details and the calculator returns an
              accurate cost range in seconds. New home or large commercial
              building — take the guesswork out of sprinkler system
              planning.
            </p>
            <div className="hero-cta">
              <a className="btn btn-1" href="#calculator">
                Try the calculator
                <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                  <path
                    d="M2 7h10M8 3l4 4-4 4"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
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
