import type { Priority, SkillGap } from "@careeros/shared-types";

export interface Requirement {
  skillId: string;
  skillName: string;
  category?: string;
  requiredLevel: number;
  weight: number;
  priority: Priority;
}

export interface StudentSkillLevel {
  skillId: string;
  skillName: string;
  proficiency: number;
}

export interface GapAnalysis {
  /** Every requirement, ordered by weight then gap size. */
  rows: SkillGap[];
  strongSkills: SkillGap[];
  gaps: SkillGap[];
}

function normalise(name: string): string {
  return name.trim().toLowerCase();
}

/**
 * Pure and deterministic — no AI involved.
 *
 * For each requirement: `ratio = min(current / required, 1)`.
 * A missing skill counts as proficiency 0, never as an error.
 */
export function computeSkillGaps(
  requirements: Requirement[],
  studentSkills: StudentSkillLevel[],
): GapAnalysis {
  const byId = new Map(studentSkills.map((s) => [s.skillId, s]));
  const byName = new Map(studentSkills.map((s) => [normalise(s.skillName), s]));

  const rows: SkillGap[] = requirements.map((req) => {
    const match = byId.get(req.skillId) ?? byName.get(normalise(req.skillName));
    const current = match?.proficiency ?? 0;
    const required = Math.max(req.requiredLevel, 1);
    const ratio = Math.min(current / required, 1);

    return {
      skillId: req.skillId,
      skillName: req.skillName,
      current,
      required: req.requiredLevel,
      weight: req.weight,
      priority: req.priority,
      ratio: Number(ratio.toFixed(4)),
    };
  });

  rows.sort((a, b) => b.weight - a.weight || a.ratio - b.ratio);

  return {
    rows,
    strongSkills: rows.filter((r) => r.ratio >= 1),
    gaps: rows.filter((r) => r.ratio < 1),
  };
}
