import type {
  AdviceGenerationInput,
  GeneratedAdvice,
  GeneratedProject,
  GeneratedRoadmap,
  ProjectGenerationInput,
  RoadmapGenerationInput,
} from "@careeros/shared-types";

/**
 * Transport-agnostic AI contract. The rest of Careeros only ever sees this
 * interface — swapping OpenRouter for another provider is a one-file change.
 */
export interface AIProvider {
  readonly name: string;
  generateRoadmap(input: RoadmapGenerationInput): Promise<GeneratedRoadmap>;
  generateProject(input: ProjectGenerationInput): Promise<GeneratedProject>;
  generateAdvice(input: AdviceGenerationInput): Promise<GeneratedAdvice>;
}
