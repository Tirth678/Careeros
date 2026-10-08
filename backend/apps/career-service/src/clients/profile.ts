import { config } from "@careeros/config";
import { callService } from "@careeros/http";
import type { StudentSkillDTO } from "@careeros/shared-types";
import type { StudentSkillLevel } from "../engine";

export const profileClient = {
  getSkills(studentId: string): Promise<StudentSkillDTO[]> {
    return callService(
      `${config.PROFILE_SERVICE_URL}/internal/students/${studentId}/skills`,
    );
  },

  async getSkillLevels(studentId: string): Promise<StudentSkillLevel[]> {
    const skills = await this.getSkills(studentId);
    return skills.map((s) => ({
      skillId: s.id,
      skillName: s.name,
      proficiency: s.proficiency,
    }));
  },

  /**
   * Closed loop: finishing a roadmap task nudges the underlying skill up.
   * The profile domain still owns the write — we just ask it to.
   */
  bumpSkill(
    studentId: string,
    skillName: string,
    delta: number,
  ): Promise<{ skillName: string; proficiency: number } | null> {
    return callService(
      `${config.PROFILE_SERVICE_URL}/internal/students/${studentId}/skill-progress`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ skillName, delta }),
      },
    );
  },
};
