import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Brain, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate('/dashboard');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md glass-card p-8 rounded-2xl border border-white/10">
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2">
            <Brain className="w-10 h-10 text-primary-500" />
            <span className="text-2xl font-bold tracking-tight text-white">CareerOS</span>
          </div>
        </div>
        <h1 className="text-2xl font-semibold text-white mb-6 text-center">Welcome back.</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <input type="email" placeholder="Email" required className="w-full bg-background-100 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary-500 transition-colors" />
          </div>
          <div>
            <input type="password" placeholder="Password" required className="w-full bg-background-100 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary-500 transition-colors" />
          </div>
          <button disabled={loading} type="submit" className="w-full bg-white text-black font-semibold py-3 rounded-lg hover:bg-gray-200 transition-colors flex justify-center items-center">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Log in"}
          </button>
        </form>
        <button className="w-full mt-4 bg-background-100 text-white font-medium py-3 rounded-lg border border-white/10 hover:bg-background-200 transition-colors">
          Continue with Google
        </button>
        <p className="mt-8 text-center text-sm text-text-muted">
          Don't have an account? <Link to="/signup" className="text-primary-400 hover:text-primary-300">Create one.</Link>
        </p>
      </div>
    </div>
  );
}