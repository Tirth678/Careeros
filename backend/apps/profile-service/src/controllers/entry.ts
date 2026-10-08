import { ok } from "@careeros/shared-types";
import {
  parse,
  z,
  createInternshipSchema,
  createCertificationSchema,
} from "../schemas";
import { entryService } from "../services/entry";
import { resolveStudentId } from "@careeros/http";
import type { Ctx } from "@careeros/http";

const entryParams = z.object({ entryId: z.string().min(1) });

export const entryController = {
  async listInternships(ctx: Ctx) {
    const studentId = resolveStudentId(ctx);
    return ok(await entryService.listInternships(studentId));
  },

  async createInternship(ctx: Ctx) {
    const studentId = resolveStudentId(ctx);
    const input = parse(createInternshipSchema, ctx.body);
    return ok(await entryService.createInternship(studentId, input));
  },

  async removeInternship(ctx: Ctx<{ entryId: string }>) {
    const studentId = resolveStudentId(ctx);
    const { entryId } = parse(entryParams, ctx.params);
    await entryService.removeInternship(studentId, entryId);
    return ok({ deleted: true });
  },

  async listCertifications(ctx: Ctx) {
    const studentId = resolveStudentId(ctx);
    return ok(await entryService.listCertifications(studentId));
  },

  async createCertification(ctx: Ctx) {
    const studentId = resolveStudentId(ctx);
    const input = parse(createCertificationSchema, ctx.body);
    return ok(await entryService.createCertification(studentId, input));
  },

  async removeCertification(ctx: Ctx<{ entryId: string }>) {
    const studentId = resolveStudentId(ctx);
    const { entryId } = parse(entryParams, ctx.params);
    await entryService.removeCertification(studentId, entryId);
    return ok({ deleted: true });
  },
};
