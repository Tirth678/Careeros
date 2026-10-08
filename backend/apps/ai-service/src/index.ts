import { config } from "@careeros/config";
import { createServiceApp, listenService, registerErrorHandler } from "@careeros/http";
import { registerRoutes } from "./routes";

const app = createServiceApp({ name: "ai-service" });
registerRoutes(app);
registerErrorHandler(app, "ai-service");

listenService(app, "ai-service", config.AI_SERVICE_PORT);

async function shutdown(signal: string) {
  console.log(`[ai-service] ${signal} received, shutting down`);
  process.exit(0);
}

process.on("SIGINT", () => void shutdown("SIGINT"));
process.on("SIGTERM", () => void shutdown("SIGTERM"));

export type App = typeof app;
