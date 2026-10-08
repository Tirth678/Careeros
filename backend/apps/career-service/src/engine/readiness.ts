import type { SkillGap } from "@careeros/shared-types";

/**
 * Weighted readiness: `Σ(weight × min(current/required, 1)) / Σ(weight) × 100`.
 *
 * Always an integer 0–100 so scores are stable across renders and can be
 * compared to stored analyses.
 */
export function computeReadiness(rows: SkillGap[]): number {
  if (rows.length === 0) return 0;

  let totalWeight = 0;
  let weighted = 0;

  for (const row of rows) {
    const weight = Number.isFinite(row.weight) ? Math.max(row.weight, 0) : 0;
    totalWeight += weight;
    weighted += weight * row.ratio;
  }

  if (totalWeight === 0) return 0;
  return Math.round((weighted / totalWeight) * 100);
}
