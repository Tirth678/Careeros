export type {
  StudentDTO,
  SkillDTO,
  StudentSkillDTO,
  ProjectDTO,
  InternshipDTO,
  CertificationDTO,
  ProfileDTO,
} from "@careeros/shared-types";

export interface CreateProjectInput {
  name: string;
  description?: string | null;
  githubUrl?: string | null;
  demoUrl?: string | null;
  skills?: string[];
}

export interface UpsertStudentSkillInput {
  name: string;
  proficiency: number;
  confidence?: number | null;
  source: string;
}
