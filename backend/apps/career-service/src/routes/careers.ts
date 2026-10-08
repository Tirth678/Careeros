import { Router, Request, Response, NextFunction } from "express";
import { careerController } from "../controllers/career";

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

export function careerRoutes(): Router {
  const router = Router();

  router.get("/careers", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await careerController.list(toCtx(req));
      res.json(result);
    } catch (err) {
      next(err);
    }
  });

  router.get("/careers/:careerId", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await careerController.get(toCtx(req));
      res.json(result);
    } catch (err) {
      next(err);
    }
  });

  return router;
}
