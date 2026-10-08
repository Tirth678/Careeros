import { ok } from "@careeros/shared-types";
import { parse, studentIdParam } from "../schemas";
import { dashboardService } from "../services/dashboard";
import type { Ctx } from "@careeros/http";

export const internalController = {
  async dashboard(ctx: Ctx) {
    const { studentId } = parse(studentIdParam, ctx.params);
    return ok(await dashboardService.get(studentId));
  },
};
