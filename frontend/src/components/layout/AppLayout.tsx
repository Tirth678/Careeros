import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import Sidebar from './Sidebar';

export default function AppLayout() {
  const { user, loading, error, refresh } = useAuth();

  // Wait for session check to complete before deciding
  if (loading) {
    return (
      <div className="flex min-h-screen bg-black items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  if (error) return <div role="alert" className="p-8 text-white">{error} <button onClick={() => void refresh()} className="underline">Retry</button></div>;
  // Not authenticated — redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex min-h-screen bg-black">
      <Sidebar />
      <main className="flex-1 ml-0 md:ml-64 p-4 md:p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
