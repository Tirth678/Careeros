import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
export default function SettingsPage() {
  const { user } = useAuth();
  return <div className="space-y-6"><h1 className="text-3xl font-bold text-white">Settings</h1><section className="glass-card p-6 rounded-xl space-y-4"><h2 className="text-xl text-white">Google account</h2><p className="text-text-muted">{user?.email}</p><p className="text-text-muted">Sign-in and account security are managed through your Google account.</p><Link to="/profile" className="text-primary-400 inline-block">Edit your career profile →</Link></section></div>;
}
