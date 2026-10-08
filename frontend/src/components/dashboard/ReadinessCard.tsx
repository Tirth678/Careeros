import { TrendingUp } from 'lucide-react';

export default function ReadinessCard() {
  return (
    <div className="glass-card p-6 rounded-2xl border border-white/10 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-24 h-24 bg-primary-500/10 blur-2xl rounded-full"></div>
      <p className="text-sm font-medium text-text-muted mb-1">Career Readiness</p>
      <div className="flex items-baseline gap-2 mb-2">
        <h3 className="text-3xl font-bold text-white text-glow">72</h3>
        <span className="text-sm text-text-muted">/ 100</span>
      </div>
      <p className="text-sm font-medium text-white mb-4">AI Engineer</p>
      <div className="flex items-center gap-1 text-xs text-primary-400 font-medium">
        <TrendingUp className="w-4 h-4" />
        <span>+6% this month</span>
      </div>
    </div>
  );
}