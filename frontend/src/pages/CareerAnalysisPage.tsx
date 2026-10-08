import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApi } from '../lib/useApi';
import { apiFetch } from '../lib/api';
import type { CareerDTO, CareerAnalysisDTO } from '../lib/models';
import RequestState from '../components/RequestState';
import { roadmapSource } from '../data/roadmapSources';
import { ROLE_DETAILS } from '../data/jobBoards';
import JobSources from '../components/JobSources';
import LiveJobs from '../components/LiveJobs';
export default function CareerAnalysisPage() {
  const { careerId } = useParams(); const navigate = useNavigate();
  const { data, loading, error, reload } = useApi<CareerDTO>(`/api/careers/${encodeURIComponent(careerId!)}`);
  const [analysis, setAnalysis] = useState<CareerAnalysisDTO | null>(null);
  const [busy, setBusy] = useState(false); const [message, setMessage] = useState('');
  const guide = roadmapSource(data ?? undefined);
  const details = data ? ROLE_DETAILS[data.name] : undefined;
  async function run(generate: boolean) {
    setBusy(true); setMessage('');
    try {
      if (generate) { await apiFetch('/api/roadmaps/generate', { method: 'POST', body: JSON.stringify({ careerId }) }); navigate('/roadmap'); }
      else setAnalysis(await apiFetch<CareerAnalysisDTO>(`/api/careers/${encodeURIComponent(careerId!)}/analyze`, { method: 'POST', body: '{}' }));
    } catch (err) { setMessage(err instanceof Error ? err.message : 'Request failed'); }
    finally { setBusy(false); }
  }
  return <div className="space-y-6"><h1 className="text-3xl font-bold text-white">{data?.name ?? 'Career analysis'}</h1>
    <RequestState loading={loading} error={error} retry={reload} />
    {message && <p role="alert" className="text-red-400">{message}</p>}
    {!loading && !error && data && <><p className="text-text-muted">{data.description}</p>
      {details && <section className="glass-card rounded-xl border border-white/10 p-6 space-y-5">
        <div><h2 className="text-xl font-semibold text-white">What you’ll do</h2><ul className="list-disc pl-5 mt-3 space-y-2 text-text-muted">{details.responsibilities.map(item => <li key={item}>{item}</li>)}</ul></div>
        <div><h3 className="font-semibold text-white">Build a portfolio that shows your skills</h3><p className="text-text-muted mt-2">{details.portfolio}</p></div>
        <div><h3 className="font-semibold text-white">Related job titles</h3><p className="text-text-muted mt-2">{details.titles.join(' · ')}</p></div>
        <p className="text-xs text-text-muted">CareerOS role overview. Exact responsibilities and eligibility depend on the employer.</p>
      </section>}
      {!!data.requirements?.length && <section className="space-y-3"><h2 className="text-xl font-semibold text-white">Core skills</h2><div className="flex flex-wrap gap-2">{data.requirements.map(skill => <span key={skill.skillId} className="rounded-lg bg-white/5 px-3 py-2 text-text-muted">{skill.skillName}</span>)}</div></section>}
      {(import.meta.env.DEV || import.meta.env.MODE === 'demo') && ROLE_DETAILS[data.name] ? <LiveJobs role={data.name} /> : <JobSources role={data.name} />}
      {guide && <a className="block text-primary-400 underline underline-offset-4" href={guide.url} target="_blank" rel="noopener noreferrer">Explore the {guide.title} guide on roadmap.sh ↗</a>}
      <button disabled={busy} onClick={() => void run(false)} className="bg-white text-black p-3 rounded-lg disabled:opacity-50">{busy ? 'Working…' : 'Analyze my skills'}</button>
      {analysis && <section className="glass-card p-6 rounded-xl space-y-4"><h2 className="text-2xl text-primary-400">{analysis.readinessScore}% ready</h2>
        <h3 className="text-white font-semibold">Skills to improve</h3>
        {analysis.gaps.length ? analysis.gaps.map(gap => <div key={gap.skillId} className="flex justify-between text-text-muted"><span>{gap.skillName}</span><span>{gap.current}% / {gap.required}% needed</span></div>) : <p className="text-text-muted">You meet all listed skill requirements.</p>}
        {analysis.gaps.length > 0 && <button disabled={busy} onClick={() => void run(true)} className="bg-primary-400 text-black p-3 rounded-lg disabled:opacity-50">Generate my roadmap</button>}
      </section>}
    </>}
  </div>;
}
