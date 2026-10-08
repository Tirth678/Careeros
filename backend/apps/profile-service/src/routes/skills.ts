import { Router, Request, Response, NextFunction } from "express";
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

export function skillRoutes(): Router {
  const router = Router();

  router.put("/profiles/:studentId/skills", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await skillController.upsert(toCtx(req));
      res.json(result);
    } catch (err) {
      next(err);
    }
  });

  router.patch("/profiles/:studentId/skills/:skillName", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await skillController.update(toCtx(req));
      res.json(result);
    } catch (err) {
      next(err);
    }
  });

  router.delete("/profiles/:studentId/skills/:skillName", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await skillController.remove(toCtx(req));
      res.json(result);
    } catch (err) {
      next(err);
    }
  });

  return router;
}
