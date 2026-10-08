import { config } from "@careeros/config";
import { createServiceApp, listenService, registerErrorHandler } from "@careeros/http";
import { prisma } from "@careeros/database";
import { registerRoutes } from "./routes";

const app = createServiceApp({ name: "career-service" });
registerRoutes(app);
registerErrorHandler(app, "career-service");

listenService(app, "career-service", config.CAREER_SERVICE_PORT);

async function shutdown(signal: string) {
  console.log(`[career-service] ${signal} received, shutting down`);
  await prisma.$disconnect();
  process.exit(0);
}

process.on("SIGINT", () => void shutdown("SIGINT"));
process.on("SIGTERM", () => void shutdown("SIGTERM"));

export type App = typeof app;
