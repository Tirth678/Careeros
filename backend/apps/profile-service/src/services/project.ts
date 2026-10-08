import { ServiceError, type ProjectDTO } from "@careeros/shared-types";
import { projectRepository } from "../repositories/project";
import { skillRepository } from "../repositories/skill";
import { profileService } from "./profile";
import { toProjectDTO } from "./mappers";

export interface ProjectInput {
  name: string;
  description?: string | null;
  githubUrl?: string | null;
  demoUrl?: string | null;
  skills?: string[];
}

async function resolveSkillIds(names: string[]): Promise<string[]> {
  const unique = [...new Set(names.map((n) => n.trim()).filter(Boolean))];
  const skills = await Promise.all(unique.map((n) => skillRepository.findOrCreate(n)));
  return skills.map((s) => s.id);
}

export const projectService = {
  async list(studentId: string): Promise<ProjectDTO[]> {
    await profileService.requireStudent(studentId);
    const projects = await projectRepository.listByStudent(studentId);
    return projects.map(toProjectDTO);
  },

  async get(projectId: string): Promise<ProjectDTO> {
    const project = await projectRepository.findById(projectId);
    if (!project) throw new ServiceError("PROJECT_NOT_FOUND", "Project does not exist");
    return toProjectDTO(project);
  },

  async create(studentId: string, input: ProjectInput): Promise<ProjectDTO> {
    await profileService.requireStudent(studentId);
    const skillIds = await resolveSkillIds(input.skills ?? []);
    const project = await projectRepository.create(
      studentId,
      {
        name: input.name,
        description: input.description,
        githubUrl: input.githubUrl,
        demoUrl: input.demoUrl,
      },
      skillIds,
    );
    return toProjectDTO(project);
  },

  async update(
    studentId: string,
    projectId: string,
    input: Partial<ProjectInput>,
  ): Promise<ProjectDTO> {
    const project = await projectRepository.findById(projectId);
    if (!project) throw new ServiceError("PROJECT_NOT_FOUND", "Project does not exist");
    if (project.studentId !== studentId) {
      throw new ServiceError("FORBIDDEN", "You do not own this project");
    }

    const skillIds =
      input.skills !== undefined ? await resolveSkillIds(input.skills) : undefined;

    const updated = await projectRepository.update(
      projectId,
      {
        name: input.name,
        description: input.description,
        githubUrl: input.githubUrl,
        demoUrl: input.demoUrl,
      },
      skillIds,
    );
    return toProjectDTO(updated);
  },

  async remove(studentId: string, projectId: string): Promise<void> {
    const project = await projectRepository.findById(projectId);
    if (!project) throw new ServiceError("PROJECT_NOT_FOUND", "Project does not exist");
    if (project.studentId !== studentId) {
      throw new ServiceError("FORBIDDEN", "You do not own this project");
    }
    await projectRepository.delete(projectId);
  },
};
