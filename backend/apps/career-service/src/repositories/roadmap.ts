import {
  prisma,
  type Roadmap,
  type RoadmapTask,
  type Skill,
  type TaskStatus,
} from "@careeros/database";

export type RoadmapWithTasks = Roadmap & {
  tasks: (RoadmapTask & { skill: Skill | null })[];
};

export interface RoadmapTaskInput {
  title: string;
  description?: string | null;
  skill?: string | null;
  week: number;
  estimatedMinutes: number;
}

const tasksInclude = {
  tasks: { include: { skill: true }, orderBy: { week: "asc" as const } },
} as const;

export const roadmapRepository = {
  findById(id: string): Promise<RoadmapWithTasks | null> {
    return prisma.roadmap.findUnique({
      where: { id },
      include: tasksInclude,
    }) as Promise<RoadmapWithTasks | null>;
  },

  listByStudent(studentId: string): Promise<RoadmapWithTasks[]> {
    return prisma.roadmap.findMany({
      where: { studentId },
      include: tasksInclude,
      orderBy: { createdAt: "desc" },
    }) as Promise<RoadmapWithTasks[]>;
  },

  findActive(studentId: string): Promise<RoadmapWithTasks | null> {
    return prisma.roadmap.findFirst({
      where: { studentId, isActive: true },
      include: tasksInclude,
      orderBy: { createdAt: "desc" },
    }) as Promise<RoadmapWithTasks | null>;
  },

  async deactivateOthers(studentId: string, keepId?: string): Promise<void> {
    await prisma.roadmap.updateMany({
      where: {
        studentId,
        isActive: true,
        ...(keepId ? { id: { not: keepId } } : {}),
      },
      data: { isActive: false },
    });
  },

  async create(input: {
    studentId: string;
    careerId: string;
    title: string;
    description?: string | null;
    skillIdsByName: Map<string, string>;
    tasks: RoadmapTaskInput[];
  }): Promise<RoadmapWithTasks> {
    const done = await prisma.roadmap.create({
      data: {
        studentId: input.studentId,
        careerId: input.careerId,
        title: input.title,
        description: input.description ?? null,
        tasks: {
          create: input.tasks.map((task) => ({
            title: task.title,
            description: task.description ?? null,
            week: task.week,
            estimatedMinutes: task.estimatedMinutes,
            skillId: task.skill
              ? (input.skillIdsByName.get(task.skill.trim().toLowerCase()) ?? null)
              : null,
          })),
        },
      },
      include: tasksInclude,
    });

    return done as RoadmapWithTasks;
  },

  async getTask(
    taskId: string,
  ): Promise<(RoadmapTask & { skill: Skill | null }) | null> {
    return prisma.roadmapTask.findUnique({
      where: { id: taskId },
      include: { skill: true },
    });
  },

  async setTaskStatus(
    taskId: string,
    status: TaskStatus,
  ): Promise<RoadmapTask | null> {
    try {
      return await prisma.roadmapTask.update({
        where: { id: taskId },
        data: {
          status,
          completedAt: status === "done" ? new Date() : null,
        },
      });
    } catch {
      return null;
    }
  },

  async recalculateProgress(roadmapId: string): Promise<number> {
    const tasks = await prisma.roadmapTask.findMany({
      where: { roadmapId },
      select: { status: true },
    });

    if (tasks.length === 0) return 0;
    const done = tasks.filter((t) => t.status === "done").length;
    const progress = Math.round((done / tasks.length) * 100);

    await prisma.roadmap.update({
      where: { id: roadmapId },
      data: { progress },
    });

    return progress;
  },
};
