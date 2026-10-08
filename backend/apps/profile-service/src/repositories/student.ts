import { prisma, type User } from "@careeros/database";

export interface StudentCreateInput {
  name: string;
  email: string;
  degree?: string | null;
  university?: string | null;
  cgpa?: number | null;
  graduationYear?: number | null;
}

export const studentRepository = {
  findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } });
  },

  findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } });
  },

  list(): Promise<User[]> {
    return prisma.user.findMany({ orderBy: { createdAt: "desc" }, take: 100 });
  },

  create(id: string, data: StudentCreateInput): Promise<User> {
    return prisma.user.create({ data: { id, ...data } });
  },

  update(id: string, data: Partial<StudentCreateInput>): Promise<User> {
    return prisma.user.update({ where: { id }, data });
  },
};
