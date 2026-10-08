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
import type { DashboardDTO, StudentDTO, StudentSkillDTO } from "@careeros/shared-types";
import { studentIdOf, authConfig } from "./auth";
import { ExpressAuth } from '@auth/express';
import { resolve } from 'node:path';
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
  const ip = req.ip || req.socket.remoteAddress || "unknown";
  return ip;
}

export const app = createServiceApp({ name: "gateway" });
app.set('trust proxy', config.TRUST_PROXY_HOPS);

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
  applyCors(res, origin);
  res.setHeader('cache-control', 'no-store');
  if (!['GET', 'HEAD', 'OPTIONS'].includes(req.method) &&
      (!origin || !config.corsOrigins.includes(origin))) {
    res.status(403).json(fail('FORBIDDEN', 'Untrusted request origin'));
    return;
  }

  next();
});

// Pin Auth.js URL construction to the configured public origin.
app.use('/api', (req, _res, next) => {
  req.headers.host = new URL(config.APP_URL).host;
  delete req.headers['x-forwarded-host'];
  next();
});
// A regex capture preserves the Auth.js Express adapter's params[0] contract on Express 5.
app.use(/^\/api\/auth\/(.*)/, ExpressAuth(authConfig));

// ── Dashboard: authenticated fan-out to the career service ─────
app.get("/api/dashboard", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const studentId = await studentIdOf(req);
    if (!studentId) {
      res.status(401).json(fail("UNAUTHORIZED", "Sign in to view your dashboard"));
      return;
    }
    const [slice, student, skills] = await Promise.all([
      callService<Omit<DashboardDTO, 'student' | 'skills'>>(`${config.CAREER_SERVICE_URL}/internal/students/${studentId}/dashboard`),
      callService<StudentDTO>(`${config.PROFILE_SERVICE_URL}/internal/students/${studentId}`),
      callService<StudentSkillDTO[]>(`${config.PROFILE_SERVICE_URL}/internal/students/${studentId}/skills`),
    ]);
    const dashboard: DashboardDTO = { ...slice, student, skills: skills.map(skill => ({ name: skill.name, level: skill.proficiency })) };
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

    const studentId = await studentIdOf(req);
    if (!studentId) {
      res.status(401).json(fail('UNAUTHORIZED', 'Sign in to continue'));
      return;
    }
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

if (config.NODE_ENV === 'production') {
  const frontend = resolve(process.cwd(), '../frontend/dist');
  app.use(express.static(frontend));
  app.get('/{*path}', (_req, res) => res.sendFile(resolve(frontend, 'index.html')));
}

// Register error handler after all routes
registerErrorHandler(app, "gateway");

if (config.NODE_ENV !== 'test') listenService(app, "gateway", config.GATEWAY_PORT);

async function shutdown(signal: string) {
  console.log(`[gateway] ${signal} received, shutting down`);
  await prisma.$disconnect();
  process.exit(0);
}

process.on("SIGINT", () => void shutdown("SIGINT"));
process.on("SIGTERM", () => void shutdown("SIGTERM"));

export type GatewayApp = typeof app;
