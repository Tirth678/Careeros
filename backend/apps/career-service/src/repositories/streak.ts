import { prisma } from "@careeros/database";
import type { StreakDTO } from "@careeros/shared-types";

export const streakRepository = {
  async get(studentId: string): Promise<StreakDTO> {
    const row = await prisma.streak.findUnique({ where: { studentId } });
    if (!row) {
      return { currentStreak: 0, longestStreak: 0, lastActivityAt: null };
    }
    return {
      currentStreak: row.currentStreak,
      longestStreak: row.longestStreak,
      lastActivityAt: row.lastActivityAt?.toISOString() ?? null,
    };
  },
};
