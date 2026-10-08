import { ArrowRight, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function NextBestAction() {
  return (
    <div className="glass-card p-8 rounded-2xl border border-primary-500/30 bg-primary-900/5 relative">
      <div className="inline-flex items-center px-2.5 py-1 rounded-md bg-primary-900/30 text-primary-400 text-xs font-bold uppercase tracking-wider mb-4 border border-primary-500/20">
        Your Next Best Action
      </div>
      <h2 className="text-2xl font-bold text-white mb-2">Complete PyTorch Training Loops</h2>
      <div className="flex gap-4 text-sm text-text-muted mb-6">
        <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> 45 min</span>
        <span className="text-primary-400 font-medium">Expected impact: +4% readiness</span>
      </div>
      <p className="text-text-dim mb-8">
        Improving PyTorch will strengthen your ML Engineer readiness and unlock the next phase of your roadmap.
      </p>
      <Link to="/roadmap" className="inline-flex items-center gap-2 bg-white text-black px-6 py-2.5 rounded-lg font-semibold hover:bg-gray-200 transition-colors">
        Continue <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}