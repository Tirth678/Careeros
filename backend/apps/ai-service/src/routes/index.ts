import { Router, Request, Response, NextFunction } from "express";
import { aiController } from "../controllers/ai";
import type { ServiceApp } from "@careeros/http";

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

export function aiRoutes(): Router {
  const router = Router();

  router.post("/ai/roadmap", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await aiController.roadmap(toCtx(req));
      res.json(result);
    } catch (err) {
      next(err);
    }
  });

  router.post("/ai/project", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await aiController.project(toCtx(req));
      res.json(result);
    } catch (err) {
      next(err);
    }
  });

  router.post("/ai/advice", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await aiController.advice(toCtx(req));
      res.json(result);
    } catch (err) {
      next(err);
    }
  });

  return router;
}

export function registerRoutes(app: ServiceApp): ServiceApp {
  app.use(aiRoutes());
  return app;
}
