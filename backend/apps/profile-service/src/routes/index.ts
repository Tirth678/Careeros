import type { ServiceApp } from "@careeros/http";
import { profileRoutes } from "./profile";
import { projectRoutes } from "./projects";
import { skillRoutes } from "./skills";
import { entryRoutes } from "./entries";
import { internalRoutes } from "./internal";

export function registerRoutes(app: ServiceApp): ServiceApp {
  app.use(profileRoutes());
  app.use(projectRoutes());
  app.use(skillRoutes());
  app.use(entryRoutes());
  app.use(internalRoutes());
  return app;
}
