import { ArrowUpRight } from 'lucide-react';
import { JOB_BOARDS } from '../data/jobBoards';

export default function JobSources({ role }: { role: string }) {
  return <section className="glass-card rounded-2xl border border-white/10 p-6 space-y-5">
    <div><h2 className="text-xl font-semibold text-white">Find {role} opportunities</h2><p className="text-text-muted text-sm mt-2">Compare openings, read employer requirements, and apply on the original job site.</p></div>
    <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3">{JOB_BOARDS.map(board => <a key={board.name} href={board.url(role)} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-4 hover:border-primary-400/50 hover:bg-white/5 transition-colors">
      <span aria-hidden="true" className={`w-10 h-10 shrink-0 rounded-lg ${board.color} text-white font-bold flex items-center justify-center`}>{board.initials}</span>
      <span className="flex-1"><span className="block text-white font-medium">{board.name}</span><span className="text-xs text-text-muted">{board.label}</span></span>
      <ArrowUpRight className="h-4 w-4 text-text-muted group-hover:text-primary-400" />
    </a>)}</div>
    <p className="text-xs text-text-muted">External job searches, not imported listings. Wellfound opens its startup jobs directory. Availability and sign-in requirements vary by site.</p>
  </section>;
}
