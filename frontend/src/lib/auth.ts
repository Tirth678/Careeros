export type AuthUser = { id: string; name: string | null; email: string; image?: string | null };
export async function getSession(): Promise<{ user: AuthUser } | null> {
  const response = await fetch('/api/auth/session', { credentials: 'include', cache: 'no-store' });
  if (!response.ok) throw new Error('Unable to check your session. Please retry.');
  const session = await response.json();
  return session?.user?.id ? session : null;
}

async function authPost(action: string, callbackUrl: string) {
  const response = await fetch('/api/auth/csrf', { credentials: 'include', cache: 'no-store' });
  if (!response.ok) throw new Error('Sign-in service is unavailable. Please retry.');
  const { csrfToken } = await response.json();
  if (!csrfToken) throw new Error('Could not initialize a secure session.');
  const result = await fetch(`/api/auth/${action}`, {
    method: 'POST', credentials: 'include',
    headers: { 'content-type': 'application/x-www-form-urlencoded', 'X-Auth-Return-Redirect': '1' },
    body: new URLSearchParams({ csrfToken, callbackUrl }),
  });
  const data = await result.json();
  if (!result.ok || !data.url) throw new Error('Authentication failed. Please retry.');
  return data.url as string;
}

export async function signInWithGoogle() {
  const providers = await fetch('/api/auth/providers').then(response => response.json());
  if (!providers.google) throw new Error('Google sign-in is not configured. Add AUTH_GOOGLE_ID and AUTH_GOOGLE_SECRET to backend/.env and restart the server.');
  window.location.assign(await authPost('signin/google', `${window.location.origin}/dashboard`));
}
export async function signOut() {
  await authPost('signout', `${window.location.origin}/login`);
}
