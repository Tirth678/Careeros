/**
 * Fixed-window in-memory limiter. A single gateway instance makes this the
 * right default — no Redis needed — and the knobs live in `RATE_LIMIT_*`.
 */
export interface RateLimitRule {
  max: number;
  windowMs: number;
}

interface Bucket {
  count: number;
  resetAt: number;
}

export class RateLimiter {
  private readonly buckets = new Map<string, Bucket>();

  constructor(private readonly rule: RateLimitRule) {}

  /** Returns `null` when allowed, otherwise the seconds to wait. */
  consume(key: string): number | null {
    const now = Date.now();
    const bucket = this.buckets.get(key);

    if (!bucket || bucket.resetAt <= now) {
      this.buckets.set(key, { count: 1, resetAt: now + this.rule.windowMs });
      this.prune(now);
      return null;
    }

    bucket.count += 1;
    if (bucket.count <= this.rule.max) return null;
    return Math.ceil((bucket.resetAt - now) / 1000);
  }

  /** Drop expired buckets so the map does not grow without bound. */
  private prune(now: number) {
    if (this.buckets.size < 10_000) return;
    for (const [key, bucket] of this.buckets) {
      if (bucket.resetAt <= now) this.buckets.delete(key);
    }
  }
}
