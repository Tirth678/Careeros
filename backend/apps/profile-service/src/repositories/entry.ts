import { prisma, type Internship, type Certification } from "@careeros/database";

export interface InternshipCreateInput {
  company: string;
  role: string;
  description?: string | null;
  startDate?: Date | null;
  endDate?: Date | null;
}

export interface CertificationCreateInput {
  name: string;
  issuer?: string | null;
  credentialUrl?: string | null;
}

export const entryRepository = {
  listInternships(studentId: string): Promise<Internship[]> {
    return prisma.internship.findMany({
      where: { studentId },
      orderBy: { startDate: "desc" },
    });
  },

  createInternship(
    studentId: string,
    input: InternshipCreateInput,
  ): Promise<Internship> {
    return prisma.internship.create({
      data: {
        studentId,
        company: input.company,
        role: input.role,
        description: input.description ?? null,
        startDate: input.startDate ?? null,
        endDate: input.endDate ?? null,
      },
    });
  },

  deleteInternship(id: string): Promise<Internship> {
    return prisma.internship.delete({ where: { id } });
  },

  listCertifications(studentId: string): Promise<Certification[]> {
    return prisma.certification.findMany({
      where: { studentId },
      orderBy: { createdAt: "desc" },
    });
  },

  createCertification(
    studentId: string,
    input: CertificationCreateInput,
  ): Promise<Certification> {
    return prisma.certification.create({
      data: {
        studentId,
        name: input.name,
        issuer: input.issuer ?? null,
        credentialUrl: input.credentialUrl ?? null,
      },
    });
  },

  deleteCertification(id: string): Promise<Certification> {
    return prisma.certification.delete({ where: { id } });
  },
};
