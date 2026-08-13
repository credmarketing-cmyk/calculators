"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import Link from "next/link";
import LeadGateForm, { isLeadUnlocked } from "./CalculatorLeadGate";
import { useCountUp } from "./useCountUp";

const CALCULATOR_NAME = "Fire Alarm Battery Calculator";
type Stage = "input" | "gate" | "result";

// Common commercially available sealed lead-acid (SLA) capacities used in
// fire alarm control panels and power supplies.
const STANDARD_SIZES_AH = [4, 7, 8, 10, 12, 18, 26, 33, 40, 55, 75, 100, 110];

const STANDBY_OPTIONS = [
  { label: "24 hr", mult: 24 },
  { label: "60 hr", mult: 60 },
  { label: "90 hr", mult: 90 },
];
const DETERIORATION_OPTIONS = [
  { label: "Standard", mult: 1.25 },
  { label: "Extended-life battery", mult: 1.1 },
];

function recommend(requiredAh: number) {
  return STANDARD_SIZES_AH.find((size) => size >= requiredAh) ?? Math.ceil(requiredAh / 10) * 10;
}

function fmt(n: number, digits = 2) {
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
  onChange: (mult: T) => void;
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

export default function FireAlarmBatteryCalculator() {
  const [quiescent, setQuiescent] = useState(0.2);
  const [standbyHours, setStandbyHours] = useState(24);
  const [alarmCurrent, setAlarmCurrent] = useState(1.2);
  const [alarmMinutes, setAlarmMinutes] = useState(5);
  const [derating, setDerating] = useState(1.2);
  const [deterioration, setDeterioration] = useState(1.25);

  const computed = useMemo(() => {
    const iq = Math.max(0, quiescent || 0);
    const ia = Math.max(0, alarmCurrent || 0);
    const fc = Math.max(1, derating || 1);
    const l = Math.max(1, deterioration || 1);

    const standbyAh = iq * standbyHours;
    const alarmAh = ia * (alarmMinutes / 60);
    const rawAh = standbyAh + alarmAh;
    const requiredAh = rawAh * fc * l;
    const overheadAh = requiredAh - rawAh;
    const recommended = recommend(requiredAh);

    const parts = [standbyAh, alarmAh, overheadAh];
    const sum = requiredAh || 1;
    const pct = parts.map((p) => (Math.max(0, p) / sum) * 100);

    return { standbyAh, alarmAh, rawAh, requiredAh, overheadAh, recommended, parts, pct };
  }, [quiescent, standbyHours, alarmCurrent, alarmMinutes, derating, deterioration]);

  const [stage, setStage] = useState<Stage>("input");
  const [revealKey, setRevealKey] = useState(0);
  const displayAh = useCountUp(computed.requiredAh, revealKey);

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

  const labels = ["Standby load", "Alarm load", "Derating & aging overhead"];
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
                <span className="acc">Fire alarm battery capacity</span>
                <br />
                <span className="tone-soft">sized</span> right, every time.
              </h1>
              <p className="lede">
                Determine the exact battery size — in ampere-hours — your
                fire alarm system needs, built on NFPA 72 standby and alarm
                load calculations. No sign-up, no guesswork.
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
                  <div className="hm-k">24 hr</div>
                  <div className="hm-v">NFPA 72 standby default</div>
                </div>
                <div>
                  <div className="hm-k">500+</div>
                  <div className="hm-v">Fire alarm contractors</div>
                </div>
                <div>
                  <div className="hm-k">NFPA 72</div>
                  <div className="hm-v">Standard applied</div>
                </div>
              </div>
            </div>

            {/* ============ CALCULATOR ============ */}
            <div id="calculator">
              {stage === "input" && (
                <div className="calc">
                  <div className="calc-hd">
                    <h2>Find your battery capacity</h2>
                    <p>Plan better. Pass inspection. Start with a quick calculation.</p>
                  </div>
                  <div className="calc-bd">
                    <div className="step">
                      <div className="step-hd">
                        <span className="step-n">01</span>
                        <span className="step-t">System load</span>
                      </div>
                      <div className="rowf">
                        <div className="field">
                          <label htmlFor="quiescent">Quiescent current (A)</label>
                          <div className="ipwrap">
                            <input
                              id="quiescent"
                              type="number"
                              min={0}
                              step={0.01}
                              value={quiescent}
                              placeholder="e.g. 0.2"
                              onChange={(e) => setQuiescent(e.target.valueAsNumber)}
                            />
                          </div>
                        </div>
                        <div className="field">
                          <label htmlFor="alarmCurrent">Alarm current (A)</label>
                          <div className="ipwrap">
                            <input
                              id="alarmCurrent"
                              type="number"
                              min={0}
                              step={0.01}
                              value={alarmCurrent}
                              placeholder="e.g. 1.2"
                              onChange={(e) => setAlarmCurrent(e.target.valueAsNumber)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="step">
                      <div className="step-hd">
                        <span className="step-n">02</span>
                        <span className="step-t">Standby time</span>
                      </div>
                      <ChipGroup
                        label="Standby time"
                        options={STANDBY_OPTIONS}
                        value={standbyHours}
                        onChange={setStandbyHours}
                      />
                    </div>

                    <div className="step">
                      <div className="step-hd">
                        <span className="step-n">03</span>
                        <span className="step-t">Alarm time</span>
                      </div>
                      <div className="rowf">
                        <div className="field">
                          <label htmlFor="alarmMinutes">Alarm time (minutes)</label>
                          <div className="ipwrap">
                            <input
                              id="alarmMinutes"
                              type="number"
                              min={0}
                              value={alarmMinutes}
                              placeholder="e.g. 5"
                              onChange={(e) => setAlarmMinutes(e.target.valueAsNumber)}
                            />
                          </div>
                        </div>
                        <div className="field">
                          <label htmlFor="derating">Capacity derating factor</label>
                          <div className="ipwrap">
                            <input
                              id="derating"
                              type="number"
                              min={1}
                              step={0.05}
                              value={derating}
                              placeholder="e.g. 1.2"
                              onChange={(e) => setDerating(e.target.valueAsNumber)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="step">
                      <div className="step-hd">
                        <span className="step-n">04</span>
                        <span className="step-t">Battery deterioration factor</span>
                      </div>
                      <ChipGroup
                        label="Battery deterioration factor"
                        options={DETERIORATION_OPTIONS}
                        value={deterioration}
                        onChange={setDeterioration}
                      />
                    </div>

                    <div className="calc-go">
                      <button className="btn btn-1" type="button" onClick={handleCalculateClick}>
                        Calculate battery capacity
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
                      <div className="res-lab">Required battery capacity</div>
                      <div className="res-num">{fmt(displayAh)} Ah</div>
                      <div className="res-rng">
                        Recommended size <b>{computed.recommended} Ah</b>
                      </div>
                    </div>
                    <div className="res-pill">{`${fmt(computed.rawAh)} Ah raw load`}</div>
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
                        <span className="v">{fmt(computed.parts[i])} Ah</span>
                      </div>
                    ))}
                  </div>

                  <p className="res-foot">
                    Estimate only, following the standard NFPA 72
                    standby/alarm sizing method: Ah = [(I_Q × T_Q) + (I_A ×
                    T_A)] × F_C × L. Always confirm final sizing against the
                    panel manufacturer&apos;s battery calculation worksheet
                    and your local AHJ requirements before installing.
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
              <h2>What is fire alarm battery capacity?</h2>
              <p>
                Fire alarm battery capacity is how long — and how much
                current — the batteries can supply to keep the fire alarm
                system running when normal power is lost. This capacity
                must be enough to power every critical component: the
                control panel, detectors, notification appliances,
                communicators, and more, during a power outage for a
                mandated duration. If the battery capacity is too low, the
                system can shut down prematurely in an outage, leaving the
                building unprotected exactly when it needs an alarm most.
              </p>
              <p>
                A fire alarm system is mission-critical safety equipment
                that must remain operational at all times, even if
                electricity goes out due to a storm, accident, or grid
                failure. <code>NFPA 72</code> and similar fire codes in the
                US and Canada explicitly require a reliable secondary power
                source for fire alarms. Typically, this means 24 hours of
                standby power plus an alarm run time of 5 minutes for
                general alarm systems, or 15 minutes for systems using
                voice evacuation, on battery alone. Fail to meet these
                backup power requirements and it can mean failed
                inspections, fire department plan rejections, and — worst
                of all — a dangerous gap in protection during an emergency.
              </p>

              <div className="marker" style={{ marginTop: 52 }}>
                Why it matters.
              </div>
              <h2>Why calculating it correctly matters</h2>
              <p>
                An undersized battery could mean the system fails before
                power is restored, and an oversized battery might be
                unnecessary in cost, or even incompatible with the control
                panel&apos;s charger. Getting the calculation right is
                critical for compliance, reliability, and
                cost-effectiveness.
              </p>
              <p>
                The goal is to calculate the minimum amp-hour (Ah) rating
                the battery must have, given the system&apos;s power
                consumption. Most fire alarm control unit manufacturers
                provide battery calculation worksheets, but the basic
                formula used across the industry is:
              </p>
              <p>
                <code>Ah = [(I_Q × T_Q) + (I_A × T_A)] × F_C × L</code>
              </p>
              <p>
                Here, I_Q is the quiescent (standby) load, T_Q is the
                standby time, I_A is the alarm load, T_A is the alarm time,
                F_C is the capacity derating factor, and L is the battery
                deterioration factor. I_Q × T_Q makes the standby load, I_A
                × T_A makes the alarm load, and the total required Ah is
                the sum of the two, scaled up by the derating and
                deterioration factors to make sure the battery still
                performs at the end of its service life.
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
                  Battery sizing included in every proposal
                </li>
                <li>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2.5 7.5l3 3 6-7" stroke="#EE5566" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Used by 500+ fire alarm contractors
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
                Protect your home against fire with accurately sized backup
                battery power.
              </div>
              <p className="p-int">
                Replace smoke and fire alarm batteries on time, and confirm
                the existing battery is still large enough after adding
                devices.
              </p>
              <div className="it">
                <div className="it-t">
                  <b>01</b>Battery sizing
                </div>
                <div className="it-d">
                  Enter the alarm load and other data from the panel&apos;s
                  manual to verify the installed battery is still
                  sufficient.
                </div>
              </div>
              <div className="it">
                <div className="it-t">
                  <b>02</b>Battery replacement
                </div>
                <div className="it-d">
                  Homeowners can replace the backup battery — or the whole
                  panel — with the right capacity value on hand, avoiding
                  guesswork.
                </div>
              </div>
              <div className="it">
                <div className="it-t">
                  <b>03</b>Adding devices
                </div>
                <div className="it-d">
                  The calculator helps determine whether the current
                  battery can handle additional detectors or notification
                  devices without shortening standby time.
                </div>
              </div>
            </div>

            <div className="panel hot rv">
              <div className="p-eyebrow">Commercial</div>
              <h3>For contractors and facility teams</h3>
              <div className="p-tag">
                Ensure compliance and adequate backup power for every
                component.
              </div>
              <p className="p-int">
                Don&apos;t risk failed inspections or fire department plan
                rejections — comply with fire codes quickly and accurately.
              </p>
              <div className="it">
                <div className="it-t">
                  <b>01</b>Sufficient standby time
                </div>
                <div className="it-d">
                  The calculation ensures the battery supports the system
                  through a power outage, with the required standby time
                  and alarm duration.
                </div>
              </div>
              <div className="it">
                <div className="it-t">
                  <b>02</b>Compliance with NFPA 72
                </div>
                <div className="it-d">
                  This tool sizes the battery to support the system through
                  a 15-minute voice-evacuation alarm or longer, depending
                  on the system design.
                </div>
              </div>
              <div className="it">
                <div className="it-t">
                  <b>03</b>Buffer for real-world conditions
                </div>
                <div className="it-d">
                  Adjust the derating and battery-age factors to build in
                  buffer capacity for extreme temperatures or long device
                  service life.
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
              <h3>Time savings and convenience</h3>
              <p>
                Calculating multiple loads and adding up margins for every
                project by hand can be time-consuming. Our calculator
                automates it.
              </p>
            </div>
            <div className="why-c">
              <div className="ico">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 1.6l5.4 2.2v4.1c0 3.1-2.2 5.4-5.4 6.5-3.2-1.1-5.4-3.4-5.4-6.5V3.8L8 1.6z" stroke="#EE5566" strokeWidth="1.3" strokeLinejoin="round" />
                </svg>
              </div>
              <h3>Custom factors and flexibility</h3>
              <p>
                Flexible enough for designing a brand-new system or testing
                whether an existing battery still holds up.
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
              <h3>Ensures code compliance</h3>
              <p>
                The result isn&apos;t just mathematically correct — it&apos;s
                aligned with NFPA 72, so you can double-check your work
                against industry standards.
              </p>
            </div>
            <div className="why-c">
              <div className="ico">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M2.5 13V7M6.8 13V3M11.2 13V9.5M15 13H1" stroke="#EE5566" strokeWidth="1.3" strokeLinecap="round" />
                </svg>
              </div>
              <h3>Reduction of error</h3>
              <p>
                The calculator applies the formula and factors correctly
                every time, so you never accidentally omit the safety
                margin or misconvert minutes to hours.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ======================= FACTORS ======================= */}
      <section className="sec" id="factors">
        <div className="shell">
          <div className="marker rv">Capacity factors.</div>
          <h2 className="rv" style={{ maxWidth: "20ch", marginBottom: 40 }}>
            What affects fire alarm battery capacity
          </h2>
          <div className="fac rv">
            <div className="fac-r">
              <span className="n">01</span>
              <span className="t">System load in standby</span>
              <span className="d">
                The more devices and equipment on the fire alarm system,
                the higher the standby current draw — which increases the
                amp-hours needed.
              </span>
            </div>
            <div className="fac-r">
              <span className="n">02</span>
              <span className="t">Battery age and health</span>
              <span className="d">
                Batteries lose capacity as they age or when exposed to
                extreme conditions. Cold environments reduce effective
                capacity, while heat can shorten battery life.
              </span>
            </div>
            <div className="fac-r">
              <span className="n">03</span>
              <span className="t">Alarm load</span>
              <span className="d">
                The higher the alarm current (I_A), the more capacity is
                needed to sustain it for the required alarm duration.
              </span>
            </div>
            <div className="fac-r">
              <span className="n">04</span>
              <span className="t">Presence of a backup generator</span>
              <span className="d">
                If the building has an emergency generator that kicks in
                during an outage, smaller batteries can be used — often
                sized for 4 hours of standby instead of 24.
              </span>
            </div>
            <div className="fac-r">
              <span className="n">05</span>
              <span className="t">Voice evacuation requirements</span>
              <span className="d">
                Systems using voice notification for evacuation typically
                require 15 minutes of alarm time instead of 5, increasing
                the alarm load contribution.
              </span>
            </div>
          </div>
          <p className="fac-note rv">
            Working through these factors helps you justify a design and
            avoid an under- or over-sized battery, without sacrificing fire
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
            <h2>Size your battery with confidence</h2>
            <p>
              Don&apos;t leave your next fire alarm battery calculation to
              chance. Try the ZenTrades Fire Alarm Battery Calculator for
              free today — input your system&apos;s parameters and get an
              instant read on the capacity you need. It&apos;s quick,
              accurate, and compliant.
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
