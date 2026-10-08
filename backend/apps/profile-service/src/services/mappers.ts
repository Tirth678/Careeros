import type { User, Skill, StudentSkill, Internship, Certification } from "@careeros/database";
import type {
  StudentDTO,
  SkillDTO,
  StudentSkillDTO,
  InternshipDTO,
  CertificationDTO,
} from "@careeros/shared-types";
import type { ProjectWithSkills } from "../repositories/project";
import type { ProjectDTO } from "@careeros/shared-types";

export function toStudentDTO(user: User): StudentDTO {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    degree: user.degree,
    university: user.university,
    cgpa: user.cgpa,
    graduationYear: user.graduationYear,
  };
}

export function toSkillDTO(skill: Skill): SkillDTO {
  return { id: skill.id, name: skill.name, category: skill.category };
}

export function toStudentSkillDTO(
  row: StudentSkill & { skill: Skill },
): StudentSkillDTO {
  return {
    id: row.skill.id,
    name: row.skill.name,
    category: row.skill.category,
    proficiency: row.proficiency,
    confidence: row.confidence,
    source: row.source,
  };
}

export function toProjectDTO(project: ProjectWithSkills): ProjectDTO {
  return {
    id: project.id,
    studentId: project.studentId,
    name: project.name,
    description: project.description,
    githubUrl: project.githubUrl,
    demoUrl: project.demoUrl,
    skills: project.skills.map((s) => toSkillDTO(s.skill)),
  };
}

export function toInternshipDTO(row: Internship): InternshipDTO {
  return {
    id: row.id,
    studentId: row.studentId,
    company: row.company,
    role: row.role,
    description: row.description,
    startDate: row.startDate?.toISOString() ?? null,
    endDate: row.endDate?.toISOString() ?? null,
  };
}

export function toCertificationDTO(row: Certification): CertificationDTO {
  return {
    id: row.id,
    studentId: row.studentId,
    name: row.name,
    issuer: row.issuer,
    credentialUrl: row.credentialUrl,
  };
}
