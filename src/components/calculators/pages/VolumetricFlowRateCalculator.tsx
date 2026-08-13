"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import LeadGateForm, { isLeadUnlocked } from "./CalculatorLeadGate";
import { useCountUp } from "./useCountUp";
import NewsletterForm from "@/components/NewsletterForm";

const CALCULATOR_NAME = "Volumetric Flow Rate Calculator";
type Stage = "input" | "gate" | "result";
type Mode = "diameter" | "volume" | "rectangular";

function fmt(n: number, digits = 2) {
  if (!Number.isFinite(n)) return "—";
  return n.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: digits });
}

function ModeTabs({ mode, onChange }: { mode: Mode; onChange: (m: Mode) => void }) {
  const options: { label: string; value: Mode }[] = [
    { label: "Diameter & Velocity", value: "diameter" },
    { label: "Volume & Time", value: "volume" },
    { label: "Rectangular Shape", value: "rectangular" },
  ];
  return (
    <div className="chips" role="group" aria-label="Calculation mode">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          className="chip"
          aria-pressed={opt.value === mode}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

export default function VolumetricFlowRateCalculator() {
  const [mode, setMode] = useState<Mode>("diameter");

  // Mode 1: round pipe, liquid — diameter in inches, velocity in ft/s -> GPM
  const [diameter, setDiameter] = useState(2);
  const [velocity, setVelocity] = useState(6);

  // Mode 2: volume & time -> GPM
  const [volume, setVolume] = useState(100);
  const [time, setTime] = useState(2);

  // Mode 3: rectangular duct — width/height in inches, velocity in ft/min -> CFM
  const [width, setWidth] = useState(12);
  const [height, setHeight] = useState(8);
  const [ductVelocity, setDuctVelocity] = useState(600);

  const computed = useMemo(() => {
    if (mode === "diameter") {
      const dIn = Math.max(0, diameter || 0);
      const v = Math.max(0, velocity || 0);
      const rFt = dIn / 12 / 2;
      const areaFt2 = Math.PI * rFt * rFt;
      const qFt3s = areaFt2 * v;
      const qGpm = qFt3s * 448.831;
      return { unit: "GPM", value: qGpm, qFt3s, area: areaFt2 };
    }
    if (mode === "volume") {
      const vol = Math.max(0, volume || 0);
      const t = Math.max(0, time || 0);
      const qGpm = t > 0 ? vol / t : 0;
      const qFt3s = qGpm / 448.831;
      return { unit: "GPM", value: qGpm, qFt3s, area: 0 };
    }
    // rectangular
    const wIn = Math.max(0, width || 0);
    const hIn = Math.max(0, height || 0);
    const v = Math.max(0, ductVelocity || 0);
    const areaFt2 = (wIn / 12) * (hIn / 12);
    const qCfm = areaFt2 * v;
    const qFt3s = qCfm / 60;
    return { unit: "CFM", value: qCfm, qFt3s, area: areaFt2 };
  }, [mode, diameter, velocity, volume, time, width, height, ductVelocity]);

  const equivalents = useMemo(() => {
    if (computed.unit === "GPM") {
      return [
        { k: "In liters / minute", v: `${fmt(computed.value * 3.78541)} L/min` },
        { k: "In cubic feet / second", v: `${fmt(computed.qFt3s, 4)} ft³/s` },
        { k: "In cubic meters / hour", v: `${fmt(computed.value * 0.227125)} m³/hr` },
      ];
    }
    return [
      { k: "In liters / minute", v: `${fmt(computed.value * 28.3168)} L/min` },
      { k: "In cubic feet / second", v: `${fmt(computed.qFt3s, 3)} ft³/s` },
      { k: "In cubic meters / hour", v: `${fmt(computed.value * 1.699)} m³/hr` },
    ];
  }, [computed]);

  const [stage, setStage] = useState<Stage>("input");
  const [revealKey, setRevealKey] = useState(0);
  const displayValue = useCountUp(computed.value * 100, revealKey);

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
                <span className="acc">Volumetric flow rate</span>
                <br />
                <span className="tone-soft">calculated</span> your way.
              </h1>
              <p className="lede">
                Calculate the flow rate swiftly, whether it&apos;s water or
                air in a pipe or duct, in whatever units you need.
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
                <Link className="btn btn-3" href="/#calculators">
                  Explore tools
                  <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                    <path d="M3.5 10.5l7-7M5 3.5h5.5V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              </div>
              <div className="hero-meta">
                <div>
                  <div className="hm-k">Q = A × v</div>
                  <div className="hm-v">Core formula</div>
                </div>
                <div>
                  <div className="hm-k">3</div>
                  <div className="hm-v">Calculation modes</div>
                </div>
                <div>
                  <div className="hm-k">500+</div>
                  <div className="hm-v">Field service pros</div>
                </div>
              </div>
            </div>

            {/* ============ CALCULATOR ============ */}
            <div id="calculator">
              {stage === "input" && (
                <div className="calc">
                  <div className="calc-hd">
                    <h2>Flow Rate Calculator</h2>
                    <p>Pick a calculation mode based on what you know.</p>
                  </div>
                  <div className="calc-bd">
                    <div className="step">
                      <div className="step-hd">
                        <span className="step-n">01</span>
                        <span className="step-t">Calculation mode</span>
                      </div>
                      <ModeTabs mode={mode} onChange={setMode} />
                    </div>

                    {mode === "diameter" && (
                      <div className="step">
                        <div className="step-hd">
                          <span className="step-n">02</span>
                          <span className="step-t">Pipe diameter &amp; velocity</span>
                        </div>
                        <div className="rowf">
                          <div className="field">
                            <label htmlFor="diameter">Diameter</label>
                            <div className="ipwrap">
                              <input id="diameter" type="number" min={0} step={0.1} value={diameter} onChange={(e) => setDiameter(e.target.valueAsNumber)} />
                              <span>in</span>
                            </div>
                          </div>
                          <div className="field">
                            <label htmlFor="velocity">Velocity</label>
                            <div className="ipwrap">
                              <input id="velocity" type="number" min={0} step={0.1} value={velocity} onChange={(e) => setVelocity(e.target.valueAsNumber)} />
                              <span>ft/s</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {mode === "volume" && (
                      <div className="step">
                        <div className="step-hd">
                          <span className="step-n">02</span>
                          <span className="step-t">Volume &amp; time</span>
                        </div>
                        <div className="rowf">
                          <div className="field">
                            <label htmlFor="volume">Volume</label>
                            <div className="ipwrap">
                              <input id="volume" type="number" min={0} value={volume} onChange={(e) => setVolume(e.target.valueAsNumber)} />
                              <span>gal</span>
                            </div>
                          </div>
                          <div className="field">
                            <label htmlFor="time">Time</label>
                            <div className="ipwrap">
                              <input id="time" type="number" min={0} step={0.1} value={time} onChange={(e) => setTime(e.target.valueAsNumber)} />
                              <span>min</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {mode === "rectangular" && (
                      <div className="step">
                        <div className="step-hd">
                          <span className="step-n">02</span>
                          <span className="step-t">Duct dimensions &amp; velocity</span>
                        </div>
                        <div className="rowf">
                          <div className="field">
                            <label htmlFor="width">Width</label>
                            <div className="ipwrap">
                              <input id="width" type="number" min={0} value={width} onChange={(e) => setWidth(e.target.valueAsNumber)} />
                              <span>in</span>
                            </div>
                          </div>
                          <div className="field">
                            <label htmlFor="height">Height</label>
                            <div className="ipwrap">
                              <input id="height" type="number" min={0} value={height} onChange={(e) => setHeight(e.target.valueAsNumber)} />
                              <span>in</span>
                            </div>
                          </div>
                        </div>
                        <div className="field" style={{ marginTop: 18 }}>
                          <label htmlFor="ductVelocity">Air velocity</label>
                          <div className="ipwrap">
                            <input id="ductVelocity" type="number" min={0} value={ductVelocity} onChange={(e) => setDuctVelocity(e.target.valueAsNumber)} />
                            <span>ft/min</span>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="calc-go">
                      <button className="btn btn-1" type="button" onClick={handleCalculateClick}>
                        Calculate now
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
                      <div className="res-lab">Volumetric flow rate</div>
                      <div className="res-num">
                        {fmt(displayValue / 100)} {computed.unit}
                      </div>
                    </div>
                    <div className="res-pill">{mode === "rectangular" ? "AIR" : "LIQUID"}</div>
                  </div>

                  <div className="brk">
                    {equivalents.map((row) => (
                      <div className="brk-r" key={row.k}>
                        <i style={{ background: "rgba(255,255,255,.28)" }} />
                        <span className="k">{row.k}</span>
                        <span className="v">{row.v}</span>
                      </div>
                    ))}
                  </div>

                  <p className="res-foot">
                    Q = A × v (area × velocity), or Q = V / t (volume ÷
                    time). Assumes steady, incompressible flow filling the
                    full cross-section — actual field results can vary
                    with fittings, elevation change, and partial fill.
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
              <h2>What is volumetric flow rate, and how do you calculate it?</h2>
              <p>
                Volumetric flow rate is the volume of fluid that passes
                through a given area per unit of time. It tells you how
                fast a fluid is flowing, as opposed to just how fast it
                moves. We usually denote flow rate by the symbol Q, and it
                can be measured in various units. The standard SI unit is
                cubic meters per second (m³/s), but in everyday field use,
                you&apos;ll often see gallons per minute (GPM) in the US,
                liters per second (L/s) in metric contexts, or cubic feet
                per minute (CFM) when dealing with airflow. No matter the
                units, the concept is the same, which is volume over time.
                The fundamental formula for the volume flow rate is:
              </p>
              <p>
                <code>Q = A × v</code>
              </p>
              <p>
                Here, A is the cross-sectional area of the flow, and v is
                the velocity of the fluid flow. The area (A) is typically
                the internal cross-sectional area of a pipe or duct. For a
                round pipe, you calculate A = π(diameter/2)². For a
                rectangular duct or channel, A = width × height. The
                velocity (v) is how fast the fluid moves through that
                cross-section. Once you multiply them together, you get
                Q, the volumetric flow rate, in units of volume per time.
              </p>
              <p>
                So, suppose you have a 2-inch diameter pipe with water
                flowing at 6 feet per second. To calculate flow rate,
                first convert the diameter to feet (2 inches is 0.167 ft)
                and find the area, which will be about 0.022 sq ft. Then
                multiply by the velocity (6 ft/s), and you get roughly
                0.134 cubic feet per second. If your pipe holds gallons,
                that&apos;s about 60 gallons per minute of fluid flowing at
                that cross-section. The math can get trickier with
                different units and bigger numbers — which is exactly why
                this calculator exists.
              </p>

              <div className="marker" style={{ marginTop: 52 }}>
                Why it matters.
              </div>
              <h2>Why volume flow rate matters so much in field service</h2>
              <p>
                It&apos;s important to accurately calculate and plan for
                flow rates. It helps in proper installations so that
                systems achieve their desired outcomes without undue delay
                or inefficiency. For example, fire hydrant and hydrant
                systems must have sufficient water flow to extinguish
                fires. In fact, NFPA standards say that even a small
                residential home&apos;s fire hydrant should provide at
                least 500 gallons per minute of flow for firefighting.
                Similarly, industrial processes may require certain flow
                rate to be accurate to ensure proper heating or cooling
                pressure build-up, or to ensure equipment functions
                correctly.
              </p>
              <p>
                Also, if you overshoot a flow requirement, it will drive
                the cost up while understocking it can cause downtime and
                expensive retrofits later. For plumbing contractors, this
                might mean the difference between making sure a
                circulation pump is powerful enough but not overly so. For
                HVAC companies, it could mean verifying that ductwork
                modifications won&apos;t choke off airflow to parts of a
                building. In sum, understanding flow rate helps balance
                performance with efficiency, keeping systems within safe
                and effective operating ranges. It&apos;s no wonder that
                savvy field service professionals consider flow
                calculations a fundamental part of their job, and why
                having a quick calculator for it is so valuable.
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
                  Flow rate breakdown included
                </li>
                <li>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2.5 7.5l3 3 6-7" stroke="#EE5566" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Used by 500+ field service contractors
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
              <h3>Residential use of flow rate calculator</h3>
              <div className="p-tag">
                Measure water flow to diagnose issues. Make better design
                decisions up front.
              </div>
              <p className="p-int">
                Translate the water pressure complaints or uneven cooling
                into actionable data. Plan and troubleshoot effectively.
              </p>
              <div className="it">
                <div className="it-t">
                  <b>01</b>Diagnosing low water pressure
                </div>
                <div className="it-d">
                  If a household has low water pressure at a faucet, the
                  actual outlet GPM might be below what fixtures require —
                  check if it indicates a blockage.
                </div>
              </div>
              <div className="it">
                <div className="it-t">
                  <b>02</b>Installing water heaters and designing irrigation systems
                </div>
                <div className="it-d">
                  Calculate the expected hot water flow for the home to
                  ensure the water heater can keep up, or design a lawn
                  irrigation system that waters evenly with an accurate
                  GPM value.
                </div>
              </div>
              <div className="it">
                <div className="it-t">
                  <b>03</b>Ensure comfort in new spaces
                </div>
                <div className="it-d">
                  If converting a garage into a living space, the
                  rectangular flow calculator can estimate if a 6&quot;x10&quot;
                  duct at a certain fan speed will provide enough CFM
                  airflow to that room.
                </div>
              </div>
            </div>

            <div className="panel hot rv">
              <div className="p-eyebrow">Commercial</div>
              <h3>Commercial use of flow rate calculator</h3>
              <div className="p-tag">
                Make accurate flow measurements. Ensure energy efficiency
                and code compliance.
              </div>
              <p className="p-int">
                Get accurate flow rates and stop wrestling with unit
                conversions or second-guessing whether a formula was
                remembered correctly.
              </p>
              <div className="it">
                <div className="it-t">
                  <b>01</b>HVAC and building management
                </div>
                <div className="it-d">
                  In a multi-story office building&apos;s ventilation
                  system, calculating the volume velocity helps balance
                  the HVAC system so that the top floor isn&apos;t starved
                  of air in summer.
                </div>
              </div>
              <div className="it">
                <div className="it-t">
                  <b>02</b>Retrofitting or expanding HVAC systems
                </div>
                <div className="it-d">
                  If adding a new classroom in a factory, you can compute
                  how much additional airflow is needed and what flow
                  rate through the new ducts is needed to maintain proper
                  air exchange.
                </div>
              </div>
              <div className="it">
                <div className="it-t">
                  <b>03</b>Extensive sprinkler networks and fire pumps
                </div>
                <div className="it-d">
                  Calculate the required GPM at the most remote sprinkler
                  head to ensure the fire code design meets the design
                  criteria, and convert volumetric flow units during a
                  fire pump test.
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
            Why use ZenTrades&apos; Flow Rate Calculator?
          </h2>
          <div className="why rv">
            <div className="why-c">
              <div className="ico">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M9 1.5L3 9h4l-1 5.5L13 7H9l1-5.5z" stroke="#EE5566" strokeWidth="1.3" strokeLinejoin="round" />
                </svg>
              </div>
              <h3>Multiple calculation modes</h3>
              <p>
                Our calculator has three different tabs to suit the
                information you have on hand — it&apos;s not limited to
                one formula.
              </p>
            </div>
            <div className="why-c">
              <div className="ico">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 1.6l5.4 2.2v4.1c0 3.1-2.2 5.4-5.4 6.5-3.2-1.1-5.4-3.4-5.4-6.5V3.8L8 1.6z" stroke="#EE5566" strokeWidth="1.3" strokeLinejoin="round" />
                </svg>
              </div>
              <h3>Flexible unit options</h3>
              <p>
                Instant conversions to liters/minute, cubic feet/second,
                and cubic meters/hour reduce manual unit-conversion
                errors.
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
              <h3>Fast and user-friendly</h3>
              <p>
                Use a different mode depending on the information you
                have — the interface is straightforward so anyone can use
                it.
              </p>
            </div>
            <div className="why-c">
              <div className="ico">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M2.5 13V7M6.8 13V3M11.2 13V9.5M15 13H1" stroke="#EE5566" strokeWidth="1.3" strokeLinecap="round" />
                </svg>
              </div>
              <h3>Accurate measurement</h3>
              <p>
                The formulas behind the calculator are based on standard
                engineering principles and fluid mechanics — they&apos;ve
                been tested against known examples.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ======================= FACTORS ======================= */}
      <section className="sec" id="factors">
        <div className="shell">
          <div className="marker rv">Influencing factors.</div>
          <h2 className="rv" style={{ maxWidth: "20ch", marginBottom: 40 }}>
            The factors that affect flow rate value
          </h2>
          <div className="fac rv">
            <div className="fac-r">
              <span className="n">01</span>
              <span className="t">Pipe or duct diameter</span>
              <span className="d">
                Doubling the diameter of a pipe increases the
                cross-sectional area, and thus the potential flow rate, by
                a factor of four.
              </span>
            </div>
            <div className="fac-r">
              <span className="n">02</span>
              <span className="t">Fluid velocity</span>
              <span className="d">
                Velocity is the speed at which the fluid moves through the
                system. Higher fluid velocity generally leads to a higher
                flow rate.
              </span>
            </div>
            <div className="fac-r">
              <span className="n">03</span>
              <span className="t">Temperature and pressure</span>
              <span className="d">
                Higher temperatures can reduce both fluid density and
                viscosity. A higher pressure differential increases fluid
                velocity, and thus, flow rate.
              </span>
            </div>
            <div className="fac-r">
              <span className="n">04</span>
              <span className="t">System friction and obstructions</span>
              <span className="d">
                Frictional losses due to pipe roughness, fittings, valves,
                and other obstructions reduce the average velocity and,
                therefore, lower the flow rate.
              </span>
            </div>
          </div>
          <p className="fac-note rv">
            Save time, avoid headaches, and keep the fluid moving smoothly
            — try ZenTrades&apos; Volumetric Flow Rate Calculator and make
            the calculations faster and easier, whether it&apos;s for
            plumbing, HVAC, fire safety, or industrial service.
          </p>
        </div>
      </section>

      {/* ======================= CLOSING CTA ======================= */}
      <section className="sec">
        <div className="shell">
          <div className="close-w rv">
            <div className="close-hatch" aria-hidden="true" />
            <div className="marker">Ready to get started.</div>
            <h2>Calculate flow rate the easy way</h2>
            <p>
              Save time, avoid headaches, and keep the fluid moving
              smoothly. Try ZenTrades&apos; Volumetric Flow Rate Calculator
              and make the calculations faster and easier — whether it&apos;s
              for plumbing, HVAC, fire safety, or industrial service.
            </p>
            <div className="hero-cta">
              <a className="btn btn-1" href="#calculator">
                Try the calculator
                <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                  <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
              <a className="btn btn-2" href="#software">
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
