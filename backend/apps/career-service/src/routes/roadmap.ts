import { Router, Request, Response, NextFunction } from "express";
import { roadmapController } from "../controllers/analysis";

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

export function roadmapRoutes(): Router {
  const router = Router();

  router.post("/roadmaps/generate", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await roadmapController.generate(toCtx(req));
      res.json(result);
    } catch (err) {
      next(err);
    }
  });

  router.get("/students/:studentId/roadmaps", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await roadmapController.list(toCtx(req));
      res.json(result);
    } catch (err) {
      next(err);
    }
  });

  router.get("/students/:studentId/roadmaps/active", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await roadmapController.active(toCtx(req));
      res.json(result);
    } catch (err) {
      next(err);
    }
  });

  router.get("/roadmaps/:roadmapId", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await roadmapController.get(toCtx(req));
      res.json(result);
    } catch (err) {
      next(err);
    }
  });

  router.patch("/roadmaps/:roadmapId/tasks/:taskId", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await roadmapController.updateTask(toCtx(req));
      res.json(result);
    } catch (err) {
      next(err);
    }
  });

  return router;
}
