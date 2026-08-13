"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Animates from 0 up to `target` whenever `trigger` changes (e.g. bump a
 * counter each time a result is revealed). Respects prefers-reduced-motion.
 */
export function useCountUp(target: number, trigger: number) {
  const [value, setValue] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setValue(target);
      return;
    }

    const from = 0;
    const to = target;
    const duration = 700;
    let start: number | null = null;

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    function step(ts: number) {
      if (start === null) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(from + (to - from) * eased);
      if (p < 1) rafRef.current = requestAnimationFrame(step);
    }
    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger]);

  return value;
}
