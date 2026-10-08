import { useState } from 'react';
import { Link, Navigate, useSearchParams } from 'react-router-dom';
import { Brain, Loader2 } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';

export default function LoginPage() {
  const { user, loading, error: sessionError, signInWithGoogle } = useAuth();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [params] = useSearchParams();
  if (!loading && user) return <Navigate to="/dashboard" replace />;
  const message = error ?? sessionError ?? (params.has('error') ? 'Google sign-in was not completed. Please try again.' : null);
  return <div className="min-h-screen bg-black flex items-center justify-center p-4">
    <div className="w-full max-w-md glass-card p-8 rounded-2xl border border-white/10 text-center">
      <Brain className="w-12 h-12 text-primary-400 mx-auto mb-6" />
      <h1 className="text-3xl font-bold text-white">Welcome to CareerOS</h1>
      <p className="text-text-muted my-4">Build your profile, discover career matches, and track your progress.</p>
      {message && <p role="alert" className="text-red-400 my-4">{message}</p>}
      <button disabled={busy || loading} onClick={async () => {
        setBusy(true); setError(null);
        try { await signInWithGoogle(); }
        catch (err) { setError(err instanceof Error ? err.message : 'Sign-in failed'); setBusy(false); }
      }} className="w-full bg-white text-black rounded-lg p-3 font-semibold disabled:opacity-50 flex gap-3 items-center justify-center">
        {busy || loading ? <Loader2 className="animate-spin w-5 h-5" /> : 'G'} Continue with Google
      </button>
      <p className="text-sm text-text-muted mt-4">Your account is created on your first sign-in.</p>
      <Link to="/" className="inline-block mt-6 text-primary-400">Back to home</Link>
    </div>
  </div>;
}
