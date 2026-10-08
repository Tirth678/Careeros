import { useState } from 'react';
import { ArrowUpRight, BookOpen, Compass } from 'lucide-react';
import { ROADMAP_SOURCES, roadmapSource } from '../../data/roadmapSources';

export default function RoadmapGuide({ career }: { career?: { slug?: string; name?: string } }) {
  const [selected, setSelected] = useState('');
  const source = ROADMAP_SOURCES.find(item => item.slug === selected) ?? roadmapSource(career) ?? ROADMAP_SOURCES[1];
  return <section className="rounded-2xl border border-primary-400/30 bg-gradient-to-br from-primary-900/30 via-background-100 to-black p-6 md:p-8 space-y-6">
    <div className="flex flex-wrap justify-between gap-4 items-center">
      <p className="flex items-center gap-2 text-primary-400 text-sm font-medium"><Compass className="w-4 h-4" /> Roadmap library</p>
      <a href="https://roadmap.sh/" target="_blank" rel="noopener noreferrer" className="text-sm text-text-muted hover:text-white">Guides by roadmap.sh ↗</a>
    </div>
    <div className="grid md:grid-cols-[1fr_auto] gap-6 items-end">
      <div><h2 className="text-3xl font-bold text-white">Your path to {source.career}</h2>
        <p className="text-text-muted mt-3 max-w-xl">{source.description}</p>
      </div>
      <label className="text-sm text-text-muted">Explore a career
        <select aria-label="Roadmap career" value={source.slug} onChange={event => setSelected(event.target.value)} className="block w-full mt-2 p-3 rounded-lg bg-background-100 text-white border border-white/15">
          {ROADMAP_SOURCES.map(item => <option key={item.slug} value={item.slug}>{item.career}</option>)}
        </select>
      </label>
    </div>
    <div className="rounded-xl border border-white/10 bg-black/30 p-5 flex flex-wrap items-center justify-between gap-5">
      <div className="flex items-center gap-3"><BookOpen className="text-primary-400 w-6 h-6" /><div><h3 className="font-semibold text-white">{source.title} roadmap</h3><p className="text-sm text-text-muted">Community-maintained guide and learning resources</p></div></div>
      <a href={source.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-primary-400 text-black font-semibold rounded-lg px-5 py-3 hover:bg-primary-300">Explore on roadmap.sh <ArrowUpRight className="w-4 h-4" /></a>
    </div>
    <p className="text-xs text-text-muted">Opens the original roadmap in a new tab. CareerOS practice progress is separate from roadmap.sh progress.</p>
  </section>;
}
