import { ServiceError, type InternshipDTO, type CertificationDTO } from "@careeros/shared-types";
import { entryRepository } from "../repositories/entry";
import { profileService } from "./profile";
import { toCertificationDTO, toInternshipDTO } from "./mappers";

export interface InternshipInput {
  company: string;
  role: string;
  description?: string | null;
  startDate?: Date | null;
  endDate?: Date | null;
}

export interface CertificationInput {
  name: string;
  issuer?: string | null;
  credentialUrl?: string | null;
}

export const entryService = {
  async listInternships(studentId: string): Promise<InternshipDTO[]> {
    await profileService.requireStudent(studentId);
    const rows = await entryRepository.listInternships(studentId);
    return rows.map(toInternshipDTO);
  },

  async createInternship(
    studentId: string,
    input: InternshipInput,
  ): Promise<InternshipDTO> {
    await profileService.requireStudent(studentId);
    if (input.startDate && input.endDate && input.endDate < input.startDate) {
      throw new ServiceError("BAD_REQUEST", "endDate cannot be before startDate");
    }
    const row = await entryRepository.createInternship(studentId, input);
    return toInternshipDTO(row);
  },

  async removeInternship(studentId: string, id: string): Promise<void> {
    const rows = await entryRepository.listInternships(studentId);
    if (!rows.some((r) => r.id === id)) {
      throw new ServiceError("NOT_FOUND", "Internship does not exist");
    }
    await entryRepository.deleteInternship(id);
  },

  async listCertifications(studentId: string): Promise<CertificationDTO[]> {
    await profileService.requireStudent(studentId);
    const rows = await entryRepository.listCertifications(studentId);
    return rows.map(toCertificationDTO);
  },

  async createCertification(
    studentId: string,
    input: CertificationInput,
  ): Promise<CertificationDTO> {
    await profileService.requireStudent(studentId);
    const row = await entryRepository.createCertification(studentId, input);
    return toCertificationDTO(row);
  },

  async removeCertification(studentId: string, id: string): Promise<void> {
    const rows = await entryRepository.listCertifications(studentId);
    if (!rows.some((r) => r.id === id)) {
      throw new ServiceError("NOT_FOUND", "Certification does not exist");
    }
    await entryRepository.deleteCertification(id);
  },
};
