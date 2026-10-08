import type { CareerMatchDTO } from "@careeros/shared-types";
import { computeSkillGaps, type Requirement, type StudentSkillLevel } from "./skillGap";
import { computeReadiness } from "./readiness";

export interface CareerForRanking {
  id: string;
  slug: string;
  name: string;
  requirements: Requirement[];
}

/**
 * "Which careers am I naturally closest to?" — same engine as the
 * single-career analysis, just applied across every career and sorted.
 */
export function rankCareers(
  careers: CareerForRanking[],
  studentSkills: StudentSkillLevel[],
): CareerMatchDTO[] {
  const matches: CareerMatchDTO[] = careers.map((career) => {
    const { rows } = computeSkillGaps(career.requirements, studentSkills);
    return {
      career: { id: career.id, slug: career.slug, name: career.name },
      matchScore: computeReadiness(rows),
    };
  });

  matches.sort(
    (a, b) =>
      b.matchScore - a.matchScore || a.career.name.localeCompare(b.career.name),
  );

  return matches;
}
