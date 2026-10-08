import { X, CheckCircle } from 'lucide-react';
import type { RoadmapTask } from '../../types/roadmap';

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
            className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg font-semibold transition-colors ${task.status === 'completed' ? 'bg-background-200 text-white/50 cursor-not-allowed' : 'bg-primary-600 text-white hover:bg-primary-500'}`}
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
}
