import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function CareerMatches() {
  const matches = [
    { name: 'Full Stack Developer', score: 89 },
    { name: 'AI Engineer', score: 72 },
    { name: 'ML Engineer', score: 67 },
  ];

  return (
    <div className="glass-card p-6 rounded-2xl border border-white/10 h-full flex flex-col">
      <h3 className="text-lg font-bold text-white mb-6">Career Matches</h3>
      <div className="space-y-4 flex-1">
        {matches.map(m => (
          <div key={m.name} className="flex justify-between items-center">
            <span className="font-medium text-white text-sm">{m.name}</span>
            <span className="text-primary-400 font-bold text-sm">{m.score}%</span>
          </div>
        ))}
      </div>
      <Link to="/careers" className="mt-6 flex items-center gap-2 text-sm text-text-muted hover:text-white transition-colors">
        Explore careers <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}