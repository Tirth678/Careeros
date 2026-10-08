import { ok } from "@careeros/shared-types";
import { resolveStudentId, type Ctx } from "@careeros/http";
import {
  parse,
  careerParam,
  studentIdParam,
  roadmapParam,
  roadmapTaskParam,
  updateTaskSchema,
  generateRoadmapSchema,
} from "../schemas";
import { analysisService } from "../services/analysis";
import { roadmapService } from "../services/roadmap";

export const analysisController = {
  async analyze(ctx: Ctx) {
    const { careerId } = parse(careerParam, ctx.params);
    const studentId = resolveStudentId(ctx);
    return ok(await analysisService.analyze(studentId, careerId));
  },

  async list(ctx: Ctx) {
    const studentId = resolveStudentId(ctx);
    return ok(await analysisService.list(studentId));
  },

  async latest(ctx: Ctx) {
    const studentId = resolveStudentId(ctx);
    const { careerId } = parse(careerParam, ctx.params);
    return ok(await analysisService.latest(studentId, careerId));
  },

  async matches(ctx: Ctx) {
    const studentId = resolveStudentId(ctx);
    return ok(await analysisService.matches(studentId));
  },
};

export const roadmapController = {
  async generate(ctx: Ctx) {
    const { careerId } = parse(generateRoadmapSchema, ctx.body);
    const studentId = resolveStudentId(ctx);
    return ok(await roadmapService.generate(studentId, careerId));
  },

  async list(ctx: Ctx) {
    const studentId = resolveStudentId(ctx);
    return ok(await roadmapService.list(studentId));
  },

  async active(ctx: Ctx) {
    const studentId = resolveStudentId(ctx);
    return ok(await roadmapService.active(studentId));
  },

  async get(ctx: Ctx) {
    const { roadmapId } = parse(roadmapParam, ctx.params);
    return ok(await roadmapService.get(roadmapId));
  },

  async updateTask(ctx: Ctx) {
    const { taskId } = parse(roadmapTaskParam, ctx.params);
    const { status } = parse(updateTaskSchema, ctx.body);
    const studentId = resolveStudentId(ctx);
    return ok(await roadmapService.updateTask(studentId, taskId, status));
  },
};
