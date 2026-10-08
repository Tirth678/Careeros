import express, { Request, Response, NextFunction } from "express";
import { timingSafeEqual } from 'node:crypto';
import { config } from '@careeros/config';
import {
  fail,
  isServiceError,
  ok,
  ServiceError,
  type ApiSuccess,
  type ErrorCode,
} from "@careeros/shared-types";

export { ok, fail };

/**
 * Minimal structural view of an Express handler context.
 *
 * Controllers stay decoupled from the Express version: routes do the wiring,
 * and `parse()` from @careeros/validation re-establishes types.
 */
export interface Ctx<TParams = any, TBody = any> {
  params: TParams;
  body: TBody;
  query: any;
  headers: any;
}

/**
 * The gateway validates the session and injects `x-student-id`.
 *
 * Services trust that header — the path param is only there for readable
 * URLs, and it must never disagree with the authenticated caller.
 */
export function resolveStudentId(ctx: Ctx): string {
  const header = ctx.headers?.["x-student-id"];
  const param = ctx.params?.studentId;
  const body =
    ctx.body && typeof ctx.body === "object"
      ? (ctx.body as { studentId?: unknown }).studentId
      : undefined;

  if (header && param && header !== param) {
    throw new ServiceError("FORBIDDEN", "Cannot act on another student's data");
  }
  if (header && body && header !== body) {
    throw new ServiceError("FORBIDDEN", "Cannot act on another student's data");
  }

  const id = header;
  if (!id) {
    throw new ServiceError("UNAUTHORIZED", "Missing student identity");
  }
  return id;
}

/**
 * Express app type for service registration.
 */
export type ServiceApp = express.Express;

export interface ServiceAppOptions {
  name: string;
}

/**
 * Every internal service boots through this: a consistent error envelope
 * plus a health route. Anything thrown in a handler comes back as
 * `{ success: false, error: { code, message } }`.
 *
 * Routes are registered afterwards, so there is a single Express instance
 * and a single error handler per service.
 */
export function createServiceApp({ name }: ServiceAppOptions): ServiceApp {
  const app = express();
  app.disable('x-powered-by');
  app.use((_req, res, next) => {
    res.setHeader('x-content-type-options', 'nosniff');
    res.setHeader('referrer-policy', 'strict-origin-when-cross-origin');
    res.setHeader('x-frame-options', 'DENY');
    next();
  });
  if (name !== 'gateway') app.use((req, res, next) => {
    if (req.path === '/health') return next();
    const supplied = Buffer.from(String(req.headers['x-service-secret'] ?? ''));
    const expected = Buffer.from(config.INTERNAL_SERVICE_SECRET);
    if (supplied.length !== expected.length || !timingSafeEqual(supplied, expected)) {
      res.status(401).json(fail('UNAUTHORIZED', 'Service authentication required'));
      return;
    }
    const match = /^\/internal\/students\/([^/]+)/.exec(req.path);
    if (match) req.headers['x-student-id'] = decodeURIComponent(match[1]!);
    next();
  });

  // Parse JSON bodies
  app.use(express.json({ limit: '100kb' }));

  // Health check route
  app.get("/health", (req: Request, res: Response) => {
    res.json(ok({ service: name, status: "ok" }) as ApiSuccess<{ service: string; status: string }>);
  });

  // Store service name on app for error handler
  (app as any).serviceName = name;

  return app;
}

/**
 * Register the global error handler for a service.
 * This should be called after all routes are registered.
 */
export function registerErrorHandler(app: ServiceApp, name: string): void {
  app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
    if (res.headersSent) return next(err);
    if ((err as { type?: string })?.type === 'entity.parse.failed') {
      res.status(400).json(fail('VALIDATION_ERROR', 'Invalid JSON body'));
      return;
    }
    if (isServiceError(err)) {
      res.status(err.status).json(err.toBody());
      return;
    }

    const code = (err as { code?: string } | undefined)?.code;
    if (code === "VALIDATION") {
      res.status(422).json(fail("VALIDATION_ERROR", "Request validation failed"));
      return;
    }
    if (code === "NOT_FOUND") {
      res.status(404).json(fail("NOT_FOUND", "Route not found"));
      return;
    }

    console.error(`[${name}] unhandled error:`, err);
    res.status(500).json(fail("INTERNAL_ERROR", "Internal server error"));
  });
}

export function listenService(
  app: ServiceApp,
  name: string,
  port: number,
  host = "0.0.0.0",
): ServiceApp {
  app.listen(port, host, () => {
    console.log(`[${name}] listening on http://localhost:${port}`);
  });
  return app;
}

/**
 * Call another service and unwrap its `{ success, data }` envelope.
 * Upstream failures surface as a local `ServiceError` so the caller's
 * error hook still produces a consistent response.
 */
export async function callService<T>(
  url: string,
  init?: RequestInit & { timeoutMs?: number },
): Promise<T> {
  const { timeoutMs = 10_000, ...rest } = init ?? {};
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const headers = new Headers(rest.headers);
    headers.set('x-service-secret', config.INTERNAL_SERVICE_SECRET);
    const res = await fetch(url, { ...rest, headers, signal: controller.signal });
    const body = (await res.json().catch(() => null)) as
      | { success: true; data: T }
      | { success: false; error?: { code?: string; message?: string; details?: unknown } }
      | null;

    if (body && body.success === false) {
      const err = body.error ?? {};
      throw new ServiceError(
        (err.code as ErrorCode | undefined) ?? "UPSTREAM_ERROR",
        err.message ?? `Upstream service returned ${res.status}`,
        err.details,
      );
    }

    if (!res.ok || !body) {
      throw new ServiceError(
        "UPSTREAM_ERROR",
        `Upstream service returned ${res.status}`,
      );
    }

    return body.data;
  } catch (err) {
    if (err instanceof ServiceError) throw err;
    const message =
      err instanceof Error && err.name === "AbortError"
        ? "Upstream service timed out"
        : "Upstream service unreachable";
    throw new ServiceError("UPSTREAM_ERROR", message);
  } finally {
    clearTimeout(timer);
  }
}
