import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getSession,
  signIn as neonSignIn,
  signInWithGoogle as neonSignInWithGoogle,
  signOut as neonSignOut,
  signUp as neonSignUp,
  type AuthUser,
} from '../lib/neonAuth';

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  signIn: (input: { email: string; password: string }) => Promise<AuthUser>;
  signInWithGoogle: () => void;
  signUp: (input: { name: string; email: string; password: string }) => Promise<AuthUser>;
  signOut: () => Promise<void>;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const refresh = useCallback(async () => {
    try {
      const session = await getSession();
      setUser(session?.user ?? null);
      return session?.user ?? null;
    } catch {
      setUser(null);
      return null;
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const sessionUser = await refresh();
      if (!cancelled) {
        setLoading(false);
        // If we just landed on /dashboard via Google OAuth callback and have a
        // valid session, stay on dashboard. Nothing to do — the guard allows it.
        // If we have a user and are on /login or /signup, redirect to dashboard.
        const path = window.location.pathname;
        if (sessionUser && (path === '/login' || path === '/signup')) {
          navigate('/dashboard', { replace: true });
        }
      }
    })();
    return () => { cancelled = true; };
  }, [refresh, navigate]);

  const signIn = useCallback(async (input: { email: string; password: string }) => {
    const { user: next } = await neonSignIn(input);
    setUser(next);
    return next;
  }, []);

  const signInWithGoogle = useCallback(() => {
    neonSignInWithGoogle();
  }, []);

  const signUp = useCallback(
    async (input: { name: string; email: string; password: string }) => {
      const { user: next } = await neonSignUp(input);
      setUser(next);
      return next;
    },
    [],
  );

  const signOut = useCallback(async () => {
    await neonSignOut();
    setUser(null);
    navigate('/login', { replace: true });
  }, [navigate]);

  const value = useMemo<AuthContextValue>(
    () => ({ user, loading, signIn, signInWithGoogle, signUp, signOut, refresh }),
    [user, loading, signIn, signInWithGoogle, signUp, signOut, refresh],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
