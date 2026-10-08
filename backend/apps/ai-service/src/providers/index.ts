import { ServiceError } from "@careeros/shared-types";
import { config } from "@careeros/config";
import { OpenRouterProvider } from "./openrouter";
import { StubProvider } from "./stub";
import type { AIProvider } from "./types";

export type { AIProvider } from "./types";
export { OpenRouterProvider } from "./openrouter";
export { StubProvider } from "./stub";

let cached: AIProvider | null = null;

/**
 * One provider per process. With a key set we use OpenRouter; without one we
 * fall back to a deterministic stub so the app still boots — but only outside
 * production, where a missing key is a hard failure.
 */
export function getAIProvider(): AIProvider {
  if (cached) return cached;

  if (config.OPENROUTER_API_KEY) {
    cached = new OpenRouterProvider({
      apiKey: config.OPENROUTER_API_KEY,
      model: config.OPENROUTER_MODEL,
      fallbackModel: config.OPENROUTER_FALLBACK_MODEL || undefined,
      referer: config.APP_URL,
      title: "Careeros",
      maxTokens: config.OPENROUTER_MAX_TOKENS,
    });
    console.log(
      `[ai-service] provider=openrouter model=${config.OPENROUTER_MODEL}` +
        (config.OPENROUTER_FALLBACK_MODEL
          ? ` fallback=${config.OPENROUTER_FALLBACK_MODEL}`
          : ""),
    );
    return cached;
  }

  if (process.env.NODE_ENV === "production") {
    throw new ServiceError("AI_PROVIDER_ERROR", "OPENROUTER_API_KEY is not configured");
  }

  console.warn(
    "[ai-service] OPENROUTER_API_KEY missing — using deterministic stub provider (dev only)",
  );
  cached = new StubProvider();
  return cached;
}
