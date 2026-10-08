import { Router, Request, Response, NextFunction } from "express";
import { internalController } from "../controllers/internal";

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

/**
 * Service-to-service endpoints. Never proxied by the gateway — the gateway
 * calls these directly to assemble the dashboard.
 */
export function internalRoutes(): Router {
  const router = Router();

  router.get("/internal/students/:studentId/dashboard", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await internalController.dashboard(toCtx(req));
      res.json(result);
    } catch (err) {
      next(err);
    }
  });

  return router;
}
