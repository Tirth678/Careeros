import { MOCK_SKILLS } from '../data/skills';
import { useState } from 'react';
import SkillDetailDrawer from '../components/skills/SkillDetailDrawer';

export default function SkillsPage() {
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">My Skills</h1>
        <p className="text-text-muted mt-1">Understand your strengths and identify what to improve.</p>
      </div>
      <div className="flex gap-4 text-sm">
        <div className="px-4 py-2 glass-card rounded-lg border border-white/10"><span className="text-white font-bold">18</span> Skills</div>
        <div className="px-4 py-2 glass-card rounded-lg border border-white/10"><span className="text-primary-400 font-bold">12</span> Strong</div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {MOCK_SKILLS.map(skill => (
          <div key={skill.id} onClick={() => setSelectedSkill(skill.id)} className="glass-card p-5 rounded-xl border border-white/10 cursor-pointer hover:border-primary-500/50 transition-colors">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-white">{skill.name}</h3>
              <span className="text-xs px-2 py-1 bg-background-200 rounded-md text-text-muted">{skill.status}</span>
            </div>
            <div className="h-2 w-full bg-background-200 rounded-full overflow-hidden">
              <div className="h-full bg-primary-500 rounded-full" style={{ width: `${skill.proficiency}%` }} />
            </div>
            <p className="text-right text-xs mt-2 text-text-muted">{skill.proficiency}%</p>
          </div>
        ))}
      </div>
      <SkillDetailDrawer skillId={selectedSkill} onClose={() => setSelectedSkill(null)} />
    </div>
  );
}