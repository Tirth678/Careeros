import { z } from "zod";
import { ServiceError } from "@careeros/shared-types";

export { z };

// ─────────────────────────────────────────────────────────────
// Primitives
// ─────────────────────────────────────────────────────────────

export const level = z.coerce
  .number()
  .int("Must be a whole number")
  .min(0, "Cannot be below 0")
  .max(100, "Cannot exceed 100");

export const slug = z
  .string()
  .min(2)
  .max(80)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Must be a kebab-case slug");

export const url = z.string().url().max(500);
export const shortText = z.string().trim().min(1).max(200);
export const longText = z.string().trim().max(5000);

// ─────────────────────────────────────────────────────────────
// Profile
// ─────────────────────────────────────────────────────────────

export const createProfileSchema = z.object({
  name: shortText,
  email: z.string().email().max(256),
  degree: shortText.nullish(),
  university: shortText.nullish(),
  cgpa: z.coerce.number().min(0).max(10).nullish(),
  graduationYear: z.coerce
    .number()
    .int()
    .min(2000)
    .max(2100)
    .nullish(),
});

export const updateProfileSchema = createProfileSchema.partial();

export const studentIdParam = z.object({
  studentId: z.string().min(1),
});

export const projectIdParam = z.object({
  projectId: z.string().min(1),
});

// ─────────────────────────────────────────────────────────────
// Skills
// ─────────────────────────────────────────────────────────────

export const skillNameSchema = z.string().trim().min(1).max(80);

export const upsertSkillSchema = z.object({
  name: skillNameSchema,
  category: z.string().trim().min(1).max(60).default("General"),
});

export const upsertStudentSkillSchema = z.object({
  name: skillNameSchema,
  proficiency: level,
  confidence: level.nullish(),
  source: z
    .enum(["self", "project", "internship", "certification", "course"])
    .default("self"),
});

export const updateStudentSkillSchema = z.object({
  proficiency: level.optional(),
  confidence: level.nullish(),
  source: z
    .enum(["self", "project", "internship", "certification", "course"])
    .optional(),
});

/** Service-to-service: nudge a proficiency up or down. */
export const skillProgressSchema = z.object({
  skillName: skillNameSchema,
  delta: z.coerce.number().int().min(-100).max(100),
});

// ─────────────────────────────────────────────────────────────
// Projects / Internships / Certifications
// ─────────────────────────────────────────────────────────────

export const createProjectSchema = z.object({
  name: shortText,
  description: longText.nullish(),
  githubUrl: url.nullish(),
  demoUrl: url.nullish(),
  skills: z.array(skillNameSchema).max(30).default([]),
});

export const updateProjectSchema = createProjectSchema.partial();

export const createInternshipSchema = z.object({
  company: shortText,
  role: shortText,
  description: longText.nullish(),
  startDate: z.coerce.date().nullish(),
  endDate: z.coerce.date().nullish(),
});

export const createCertificationSchema = z.object({
  name: shortText,
  issuer: shortText.nullish(),
  credentialUrl: url.nullish(),
});

// ─────────────────────────────────────────────────────────────
// Career
// ─────────────────────────────────────────────────────────────

export const careerParam = z.object({
  careerId: z.string().min(1),
});

export const analyzeBodySchema = z.object({
  studentId: z.string().min(1),
});

export const generateRoadmapSchema = z.object({
  careerId: z.string().min(1),
  studentId: z.string().min(1).optional(),
});

// ─────────────────────────────────────────────────────────────
// Roadmap
// ─────────────────────────────────────────────────────────────

export const roadmapParam = z.object({
  roadmapId: z.string().min(1),
});

export const roadmapTaskParam = z.object({
  taskId: z.string().min(1),
});

export const updateTaskSchema = z.object({
  status: z.enum(["todo", "in_progress", "done"]),
});

export const saveRoadmapSchema = z.object({
  studentId: z.string().min(1),
  careerId: z.string().min(1),
  title: shortText,
  description: longText.nullish(),
  tasks: z
    .array(
      z.object({
        title: shortText,
        description: longText.nullish(),
        skill: skillNameSchema.nullish(),
        week: z.coerce.number().int().min(1).max(52),
        estimatedMinutes: z.coerce.number().int().min(5).max(2400),
      }),
    )
    .min(1)
    .max(200),
});

// ─────────────────────────────────────────────────────────────
// AI
// ─────────────────────────────────────────────────────────────

const gapInput = z.object({
  skill: skillNameSchema,
  current: level,
  required: level,
});

export const aiRoadmapSchema = z.object({
  career: shortText,
  readiness: level,
  gaps: z.array(gapInput).min(1).max(40),
});

export const aiProjectSchema = z.object({
  career: shortText,
  skills: z.array(skillNameSchema).min(1).max(40),
  gaps: z.array(skillNameSchema).max(40).default([]),
  difficulty: z.enum(["Beginner", "Intermediate", "Advanced"]).default("Intermediate"),
});

export const aiAdviceSchema = z.object({
  career: shortText,
  readiness: level,
  strongSkills: z.array(skillNameSchema).max(40),
  gaps: z.array(gapInput).max(40),
});

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

export function formatZodIssues(error: z.ZodError) {
  return error.issues.map((i) => ({
    path: i.path.join("."),
    message: i.message,
  }));
}

/**
 * Parse `data` against `schema`, or throw a ServiceError
 * (`VALIDATION_ERROR`, details: [{ path, message }]).
 */
export function parse<T extends z.ZodTypeAny>(
  schema: T,
  data: unknown,
): z.infer<T> {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new ServiceError(
      "VALIDATION_ERROR",
      "Request validation failed",
      formatZodIssues(result.error),
    );
  }
  return result.data as z.infer<T>;
}
