import { prisma, type Project, type ProjectSkill, type Skill } from "@careeros/database";

export interface ProjectCreateInput {
  name: string;
  description?: string | null;
  githubUrl?: string | null;
  demoUrl?: string | null;
  skillNames?: string[];
}

const projectInclude = {
  skills: { include: { skill: true } },
} as const;

export type ProjectWithSkills = Project & {
  skills: (ProjectSkill & { skill: Skill })[];
};

export const projectRepository = {
  listByStudent(studentId: string): Promise<ProjectWithSkills[]> {
    return prisma.project.findMany({
      where: { studentId },
      include: projectInclude,
      orderBy: { createdAt: "desc" },
    }) as Promise<ProjectWithSkills[]>;
  },

  findById(id: string): Promise<ProjectWithSkills | null> {
    return prisma.project.findUnique({
      where: { id },
      include: projectInclude,
    }) as Promise<ProjectWithSkills | null>;
  },

  async create(
    studentId: string,
    input: ProjectCreateInput,
    skillIds: string[],
  ): Promise<ProjectWithSkills> {
    return prisma.project.create({
      data: {
        studentId,
        name: input.name,
        description: input.description ?? null,
        githubUrl: input.githubUrl ?? null,
        demoUrl: input.demoUrl ?? null,
        skills: {
          create: skillIds.map((skillId) => ({ skillId })),
        },
      },
      include: projectInclude,
    }) as Promise<ProjectWithSkills>;
  },

  async update(
    id: string,
    input: Partial<Omit<ProjectCreateInput, "skillNames">>,
    skillIds?: string[],
  ): Promise<ProjectWithSkills> {
    if (skillIds) {
      await prisma.projectSkill.deleteMany({ where: { projectId: id } });
      await prisma.projectSkill.createMany({
        data: skillIds.map((skillId) => ({ projectId: id, skillId })),
        skipDuplicates: true,
      });
    }

    const data: Record<string, string | null | undefined> = {};
    if (input.name !== undefined) data.name = input.name;
    if (input.description !== undefined) data.description = input.description;
    if (input.githubUrl !== undefined) data.githubUrl = input.githubUrl;
    if (input.demoUrl !== undefined) data.demoUrl = input.demoUrl;

    return prisma.project.update({
      where: { id },
      data,
      include: projectInclude,
    }) as Promise<ProjectWithSkills>;
  },

  async delete(id: string): Promise<boolean> {
    const { count } = await prisma.project.deleteMany({ where: { id } });
    return count > 0;
  },
};
