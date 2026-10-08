import type { CareerAnalysis, Roadmap } from "@careeros/database";
import type {
  CareerAnalysisDTO,
  RoadmapDTO,
  RoadmapTaskDTO,
  SkillGap,
} from "@careeros/shared-types";
import type { RoadmapWithTasks } from "../repositories/roadmap";

function asGaps(value: unknown): SkillGap[] {
  if (!Array.isArray(value)) return [];
  return value as SkillGap[];
}

export function toAnalysisDTO(
  row: CareerAnalysis & { career: { id: string; slug: string; name: string } },
): CareerAnalysisDTO {
  return {
    id: row.id,
    career: { id: row.career.id, slug: row.career.slug, name: row.career.name },
    readinessScore: row.readinessScore,
    strongSkills: asGaps(row.strengths),
    gaps: asGaps(row.gaps),
    createdAt: row.createdAt.toISOString(),
  };
}

export function toRoadmapTaskDTO(
  task: RoadmapWithTasks["tasks"][number],
): RoadmapTaskDTO {
  return {
    id: task.id,
    roadmapId: task.roadmapId,
    title: task.title,
    description: task.description,
    skillId: task.skillId,
    skillName: task.skill?.name ?? null,
    week: task.week,
    status: task.status,
    estimatedMinutes: task.estimatedMinutes,
  };
}

export function toRoadmapDTO(roadmap: RoadmapWithTasks): RoadmapDTO {
  return {
    id: roadmap.id,
    studentId: roadmap.studentId,
    careerId: roadmap.careerId,
    title: roadmap.title,
    description: roadmap.description,
    progress: roadmap.progress,
    isActive: roadmap.isActive,
    createdAt: roadmap.createdAt.toISOString(),
    tasks: roadmap.tasks.map(toRoadmapTaskDTO),
  };
}

export function toRoadmapSummary(
  roadmap: Roadmap & { tasks?: { status: string }[] },
): Pick<RoadmapDTO, "id" | "title" | "progress" | "isActive"> {
  return {
    id: roadmap.id,
    title: roadmap.title,
    progress: roadmap.progress,
    isActive: roadmap.isActive,
  };
}
