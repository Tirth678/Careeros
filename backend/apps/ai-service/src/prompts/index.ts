import type {
  AdviceGenerationInput,
  ProjectGenerationInput,
  RoadmapGenerationInput,
} from "@careeros/shared-types";

const SYSTEM_CORE = `You are a career advisor inside Careeros, a platform that helps students close skill gaps.
You are precise, practical and never vague. You only ever reply with a single JSON object — no markdown fences, no commentary.`;

const JSON_RULES = `Respond with raw JSON only. No \`\`\` fences, no prose before or after.`;

export function roadmapPrompt(input: RoadmapGenerationInput) {
  const gaps = input.gaps
    .map((g) => `- ${g.skill}: current ${g.current}/100, required ${g.required}/100`)
    .join("\n");

  return {
    system: `${SYSTEM_CORE}
${JSON_RULES}

Build a realistic week-by-week learning roadmap that closes the listed gaps for the "${input.career}" role.
The student's readiness score is ${input.readiness}/100.

Rules:
- Prioritise the largest gaps first, but sequence prerequisites before advanced topics.
- Each week should be roughly 4-8 hours of work.
- Every task must be concrete and completable, not a vague goal.
- Attach the skill a task builds to \`skill\` (use the exact gap skill name when relevant), otherwise null.
- \`estimatedMinutes\` is a realistic duration for one sitting, 5-2400.

Return exactly this JSON shape:
{
  "title": string,
  "description": string,
  "weeks": [
    {
      "week": number,
      "title": string,
      "tasks": [
        { "title": string, "description": string, "skill": string | null, "estimatedMinutes": number }
      ]
    }
  ]
}`,
    user: `Career: ${input.career}\nReadiness: ${input.readiness}/100\n\nGaps:\n${gaps || "- none listed"}`,
  };
}

export function projectPrompt(input: ProjectGenerationInput) {
  return {
    system: `${SYSTEM_CORE}
${JSON_RULES}

Suggest one portfolio project a "${input.career}" candidate should build at ${input.difficulty} level.
It must force practice of the listed skills and help close the listed gaps.

Return exactly this JSON shape:
{
  "title": string,
  "description": string,
  "difficulty": "Beginner" | "Intermediate" | "Advanced",
  "skills": string[],
  "milestones": string[]
}`,
    user: `Skills the student already has: ${input.skills.join(", ") || "none listed"}\nSkills to close: ${input.gaps.join(", ") || "none listed"}\nDifficulty: ${input.difficulty}`,
  };
}

export function advicePrompt(input: AdviceGenerationInput) {
  const gaps = input.gaps
    .map((g) => `- ${g.skill}: ${g.current}/${g.required}`)
    .join("\n");

  return {
    system: `${SYSTEM_CORE}
${JSON_RULES}

Explain, in plain language, where a "${input.career}" candidate stands and what to do next.
Be direct: name the real reason they are behind, then give the few highest-impact improvements.

Return exactly this JSON shape:
{
  "whyBehind": string,
  "strengths": string,
  "highestImpact": string[],
  "nextAction": string
}`,
    user: `Readiness: ${input.readiness}/100\nStrong skills: ${input.strongSkills.join(", ") || "none yet"}\n\nGaps:\n${gaps || "- none"}`,
  };
}
