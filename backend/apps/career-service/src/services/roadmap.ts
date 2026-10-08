import { recordActivity } from "@careeros/database";
import {
  ServiceError,
  type RoadmapDTO,
  type TaskStatus,
} from "@careeros/shared-types";
import { careerRepository, toRequirement } from "../repositories/career";
import { roadmapRepository, type RoadmapTaskInput } from "../repositories/roadmap";
import { skillRepository } from "../repositories/skill";
import { computeReadiness, computeSkillGaps } from "../engine";
import { profileClient } from "../clients/profile";
import { aiClient } from "../clients/ai";
import { toRoadmapDTO, toRoadmapTaskDTO } from "./mappers";

/** How much proficiency a completed roadmap task contributes. */
const TASK_SKILL_DELTA = 5;

export const roadmapService = {
  /**
   * AI *generates* the plan, this service *owns* it: we compute the gaps,
   * ask the AI for a structured roadmap, validate it, then persist it.
   */
  async generate(studentId: string, careerRef: string): Promise<RoadmapDTO> {
    const career = await careerRepository.find(careerRef);
    if (!career) {
      throw new ServiceError("CAREER_NOT_FOUND", "Career does not exist");
    }

    const skills = await profileClient.getSkillLevels(studentId);
    const requirements = career.skills.map(toRequirement);
    const { rows, gaps } = computeSkillGaps(requirements, skills);
    const readiness = computeReadiness(rows);

    const generated = await aiClient.generateRoadmap({
      career: career.name,
      readiness,
      gaps: gaps.map((g) => ({
        skill: g.skillName,
        current: g.current,
        required: g.required,
      })),
    });

    const tasks: RoadmapTaskInput[] = generated.weeks.flatMap((week) =>
      week.tasks.map((task) => ({
        title: task.title,
        description: task.description ?? null,
        skill: task.skill,
        week: week.week,
        estimatedMinutes: task.estimatedMinutes,
      })),
    );

    if (tasks.length === 0) {
      throw new ServiceError(
        "AI_RESPONSE_INVALID",
        "The generated roadmap contained no tasks",
      );
    }

    const skillIdsByName = await skillRepository.findIdsByNames(
      tasks.map((t) => t.skill),
    );

    await roadmapRepository.deactivateOthers(studentId);
    const roadmap = await roadmapRepository.create({
      studentId,
      careerId: career.id,
      title: generated.title,
      description: generated.description,
      skillIdsByName,
      tasks,
    });

    await recordActivity(studentId);

    return toRoadmapDTO(roadmap);
  },

  async get(roadmapId: string, studentId: string): Promise<RoadmapDTO> {
    const roadmap = await roadmapRepository.findById(roadmapId);
    if (!roadmap || roadmap.studentId !== studentId) {
      throw new ServiceError("ROADMAP_NOT_FOUND", "Roadmap does not exist");
    }
    return toRoadmapDTO(roadmap);
  },

  async list(studentId: string): Promise<RoadmapDTO[]> {
    const roadmaps = await roadmapRepository.listByStudent(studentId);
    return roadmaps.map(toRoadmapDTO);
  },

  async active(studentId: string): Promise<RoadmapDTO | null> {
    const roadmap = await roadmapRepository.findActive(studentId);
    return roadmap ? toRoadmapDTO(roadmap) : null;
  },

  /**
   * Closed loop: task done → progress recalculated → the task's skill gets a
   * proficiency bump in the profile domain → streak updated.
   */
  async updateTask(
    studentId: string,
    taskId: string,
    status: TaskStatus,
  ): Promise<{ task: ReturnType<typeof toRoadmapTaskDTO>; progress: number }> {
    const task = await roadmapRepository.getTask(taskId);
    if (!task) {
      throw new ServiceError("ROADMAP_TASK_NOT_FOUND", "Roadmap task does not exist");
    }

    const roadmap = await roadmapRepository.findById(task.roadmapId);
    if (!roadmap || roadmap.studentId !== studentId) {
      throw new ServiceError("FORBIDDEN", "You do not own this roadmap");
    }

    const updated = await roadmapRepository.setTaskStatus(taskId, status);
    if (!updated) {
      throw new ServiceError("ROADMAP_TASK_NOT_FOUND", "Roadmap task does not exist");
    }

    const progress = await roadmapRepository.recalculateProgress(roadmap.id);

    if (status === "done" && task.skill?.name) {
      await profileClient
        .bumpSkill(studentId, task.skill.name, TASK_SKILL_DELTA)
        .catch(() => null);
    }

    await recordActivity(studentId);

    return {
      task: toRoadmapTaskDTO({ ...task, ...updated, skill: task.skill }),
      progress,
    };
  },
};
