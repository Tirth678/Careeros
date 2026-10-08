import { createAuthClient } from '@neondatabase/neon-js';

// Auth URL — set VITE_NEON_AUTH_URL in .env to override.
// This is the base URL of your Neon Auth service (no trailing /auth).
const NEON_AUTH_URL =
  (import.meta.env.VITE_NEON_AUTH_URL as string | undefined) ??
  'https://ep-bitter-bird-b30tc32j.neonauth.c-4.ap-southeast-1.aws.neon.tech/neondb/auth';

export const authClient = createAuthClient({ auth: { url: NEON_AUTH_URL } });

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null | undefined;
  createdAt: Date | string;
  updatedAt: Date | string;
  role?: string;
};

export type Credentials = {
  token: string;
  user: AuthUser;
};

// ── Token helpers (for attaching Bearer token to gateway requests) ──────────
const TOKEN_KEY = 'careeros.session.token';
let _token: string | null = (() => {
  try { return localStorage.getItem(TOKEN_KEY); } catch { return null; }
})();

export function getToken(): string | null { return _token; }

function storeToken(t: string | null) {
  _token = t;
  try {
    if (t) localStorage.setItem(TOKEN_KEY, t);
    else localStorage.removeItem(TOKEN_KEY);
  } catch { /* private browsing */ }
}

// ── Auth operations ──────────────────────────────────────────────────────────

export async function signUp(input: {
  name: string;
  email: string;
  password: string;
}): Promise<Credentials> {
  const { data, error } = await authClient.signUp.email({
    email: input.email,
    password: input.password,
    name: input.name,
  });
  if (error || !data?.user) throw new Error(error?.message ?? 'Sign up failed');
  const token = (data.session as any)?.token ?? (data.session as any)?.access_token ?? '';
  storeToken(token);
  return { token, user: data.user as AuthUser };
}

export async function signIn(input: {
  email: string;
  password: string;
}): Promise<Credentials> {
  const { data, error } = await authClient.signIn.email({
    email: input.email,
    password: input.password,
  });
  if (error || !data?.user) throw new Error(error?.message ?? 'Sign in failed');
  const token = (data.session as any)?.token ?? (data.session as any)?.access_token ?? '';
  storeToken(token);
  return { token, user: data.user as AuthUser };
}

/**
 * Initiates Google OAuth. After Google redirects back, Neon Auth sets a
 * session cookie and redirects the browser to callbackURL (/dashboard).
 * AuthContext.refresh() will then pick up the session via getSession().
 */
export function signInWithGoogle(): void {
  void authClient.signIn.social({
    provider: 'google',
    callbackURL: `${window.location.origin}/dashboard`,
    errorCallbackURL: `${window.location.origin}/login`,
  });
}

export async function getSession(): Promise<{ user: AuthUser; token: string } | null> {
  const { data, error } = await authClient.getSession();
  if (error || !data?.session || !data?.user) {
    storeToken(null);
    return null;
  }
  const token = (data.session as any)?.token ?? (data.session as any)?.access_token ?? '';
  storeToken(token);
  return { user: data.user as AuthUser, token };
}

export async function signOut(): Promise<void> {
  await authClient.signOut();
  storeToken(null);
}
