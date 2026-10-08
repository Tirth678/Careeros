// ─────────────────────────────────────────────────────────────
// API envelope — every service speaks this shape
// ─────────────────────────────────────────────────────────────

export interface ApiSuccess<T> {
  success: true;
  data: T;
}

export interface ApiErrorBody {
  success: false;
  error: {
    code: ErrorCode;
    message: string;
    details?: unknown;
  };
}

export type ApiResponse<T> = ApiSuccess<T> | ApiErrorBody;

export type ErrorCode =
  | "BAD_REQUEST"
  | "VALIDATION_ERROR"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "STUDENT_NOT_FOUND"
  | "SKILL_NOT_FOUND"
  | "PROJECT_NOT_FOUND"
  | "CAREER_NOT_FOUND"
  | "ROADMAP_NOT_FOUND"
  | "ROADMAP_TASK_NOT_FOUND"
  | "ANALYSIS_NOT_FOUND"
  | "CONFLICT"
  | "UPSTREAM_ERROR"
  | "AI_PROVIDER_ERROR"
  | "AI_RESPONSE_INVALID"
  | "RATE_LIMITED"
  | "INTERNAL_ERROR";

export const ERROR_STATUS: Record<ErrorCode, number> = {
  BAD_REQUEST: 400,
  VALIDATION_ERROR: 422,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  STUDENT_NOT_FOUND: 404,
  SKILL_NOT_FOUND: 404,
  PROJECT_NOT_FOUND: 404,
  CAREER_NOT_FOUND: 404,
  ROADMAP_NOT_FOUND: 404,
  ROADMAP_TASK_NOT_FOUND: 404,
  ANALYSIS_NOT_FOUND: 404,
  CONFLICT: 409,
  UPSTREAM_ERROR: 502,
  AI_PROVIDER_ERROR: 502,
  AI_RESPONSE_INVALID: 502,
  RATE_LIMITED: 429,
  INTERNAL_ERROR: 500,
};

export function ok<T>(data: T): ApiSuccess<T> {
  return { success: true, data };
}

export function fail(
  code: ErrorCode,
  message: string,
  details?: unknown,
): ApiErrorBody {
  return {
    success: false,
    error: {
      code,
      message,
      ...(details !== undefined ? { details } : {}),
    },
  };
}
