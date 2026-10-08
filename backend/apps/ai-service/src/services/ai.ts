import type {
  AdviceGenerationInput,
  GeneratedAdvice,
  GeneratedProject,
  GeneratedRoadmap,
  ProjectGenerationInput,
  RoadmapGenerationInput,
} from "@careeros/shared-types";
import { getAIProvider } from "../providers";

/**
 * Stateless by design: everything the AI needs arrives in the request, so
 * this service owns no tables and never touches the database.
 */
export const aiService = {
  generateRoadmap(input: RoadmapGenerationInput): Promise<GeneratedRoadmap> {
    return getAIProvider().generateRoadmap(input);
  },

  generateProject(input: ProjectGenerationInput): Promise<GeneratedProject> {
    return getAIProvider().generateProject(input);
  },

  generateAdvice(input: AdviceGenerationInput): Promise<GeneratedAdvice> {
    return getAIProvider().generateAdvice(input);
  },
};
