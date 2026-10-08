import { Router, Request, Response, NextFunction } from "express";
import { profileController } from "../controllers/profile";
import { skillController } from "../controllers/skill";

/**
 * Convert Express Request to Ctx format for controllers
 */
function toCtx(req: Request): any {
  return {
    params: req.params,
    body: req.body,
    query: req.query,
    headers: req.headers,
  };
}

export function profileRoutes(): Router {
  const router = Router();

  router.post("/profiles", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await profileController.createProfile(toCtx(req));
      res.json(result);
    } catch (err) {
      next(err);
    }
  });

  router.get("/profiles/:studentId", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await profileController.getProfile(toCtx(req));
      res.json(result);
    } catch (err) {
      next(err);
    }
  });

  router.patch("/profiles/:studentId", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await profileController.updateProfile(toCtx(req));
      res.json(result);
    } catch (err) {
      next(err);
    }
  });

  router.get("/profiles/:studentId/skills", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await profileController.getSkills(toCtx(req));
      res.json(result);
    } catch (err) {
      next(err);
    }
  });

  return router;
}
