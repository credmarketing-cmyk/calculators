"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import LeadGateForm, { isLeadUnlocked } from "./CalculatorLeadGate";
import { useCountUp } from "./useCountUp";
import NewsletterForm from "@/components/NewsletterForm";

const CALCULATOR_NAME = "Air Conditioner BTU Calculator";
type Stage = "input" | "gate" | "result";

const ROOM_TYPE_OPTIONS = [
  { label: "Bedroom", mult: 0.9 },
  { label: "Living Room", mult: 1 },
  { label: "Kitchen", mult: 1.15 },
  { label: "Office", mult: 0.95 },
  { label: "Sunroom", mult: 1.1 },
];
const SUN_OPTIONS = [
  { label: "Low", mult: 0.9 },
  { label: "Moderate", mult: 1 },
  { label: "High", mult: 1.1 },
];
const INSULATION_OPTIONS = [
  { label: "Good", mult: 0.9 },
  { label: "Average", mult: 1 },
  { label: "Poor", mult: 1.15 },
];
const APPLIANCE_OPTIONS = [
  { label: "None", add: 0 },
  { label: "Some", add: 600 },
  { label: "Many", add: 1200 },
];

// Standard area-based baseline BTU brackets (matches common EnergyStar-style
// AC sizing charts) — the starting point before room-condition adjustments.
const AREA_BRACKETS: { max: number; btu: number }[] = [
  { max: 150, btu: 5500 },
  { max: 250, btu: 6500 },
  { max: 300, btu: 7500 },
  { max: 350, btu: 8500 },
  { max: 400, btu: 9500 },
  { max: 450, btu: 10000 },
  { max: 550, btu: 12000 },
  { max: 700, btu: 14000 },
  { max: 1000, btu: 18000 },
  { max: 1200, btu: 21000 },
  { max: 1400, btu: 23000 },
  { max: 1500, btu: 24000 },
  { max: 2000, btu: 30000 },
  { max: Infinity, btu: 34000 },
];

function baseBtuForArea(area: number) {
  return (AREA_BRACKETS.find((b) => area <= b.max) ?? AREA_BRACKETS[AREA_BRACKETS.length - 1]).btu;
}

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
  options: { label: string; mult?: T; add?: T }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="chips" role="group" aria-label={label}>
      {options.map((opt) => {
        const v = (opt.mult ?? opt.add) as T;
        return (
          <button
            key={opt.label}
            className="chip"
            type="button"
            aria-pressed={v === value}
            onClick={() => onChange(v)}
          >
            {opt.label}{" "}
            <small>
              {opt.mult !== undefined ? `×${opt.mult.toFixed(2)}` : `+${opt.add}`}
            </small>
          </button>
        );
      })}
    </div>
  );
}

