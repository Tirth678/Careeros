import { ServiceError } from "@careeros/shared-types";
import type {
  AdviceGenerationInput,
  GeneratedAdvice,
  GeneratedProject,
  GeneratedRoadmap,
  ProjectGenerationInput,
  RoadmapGenerationInput,
} from "@careeros/shared-types";
import { advicePrompt, projectPrompt, roadmapPrompt } from "../prompts";
import {
  adviceOutputSchema,
  projectOutputSchema,
  roadmapOutputSchema,
} from "../schemas/output";
import type { AIProvider } from "./types";

const ENDPOINT = "https://openrouter.ai/api/v1/chat/completions";

export interface OpenRouterConfig {
  apiKey: string;
  model: string;
  fallbackModel?: string;
  referer?: string;
  title?: string;
  timeoutMs?: number;
  maxRetries?: number;
  /**
   * OpenRouter reserves credits against this ceiling, so an unbounded default
   * (16384) fails with 402 on accounts with a small balance.
   */
  maxTokens?: number;
}

type Message = { role: "system" | "user"; content: string };

export class OpenRouterProvider implements AIProvider {
  readonly name = "openrouter";

  constructor(private readonly config: OpenRouterConfig) {}

  async generateRoadmap(input: RoadmapGenerationInput): Promise<GeneratedRoadmap> {
    return this.generate(roadmapPrompt(input), roadmapOutputSchema, "roadmap") as Promise<GeneratedRoadmap>;
  }

  async generateProject(input: ProjectGenerationInput): Promise<GeneratedProject> {
    return this.generate(projectPrompt(input), projectOutputSchema, "project") as Promise<GeneratedProject>;
  }

  async generateAdvice(input: AdviceGenerationInput): Promise<GeneratedAdvice> {
    return this.generate(advicePrompt(input), adviceOutputSchema, "advice") as Promise<GeneratedAdvice>;
  }

  /**
   * Free-tier models both rate-limit and occasionally emit malformed JSON, so
   * a bad response is retried like a transport failure rather than failing the
   * request outright.
   */
  private async generate<T>(
    prompt: { system: string; user: string },
    schema: { parse(v: unknown): T },
    what: string,
  ): Promise<T> {
    const attempts = (this.config.maxRetries ?? 2) + 1;
    let lastError: unknown;

    for (let attempt = 0; attempt < attempts; attempt++) {
      try {
        return this.parse(await this.complete(prompt.system, prompt.user), schema, what);
      } catch (err) {
        lastError = err;
        const retriable =
          err instanceof ServiceError &&
          (err.code === "AI_PROVIDER_ERROR" || err.code === "AI_RESPONSE_INVALID");
        if (!retriable) throw err;
        if (attempt < attempts - 1) await sleep(600 * 2 ** attempt);
      }
    }

    throw lastError instanceof Error
      ? lastError
      : new ServiceError("AI_PROVIDER_ERROR", "OpenRouter request failed");
  }

  private async complete(system: string, user: string): Promise<string> {
    const messages: Message[] = [
      { role: "system", content: system },
      { role: "user", content: user },
    ];

    const models = [...new Set(
      [this.config.model, this.config.fallbackModel].filter((m): m is string => Boolean(m)),
    )];

    // Each model gets one shot per attempt; the outer `generate` loop decides
    // whether to come back.
    let lastError: unknown;
    for (const model of models) {
      try {
        return await this.requestOnce(messages, model);
      } catch (err) {
        lastError = err;
      }
    }

    throw lastError instanceof Error
      ? lastError
      : new ServiceError("AI_PROVIDER_ERROR", "OpenRouter request failed");
  }

  private async requestOnce(messages: Message[], model: string): Promise<string> {
    const controller = new AbortController();
    const timeout = setTimeout(
      () => controller.abort(),
      this.config.timeoutMs ?? 60_000,
    );

    let res: Response;
    try {
      res = await fetch(ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.config.apiKey}`,
          ...(this.config.referer ? { "HTTP-Referer": this.config.referer } : {}),
          ...(this.config.title ? { "X-Title": this.config.title } : {}),
        },
        body: JSON.stringify({
          model,
          temperature: 0.3,
          max_tokens: this.config.maxTokens ?? 4000,
          messages,
        }),
        signal: controller.signal,
      });
    } catch (err) {
      const reason = err instanceof Error ? err.message : String(err);
      throw new ServiceError("AI_PROVIDER_ERROR", `OpenRouter unreachable: ${reason}`);
    } finally {
      clearTimeout(timeout);
    }

    if (!res.ok) {
      const detail = (await res.text().catch(() => "")).slice(0, 300);
      throw new ServiceError(
        "AI_PROVIDER_ERROR",
        `OpenRouter returned ${res.status}: ${detail}`,
      );
    }

    const body = (await res.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const content = body.choices?.[0]?.message?.content;

    if (!content || typeof content !== "string") {
      throw new ServiceError("AI_PROVIDER_ERROR", "OpenRouter returned an empty response");
    }
    return content;
  }

  private parse<T>(raw: string, schema: { parse(v: unknown): T }, what: string): T {
    let json: unknown;
    try {
      json = JSON.parse(extractJson(raw));
    } catch {
      throw new ServiceError("AI_RESPONSE_INVALID", `AI returned malformed JSON for ${what}`);
    }

    try {
      return schema.parse(json);
    } catch (err) {
      const issues = formatIssues(err);
      throw new ServiceError(
        "AI_RESPONSE_INVALID",
        `AI returned an invalid ${what} response${issues ? `: ${issues}` : ""}`,
      );
    }
  }
}

/** Pulls the first few Zod issues out of a thrown error, if there are any. */
function formatIssues(err: unknown): string | null {
  if (!err || typeof err !== "object" || !("issues" in err)) return null;
  const issues = (err as { issues?: unknown }).issues;
  if (!Array.isArray(issues) || issues.length === 0) return null;

  return issues
    .slice(0, 3)
    .map((issue) => {
      const { path, message } = issue as { path?: unknown; message?: unknown };
      const at = Array.isArray(path) ? path.join(".") : "";
      const msg = typeof message === "string" ? message : String(message);
      return `${at || "(root)"} ${msg}`;
    })
    .join("; ");
}

/** Strips markdown fences and any prose around the JSON payload. */
export function extractJson(text: string): string {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fenced ? fenced[1]! : text;

  const start = candidate.indexOf("{");
  const end = candidate.lastIndexOf("}");
  if (start === -1 || end === -1 || end < start) return candidate.trim();
  return candidate.slice(start, end + 1);
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
