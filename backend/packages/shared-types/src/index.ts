export * from "./envelope";
export * from "./errors";

// ─────────────────────────────────────────────────────────────
// Profile domain
// ─────────────────────────────────────────────────────────────

export interface StudentDTO {
  id: string;
  name: string;
  email: string;
  degree: string | null;
  university: string | null;
  cgpa: number | null;
  graduationYear: number | null;
}

export interface SkillDTO {
  id: string;
  name: string;
  category: string;
}

export interface StudentSkillDTO extends SkillDTO {
  proficiency: number;
  confidence: number | null;
  source: string;
}

export interface ProjectDTO {
  id: string;
  studentId: string;
  name: string;
  description: string | null;
  githubUrl: string | null;
  demoUrl: string | null;
  skills: SkillDTO[];
}

export interface InternshipDTO {
  id: string;
  studentId: string;
  company: string;
  role: string;
  description: string | null;
  startDate: string | null;
  endDate: string | null;
}

export interface CertificationDTO {
  id: string;
  studentId: string;
  name: string;
  issuer: string | null;
  credentialUrl: string | null;
}

export interface ProfileDTO {
  student: StudentDTO;
  skills: StudentSkillDTO[];
  projects: ProjectDTO[];
  internships: InternshipDTO[];
  certifications: CertificationDTO[];
}

// ─────────────────────────────────────────────────────────────
// Career domain
// ─────────────────────────────────────────────────────────────

export type Priority = "high" | "medium" | "low";

export interface CareerSkillRequirement {
  skillId: string;
  skillName: string;
  category: string;
  requiredLevel: number;
  weight: number;
  priority: Priority;
}

export interface CareerDTO {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  requirements?: CareerSkillRequirement[];
}

export interface SkillGap {
  skillId: string;
  skillName: string;
  current: number;
  required: number;
  weight: number;
  priority: Priority;
  ratio: number;
}

export interface CareerAnalysisDTO {
  id?: string;
  career: { id: string; slug: string; name: string };
  readinessScore: number;
  strongSkills: SkillGap[];
  gaps: SkillGap[];
  createdAt?: string;
}

export interface CareerMatchDTO {
  career: { id: string; slug: string; name: string };
  matchScore: number;
}

export type TaskStatus = "todo" | "in_progress" | "done";

export interface RoadmapTaskDTO {
  id: string;
  roadmapId: string;
  title: string;
  description: string | null;
  skillId: string | null;
  skillName?: string | null;
  week: number;
  status: TaskStatus;
  estimatedMinutes: number;
}

export interface RoadmapDTO {
  id: string;
  studentId: string;
  careerId: string;
  title: string;
  description: string | null;
  progress: number;
  isActive: boolean;
  createdAt: string;
  tasks: RoadmapTaskDTO[];
}

export interface StreakDTO {
  currentStreak: number;
  longestStreak: number;
  lastActivityAt: string | null;
}

// ─────────────────────────────────────────────────────────────
// Dashboard
// ─────────────────────────────────────────────────────────────

export interface DashboardDTO {
  student: StudentDTO;
  streak: StreakDTO;
  readiness: {
    career: { id: string; slug: string; name: string } | null;
    score: number | null;
  };
  skills: { name: string; level: number }[];
  roadmap: {
    id: string;
    title: string;
    progress: number;
    nextTask: {
      id: string;
      title: string;
      estimatedMinutes: number;
    } | null;
  } | null;
}

// ─────────────────────────────────────────────────────────────
// AI domain
// ─────────────────────────────────────────────────────────────

export interface RoadmapGenerationInput {
  career: string;
  readiness: number;
  gaps: { skill: string; current: number; required: number }[];
}

export interface GeneratedRoadmap {
  title: string;
  description: string;
  weeks: {
    week: number;
    title: string;
    tasks: {
      title: string;
      description: string;
      skill: string | null;
      estimatedMinutes: number;
    }[];
  }[];
}

export interface ProjectGenerationInput {
  career: string;
  skills: string[];
  gaps: string[];
  difficulty: "Beginner" | "Intermediate" | "Advanced";
}

export interface GeneratedProject {
  title: string;
  description: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  skills: string[];
  milestones: string[];
}

export interface AdviceGenerationInput {
  career: string;
  readiness: number;
  strongSkills: string[];
  gaps: { skill: string; current: number; required: number }[];
}

export interface GeneratedAdvice {
  whyBehind: string;
  strengths: string;
  highestImpact: string[];
  nextAction: string;
}
