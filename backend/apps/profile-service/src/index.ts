import { config } from "@careeros/config";
import { createServiceApp, listenService, registerErrorHandler } from "@careeros/http";
import { prisma } from "@careeros/database";
import { registerRoutes } from "./routes";

const app = createServiceApp({ name: "profile-service" });
registerRoutes(app);
registerErrorHandler(app, "profile-service");

listenService(app, "profile-service", config.PROFILE_SERVICE_PORT);

async function shutdown(signal: string) {
  console.log(`[profile-service] ${signal} received, shutting down`);
  await prisma.$disconnect();
  process.exit(0);
}

process.on("SIGINT", () => void shutdown("SIGINT"));
process.on("SIGTERM", () => void shutdown("SIGTERM"));

export type App = typeof app;
