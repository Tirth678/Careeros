import { ServiceError, type ProfileDTO } from "@careeros/shared-types";
import { studentRepository } from "../repositories/student";
import { skillRepository } from "../repositories/skill";
import { projectRepository } from "../repositories/project";
import { entryRepository } from "../repositories/entry";
import {
  toCertificationDTO,
 toInternshipDTO,
  toProjectDTO,
  toStudentDTO,
  toStudentSkillDTO,
} from "./mappers";

export interface UpdateProfileInput {
  name?: string;
  email?: string;
  degree?: string | null;
  university?: string | null;
  cgpa?: number | null;
  graduationYear?: number | null;
}

export const profileService = {
  async requireStudent(studentId: string) {
    const student = await studentRepository.findById(studentId);
    if (!student) {
      throw new ServiceError("STUDENT_NOT_FOUND", "Student does not exist");
    }
    return student;
  },

  async getProfile(studentId: string): Promise<ProfileDTO> {
    const student = await this.requireStudent(studentId);

    const [skills, projects, internships, certifications] = await Promise.all([
      skillRepository.listForStudent(studentId),
      projectRepository.listByStudent(studentId),
      entryRepository.listInternships(studentId),
      entryRepository.listCertifications(studentId),
    ]);

    return {
      student: toStudentDTO(student),
      skills: skills.map(toStudentSkillDTO),
      projects: projects.map(toProjectDTO),
      internships: internships.map(toInternshipDTO),
      certifications: certifications.map(toCertificationDTO),
    };
  },

  async getStudent(studentId: string) {
    return toStudentDTO(await this.requireStudent(studentId));
  },

  async getSkills(studentId: string) {
    await this.requireStudent(studentId);
    const skills = await skillRepository.listForStudent(studentId);
    return skills.map(toStudentSkillDTO);
  },

  async updateProfile(studentId: string, input: UpdateProfileInput) {
    const student = await this.requireStudent(studentId);

    if (input.email && input.email !== student.email) {
      const existing = await studentRepository.findByEmail(input.email);
      if (existing) {
        throw new ServiceError("CONFLICT", "Email is already in use");
      }
    }

    const updated = await studentRepository.update(studentId, input);
    return toStudentDTO(updated);
  },

  async createProfile(id: string, input: Required<Pick<UpdateProfileInput, "name" | "email">> & Omit<UpdateProfileInput, "name" | "email">) {
    const existing = await studentRepository.findByEmail(input.email);
    if (existing) {
      throw new ServiceError("CONFLICT", "A student with this email already exists");
    }
    const created = await studentRepository.create(id, input);
    return toStudentDTO(created);
  },
};
