import { config } from "@careeros/config";

/**
 * The gateway strips `/api` and routes on the first path segment. Domains map
 * to exactly one service so no prefix can reach two backends at once.
 */
export const SERVICES: Record<string, string> = {
  // Profile domain
  profiles: config.PROFILE_SERVICE_URL,
  projects: config.PROFILE_SERVICE_URL,
  skills: config.PROFILE_SERVICE_URL,
  internships: config.PROFILE_SERVICE_URL,
  certifications: config.PROFILE_SERVICE_URL,

  // Career domain
  careers: config.CAREER_SERVICE_URL,
  students: config.CAREER_SERVICE_URL,
  roadmaps: config.CAREER_SERVICE_URL,
  analysis: config.CAREER_SERVICE_URL,

  // AI domain
  ai: config.AI_SERVICE_URL,
};

/** Not routable through the proxy — they are handled in-process or are internal. */
const RESERVED_SEGMENTS = new Set(["auth", "dashboard", "health", "internal"]);

/**
 * Identity is minted here and nowhere else: a client-supplied `x-student-id`
 * is always dropped so callers cannot impersonate another student.
 */
const HOP_BY_HOP = new Set([
  "host",
  "connection",
  "content-length",
  "accept-encoding",
  "transfer-encoding",
  "upgrade",
  "x-student-id",
  "x-service-secret",
  "authorization",
  "cookie",
]);

export function segmentOf(path: string): string {
  return path.split("/")[0] ?? "";
}

export function resolveTarget(path: string): string | null {
  try {
    if (path.split('/').some(part => {
      const decoded = decodeURIComponent(part);
      return decoded === '.' || decoded === '..' || /[\\/\u0000]/.test(decoded);
    })) return null;
  } catch { return null; }
  const segment = segmentOf(path);
  if (RESERVED_SEGMENTS.has(segment)) return null;
  return SERVICES[segment] ?? null;
}

export interface ForwardOptions {
  baseUrl: string;
  path: string;
  search: string;
  method: string;
  headers: Headers;
  body: RequestInit["body"];
  studentId?: string;
  timeoutMs?: number;
}

export async function forward({
  baseUrl,
  path,
  search,
  method,
  headers,
  body,
  studentId,
  timeoutMs = 15_000,
}: ForwardOptions): Promise<Response> {
  const out = new Headers();
  headers.forEach((value, key) => {
    if (!HOP_BY_HOP.has(key.toLowerCase())) out.set(key, value);
  });
  if (studentId) out.set("x-student-id", studentId);
  out.set('x-service-secret', config.INTERNAL_SERVICE_SECRET);

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(`${baseUrl}/${path}${search}`, {
      method,
      headers: out,
      body: body ?? null,
      redirect: "manual",
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timer);
  }
}
