import { Flame } from 'lucide-react';

export default function StreakCard() {
  return (
    <div className="glass-card p-6 rounded-2xl border border-white/10">
      <p className="text-sm font-medium text-text-muted mb-1">Career Streak</p>
      <div className="flex items-center gap-3 mb-4">
        <h3 className="text-3xl font-bold text-white">12</h3>
        <span className="text-sm text-text-muted">days</span>
        <Flame className="w-6 h-6 text-primary-500" />
      </div>
      <p className="text-xs text-text-muted">Best: <span className="text-white font-medium">21 days</span></p>
    </div>
  );
}