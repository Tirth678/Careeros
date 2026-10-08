import {
  prisma,
  type Career,
  type CareerSkill,
  type Skill,
} from "@careeros/database";
import type { CareerDTO, CareerSkillRequirement, Priority } from "@careeros/shared-types";
import type { Requirement } from "../engine";

export type CareerWithSkills = Career & {
  skills: (CareerSkill & { skill: Skill })[];
};

export function toRequirement(
  row: CareerSkill & { skill: Skill },
): Requirement {
  return {
    skillId: row.skillId,
    skillName: row.skill.name,
    category: row.skill.category,
    requiredLevel: row.requiredLevel,
    weight: row.weight,
    priority: row.priority as Priority,
  };
}

export function toRequirementDTO(row: Requirement): CareerSkillRequirement {
  return {
    skillId: row.skillId,
    skillName: row.skillName,
    category: row.category ?? "General",
    requiredLevel: row.requiredLevel,
    weight: row.weight,
    priority: row.priority,
  };
}

export function toCareerDTO(
  career: CareerWithSkills,
  includeRequirements = false,
): CareerDTO {
  return {
    id: career.id,
    slug: career.slug,
    name: career.name,
    description: career.description,
    ...(includeRequirements
      ? { requirements: career.skills.map((s) => toRequirementDTO(toRequirement(s))) }
      : {}),
  };
}

const skillsInclude = {
  skills: { include: { skill: true } },
} as const;

export const careerRepository = {
  list(): Promise<CareerWithSkills[]> {
    return prisma.career.findMany({
      include: skillsInclude,
      orderBy: { name: "asc" },
    }) as Promise<CareerWithSkills[]>;
  },

  findById(id: string): Promise<CareerWithSkills | null> {
    return prisma.career.findUnique({
      where: { id },
      include: skillsInclude,
    }) as Promise<CareerWithSkills | null>;
  },

  findBySlug(slug: string): Promise<CareerWithSkills | null> {
    return prisma.career.findUnique({
      where: { slug },
      include: skillsInclude,
    }) as Promise<CareerWithSkills | null>;
  },

  /** Accepts either a cuid or a slug so routes can stay human-readable. */
  async find(idOrSlug: string): Promise<CareerWithSkills | null> {
    return (await this.findBySlug(idOrSlug)) ?? (await this.findById(idOrSlug));
  },
};
