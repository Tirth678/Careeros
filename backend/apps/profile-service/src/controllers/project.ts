import { ok } from "@careeros/shared-types";
import {
  parse,
  projectIdParam,
  createProjectSchema,
  updateProjectSchema,
} from "../schemas";
import { projectService } from "../services/project";
import { resolveStudentId } from "@careeros/http";
import type { Ctx } from "@careeros/http";

export const projectController = {
  async list(ctx: Ctx) {
    const studentId = resolveStudentId(ctx);
    return ok(await projectService.list(studentId));
  },

  async get(ctx: Ctx<{ projectId: string }>) {
    const { projectId } = parse(projectIdParam, ctx.params);
    return ok(await projectService.get(projectId, resolveStudentId(ctx)));
  },

  async create(ctx: Ctx) {
    const studentId = resolveStudentId(ctx);
    const input = parse(createProjectSchema, ctx.body);
    return ok(await projectService.create(studentId, input));
  },

  async update(ctx: Ctx<{ projectId: string }>) {
    const studentId = resolveStudentId(ctx);
    const { projectId } = parse(projectIdParam, ctx.params);
    const input = parse(updateProjectSchema, ctx.body);
    return ok(await projectService.update(studentId, projectId, input));
  },

  async remove(ctx: Ctx<{ projectId: string }>) {
    const studentId = resolveStudentId(ctx);
    const { projectId } = parse(projectIdParam, ctx.params);
    await projectService.remove(studentId, projectId);
    return ok({ deleted: true });
  },
};
