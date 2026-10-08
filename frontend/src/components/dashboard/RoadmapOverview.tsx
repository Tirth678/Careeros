export default function RoadmapOverview() {
  return (
    <div className="glass-card p-6 rounded-2xl border border-white/10">
      <p className="text-sm font-medium text-text-muted mb-1">Roadmap</p>
      <div className="flex items-baseline gap-2 mb-2">
        <h3 className="text-3xl font-bold text-white">68%</h3>
      </div>
      <p className="text-sm font-medium text-white mb-4">AI Engineer</p>
      <div className="h-1.5 w-full bg-background-200 rounded-full overflow-hidden">
        <div className="h-full bg-primary-500 rounded-full" style={{ width: '68%' }}></div>
      </div>
    </div>
  );
}