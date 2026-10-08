import { X, ExternalLink, ArrowRight } from 'lucide-react';
import { MOCK_SKILLS } from '../../data/skills';
import { useNavigate } from 'react-router-dom';

export default function SkillDetailDrawer({ skillId, onClose }: { skillId: string | null; onClose: () => void }) {
  const navigate = useNavigate();
  const skill = MOCK_SKILLS.find(s => s.id === skillId);
  
  if (!skill) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative w-full max-w-md bg-background-50 border-l border-white/10 h-full shadow-2xl flex flex-col animate-slide-up sm:animate-none">
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-background">
          <h2 className="text-xl font-bold text-white uppercase tracking-wider">{skill.name}</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-lg text-text-muted transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 flex-1 overflow-y-auto space-y-8">
          <div>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-4xl font-bold text-white">{skill.proficiency}%</span>
            </div>
            <div className="inline-block px-2.5 py-1 bg-background-200 text-text-muted text-xs font-semibold rounded uppercase tracking-wider">
              {skill.status.replace('_', ' ')}
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-text-muted uppercase tracking-wider">Evidence</h3>
            <div className="glass-card p-4 rounded-xl border border-white/10 flex items-center justify-between">
              <span className="text-sm font-medium text-white">Neural Network from Scratch</span>
              <ExternalLink className="w-4 h-4 text-text-muted" />
            </div>
            <div className="glass-card p-4 rounded-xl border border-white/10 flex items-center justify-between">
              <span className="text-sm font-medium text-white">Machine Learning coursework</span>
              <ExternalLink className="w-4 h-4 text-text-muted" />
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-text-muted uppercase tracking-wider">Career Relevance</h3>
            <div className="flex justify-between items-center pb-2 border-b border-white/5">
              <span className="text-sm text-white">ML Engineer</span>
              <span className="text-xs font-bold text-primary-400 uppercase">High</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-white/5">
              <span className="text-sm text-white">AI Engineer</span>
              <span className="text-xs font-bold text-primary-400 uppercase">High</span>
            </div>
          </div>
          
          <div className="bg-primary-900/10 border border-primary-500/20 p-5 rounded-xl">
            <h3 className="text-sm font-bold text-primary-400 uppercase tracking-wider mb-2">Recommended</h3>
            <p className="text-white text-sm font-medium mb-4">Complete PyTorch Training Loops</p>
            <button onClick={() => navigate('/roadmap')} className="text-sm flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-500 transition-colors w-full justify-center">
              View Roadmap <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}