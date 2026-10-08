export default function SkillsOverview() {
  return (
    <div className="glass-card p-6 rounded-2xl border border-white/10">
      <p className="text-sm font-medium text-text-muted mb-1">Skills</p>
      <div className="flex items-baseline gap-2 mb-4">
        <h3 className="text-3xl font-bold text-white">18</h3>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-primary-500"></div>
        <p className="text-xs font-medium text-white">12 strong</p>
      </div>
    </div>
  );
}