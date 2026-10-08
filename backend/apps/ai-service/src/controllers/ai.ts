import { ok } from "@careeros/shared-types";
import {
  parse,
  aiRoadmapSchema,
  aiProjectSchema,
  aiAdviceSchema,
} from "../schemas";
import { aiService } from "../services/ai";
import type { Ctx } from "@careeros/http";

export const aiController = {
  async roadmap(ctx: Ctx) {
    return ok(await aiService.generateRoadmap(parse(aiRoadmapSchema, ctx.body)));
  },

  async project(ctx: Ctx) {
    return ok(await aiService.generateProject(parse(aiProjectSchema, ctx.body)));
  },

  async advice(ctx: Ctx) {
    return ok(await aiService.generateAdvice(parse(aiAdviceSchema, ctx.body)));
  },
};
