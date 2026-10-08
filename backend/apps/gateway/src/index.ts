import express, { Request, Response, NextFunction } from "express";
import { config } from "@careeros/config";
import { prisma } from "@careeros/database";
import {
  callService,
  createServiceApp,
  fail,
  listenService,
  ok,
  registerErrorHandler,
} from "@careeros/http";
import type { DashboardDTO } from "@careeros/shared-types";
import { studentIdOf } from "./auth";
import { forward, resolveTarget, segmentOf } from "./proxy";
import { RateLimiter } from "./rateLimit";

const limiter = new RateLimiter({
  max: config.RATE_LIMIT_MAX,
  windowMs: config.RATE_LIMIT_WINDOW_MS,
});

function corsHeaders(origin: string | null): Record<string, string> | null {
  if (!origin || !config.corsOrigins.includes(origin)) return null;
  return {
    "access-control-allow-origin": origin,
    "access-control-allow-credentials": "true",
    "access-control-allow-methods": "GET,POST,PATCH,PUT,DELETE,OPTIONS",
    "access-control-allow-headers": "content-type,authorization",
    vary: "Origin",
  };
}

function applyCors(res: Response, origin: string | null): void {
  const extra = corsHeaders(origin);
  if (!extra) return;
  for (const [key, value] of Object.entries(extra)) {
    res.setHeader(key, value);
  }
}

function clientKey(req: Request): string {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.length > 0) {
    return forwarded.split(",")[0]!.trim();
  }
  if (Array.isArray(forwarded) && forwarded.length > 0) {
    return forwarded[0]!.trim();
  }
  const ip = req.ip || req.socket.remoteAddress || "unknown";
  return ip;
}

const app = createServiceApp({ name: "gateway" });

// ── Rate limit + CORS preflight middleware ─────────────────────
app.use(async (req: Request, res: Response, next: NextFunction) => {
  const origin = req.headers.origin as string | null;
  const cors = corsHeaders(origin);

  if (req.method === "OPTIONS") {
    if (cors) {
      for (const [key, value] of Object.entries(cors)) {
        res.setHeader(key, value);
      }
    }
    res.status(204).end();
    return;
  }

  const retryAfter = limiter.consume(clientKey(req));
  if (retryAfter !== null) {
    if (cors) {
      for (const [key, value] of Object.entries(cors)) {
        res.setHeader(key, value);
      }
    }
    res.setHeader("retry-after", String(retryAfter));
    res.status(429).json(fail("RATE_LIMITED", "Too many requests, slow down"));
    return;
  }

  // Apply CORS to all responses
  res.on("finish", () => {
    applyCors(res, origin);
  });

  next();
});

// ── Dashboard: authenticated fan-out to the career service ─────
app.get("/api/dashboard", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const studentId = await studentIdOf(req.headers);
    if (!studentId) {
      res.status(401).json(fail("UNAUTHORIZED", "Sign in to view your dashboard"));
      return;
    }
    const dashboard = await callService<DashboardDTO>(
      `${config.CAREER_SERVICE_URL}/internal/students/${studentId}/dashboard`,
    );
    res.json(ok(dashboard));
  } catch (err) {
    next(err);
  }
});

// ── Everything else: route by first segment after /api ────────
app.all("/api/*path", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const path = req.path.substring(5); // Remove "/api/" prefix
    const baseUrl = resolveTarget(path);

    if (!baseUrl) {
      res.status(404).json(fail("NOT_FOUND", `No route for /api/${segmentOf(path)}`));
      return;
    }

    const studentId = await studentIdOf(req.headers);
    const method = req.method;
    const hasBody = method !== "GET" && method !== "HEAD";

    // Convert Express headers to Headers
    const headers = new Headers();
    for (const [key, value] of Object.entries(req.headers)) {
      if (value !== undefined) {
        headers.set(key, Array.isArray(value) ? value.join(", ") : value);
      }
    }

    const upstreamRes = await forward({
      baseUrl,
      path,
      search: new URL(req.url!, `http://${req.headers.host}`).search,
      method,
      headers,
      body: hasBody && req.body ? JSON.stringify(req.body) : null,
      studentId,
    });

    // Copy response headers
    upstreamRes.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });

    // Apply CORS
    applyCors(res, req.headers.origin as string | null);

    res.status(upstreamRes.status);
    const body = await upstreamRes.text();
    res.send(body);
  } catch (err) {
    next(err);
  }
});

// Register error handler after all routes
registerErrorHandler(app, "gateway");

listenService(app, "gateway", config.GATEWAY_PORT);

async function shutdown(signal: string) {
  console.log(`[gateway] ${signal} received, shutting down`);
  await prisma.$disconnect();
  process.exit(0);
}

process.on("SIGINT", () => void shutdown("SIGINT"));
process.on("SIGTERM", () => void shutdown("SIGTERM"));

export type GatewayApp = typeof app;
