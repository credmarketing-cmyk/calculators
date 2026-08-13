import type { ComponentType } from "react";

/**
 * Maps a calculator's slug to its interactive tool component, for
 * calculators still on the simple CalculatorShell design. Calculators that
 * have graduated to the richer editorial page design get their own static
 * route under src/app/calculators/(rich)/<slug>/ instead — see
 * MIGRATED_SLUGS in src/app/calculators/[slug]/page.tsx.
 */
export const calculatorRegistry: Record<string, ComponentType> = {};