export default function AirConditionerBTUCalculator() {
  const [roomType, setRoomType] = useState(1);
  const [length, setLength] = useState(15);
  const [width, setWidth] = useState(12);
  const [height, setHeight] = useState(8);
  const [windows, setWindows] = useState(2);
  const [sun, setSun] = useState(1);
  const [people, setPeople] = useState(2);
  const [appliances, setAppliances] = useState(0);
  const [insulation, setInsulation] = useState(1);

  const computed = useMemo(() => {
    const l = Math.max(0, length || 0);
    const w = Math.max(0, width || 0);
    const h = Math.max(0, height || 0);
    const area = l * w;

    const base = baseBtuForArea(area);
    const heightFactor = h > 0 ? h / 8 : 1;
    const baseAdjusted = base * heightFactor;

    const conditioned = baseAdjusted * roomType * sun * insulation;

    const windowsAdd = Math.max(0, (windows || 0) - 2) * 200;
    const peopleAdd = Math.max(0, (people || 0) - 2) * 600;
    const applianceAdd = appliances;

    const occupancyLoad = windowsAdd + peopleAdd + applianceAdd;
    const total = conditioned + occupancyLoad;

    const roomDelta = conditioned - baseAdjusted;

    return {
      area,
      base: baseAdjusted,
      roomDelta,
      occupancyLoad,
      total,
      lo: total * 0.9,
      hi: total * 1.1,
      tons: total / 12000,
    };
  }, [roomType, length, width, height, windows, sun, people, appliances, insulation]);

  const [stage, setStage] = useState<Stage>("input");
  const [revealKey, setRevealKey] = useState(0);
  const displayBtu = useCountUp(computed.total, revealKey);

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

  const parts = [computed.base, Math.max(0, computed.roomDelta), computed.occupancyLoad];
  const sum = computed.total || 1;
  const pct = parts.map((v) => (Math.max(0, v) / sum) * 100);
  const labels = ["Base cooling load", "Room conditions", "Occupancy & appliances"];
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
                <span className="acc">Air conditioner BTU</span>
                <br />
                <span className="tone-soft">sized</span> for this summer.
              </h1>
              <p className="lede">
                Calculate the right BTU rating and get energy-efficient AC
                sizing and the temperature you actually want this summer.
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
                  <div className="hm-k">20–25</div>
                  <div className="hm-v">BTU per sq ft (industry rule)</div>
                </div>
                <div>
                  <div className="hm-k">500+</div>
                  <div className="hm-v">HVAC contractors</div>
                </div>
                <div>
                  <div className="hm-k">5K–34K</div>
                  <div className="hm-v">BTU range covered</div>
                </div>
              </div>
            </div>

            {/* ============ CALCULATOR ============ */}
            <div id="calculator">
              {stage === "input" && (
                <div className="calc">
                  <div className="calc-hd">
                    <h2>U.S. Residential BTU Calculator</h2>
                    <p>Estimate your cooling needs quickly and visually.</p>
                  </div>
                  <div className="calc-bd">
                    <div className="step">
                      <div className="step-hd">
                        <span className="step-n">01</span>
                        <span className="step-t">Room type &amp; dimensions</span>
                      </div>
                      <ChipGroup label="Room type" options={ROOM_TYPE_OPTIONS} value={roomType} onChange={setRoomType} />
                      <div className="rowf" style={{ marginTop: 18 }}>
                        <div className="field">
                          <label htmlFor="length">Room length (ft)</label>
                          <div className="ipwrap">
                            <input id="length" type="number" min={0} value={length} onChange={(e) => setLength(e.target.valueAsNumber)} />
                          </div>
                        </div>
                        <div className="field">
                          <label htmlFor="width">Room width (ft)</label>
                          <div className="ipwrap">
                            <input id="width" type="number" min={0} value={width} onChange={(e) => setWidth(e.target.valueAsNumber)} />
                          </div>
                        </div>
                      </div>
                      <div className="rowf" style={{ marginTop: 18 }}>
                        <div className="field">
                          <label htmlFor="height">Room height (ft)</label>
                          <div className="ipwrap">
                            <input id="height" type="number" min={0} value={height} onChange={(e) => setHeight(e.target.valueAsNumber)} />
                          </div>
                        </div>
                        <div className="field">
                          <label htmlFor="windows">Number of windows</label>
                          <div className="ipwrap">
                            <input id="windows" type="number" min={0} value={windows} onChange={(e) => setWindows(e.target.valueAsNumber)} />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="step">
                      <div className="step-hd">
                        <span className="step-n">02</span>
                        <span className="step-t">Sunlight exposure</span>
                      </div>
                      <ChipGroup label="Sunlight exposure" options={SUN_OPTIONS} value={sun} onChange={setSun} />
                    </div>

                    <div className="step">
                      <div className="step-hd">
                        <span className="step-n">03</span>
                        <span className="step-t">Occupancy &amp; appliances</span>
                      </div>
                      <div className="field">
                        <label htmlFor="people">People in room</label>
                        <div className="ipwrap">
                          <input id="people" type="number" min={0} value={people} onChange={(e) => setPeople(e.target.valueAsNumber)} />
                        </div>
                      </div>
                      <div style={{ marginTop: 18 }}>
                        <ChipGroup label="Appliances in room" options={APPLIANCE_OPTIONS} value={appliances} onChange={setAppliances} />
                      </div>
                    </div>

                    <div className="step">
                      <div className="step-hd">
                        <span className="step-n">04</span>
                        <span className="step-t">Insulation quality</span>
                      </div>
                      <ChipGroup label="Insulation quality" options={INSULATION_OPTIONS} value={insulation} onChange={setInsulation} />
                    </div>

                    <div className="calc-go">
                      <button className="btn btn-1" type="button" onClick={handleCalculateClick}>
                        Estimate BTU range
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
                      <div className="res-lab">Recommended cooling capacity</div>
                      <div className="res-num">{fmt(displayBtu)} BTU</div>
                      <div className="res-rng">
                        Likely range <b>{fmt(computed.lo)}</b> — <b>{fmt(computed.hi)}</b> BTU
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
                        <span className="v">{fmt(parts[i])} BTU</span>
                      </div>
                    ))}
                  </div>

                  <p className="res-foot">
                    Estimate based on standard area-based BTU sizing charts,
                    adjusted for ceiling height, room type, sunlight,
                    insulation, occupancy and appliances. For whole-home or
                    multi-zone systems, consult an HVAC professional for a
                    full Manual J load calculation.
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
              <h2>Ensure proper AC sizing using BTU calculation</h2>
              <p>
                Summers in the United States can become sweltering in many
                regions, and that&apos;s why efficient cooling is a must.
                Yet plenty of people get confused finding the perfect AC
                unit size. Our free Air Conditioner BTU Calculator takes
                the guesswork out of sizing — enter your room&apos;s
                length, width, and height, plus details like the number of
                windows, sunlight exposure, occupants, and insulation
                quality, and the tool computes the cooling capacity in BTUs
                you need.
              </p>
              <p>
                But first, a quick primer on BTU: every air conditioner is
                rated in British Thermal Units, which measure cooling
                capacity — one BTU is the energy needed to raise 1 pound of
                water by one degree Fahrenheit. The higher the BTU, the
                greater the cooling capacity. A window unit might be 5,000
                BTU for a small room, but a whole-house system can run
                24,000 BTU or more. A small bedroom only needs a few
                thousand BTUs; a large space or shop needs tens of
                thousands.
              </p>

              <div className="marker" style={{ marginTop: 52 }}>
                Why it matters.
              </div>
              <h2>Why air conditioner size matters</h2>
              <p>
                Choosing the right-sized air conditioner matters. An
                undersized cooling system can&apos;t reach the desired
                indoor temperature; an oversized one turns on and off
                frequently, which wastes energy and leaves rooms feeling
                clammy.
              </p>
              <p>
                Industry guidelines typically call for 20–25 BTUs per
                square foot of space. Here&apos;s a more detailed capacity
                chart:
              </p>

              <div style={{ overflowX: "auto", marginTop: 8 }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13.5 }}>
                  <thead>
                    <tr>
                      <th style={{ textAlign: "left", padding: "10px 12px", borderBottom: "1px solid var(--rule)", color: "var(--faint)", fontFamily: "var(--mono)", fontSize: 10.5, letterSpacing: ".08em", textTransform: "uppercase", fontWeight: 500 }}>
                        Square footage of the room
                      </th>
                      <th style={{ textAlign: "left", padding: "10px 12px", borderBottom: "1px solid var(--rule)", color: "var(--faint)", fontFamily: "var(--mono)", fontSize: 10.5, letterSpacing: ".08em", textTransform: "uppercase", fontWeight: 500 }}>
                        BTU required
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["100–150 sq ft", "5,000–6,000 BTU"],
                      ["150–250 sq ft", "6,000–7,000 BTU"],
                      ["250–350 sq ft", "7,000–8,500 BTU"],
                      ["350–450 sq ft", "8,500–10,000 BTU"],
                      ["450–550 sq ft", "10,000–12,000 BTU"],
                      ["550–700 sq ft", "12,000–14,000 BTU"],
                      ["700–1,000 sq ft", "14,000–18,000 BTU"],
                      ["1,000–1,200 sq ft", "18,000–21,000 BTU"],
                      ["1,200–1,500 sq ft", "21,000–24,000 BTU"],
                      ["1,500–2,000 sq ft", "24,000–30,000 BTU"],
                      ["2,000+ sq ft", "30,000–34,000+ BTU"],
                    ].map(([range, btu]) => (
                      <tr key={range}>
                        <td style={{ padding: "10px 12px", borderBottom: "1px solid var(--rule-soft)", color: "var(--ink-soft)" }}>{range}</td>
                        <td style={{ padding: "10px 12px", borderBottom: "1px solid var(--rule-soft)", color: "var(--ink-soft)", fontFamily: "var(--mono)" }}>{btu}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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
              <h3>For homeowners</h3>
              <div className="p-tag">
                Ensure your home is always comfortable, without unnecessary
                energy consumption.
              </div>
              <p className="p-int">
                Select the right air conditioner for your space and
                lifestyle, whether you&apos;re upgrading your current
                system or replacing a broken one.
              </p>
              <div className="it">
                <div className="it-t">
                  <b>01</b>Choosing the right AC
                </div>
                <div className="it-d">
                  Calculate the cooling needs of a particular room or
                  entire house, based on exact room dimensions, sunlight,
                  insulation, and occupancy.
                </div>
              </div>
              <div className="it">
                <div className="it-t">
                  <b>02</b>Energy savings
                </div>
                <div className="it-d">
                  When your AC is neither too large nor too small, it
                  delivers efficient, consistent cooling without wasting
                  energy — directly reducing your bills.
                </div>
              </div>
              <div className="it">
                <div className="it-t">
                  <b>03</b>Customized estimate
                </div>
                <div className="it-d">
                  Whether you&apos;re upgrading a current unit or replacing
                  a broken one, this tool helps you pick the size that
                  actually fits your space.
                </div>
              </div>
            </div>

            <div className="panel hot rv">
              <div className="p-eyebrow">Commercial</div>
              <h3>For contractors and facility teams</h3>
              <div className="p-tag">
                Avoid overspending on utility bills while maintaining a
                comfortable temperature in a large room.
              </div>
              <p className="p-int">
                Get a precise solution for complex environments with
                multiple variables, and avoid waste from oversized units
                or the discomfort of undersized ones.
              </p>
              <div className="it">
                <div className="it-t">
                  <b>01</b>Optimized for workspaces
                </div>
                <div className="it-d">
                  The calculator considers factors like appliance count and
                  insulation quality — a store, office, or restaurant can
                  have very different heat sources.
                </div>
              </div>
              <div className="it">
                <div className="it-t">
                  <b>02</b>Prevents equipment overloading
                </div>
                <div className="it-d">
                  When each zone is properly sized, it leads to less wear
                  and tear, improved efficiency, and lower utility bills.
                </div>
              </div>
              <div className="it">
                <div className="it-t">
                  <b>03</b>Scalable for multiple zones
                </div>
                <div className="it-d">
                  For large commercial spaces, calculate the BTU
                  requirement section by section, making it easier to plan
                  different cooling zones.
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
              <h3>A precise estimate for each room</h3>
              <p>
                Our calculator considers square footage, insulation
                quality, occupancy, and sun exposure — not just floor area
                — to get a precise BTU value.
              </p>
            </div>
            <div className="why-c">
              <div className="ico">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 1.6l5.4 2.2v4.1c0 3.1-2.2 5.4-5.4 6.5-3.2-1.1-5.4-3.4-5.4-6.5V3.8L8 1.6z" stroke="#EE5566" strokeWidth="1.3" strokeLinejoin="round" />
                </svg>
              </div>
              <h3>The right investment from the start</h3>
              <p>
                Instead of trial-and-error AC sizing, our calculator
                customizes the value for each room, so you invest in the
                right unit and save money.
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
              <h3>Works for residential and commercial</h3>
              <p>
                Whether you&apos;re sizing a bedroom or a large commercial
                space, our tool supports both single-room and multi-zone
                cooling setups.
              </p>
            </div>
            <div className="why-c">
              <div className="ico">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M2.5 13V7M6.8 13V3M11.2 13V9.5M15 13H1" stroke="#EE5566" strokeWidth="1.3" strokeLinecap="round" />
                </svg>
              </div>
              <h3>Built-in energy efficiency</h3>
              <p>
                Proper sizing reduces mechanical wear and saves on energy
                bills. You don&apos;t need any HVAC knowledge to get the
                right AC for your space.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ======================= FACTORS ======================= */}
      <section className="sec" id="factors">
        <div className="shell">
          <div className="marker rv">Sizing factors.</div>
          <h2 className="rv" style={{ maxWidth: "20ch", marginBottom: 40 }}>
            Key factors affecting BTU requirements
          </h2>
          <div className="fac rv">
            <div className="fac-r">
              <span className="n">01</span>
              <span className="t">Insulation</span>
              <span className="d">
                Well-insulated walls, ceilings, and windows slow heat gain,
                which can lower the BTU needed for a room.
              </span>
            </div>
            <div className="fac-r">
              <span className="n">02</span>
              <span className="t">Sunlight and orientation</span>
              <span className="d">
                A very sunny room typically needs about 10% more cooling
                capacity than a shaded one.
              </span>
            </div>
            <div className="fac-r">
              <span className="n">03</span>
              <span className="t">Occupancy</span>
              <span className="d">
                Each additional person beyond a typical two adds roughly
                600 BTU/hr of body heat to the load.
              </span>
            </div>
            <div className="fac-r">
              <span className="n">04</span>
              <span className="t">Cooling and appliances</span>
              <span className="d">
                A stove, oven, or other heat-generating appliance in the
                room can add several thousand BTU to the total — which is
                why our calculator considers the room&apos;s purpose.
              </span>
            </div>
            <div className="fac-r">
              <span className="n">05</span>
              <span className="t">Ceiling fans and height</span>
              <span className="d">
                Ceiling fans improve air circulation and can reduce the
                BTU needed, while higher ceilings increase the room&apos;s
                volume — and its cooling load.
              </span>
            </div>
          </div>
          <p className="fac-note rv">
            Working through these factors helps you land on a BTU figure
            that matches the room&apos;s real conditions, not just its
            floor area.
          </p>
        </div>
      </section>

      {/* ======================= CLOSING CTA ======================= */}
      <section className="sec">
        <div className="shell">
          <div className="close-w rv">
            <div className="close-hatch" aria-hidden="true" />
            <div className="marker">Ready to get started.</div>
            <h2>Size your AC with confidence</h2>
            <p>
              Get the right BTU figure so you can pick an air conditioner
              that cools effectively without wasting energy. Our tool
              factors in room dimensions, insulation, sunlight, occupancy,
              and appliances, so you don&apos;t end up with a system
              that&apos;s too big or too small for the space.
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
