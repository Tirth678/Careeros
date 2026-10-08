import { Router, Request, Response, NextFunction } from "express";
import { analysisController } from "../controllers/analysis";

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

export function analysisRoutes(): Router {
  const router = Router();

  router.post("/careers/:careerId/analyze", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await analysisController.analyze(toCtx(req));
      res.json(result);
    } catch (err) {
      next(err);
    }
  });

  router.get("/students/:studentId/career-analysis", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await analysisController.list(toCtx(req));
      res.json(result);
    } catch (err) {
      next(err);
    }
  });

  router.get("/students/:studentId/career-analysis/:careerId", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await analysisController.latest(toCtx(req));
      res.json(result);
    } catch (err) {
      next(err);
    }
  });

  router.get("/students/:studentId/career-matches", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await analysisController.matches(toCtx(req));
      res.json(result);
    } catch (err) {
      next(err);
    }
  });

  return router;
}
