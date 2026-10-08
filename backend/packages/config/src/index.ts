import { z } from "zod";
import { readFile } from "fs/promises";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

// ─────────────────────────────────────────────────────────────
// Root .env loader — services run from their own package dir,
// so Bun's automatic .env discovery would miss the repo root.
// ─────────────────────────────────────────────────────────────

function parseDotenv(contents: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const rawLine of contents.split("\n")) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim().replace(/^export\s+/, "");
    let value = line.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"') && value.length >= 2) ||
      (value.startsWith("'") && value.endsWith("'") && value.length >= 2)
    ) {
      value = value.slice(1, -1);
    }
    out[key] = value;
  }
  return out;
}

async function findRoot(start: string): Promise<string | null> {
  let dir = start;
  for (let i = 0; i < 10; i++) {
    try {
      const pkg = await readFile(join(dir, "package.json"), "utf8");
      const json = JSON.parse(pkg) as { name?: string };
      if (json.name === "backend") return dir;
    } catch {
      // keep walking
    }
    const parent = dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return null;
}

async function loadRootEnv(): Promise<void> {
  const root = await findRoot(process.cwd());
  if (!root) return;
  const filePath = join(root, ".env");
  try {
    const file = await readFile(filePath, "utf8");
    const parsed = parseDotenv(file);
    for (const [key, value] of Object.entries(parsed)) {
      if (process.env[key] === undefined && value !== "") {
        process.env[key] = value;
      }
    }
  } catch {
    return;
  }
}

await loadRootEnv();

// ─────────────────────────────────────────────────────────────
// Schema
// ─────────────────────────────────────────────────────────────

const EnvSchema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),

  GATEWAY_PORT: z.coerce.number().int().positive().default(3000),
  PROFILE_SERVICE_PORT: z.coerce.number().int().positive().default(3001),
  CAREER_SERVICE_PORT: z.coerce.number().int().positive().default(3002),
  AI_SERVICE_PORT: z.coerce.number().int().positive().default(3003),

  PROFILE_SERVICE_URL: z.string().url().default("http://localhost:3001"),
  CAREER_SERVICE_URL: z.string().url().default("http://localhost:3002"),
  AI_SERVICE_URL: z.string().url().default("http://localhost:3003"),

  APP_URL: z.string().url().default('http://localhost:5173'),
  AUTH_SECRET: z.string().min(32),
  AUTH_GOOGLE_ID: z.string().default(''),
  AUTH_GOOGLE_SECRET: z.string().default(''),
  INTERNAL_SERVICE_SECRET: z.string().min(32),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  TRUST_PROXY_HOPS: z.coerce.number().int().min(0).default(0),
  CORS_ORIGINS: z.string().default("http://localhost:5173"),

  OPENROUTER_API_KEY: z.string().optional().default(""),
  OPENROUTER_MODEL: z.string().default("openai/gpt-4o-mini"),
  OPENROUTER_FALLBACK_MODEL: z.string().optional().default(""),
  OPENROUTER_MAX_TOKENS: z.coerce.number().int().positive().default(4000),

  RATE_LIMIT_MAX: z.coerce.number().int().positive().default(120),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(60_000),
});

const parsed = EnvSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Invalid environment configuration:");
  for (const issue of parsed.error.issues) {
    console.error(`   ${issue.path.join(".")}: ${issue.message}`);
  }
  process.exit(1);
}

const env = parsed.data;
process.env.AUTH_URL = new URL(env.APP_URL).origin;
if (env.NODE_ENV === 'production' && !env.APP_URL.startsWith('https://')) {
  throw new Error('Production APP_URL must use HTTPS');
}
if (env.NODE_ENV === 'production' && (!env.AUTH_GOOGLE_ID || !env.AUTH_GOOGLE_SECRET)) {
  throw new Error('Production requires AUTH_GOOGLE_ID and AUTH_GOOGLE_SECRET');
}

export const config = {
  ...env,
  corsOrigins: env.CORS_ORIGINS.split(",")
    .map((o) => o.trim())
    .filter(Boolean),
} as const;

export type Config = typeof config;
