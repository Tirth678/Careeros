import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSession, signInWithGoogle, signOut as endSession, type AuthUser } from '../lib/auth';

type AuthContextValue = {
  user: AuthUser | null; loading: boolean; error: string | null;
  signInWithGoogle: () => Promise<void>; signOut: () => Promise<void>; refresh: () => Promise<void>;
};
const AuthContext = createContext<AuthContextValue | null>(null);
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const refresh = useCallback(async () => {
    setError(null);
    try { setUser((await getSession())?.user ?? null); }
    catch (err) { setUser(null); setError(err instanceof Error ? err.message : 'Session check failed'); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => {
    void refresh();
    const expired = () => { setUser(null); navigate('/login', { replace: true }); };
    const focus = () => { void refresh(); };
    window.addEventListener('auth:expired', expired);
    window.addEventListener('focus', focus);
    return () => { window.removeEventListener('auth:expired', expired); window.removeEventListener('focus', focus); };
  }, [refresh, navigate]);
  const signOut = useCallback(async () => {
    await endSession(); setUser(null); navigate('/login', { replace: true });
  }, [navigate]);
  const value = useMemo(() => ({ user, loading, error, refresh, signInWithGoogle, signOut }), [user, loading, error, refresh, signOut]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error('AuthProvider is missing');
  return value;
}
