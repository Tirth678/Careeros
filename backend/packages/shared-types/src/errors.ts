import type { ApiErrorBody, ErrorCode } from "./envelope";
import { ERROR_STATUS, fail } from "./envelope";

/**
 * Throw from anywhere in a service; the shared Elysia error hook turns it
 * into the standard `{ success: false, error }` envelope with the right status.
 */
export class ServiceError extends Error {
  readonly code: ErrorCode;
  readonly status: number;
  readonly details?: unknown;

  constructor(code: ErrorCode, message: string, details?: unknown) {
    super(message);
    this.name = "ServiceError";
    this.code = code;
    this.status = ERROR_STATUS[code];
    this.details = details;
  }

  toBody(): ApiErrorBody {
    return fail(this.code, this.message, this.details);
  }
}

export function isServiceError(err: unknown): err is ServiceError {
  return err instanceof ServiceError;
}
