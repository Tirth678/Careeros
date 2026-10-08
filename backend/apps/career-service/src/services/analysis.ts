import { recordActivity } from "@careeros/database";
import { ServiceError, type CareerAnalysisDTO, type CareerMatchDTO } from "@careeros/shared-types";
import { careerRepository, toRequirement } from "../repositories/career";
import { analysisRepository } from "../repositories/analysis";
import { computeSkillGaps, computeReadiness, rankCareers } from "../engine";
import { profileClient } from "../clients/profile";
import { toAnalysisDTO } from "./mappers";

export const analysisService = {
  /**
   * Full single-career analysis: fetch skills → deterministic gap engine →
   * persist → bump the streak. No AI anywhere in this path.
   */
  async analyze(studentId: string, careerRef: string): Promise<CareerAnalysisDTO> {
    const career = await careerRepository.find(careerRef);
    if (!career) {
      throw new ServiceError("CAREER_NOT_FOUND", "Career does not exist");
    }

    const skills = await profileClient.getSkillLevels(studentId);
    const requirements = career.skills.map(toRequirement);
    const { rows, strongSkills, gaps } = computeSkillGaps(requirements, skills);
    const readinessScore = computeReadiness(rows);

    const saved = await analysisRepository.create({
      studentId,
      careerId: career.id,
      readinessScore,
      strengths: strongSkills,
      gaps,
    });

    await recordActivity(studentId);

    return toAnalysisDTO({ ...saved, career });
  },

  async list(studentId: string): Promise<CareerAnalysisDTO[]> {
    const rows = await analysisRepository.listByStudent(studentId);
    return rows.map(toAnalysisDTO);
  },

  async latest(studentId: string, careerRef: string): Promise<CareerAnalysisDTO> {
    const career = await careerRepository.find(careerRef);
    if (!career) {
      throw new ServiceError("CAREER_NOT_FOUND", "Career does not exist");
    }

    const row = await analysisRepository.latestForCareer(studentId, career.id);
    if (!row) {
      throw new ServiceError("ANALYSIS_NOT_FOUND", "No analysis yet for this career");
    }
    return toAnalysisDTO(row);
  },

  /** Ranked list of every career the student is closest to. */
  async matches(studentId: string): Promise<CareerMatchDTO[]> {
    const [careers, skills] = await Promise.all([
      careerRepository.list(),
      profileClient.getSkillLevels(studentId),
    ]);

    return rankCareers(
      careers.map((career) => ({
        id: career.id,
        slug: career.slug,
        name: career.name,
        requirements: career.skills.map(toRequirement),
      })),
      skills,
    );
  },
};
