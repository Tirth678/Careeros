import { useParams, useNavigate } from 'react-router-dom';
import { MOCK_CAREERS } from '../data/careers';
import ParticleBackground from '../components/landing/ParticleBackground';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';

export default function CareerAnalysisPage() {
  const { careerId } = useParams();
  const navigate = useNavigate();
  const career = MOCK_CAREERS.find(c => c.id === careerId) || MOCK_CAREERS[2];
  const [loading, setLoading] = useState(false);

  const generateRoadmap = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate('/roadmap');
    }, 2000);
  };

  return (
    <div className="relative min-h-screen">
      <ParticleBackground />
      <div className="relative z-10 space-y-8">
        <div className="text-center py-12">
          <h1 className="text-5xl font-bold text-white mb-4">{career.name}</h1>
          <p className="text-xl text-text-muted">How ready are you?</p>
          <div className="mt-8 text-7xl font-bold text-primary-500 text-glow">{career.matchScore} / 100</div>
          <div className="mt-4 text-primary-300 font-semibold tracking-widest uppercase">Developing</div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="glass-card p-6 rounded-2xl border border-white/10">
            <h2 className="text-xl font-bold text-white mb-6">Skill Gaps</h2>
            <div className="space-y-6">
              {[
                { name: 'PyTorch', current: 31, req: 80, gap: 49 },
                { name: 'MLOps', current: 12, req: 60, gap: 48 }
              ].map(skill => (
                <div key={skill.name}>
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold text-white">{skill.name}</span>
                    <span className="text-sm text-primary-400">Gap: {skill.gap}%</span>
                  </div>
                  <div className="h-2 w-full bg-background-200 rounded-full overflow-hidden flex">
                    <div className="h-full bg-primary-600" style={{ width: `${skill.current}%` }} />
                    <div className="h-full bg-primary-400/30" style={{ width: `${skill.gap}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-8 rounded-2xl border border-primary-500/30 bg-primary-900/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/20 blur-3xl rounded-full"></div>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">✨ AI Career Advisor</h2>
            <p className="text-text-muted mb-4">"You have a strong programming foundation, but your biggest gaps are PyTorch and MLOps."</p>
            <p className="text-text-muted mb-8">"Your highest-impact next step is to complete a PyTorch training project."</p>
            <button onClick={generateRoadmap} disabled={loading} className="w-full bg-primary-600 text-white font-semibold py-3 rounded-lg hover:bg-primary-500 transition-colors flex justify-center items-center">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Generate My Roadmap →"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}