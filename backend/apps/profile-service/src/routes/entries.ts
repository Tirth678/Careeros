import { Router, Request, Response, NextFunction } from "express";
import { entryController } from "../controllers/entry";

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

export function entryRoutes(): Router {
  const router = Router();

  router.get("/profiles/:studentId/internships", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await entryController.listInternships(toCtx(req));
      res.json(result);
    } catch (err) {
      next(err);
    }
  });

  router.post("/profiles/:studentId/internships", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await entryController.createInternship(toCtx(req));
      res.json(result);
    } catch (err) {
      next(err);
    }
  });

  router.delete("/internships/:entryId", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await entryController.removeInternship(toCtx(req));
      res.json(result);
    } catch (err) {
      next(err);
    }
  });

  router.get("/profiles/:studentId/certifications", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await entryController.listCertifications(toCtx(req));
      res.json(result);
    } catch (err) {
      next(err);
    }
  });

  router.post("/profiles/:studentId/certifications", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await entryController.createCertification(toCtx(req));
      res.json(result);
    } catch (err) {
      next(err);
    }
  });

  router.delete("/certifications/:entryId", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await entryController.removeCertification(toCtx(req));
      res.json(result);
    } catch (err) {
      next(err);
    }
  });

  return router;
}
