import { ok } from "@careeros/shared-types";
import { parse, careerParam } from "../schemas";
import { careerService } from "../services/career";
import type { Ctx } from "@careeros/http";

export const careerController = {
  async list(_ctx: Ctx) {
    return ok(await careerService.list());
  },

  async get(ctx: Ctx) {
    const { careerId } = parse(careerParam, ctx.params);
    return ok(await careerService.get(careerId));
  },
};
