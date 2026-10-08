import { prisma, type Skill, type StudentSkill } from "@careeros/database";

export const skillRepository = {
  findByName(name: string): Promise<Skill | null> {
    return prisma.skill.findUnique({ where: { name } });
  },

  findOrCreate(name: string, category = "General"): Promise<Skill> {
    return prisma.skill.upsert({
      where: { name },
      update: {},
      create: { name, category },
    });
  },

  listForStudent(studentId: string): Promise<(StudentSkill & { skill: Skill })[]> {
    return prisma.studentSkill.findMany({
      where: { studentId },
      include: { skill: true },
      orderBy: { proficiency: "desc" },
    });
  },

  upsertStudentSkill(
    studentId: string,
    skillId: string,
    data: { proficiency: number; confidence?: number | null; source: string },
  ): Promise<StudentSkill> {
    return prisma.studentSkill.upsert({
      where: { studentId_skillId: { studentId, skillId } },
      update: data,
      create: { studentId, skillId, ...data },
    });
  },

  updateStudentSkill(
    id: string,
    data: { proficiency?: number; confidence?: number | null; source?: string },
  ): Promise<StudentSkill> {
    return prisma.studentSkill.update({ where: { id }, data });
  },

  async deleteStudentSkill(studentId: string, skillId: string): Promise<boolean> {
    const { count } = await prisma.studentSkill.deleteMany({
      where: { studentId, skillId },
    });
    return count > 0;
  },
};
