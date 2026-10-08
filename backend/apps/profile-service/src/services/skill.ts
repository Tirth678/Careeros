import { ServiceError, type StudentSkillDTO } from "@careeros/shared-types";
import { skillRepository } from "../repositories/skill";
import { profileService } from "./profile";
import { toStudentSkillDTO } from "./mappers";

export interface UpsertSkillInput {
  name: string;
  proficiency: number;
  confidence?: number | null;
  source: string;
}

export const skillService = {
  async upsert(
    studentId: string,
    input: UpsertSkillInput,
  ): Promise<StudentSkillDTO> {
    await profileService.requireStudent(studentId);

    const skill = await skillRepository.findOrCreate(input.name);
    const row = await skillRepository.upsertStudentSkill(studentId, skill.id, {
      proficiency: input.proficiency,
      confidence: input.confidence ?? null,
      source: input.source,
    });

    return toStudentSkillDTO({ ...row, skill });
  },

  async update(
    studentId: string,
    skillName: string,
    input: { proficiency?: number; confidence?: number | null; source?: string },
  ): Promise<StudentSkillDTO> {
    await profileService.requireStudent(studentId);

    const skill = await skillRepository.findByName(skillName);
    if (!skill) throw new ServiceError("SKILL_NOT_FOUND", "Skill does not exist");

    const existing = await skillRepository.listForStudent(studentId);
    const row = existing.find((r) => r.skillId === skill.id);
    if (!row) throw new ServiceError("SKILL_NOT_FOUND", "Student has no such skill");

    const updated = await skillRepository.updateStudentSkill(row.id, input);
    return toStudentSkillDTO({ ...updated, skill });
  },

  async remove(studentId: string, skillName: string): Promise<void> {
    await profileService.requireStudent(studentId);

    const skill = await skillRepository.findByName(skillName);
    if (!skill) throw new ServiceError("SKILL_NOT_FOUND", "Skill does not exist");

    const removed = await skillRepository.deleteStudentSkill(studentId, skill.id);
    if (!removed) throw new ServiceError("SKILL_NOT_FOUND", "Student has no such skill");
  },

  /**
   * Called by the career service when a roadmap task is completed — the
   * profile domain keeps ownership of the write.
   */
  async bump(
    studentId: string,
    skillName: string,
    delta: number,
  ): Promise<{ skillName: string; proficiency: number } | null> {
    const skill = await skillRepository.findByName(skillName);
    if (!skill) return null;

    const rows = await skillRepository.listForStudent(studentId);
    const row = rows.find((r) => r.skillId === skill.id);
    if (!row) return null;

    const proficiency = Math.min(100, Math.max(0, row.proficiency + delta));
    const updated = await skillRepository.updateStudentSkill(row.id, { proficiency });
    return { skillName: skill.name, proficiency: updated.proficiency };
  },
};
