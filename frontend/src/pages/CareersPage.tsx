import { MOCK_CAREERS } from '../data/careers';
import { useNavigate } from 'react-router-dom';

export default function CareersPage() {
  const navigate = useNavigate();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Career Explorer</h1>
        <p className="text-text-muted mt-1">Discover careers that match your current skills.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {MOCK_CAREERS.map(career => (
          <div key={career.id} className="glass-card p-6 rounded-2xl border border-white/10">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-bold text-white">{career.name}</h2>
                <p className="text-sm text-text-muted mt-1">{career.description}</p>
              </div>
              <div className="text-2xl font-bold text-primary-400">{career.matchScore}%</div>
            </div>
            <button onClick={() => navigate(`/careers/${career.id}`)} className="mt-4 w-full py-2 bg-background-100 border border-white/10 text-white rounded-lg hover:bg-white hover:text-black transition-colors">
              View Analysis
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}