import { Link, useLocation } from 'react-router-dom';
import { Brain, LayoutDashboard, User, Code2, Briefcase, Map, Settings, LogOut, Menu, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../auth/AuthContext';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/profile', label: 'Profile', icon: User },
  { path: '/skills', label: 'Skills', icon: Code2 },
  { path: '/careers', label: 'Careers', icon: Briefcase },
  { path: '/roadmap', label: 'Roadmap', icon: Map },
  { path: '/ai-assistant', label: 'AI Assistant', icon: Sparkles },
];

export default function Sidebar() {
  const location = useLocation();
  const { user, signOut } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Toggle */}
      <button className="md:hidden fixed top-4 right-4 z-50 p-2 glass-card rounded-lg" onClick={() => setIsOpen(!isOpen)}>
        <Menu className="w-6 h-6 text-white" />
      </button>

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 glass-panel border-r border-white/10 transform transition-transform duration-300 md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full p-4">
          <div className="flex items-center gap-2 px-2 py-4 mb-8">
            <Brain className="w-8 h-8 text-primary-500" />
            <span className="text-xl font-bold tracking-tight text-white">CareerOS</span>
          </div>

          <nav className="flex-1 space-y-1">
            {navItems.map(item => {
              const active = location.pathname.startsWith(item.path);
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${active ? 'bg-background-200 text-white font-medium' : 'text-text-muted hover:text-white hover:bg-white/5'}`}
                >
                  <Icon className={`w-5 h-5 ${active ? 'text-primary-400' : ''}`} />
                  {item.label}
                </Link>
              );
            })}
            
            <div className="pt-8 mt-8 border-t border-white/10 space-y-1">
              <Link to="/settings" className="flex items-center gap-3 px-3 py-3 rounded-lg text-text-muted hover:text-white hover:bg-white/5 transition-colors">
                <Settings className="w-5 h-5" />
                Settings
              </Link>
            </div>
          </nav>

          <div className="pt-4 border-t border-white/10 flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-full bg-primary-900/20 border border-primary-500/30 flex items-center justify-center text-primary-400 font-bold">
              {user?.name?.[0] ?? 'U'}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium text-white truncate">{user?.name}</p>
              <p className="text-xs text-text-muted truncate">{user?.email}</p>
              {error && <p role="alert" className="text-xs text-red-400">{error}</p>}
            </div>
            <button aria-label="Sign out" onClick={() => { void signOut().catch(() => setError('Sign out failed. Retry.')); }} className="p-2 text-text-muted hover:text-white transition-colors">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
      
      {/* Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setIsOpen(false)} />
      )}
    </>
  );
}
