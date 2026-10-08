import { prisma } from "./client";

function dayKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function daysAgo(n: number): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - n);
  return d;
}

/**
 * Call this on any meaningful activity (task completed, project added,
 * skill updated, analysis run). Idempotent within a single day.
 *
 *   same day     → unchanged
 *   next day     → streak++
 *   gap ≥ 2 days → streak resets to 1
 */
export async function recordActivity(studentId: string) {
  const today = dayKey(new Date());

  const existing = await prisma.streak.findUnique({ where: { studentId } });

  if (!existing) {
    return prisma.streak.create({
      data: {
        studentId,
        currentStreak: 1,
        longestStreak: 1,
        lastActivityAt: new Date(),
      },
    });
  }

  if (existing.lastActivityAt && dayKey(existing.lastActivityAt) === today) {
    return existing;
  }

  const yesterday = dayKey(daysAgo(1));
  const continued =
    existing.lastActivityAt !== null && dayKey(existing.lastActivityAt) === yesterday;

  const currentStreak = continued ? existing.currentStreak + 1 : 1;
  const longestStreak = Math.max(existing.longestStreak, currentStreak);

  return prisma.streak.update({
    where: { studentId },
    data: { currentStreak, longestStreak, lastActivityAt: new Date() },
  });
}
