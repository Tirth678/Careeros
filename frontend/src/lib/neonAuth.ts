import { createInternalNeonAuth } from '@neondatabase/neon-js/auth';
import { DEMO_MODE, demoUser } from './demo';

const authUrl = import.meta.env.VITE_NEON_AUTH_URL as string;
if (!authUrl) throw new Error('VITE_NEON_AUTH_URL is required');

const auth = createInternalNeonAuth(authUrl);

export type AuthUser = { id: string; name: string | null; email: string; image?: string | null };

export function getAccessToken(): Promise<string | null> {
  if (DEMO_MODE) return Promise.resolve(null);
  return auth.getJWTToken();
}

export async function getSession(): Promise<{ user: AuthUser } | null> {
  if (DEMO_MODE) return { user: demoUser() };
  const { data, error } = await auth.adapter.getSession();
  if (error) throw new Error(error.message ?? 'Unable to restore your session. Please retry.');
  return !data?.user ? null : { user: data.user as AuthUser };
}

export async function signInWithGoogle(): Promise<void> {
  if (DEMO_MODE) { window.location.assign('/dashboard'); return; }
  const { error } = await auth.adapter.signIn.social({
    provider: 'google',
    callbackURL: `${window.location.origin}/dashboard`,
    errorCallbackURL: `${window.location.origin}/login`,
  });
  if (error) throw new Error(error.message ?? 'Google sign-in failed');
}

export async function signOut(): Promise<void> {
  if (DEMO_MODE) return;
  const { error } = await auth.adapter.signOut();
  if (error) throw new Error(error.message ?? 'Sign-out failed');
}
