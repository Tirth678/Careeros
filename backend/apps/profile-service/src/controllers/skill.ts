import { ok } from "@careeros/shared-types";
import { resolveStudentId, type Ctx } from "@careeros/http";
import {
  z,
  parse,
  upsertStudentSkillSchema,
  updateStudentSkillSchema,
} from "../schemas";
import { skillService } from "../services/skill";
import { profileService } from "../services/profile";

const skillParams = z.object({
  studentId: z.string().min(1),
  skillName: z.string().trim().min(1).max(80),
});

export const skillController = {
  async list(ctx: Ctx) {
    const studentId = resolveStudentId(ctx);
    return ok(await profileService.getSkills(studentId));
  },

  async upsert(ctx: Ctx) {
    const studentId = resolveStudentId(ctx);
    const input = parse(upsertStudentSkillSchema, ctx.body);
    return ok(await skillService.upsert(studentId, input));
  },

  async update(ctx: Ctx) {
    const studentId = resolveStudentId(ctx);
    const { skillName } = parse(skillParams, ctx.params);
    const input = parse(updateStudentSkillSchema, ctx.body);
    return ok(await skillService.update(studentId, skillName, input));
  },

  async remove(ctx: Ctx) {
    const studentId = resolveStudentId(ctx);
    const { skillName } = parse(skillParams, ctx.params);
    await skillService.remove(studentId, skillName);
    return ok({ deleted: true });
  },
};
