import { Router, Request, Response, NextFunction } from "express";
import { projectController } from "../controllers/project";

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

export function projectRoutes(): Router {
  const router = Router();

  router.get("/profiles/:studentId/projects", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await projectController.list(toCtx(req));
      res.json(result);
    } catch (err) {
      next(err);
    }
  });

  router.post("/profiles/:studentId/projects", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await projectController.create(toCtx(req));
      res.json(result);
    } catch (err) {
      next(err);
    }
  });

  router.get("/projects/:projectId", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await projectController.get(toCtx(req));
      res.json(result);
    } catch (err) {
      next(err);
    }
  });

  router.patch("/projects/:projectId", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await projectController.update(toCtx(req));
      res.json(result);
    } catch (err) {
      next(err);
    }
  });

  router.delete("/projects/:projectId", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await projectController.remove(toCtx(req));
      res.json(result);
    } catch (err) {
      next(err);
    }
  });

  return router;
}
