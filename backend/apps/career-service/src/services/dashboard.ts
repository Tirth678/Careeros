import { analysisRepository } from "../repositories/analysis";
import { roadmapRepository } from "../repositories/roadmap";
import { streakRepository } from "../repositories/streak";

export interface CareerDashboardSlice {
  readiness: {
    career: { id: string; slug: string; name: string } | null;
    score: number | null;
  };
  roadmap: {
    id: string;
    title: string;
    progress: number;
    nextTask: { id: string; title: string; estimatedMinutes: number } | null;
  } | null;
  streak: Awaited<ReturnType<typeof streakRepository.get>>;
}

/**
 * The gateway fans out to each service for the dashboard; this is the
 * career-domain slice (readiness + roadmap + streak) in one call so the
 * frontend still gets a single request.
 */
export const dashboardService = {
  async get(studentId: string): Promise<CareerDashboardSlice> {
    const [analysis, roadmap, streak] = await Promise.all([
      analysisRepository.latest(studentId),
      roadmapRepository.findActive(studentId),
      streakRepository.get(studentId),
    ]);

    const nextTask = roadmap?.tasks.find((t) => t.status !== "done");

    return {
      readiness: analysis
        ? {
            career: {
              id: analysis.career.id,
              slug: analysis.career.slug,
              name: analysis.career.name,
            },
            score: analysis.readinessScore,
          }
        : { career: null, score: null },
      roadmap: roadmap
        ? {
            id: roadmap.id,
            title: roadmap.title,
            progress: roadmap.progress,
            nextTask: nextTask
              ? {
                  id: nextTask.id,
                  title: nextTask.title,
                  estimatedMinutes: nextTask.estimatedMinutes,
                }
              : null,
          }
        : null,
      streak,
    };
  },
};
