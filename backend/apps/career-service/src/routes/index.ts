import type { ServiceApp } from "@careeros/http";
import { careerRoutes } from "./careers";
import { analysisRoutes } from "./analysis";
import { roadmapRoutes } from "./roadmap";
import { internalRoutes } from "./internal";

export function registerRoutes(app: ServiceApp): ServiceApp {
  app.use(careerRoutes());
  app.use(analysisRoutes());
  app.use(roadmapRoutes());
  app.use(internalRoutes());
  return app;
}
