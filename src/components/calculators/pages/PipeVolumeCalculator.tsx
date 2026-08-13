"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import LeadGateForm, { isLeadUnlocked } from "./CalculatorLeadGate";
import { useCountUp } from "./useCountUp";
import NewsletterForm from "@/components/NewsletterForm";

const CALCULATOR_NAME = "Pipe Volume Calculator";
type Stage = "input" | "gate" | "result";

const IN_TO_M = 0.0254;
const MM_TO_M = 0.001;
const FT_TO_M = 0.3048;

function fmt(n: number, digits = 2) {
  if (!Number.isFinite(n)) return "—";
  return n.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: digits });
}

function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { label: string; value: T }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="chips" role="group">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          className="chip"
          aria-pressed={opt.value === value}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

export default function PipeVolumeCalculator() {
  const [diameter, setDiameter] = useState(1);
  const [diameterUnit, setDiameterUnit] = useState<"in" | "mm">("in");
  const [length, setLength] = useState(50);
  const [lengthUnit, setLengthUnit] = useState<"ft" | "m">("ft");
  const [density, setDensity] = useState(1000);

  const computed = useMemo(() => {
    const d = Math.max(0, diameter || 0);
    const l = Math.max(0, length || 0);
    const rho = Math.max(0, density || 0);

    const dM = diameterUnit === "in" ? d * IN_TO_M : d * MM_TO_M;
    const lM = lengthUnit === "ft" ? l * FT_TO_M : l;
    const rM = dM / 2;

    const volumeM3 = Math.PI * rM * rM * lM;
    const volumeL = volumeM3 * 1000;
    const volumeGal = volumeM3 * 264.172;
    const volumeFt3 = volumeM3 * 35.3147;
    const massKg = volumeM3 * rho;
    const massLb = massKg * 2.20462;

    return { volumeM3, volumeL, volumeGal, volumeFt3, massKg, massLb };
  }, [diameter, diameterUnit, length, lengthUnit, density]);

  const [stage, setStage] = useState<Stage>("input");
  const [revealKey, setRevealKey] = useState(0);
  const displayGal = useCountUp(computed.volumeGal * 100, revealKey);

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
                <span className="acc">Pipe volume</span>
                <br />
                <span className="tone-soft">computed</span> in seconds.
              </h1>
              <p className="lede">
                Compute a pipe&apos;s capacity in seconds and design your
                pipe system precisely. Save time and improve accuracy.
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
                  <div className="hm-k">V = πr²L</div>
                  <div className="hm-v">Core formula</div>
                </div>
                <div>
                  <div className="hm-k">500+</div>
                  <div className="hm-v">Plumbing contractors</div>
                </div>
                <div>
                  <div className="hm-k">gal / L / lb</div>
                  <div className="hm-v">Units covered</div>
                </div>
              </div>
            </div>

            {/* ============ CALCULATOR ============ */}
            <div id="calculator">
              {stage === "input" && (
                <div className="calc">
                  <div className="calc-hd">
                    <h2>Pipe Volume &amp; Mass Calculator</h2>
                    <p>Enter your pipe&apos;s dimensions to calculate volume and fluid mass.</p>
                  </div>
                  <div className="calc-bd">
                    <div className="step">
                      <div className="step-hd">
                        <span className="step-n">01</span>
                        <span className="step-t">Inner diameter</span>
                      </div>
                      <div className="rowf">
                        <div className="field">
                          <label htmlFor="diameter">Inner diameter</label>
                          <div className="ipwrap">
                            <input id="diameter" type="number" min={0} step={0.01} value={diameter} onChange={(e) => setDiameter(e.target.valueAsNumber)} />
                          </div>
                        </div>
                        <div className="field">
                          <label>Diameter unit</label>
                          <SegmentedControl
                            options={[
                              { label: "in", value: "in" as const },
                              { label: "mm", value: "mm" as const },
                            ]}
                            value={diameterUnit}
                            onChange={setDiameterUnit}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="step">
                      <div className="step-hd">
                        <span className="step-n">02</span>
                        <span className="step-t">Length</span>
                      </div>
                      <div className="rowf">
                        <div className="field">
                          <label htmlFor="length">Length</label>
                          <div className="ipwrap">
                            <input id="length" type="number" min={0} value={length} onChange={(e) => setLength(e.target.valueAsNumber)} />
                          </div>
                        </div>
                        <div className="field">
                          <label>Length unit</label>
                          <SegmentedControl
                            options={[
                              { label: "ft", value: "ft" as const },
                              { label: "m", value: "m" as const },
                            ]}
                            value={lengthUnit}
                            onChange={setLengthUnit}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="step">
                      <div className="step-hd">
                        <span className="step-n">03</span>
                        <span className="step-t">Fluid density</span>
                      </div>
                      <div className="field">
                        <label htmlFor="density">Fluid density (kg/m³)</label>
                        <div className="ipwrap">
                          <input id="density" type="number" min={0} value={density} onChange={(e) => setDensity(e.target.valueAsNumber)} />
                        </div>
                      </div>
                      <p className="hint" style={{ marginTop: 10 }}>
                        Water ≈ 1,000 kg/m³
                      </p>
                    </div>

                    <div className="calc-go">
                      <button className="btn btn-1" type="button" onClick={handleCalculateClick}>
                        Calculate
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
                      <div className="res-lab">Pipe volume</div>
                      <div className="res-num">{fmt(displayGal / 100)} gal</div>
                      <div className="res-rng">
                        ≈ <b>{fmt(computed.volumeL)} L</b>
                      </div>
                    </div>
                    <div className="res-pill">{`${fmt(computed.massLb)} lb`}</div>
                  </div>

                  <div className="brk">
                    <div className="brk-r">
                      <i style={{ background: "#EE5566" }} />
                      <span className="k">Volume</span>
                      <span className="v">{fmt(computed.volumeFt3, 3)} ft³</span>
                    </div>
                    <div className="brk-r">
                      <i style={{ background: "#F8919C" }} />
                      <span className="k">Fluid mass</span>
                      <span className="v">{fmt(computed.massKg)} kg</span>
                    </div>
                    <div className="brk-r">
                      <i style={{ background: "rgba(255,255,255,.28)" }} />
                      <span className="k">Fluid mass</span>
                      <span className="v">{fmt(computed.massLb)} lb</span>
                    </div>
                  </div>

                  <p className="res-foot">
                    Volume = π r² L, using the pipe&apos;s inner diameter
                    (not outer diameter — wall thickness reduces usable
                    capacity). Mass = Volume × fluid density. Verify
                    against manufacturer specs for critical applications.
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
              <h2>What is pipe volume, and how do you calculate it?</h2>
              <p>
                Pipe volume is the amount of space inside a pipe, usually
                filled with a liquid. A pipe&apos;s interior is typically a
                hollow cylinder, so its volume represents how much water
                or other liquid it can hold when filled. This volume is
                measured in cubic units depending on the units of the
                pipe&apos;s dimensions.
              </p>
              <p>
                When calculating pipe volume, you must use the{" "}
                <b>inner</b> diameter of the pipe, not the outer diameter —
                it&apos;s the inside width that determines capacity. Even
                if you only know the outer diameter and wall thickness,
                you&apos;ll need to find the inner diameter to get an
                accurate volume.
              </p>
              <p>
                The pipe volume formula is derived from the volume formula
                for a cylinder. For a cylinder (or pipe) of radius r and
                length L:
              </p>
              <p>
                <code>V = π r² L</code>
              </p>
              <p>
                While calculating the volume, make sure to use consistent
                units for diameter and length in the calculation to avoid
                errors.
              </p>
              <p>
                Let&apos;s take a quick example. Suppose you have a
                1-inch inner pipe diameter that&apos;s 50 feet long. First,
                convert the length to inches: 50 ft × 12 = 600 inches. The
                inner radius r is half of 1 inch, so 0.5 inches. Now,
                apply the formula: Volume = π(0.5 in)² × 600 in = 471.24
                cubic inches.
              </p>
              <p>
                An exact volume of 471.2 cubic inches might be immediately
                intuitive, so you can convert it to more familiar units.
                Like, 1 U.S. gallon is equal to 231 cubic inches, so you
                can divide 471.24 by 231, so the pipe can hold roughly
                2.04 gallons of liquid. In water, a 1&quot; diameter pipe,
                50&apos; long, holds just about two gallons of water. If
                you need the weight of that water, you can just multiply
                the volume in cubic feet by the water&apos;s density.
                Water weighs about 62.4 lb per cubic foot. Since 2.04
                gallons is 0.273 cubic feet, the water in this pipe would
                weigh around 17 pounds.
              </p>

              <div className="marker" style={{ marginTop: 52 }}>
                Why it matters.
              </div>
              <h2>What is the importance of calculating pipe volume?</h2>
              <p>
                If you&apos;re designing a residential plumbing system or a
                large-scale industrial piping network, and the pipe&apos;s
                volume is too low, it can lead to poor performance. But if
                it&apos;s far higher than necessary, you may be spending
                extra on larger pipes. Having the accurate volume helps
                you choose the right pipe size, and knowing the volume of
                pipes helps determine how much water the system will
                hold.
              </p>
              <p>
                It&apos;s also useful for figuring out how much of a
                treatment chemical to put into a plumbing system,
                inaccurate volume estimates can lead to wasted materials
                or inadequate system design.
              </p>
              <p>
                If you&apos;re dealing with a fire sprinkler system, NFPA
                codes require careful hydraulic calculations. While those
                focus on flow and pressure, having accurate pipe volume
                data is part of the overall picture to make sure the
                system can deliver water for the required duration. HVAC
                professionals also calculate the volume of water in
                heating or cooling pipes to determine how much coolant or
                water to add to the system. Even after installation,
                knowing pipe volumes can help in maintenance. If you need
                to drain a system for repairs, knowing the volume of water
                in the pipes tells you how large a container you need, or
                how long the draining might take.
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
                  Volume and mass breakdown included
                </li>
                <li>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2.5 7.5l3 3 6-7" stroke="#EE5566" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Used by 500+ plumbing contractors
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
              <h3>Residential use of the pipe volume calculator</h3>
              <div className="p-tag">
                Ensure optimal flow and capacity for everyday home
                systems.
              </div>
              <p className="p-int">
                Get accurate results for the water capacity that pipes can
                hold for pump runtime and water usage using the pipe
                calculator.
              </p>
              <div className="it">
                <div className="it-t">
                  <b>01</b>Home plumbing projects
                </div>
                <div className="it-d">
                  If you&apos;re adding a new bathroom or kitchen fixture,
                  check the volume of the existing supply pipe to make
                  sure it can deliver enough water.
                </div>
              </div>
              <div className="it">
                <div className="it-t">
                  <b>02</b>Heating and cooling systems
                </div>
                <div className="it-d">
                  Use pipe volume calculations to determine the total
                  water in the hot-water baseboard system to add the
                  right amount of fluid.
                </div>
              </div>
              <div className="it">
                <div className="it-t">
                  <b>03</b>Filling swimming pools, ponds, or tanks
                </div>
                <div className="it-d">
                  If you have a garden pond or a pool that you fill via a
                  pipe, calculate the volume of the supply pipe and
                  estimate how much water it will deliver at once.
                </div>
              </div>
            </div>

            <div className="panel hot rv">
              <div className="p-eyebrow">Commercial</div>
              <h3>Commercial use of the pipe volume calculator</h3>
              <div className="p-tag">
                Optimize fluid transport and storage to adhere to safety
                standards.
              </div>
              <p className="p-int">
                Improve data accuracy and save time so you can get on
                with installing pipes or planning projects confidently.
              </p>
              <div className="it">
                <div className="it-t">
                  <b>01</b>Commercial plumbing systems
                </div>
                <div className="it-d">
                  Calculate pipe volumes during design to size expansion
                  tanks and ensure that boosting pumps can handle the
                  volume in tall buildings.
                </div>
              </div>
              <div className="it">
                <div className="it-t">
                  <b>02</b>HVAC and mechanical systems
                </div>
                <div className="it-d">
                  Volume calculation is critical for charging commercial
                  HVAC systems like chillers, boilers, and cooling towers
                  with the correct amount of fluid and chemicals.
                </div>
              </div>
              <div className="it">
                <div className="it-t">
                  <b>03</b>Fire protection systems
                </div>
                <div className="it-d">
                  Calculate the volume of water between the riser and the
                  farthest sprinkler head, to estimate how quickly the
                  system will discharge when a sprinkler opens.
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
            Why use ZenTrades&apos; Pipe Volume Calculator?
          </h2>
          <div className="why rv">
            <div className="why-c">
              <div className="ico">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M9 1.5L3 9h4l-1 5.5L13 7H9l1-5.5z" stroke="#EE5566" strokeWidth="1.3" strokeLinejoin="round" />
                </svg>
              </div>
              <h3>Speed and convenience</h3>
              <p>
                Enter a couple of numbers and get instant results. No
                need to switch between calculators — it&apos;s a click and
                not a manual conversion.
              </p>
            </div>
            <div className="why-c">
              <div className="ico">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 1.6l5.4 2.2v4.1c0 3.1-2.2 5.4-5.4 6.5-3.2-1.1-5.4-3.4-5.4-6.5V3.8L8 1.6z" stroke="#EE5566" strokeWidth="1.3" strokeLinejoin="round" />
                </svg>
              </div>
              <h3>Multiple outputs</h3>
              <p>
                See the volume in cubic inches, cubic feet, gallons, and
                more, all at once — it saves the trouble of calculating
                different units separately.
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
              <h3>Handles any liquid density</h3>
              <p>
                Calculate the volume and mass of any liquid inside the
                pipe, whether it&apos;s water, glycol, oil, or a custom
                chemical, and get the liquid mass in the pipe
                accordingly.
              </p>
            </div>
            <div className="why-c">
              <div className="ico">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M2.5 13V7M6.8 13V3M11.2 13V9.5M15 13H1" stroke="#EE5566" strokeWidth="1.3" strokeLinecap="round" />
                </svg>
              </div>
              <h3>Unit flexibility for inputs</h3>
              <p>
                Choose your input units for diameter and length, whether
                it&apos;s inches, feet, millimeters, or meters, via a
                simple selection.
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
            What are the factors affecting pipe volume?
          </h2>
          <div className="fac rv">
            <div className="fac-r">
              <span className="n">01</span>
              <span className="t">Inner diameter vs. outer diameter</span>
              <span className="d">
                The inner diameter is the open space where fluid flows.
                Using the outer diameter will overestimate volume, since
                it includes the pipe&apos;s wall thickness.
              </span>
            </div>
            <div className="fac-r">
              <span className="n">02</span>
              <span className="t">Pipe shape and internal obstructions</span>
              <span className="d">
                The formula assumes a perfect circular cross-section.
                Older pipes have mineral buildup or scale obstruction, and
                effective volume can be less than the theoretical
                full-bore cylinder.
              </span>
            </div>
            <div className="fac-r">
              <span className="n">03</span>
              <span className="t">Temperature and fluid expansion</span>
              <span className="d">
                Most of the time, hot water may hold a bit more water and
                the fluid might expand — expansion tanks account for this
                elsewhere in the system.
              </span>
            </div>
            <div className="fac-r">
              <span className="n">04</span>
              <span className="t">Fluid density for weight calculations</span>
              <span className="d">
                If the pipe carries oil, glycol, or any other fluid, the
                correct density is required to get an accurate weight.
                Using the wrong density gives a misleading result.
              </span>
            </div>
          </div>
          <p className="fac-note rv">
            Working through these factors keeps volume and weight
            estimates trustworthy, whether you&apos;re sizing a pump,
            planning a fill, or figuring out how long a drain-down will
            take.
          </p>
        </div>
      </section>

      {/* ======================= CLOSING CTA ======================= */}
      <section className="sec">
        <div className="shell">
          <div className="close-w rv">
            <div className="close-hatch" aria-hidden="true" />
            <div className="marker">Ready to get started.</div>
            <h2>Don&apos;t let the unknowns slow you down</h2>
            <p>
              Try out the ZenTrades Pipe Volume Calculator today, and see
              how much easier your planning and calculations can be. It&apos;s
              as simple as entering a few values and letting the tool do
              the rest.
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
