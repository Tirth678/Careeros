const fs = require('fs');
const path = require('path');

const files = {
  // Skills Drawer
  "src/components/skills/SkillDetailDrawer.tsx": `import { X, ExternalLink, ArrowRight } from 'lucide-react';
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
}`,
  
  // Roadmap Drawer
  "src/components/roadmap/TaskDetailDrawer.tsx": `import { X, CheckCircle } from 'lucide-react';
import { RoadmapTask } from '../../types/roadmap';

export default function TaskDetailDrawer({ task, onClose }: { task: RoadmapTask; onClose: () => void }) {
  if (!task) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative w-full max-w-md bg-background-50 border-l border-white/10 h-full shadow-2xl flex flex-col animate-slide-up sm:animate-none">
        <div className="p-6 border-b border-white/10 flex justify-between items-start bg-background">
          <div>
            <h2 className="text-xl font-bold text-white mb-2">{task.title}</h2>
            <div className="flex gap-2 text-xs">
              <span className="px-2 py-1 bg-background-200 rounded text-text-muted">{task.difficulty}</span>
              <span className="px-2 py-1 bg-background-200 rounded text-text-muted">{task.estimatedMinutes} min</span>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-lg text-text-muted transition-colors ml-4">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 flex-1 overflow-y-auto space-y-8">
          <div>
            <h3 className="text-sm font-bold text-text-muted uppercase tracking-wider mb-2">Why this matters</h3>
            <p className="text-white text-sm leading-relaxed">{task.description}</p>
          </div>
          
          {task.steps && task.steps.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-text-muted uppercase tracking-wider mb-4">Steps</h3>
              <div className="space-y-3">
                {task.steps.map((step, idx) => (
                  <div key={idx} className="flex gap-3 text-sm">
                    <span className="text-primary-400 font-bold">{idx + 1}.</span>
                    <span className="text-white">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="p-6 border-t border-white/10 bg-background">
          <button 
            className={\`w-full flex items-center justify-center gap-2 py-3 rounded-lg font-semibold transition-colors \${task.status === 'completed' ? 'bg-background-200 text-white/50 cursor-not-allowed' : 'bg-primary-600 text-white hover:bg-primary-500'}\`}
            disabled={task.status === 'completed'}
            onClick={() => {
              // In a real app this would update state
              onClose();
            }}
          >
            {task.status === 'completed' ? 'Completed' : 'Mark Complete'} 
            {task.status !== 'completed' && <CheckCircle className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  );
}`
};

for (const [filepath, content] of Object.entries(files)) {
  const fullPath = path.join(__dirname, filepath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content, 'utf-8');
  console.log('Created:', filepath);
}
