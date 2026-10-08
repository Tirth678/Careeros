import { MOCK_ROADMAP } from '../data/roadmap';
import ParticleBackground from '../components/landing/ParticleBackground';
import { useState } from 'react';
import TaskDetailDrawer from '../components/roadmap/TaskDetailDrawer';

export default function RoadmapPage() {
  const [selectedTask, setSelectedTask] = useState<any>(null);

  return (
    <div className="relative min-h-screen pb-20">
      <ParticleBackground />
      <div className="relative z-10 space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-white">My Career Roadmap</h1>
          <p className="text-text-muted mt-1">Your personalized path to becoming an AI Engineer.</p>
        </div>
        
        <div className="glass-card p-6 rounded-2xl border border-white/10 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-white">AI Engineer</h2>
            <p className="text-primary-400 mt-1 font-medium">Readiness: 72%</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-white">68%</div>
            <p className="text-sm text-text-muted">Progress</p>
          </div>
        </div>

        <div className="space-y-8 pl-4 border-l-2 border-background-200">
          {MOCK_ROADMAP.map(phase => (
            <div key={phase.id} className="relative">
              <div className="absolute -left-[21px] top-1 w-10 h-10 bg-background border border-white/10 rounded-full flex items-center justify-center font-bold text-sm text-primary-400">
                P{phase.order}
              </div>
              <div className="pl-10">
                <h3 className="text-lg font-bold text-white tracking-widest">{phase.title}</h3>
                <div className="mt-4 space-y-3">
                  {phase.tasks.map(task => (
                    <div 
                      key={task.id} 
                      onClick={() => setSelectedTask(task)}
                      className={`p-4 rounded-xl border transition-colors cursor-pointer flex items-center gap-3 ${task.status === 'completed' ? 'glass-card border-white/10 opacity-70' : task.status === 'in-progress' ? 'bg-primary-900/10 border-primary-500/50' : 'glass-card border-white/10'}`}
                    >
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${task.status === 'completed' ? 'border-primary-500 bg-primary-500 text-black' : task.status === 'in-progress' ? 'border-primary-400' : 'border-background-200'}`}>
                        {task.status === 'completed' && <span className="text-[10px]">✓</span>}
                      </div>
                      <span className={`font-medium ${task.status === 'completed' ? 'text-text-muted line-through' : 'text-white'}`}>{task.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {selectedTask && <TaskDetailDrawer task={selectedTask} onClose={() => setSelectedTask(null)} />}
    </div>
  );
}