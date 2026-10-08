import { config } from "@careeros/config";
import { callService } from "@careeros/http";
import type {
  GeneratedAdvice,
  GeneratedProject,
  GeneratedRoadmap,
  AdviceGenerationInput,
  ProjectGenerationInput,
  RoadmapGenerationInput,
} from "@careeros/shared-types";

function post<T>(path: string, body: unknown): Promise<T> {
  return callService<T>(`${config.AI_SERVICE_URL}${path}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

export const aiClient = {
  generateRoadmap(input: RoadmapGenerationInput): Promise<GeneratedRoadmap> {
    return post<GeneratedRoadmap>("/ai/roadmap", input);
  },

  generateProject(input: ProjectGenerationInput): Promise<GeneratedProject> {
    return post<GeneratedProject>("/ai/project", input);
  },

  generateAdvice(input: AdviceGenerationInput): Promise<GeneratedAdvice> {
    return post<GeneratedAdvice>("/ai/advice", input);
  },
};
