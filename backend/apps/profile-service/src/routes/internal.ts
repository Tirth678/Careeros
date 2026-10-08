import { Router, Request, Response, NextFunction } from "express";
import { ok } from "@careeros/shared-types";
import { parse, skillProgressSchema } from "../schemas";
import { profileService } from "../services/profile";
import { skillService } from "../services/skill";

/**
 * Service-to-service endpoints. Never proxied by the gateway — other
 * services call these directly over the internal network.
 */
export function internalRoutes(): Router {
  const router = Router();

  router.get("/internal/students/:studentId", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await profileService.getStudent(req.params.studentId);
      res.json(ok(result));
    } catch (err) {
      next(err);
    }
  });

  router.get("/internal/students/:studentId/skills", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await profileService.getSkills(req.params.studentId);
      res.json(ok(result));
    } catch (err) {
      next(err);
    }
  });

  router.post("/internal/students/:studentId/skill-progress", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input = parse(skillProgressSchema, req.body);
      const result = await skillService.bump(req.params.studentId, input.skillName, input.delta);
      res.json(ok(result));
    } catch (err) {
      next(err);
    }
  });

  return router;
}
