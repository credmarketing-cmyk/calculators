"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import LeadGateForm, { isLeadUnlocked } from "./CalculatorLeadGate";
import { useCountUp } from "./useCountUp";

const CALCULATOR_NAME = "Power Factor Calculator";
type Stage = "input" | "gate" | "result";

function fmt(n: number, digits = 2) {
  if (!Number.isFinite(n)) return "—";
  return n.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: digits });
}

function ratingFor(pf: number) {
  if (!Number.isFinite(pf)) return { label: "—", cls: "" };
  if (pf >= 0.95) return { label: "EXCELLENT" };
  if (pf >= 0.9) return { label: "GOOD" };
  if (pf >= 0.85) return { label: "FAIR" };
  return { label: "POOR" };
}

export default function PowerFactorCalculator() {
  // Any two of {P, S, angle} determine the third — matching how the tool
  // is meant to be used (fill in whichever two you know).
  const [trueP, setTrueP] = useState<number | "">(3600);
  const [apparentS, setApparentS] = useState<number | "">(4000);
  const [angle, setAngle] = useState<number | "">("");

  const computed = useMemo(() => {
    const p = typeof trueP === "number" && Number.isFinite(trueP) ? trueP : null;
    const s = typeof apparentS === "number" && Number.isFinite(apparentS) ? apparentS : null;
    const a = typeof angle === "number" && Number.isFinite(angle) ? angle : null;

    let pf: number | null = null;
    let pOut = p;
    let sOut = s;
    let angleOut = a;

    if (p !== null && s !== null && s > 0) {
      pf = Math.min(1, Math.max(0, p / s));
      angleOut = (Math.acos(pf) * 180) / Math.PI;
    } else if (p !== null && a !== null) {
      pf = Math.cos((a * Math.PI) / 180);
      sOut = pf !== 0 ? p / pf : null;
    } else if (s !== null && a !== null) {
      pf = Math.cos((a * Math.PI) / 180);
      pOut = s * pf;
    }

    const valid = pf !== null && pOut !== null && sOut !== null && angleOut !== null;
    const reactiveQ = valid ? Math.sqrt(Math.max(0, sOut! * sOut! - pOut! * pOut!)) : 0;
    const rating = valid ? ratingFor(pf!) : ratingFor(NaN);

    return {
      valid,
      pf: pf ?? 0,
      p: pOut ?? 0,
      s: sOut ?? 0,
      angle: angleOut ?? 0,
      reactiveQ,
      rating,
    };
  }, [trueP, apparentS, angle]);

  const [stage, setStage] = useState<Stage>("input");
  const [revealKey, setRevealKey] = useState(0);
  const displayPf = useCountUp(computed.valid ? computed.pf * 100 : 0, revealKey);

  const resultRef = useRef<HTMLDivElement>(null);
  function reveal() {
    setStage("result");
    setRevealKey((k) => k + 1);
    resultRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }
  function handleCalculateClick() {
    if (!computed.valid) return;
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

  const parts = [computed.p, computed.reactiveQ];
  // P and Q are legs of a right triangle (P² + Q² = S²), not additive shares
  // of S — sum against each other instead so the bar segments total 100%.
  const sum = parts[0] + parts[1] || 1;
  const pct = parts.map((v) => (Math.max(0, v) / sum) * 100);
  const labels = ["Real power (working)", "Reactive power (wasted)"];
  const dots = ["#EE5566", "rgba(255,255,255,.28)"];

  function numOrEmpty(v: number) {
    return Number.isNaN(v) ? "" : v;
  }

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
                <span className="acc">Power factor</span>
                <br />
                <span className="tone-soft">measured</span> in seconds.
              </h1>
              <p className="lede">
                Get an accurate power factor reading in seconds and
                confidently optimize any electrical setup, residential or
                commercial.
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
                  <div className="hm-k">0–1</div>
                  <div className="hm-v">Power factor range</div>
                </div>
                <div>
                  <div className="hm-k">500+</div>
                  <div className="hm-v">Electrical contractors</div>
                </div>
                <div>
                  <div className="hm-k">P = S × PF</div>
                  <div className="hm-v">Core formula</div>
                </div>
              </div>
            </div>

            {/* ============ CALCULATOR ============ */}
            <div id="calculator">
              {stage === "input" && (
                <div className="calc">
                  <div className="calc-hd">
                    <h2>Power Factor Calculator</h2>
                    <p>Calculate power factor from true power &amp; apparent power, or phase angle.</p>
                  </div>
                  <div className="calc-bd">
                    <div className="step">
                      <div className="step-hd">
                        <span className="step-n">01</span>
                        <span className="step-t">Power values</span>
                      </div>
                      <div className="rowf">
                        <div className="field">
                          <label htmlFor="trueP">True power (P)</label>
                          <div className="ipwrap">
                            <input
                              id="trueP"
                              type="number"
                              min={0}
                              value={trueP}
                              placeholder="Watts"
                              onChange={(e) => setTrueP(numOrEmpty(e.target.valueAsNumber))}
                            />
                            <span>W</span>
                          </div>
                        </div>
                        <div className="field">
                          <label htmlFor="apparentS">Apparent power (S)</label>
                          <div className="ipwrap">
                            <input
                              id="apparentS"
                              type="number"
                              min={0}
                              value={apparentS}
                              placeholder="VA"
                              onChange={(e) => setApparentS(numOrEmpty(e.target.valueAsNumber))}
                            />
                            <span>VA</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="step">
                      <div className="step-hd">
                        <span className="step-n">02</span>
                        <span className="step-t">Or phase angle</span>
                      </div>
                      <div className="field">
                        <label htmlFor="angle">Phase angle (degrees)</label>
                        <div className="ipwrap">
                          <input
                            id="angle"
                            type="number"
                            min={0}
                            max={90}
                            value={angle}
                            placeholder="e.g. 25"
                            onChange={(e) => setAngle(numOrEmpty(e.target.valueAsNumber))}
                          />
                          <span>°</span>
                        </div>
                      </div>
                    </div>

                    <div className="calc-go">
                      <button
                        className="btn btn-1"
                        type="button"
                        onClick={handleCalculateClick}
                        disabled={!computed.valid}
                      >
                        Calculate power factor
                        <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                          <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                      <span className="hint">Fill in any two values</span>
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
                      <div className="res-lab">Power factor</div>
                      <div className="res-num">{fmt(displayPf / 100, 2)}</div>
                      <div className="res-rng">
                        Phase angle <b>{fmt(computed.angle, 1)}°</b>
                      </div>
                    </div>
                    <div className="res-pill">{computed.rating.label}</div>
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
                        <span className="v">
                          {fmt(parts[i])} {i === 0 ? "W" : "VAR"}
                        </span>
                      </div>
                    ))}
                  </div>

                  <p className="res-foot">
                    PF = P / S = cos(φ). A power factor at or above 0.95 is
                    generally considered excellent; utilities often apply
                    penalty charges below roughly 0.90–0.95. Verify against
                    your utility&apos;s specific tariff before budgeting for
                    correction.
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
              <h2>What is power factor, and what&apos;s its formula?</h2>
              <p>
                Power factor (PF) measures how effectively electrical power
                is being used by a system. In an AC circuit, voltage and
                current may not always peak at the same time, and this
                phase difference can cause some power to oscillate back and
                forth without doing useful work. Power factor is the ratio
                between real power — also called true or active power,
                measured in watts (W) — that actually performs work, and
                apparent power — measured in volt-amperes (VA) — that is
                drawn from the source:
              </p>
              <p>
                <code>PF = P / S</code>
              </p>
              <p>
                With sinusoidal waveforms, power factor is also the cosine
                of the phase angle (φ) between the current and voltage
                waveforms: <code>PF = cos(φ)</code>. If current and voltage
                are perfectly in phase, φ = 0 and cos(φ) = 1 — a power
                factor of 1, or unity power factor, meaning 100% of the
                power is being used effectively.
              </p>
              <p>
                Power factor is a dimensionless number between 0 and 1. In
                rare cases you might see a negative power factor if the
                load is actually supplying power back, but for most
                practical AC circuits you&apos;ll deal with 0 ≤ PF ≤ 1. A
                PF close to 1 means most of the power is doing useful work;
                a low PF means a significant portion is wasted in
                oscillating reactive currents.
              </p>

              <div className="marker" style={{ marginTop: 52 }}>
                Why it matters.
              </div>
              <h2>Why is power factor important?</h2>
              <p>
                Power factor affects how much usable work you get out of
                the electricity you pay for, how much extra stress your
                electrical system endures, and even how much your utility
                charges you. For any sizable electrical system — especially
                commercial or industrial — keeping an eye on power factor
                is as important as monitoring voltage and current.
              </p>
              <p>
                Whether you&apos;re sizing a correction capacitor bank or
                diagnosing a low-power-factor surcharge on a utility bill,
                this calculator gives you a fast, accurate read on where
                your system stands — fill in any two of true power,
                apparent power, or phase angle and it solves for the rest.
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
                  Correction capacitor sizing included
                </li>
                <li>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2.5 7.5l3 3 6-7" stroke="#EE5566" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Used by 500+ electrical contractors
                </li>
                <li>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2.5 7.5l3 3 6-7" stroke="#EE5566" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Export this estimate straight to ZenTrades
                </li>
              </ul>
              <Link className="btn btn-dark" href="/">
                Explore software
                <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                  <path d="M3.5 10.5l7-7M5 3.5h5.5V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
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
                Increase the life of your equipment and reduce energy
                bills.
              </div>
              <p className="p-int">
                Reduce losses in the wiring and improve the performance of
                generators and solar power inverters in your residence.
              </p>
              <div className="it">
                <div className="it-t">
                  <b>01</b>Power factor check
                </div>
                <div className="it-d">
                  Certain loads, like LED or CFL bulbs, can have low PF.
                  Identify when correction is needed by adding a capacitor
                  to improve system efficiency.
                </div>
              </div>
              <div className="it">
                <div className="it-t">
                  <b>02</b>Effect on appliances
                </div>
                <div className="it-d">
                  See how each appliance affects your overall power factor
                  and look for correction opportunities.
                </div>
              </div>
              <div className="it">
                <div className="it-t">
                  <b>03</b>Sizing backup power
                </div>
                <div className="it-d">
                  Select the right generator or solar inverter by
                  accurately measuring power demand and compensating for
                  low power factors.
                </div>
              </div>
            </div>

            <div className="panel hot rv">
              <div className="p-eyebrow">Commercial</div>
              <h3>For contractors and facility teams</h3>
              <div className="p-tag">
                Avoid hefty power factor penalties and reduce demand
                charges.
              </div>
              <p className="p-int">
                Improve overall energy efficiency and ensure motors and
                appliances receive adequate voltage and operate properly.
              </p>
              <div className="it">
                <div className="it-t">
                  <b>01</b>Avoid utility penalties
                </div>
                <div className="it-d">
                  Low power factor means inefficient power usage.
                  Calculating and correcting it can avoid utility penalties
                  and reduce energy costs.
                </div>
              </div>
              <div className="it">
                <div className="it-t">
                  <b>02</b>Optimize efficiency &amp; size
                </div>
                <div className="it-d">
                  For manufacturing plants, restaurants, or facilities
                  running heavy motor loads, size correction capacitors
                  accurately and avoid oversized equipment costs.
                </div>
              </div>
              <div className="it">
                <div className="it-t">
                  <b>03</b>Decreased energy consumption
                </div>
                <div className="it-d">
                  Fluorescent lighting, HVAC systems, and motors can
                  increase energy consumption and inefficiency — improved
                  by getting the right PF value.
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
            Why use our calculator?
          </h2>
          <div className="why rv">
            <div className="why-c">
              <div className="ico">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M9 1.5L3 9h4l-1 5.5L13 7H9l1-5.5z" stroke="#EE5566" strokeWidth="1.3" strokeLinejoin="round" />
                </svg>
              </div>
              <h3>Designed for professionals</h3>
              <p>
                Our tool focuses on the key parameters you deal with in
                real scenarios, and isn&apos;t cluttered with unnecessary
                information.
              </p>
            </div>
            <div className="why-c">
              <div className="ico">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 1.6l5.4 2.2v4.1c0 3.1-2.2 5.4-5.4 6.5-3.2-1.1-5.4-3.4-5.4-6.5V3.8L8 1.6z" stroke="#EE5566" strokeWidth="1.3" strokeLinejoin="round" />
                </svg>
              </div>
              <h3>Multiple input options</h3>
              <p>
                The calculator is flexible — input any two of the three
                values (P, S, or φ) and it calculates the rest.
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
              <h3>Integration with field service</h3>
              <p>
                While the power factor calculator is a free, standalone
                tool, it reflects our overall approach to streamlining
                field work through smart technology.
              </p>
            </div>
            <div className="why-c">
              <div className="ico">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M2.5 13V7M6.8 13V3M11.2 13V9.5M15 13H1" stroke="#EE5566" strokeWidth="1.3" strokeLinecap="round" />
                </svg>
              </div>
              <h3>Clear outputs and units</h3>
              <p>
                Our PF calculator labels everything and reduces confusion —
                knowing that P is in watts and S is in VA matters for
                consistency.
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
            Common factors that influence power factor
          </h2>
          <div className="fac rv">
            <div className="fac-r">
              <span className="n">01</span>
              <span className="t">Type of load</span>
              <span className="d">
                A resistive load results in unity PF, an inductive load
                lowers PF, and a capacitive load can raise PF and cause
                voltage instability.
              </span>
            </div>
            <div className="fac-r">
              <span className="n">02</span>
              <span className="t">Phase difference between voltage and current</span>
              <span className="d">
                A large phase difference means more of the power is
                reactive and not doing useful work — which lowers PF.
              </span>
            </div>
            <div className="fac-r">
              <span className="n">03</span>
              <span className="t">Quality of the electrical system</span>
              <span className="d">
                Poor wiring, high resistance, improper sizing, or
                over-correction with capacitors can all reduce power
                factor or destabilize the system.
              </span>
            </div>
            <div className="fac-r">
              <span className="n">04</span>
              <span className="t">Harmonics in the electrical system</span>
              <span className="d">
                Harmonics add reactive power and distortion, which can
                reduce the overall effective power factor.
              </span>
            </div>
          </div>
          <p className="fac-note rv">
            Working through these factors helps you diagnose a low reading
            and prioritize the correction that will actually move the
            needle.
          </p>
        </div>
      </section>

      {/* ======================= CLOSING CTA ======================= */}
      <section className="sec">
        <div className="shell">
          <div className="close-w rv">
            <div className="close-hatch" aria-hidden="true" />
            <div className="marker">Ready to get started.</div>
            <h2>Optimize your electrical projects</h2>
            <p>
              Use ZenTrades&apos; Power Factor Calculator today to take the
              guesswork out of your power calculations. And while
              you&apos;re at it, explore our other free resources and tools
              that make field service work simpler.
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
            <div className="ipwrap">
              <input type="email" placeholder="you@company.com" aria-label="Email address" />
            </div>
            <button className="btn btn-dark" type="button">
              Subscribe
            </button>
          </div>
          <div className="nf-note rv">One email a week · Unsubscribe anytime</div>
        </div>
      </section>
    </div>
  );
}
