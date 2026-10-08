import type {
  AdviceGenerationInput,
  GeneratedAdvice,
  GeneratedProject,
  GeneratedRoadmap,
  ProjectGenerationInput,
  RoadmapGenerationInput,
} from "@careeros/shared-types";
import type { AIProvider } from "./types";

/**
 * Deterministic fallback used only when no API key is configured (dev/demo).
 * It never reaches production: `getAIProvider` refuses it outside development.
 */
export class StubProvider implements AIProvider {
  readonly name = "stub";

  async generateRoadmap(input: RoadmapGenerationInput): Promise<GeneratedRoadmap> {
    const gaps = input.gaps.length
      ? input.gaps
      : [{ skill: "Foundations", current: 40, required: 70 }];

    const weeks = gaps.slice(0, 6).map((gap, index) => ({
      week: index + 1,
      title: `Close the ${gap.skill} gap`,
      tasks: [
        {
          title: `Study ${gap.skill} fundamentals`,
          description: `Work through the core ${gap.skill} material until you can explain it unprompted.`,
          skill: gap.skill,
          estimatedMinutes: 120,
        },
        {
          title: `Build a small ${gap.skill} exercise`,
          description: `Apply the concepts in a hands-on task and commit it to GitHub.`,
          skill: gap.skill,
          estimatedMinutes: 180,
        },
      ],
    }));

    return {
      title: `${input.career} readiness plan`,
      description: `Generated locally without an AI provider — ${weeks.length} week(s) targeting your largest gaps.`,
      weeks,
    };
  }

  async generateProject(input: ProjectGenerationInput): Promise<GeneratedProject> {
    return {
      title: `${input.career} portfolio project`,
      description: `A ${input.difficulty.toLowerCase()} project covering ${input.gaps.join(", ") || input.skills.join(", ")}.`,
      difficulty: input.difficulty,
      skills: [...new Set([...input.skills.slice(0, 4), ...input.gaps.slice(0, 4)])],
      milestones: [
        "Set up the repository and README",
        "Ship a walking skeleton end to end",
        "Add the core feature that exercises the target skills",
        "Write tests and a short demo write-up",
      ],
    };
  }

  async generateAdvice(input: AdviceGenerationInput): Promise<GeneratedAdvice> {
    const weakest = input.gaps[0]?.skill;
    return {
      whyBehind: `You are at ${input.readiness}/100 for ${input.career}. The gap analysis shows ${
        weakest ? `${weakest} is the furthest behind` : "a few skills still need proof"
      }, so employers cannot yet see the signal they filter on.`,
      strengths: input.strongSkills.length
        ? `${input.strongSkills.slice(0, 3).join(", ")} are already carrying your profile.`
        : "Nothing is proven yet — start by shipping one public project that uses the core skills.",
      highestImpact: (input.gaps.length
        ? input.gaps.slice(0, 3).map((g) => `Raise ${g.skill} from ${g.current} to ${g.required}`)
        : ["Ship one portfolio project", "Get one internship or freelance engagement", "Publish a short case study"]),
      nextAction: weakest
        ? `Block 4 hours this week for ${weakest} and finish one committed exercise.`
        : "Ship one committed project this week.",
    };
  }
}
