import { ok } from "@careeros/shared-types";
import { parse, createProfileSchema, updateProfileSchema, z } from "../schemas";
import { profileService } from "../services/profile";
import { resolveStudentId } from "@careeros/http";
import type { Ctx } from "@careeros/http";

const pathParams = z.object({ studentId: z.string().min(1) });

export const profileController = {
  async getProfile(ctx: Ctx) {
    const studentId = resolveStudentId(ctx);
    return ok(await profileService.getProfile(studentId));
  },

  async getStudent(ctx: Ctx) {
    const studentId = resolveStudentId(ctx);
    return ok(await profileService.getStudent(studentId));
  },

  async getSkills(ctx: Ctx) {
    const studentId = resolveStudentId(ctx);
    return ok(await profileService.getSkills(studentId));
  },

  async createProfile(ctx: Ctx) {
    const input = parse(createProfileSchema, ctx.body);
    const id = crypto.randomUUID();
    return ok(await profileService.createProfile(id, input));
  },

  async updateProfile(ctx: Ctx) {
    const studentId = resolveStudentId(ctx);
    parse(pathParams, ctx.params);
    const input = parse(updateProfileSchema, ctx.body);
    return ok(await profileService.updateProfile(studentId, input));
  },
};
