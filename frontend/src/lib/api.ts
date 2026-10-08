
import { DEMO_MODE, demoFetch } from './demo';
const base = import.meta.env.VITE_API_URL as string | undefined;

/** Same-origin by default — `vite.config.ts` proxies `/api` to the gateway. */
export const API_BASE = base ?? '';

export class ApiError extends Error {
  readonly code: string;
  readonly status: number;

  constructor(code: string, message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
  }
}

type Envelope<T> =
  | { success: true; data: T }
  | { success: false; error: { code: string; message: string } };

export async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  if (DEMO_MODE) return demoFetch<T>(path, init);
  const headers = new Headers(init.headers);
  headers.set('content-type', 'application/json');
  const token = await getAccessToken();
  if (token) headers.set('authorization', `Bearer ${token}`);

  const res = await fetch(`${API_BASE}${path}`, { ...init, headers, credentials: 'include' });
  if (res.status === 401) window.dispatchEvent(new Event('auth:expired'));

  const text = await res.text();
  let body: Envelope<T> | null = null;
  if (text) {
    try {
      body = JSON.parse(text) as Envelope<T>;
    } catch {
      throw new ApiError('BAD_RESPONSE', 'The server returned an unreadable response', res.status);
    }
  }

  if (!body) {
    throw new ApiError('EMPTY_RESPONSE', `Request failed (${res.status})`, res.status);
  }
  if (!body.success) {
    throw new ApiError(body.error.code, body.error.message, res.status);
  }
  if (!res.ok) throw new ApiError('HTTP_ERROR', 'The request failed', res.status);
  return body.data;
}
import { getAccessToken } from './neonAuth';
