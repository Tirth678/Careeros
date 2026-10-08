import { z } from "@careeros/validation";

/**
 * Schemas for what the LLM must return. Anything that doesn't match is
 * rejected with `AI_RESPONSE_INVALID` rather than leaking garbage to the
 * frontend.
 */

export const roadmapTaskOutput = z.object({
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().max(2000).default(""),
  skill: z.string().trim().max(80).nullable().default(null),
  estimatedMinutes: z.coerce.number().int().min(5).max(2400),
});

export const roadmapWeekOutput = z.object({
  week: z.coerce.number().int().min(1).max(52),
  title: z.string().trim().min(1).max(160),
  tasks: z.array(roadmapTaskOutput).min(1).max(20),
});

export const roadmapOutputSchema = z.object({
  title: z.string().trim().min(1).max(160),
  description: z.string().trim().max(2000),
  weeks: z.array(roadmapWeekOutput).min(1).max(24),
});

export const projectOutputSchema = z.object({
  title: z.string().trim().min(1).max(160),
  description: z.string().trim().max(2000),
  difficulty: z.enum(["Beginner", "Intermediate", "Advanced"]),
  skills: z.array(z.string().trim().min(1).max(80)).min(1).max(20),
  milestones: z.array(z.string().trim().min(1).max(200)).min(1).max(20),
});

export const adviceOutputSchema = z.object({
  whyBehind: z.string().trim().min(1).max(1200),
  strengths: z.string().trim().min(1).max(1200),
  highestImpact: z.array(z.string().trim().min(1).max(200)).min(1).max(10),
  nextAction: z.string().trim().min(1).max(600),
});
