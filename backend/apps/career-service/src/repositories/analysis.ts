import {
  prisma,
  type CareerAnalysis,
  type Career,
  type Prisma,
} from "@careeros/database";

export const analysisRepository = {
  create(input: {
    studentId: string;
    careerId: string;
    readinessScore: number;
    strengths: unknown;
    gaps: unknown;
  }): Promise<CareerAnalysis> {
    return prisma.careerAnalysis.create({
      data: {
        studentId: input.studentId,
        careerId: input.careerId,
        readinessScore: input.readinessScore,
        strengths: input.strengths as Prisma.InputJsonValue,
        gaps: input.gaps as Prisma.InputJsonValue,
      },
    });
  },

  listByStudent(studentId: string, limit = 20): Promise<(CareerAnalysis & { career: Career })[]> {
    return prisma.careerAnalysis.findMany({
      where: { studentId },
      include: { career: true },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  },

  latestForCareer(
    studentId: string,
    careerId: string,
  ): Promise<(CareerAnalysis & { career: Career }) | null> {
    return prisma.careerAnalysis.findFirst({
      where: { studentId, careerId },
      include: { career: true },
      orderBy: { createdAt: "desc" },
    });
  },

  latest(studentId: string): Promise<(CareerAnalysis & { career: Career }) | null> {
    return prisma.careerAnalysis.findFirst({
      where: { studentId },
      include: { career: true },
      orderBy: { createdAt: "desc" },
    });
  },
};
