import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApi } from '../lib/useApi';
import { apiFetch } from '../lib/api';
import type { CareerDTO, CareerAnalysisDTO } from '../lib/models';
import RequestState from '../components/RequestState';
export default function CareerAnalysisPage() {
  const { careerId } = useParams(); const navigate = useNavigate();
  const { data, loading, error, reload } = useApi<CareerDTO>(`/api/careers/${encodeURIComponent(careerId!)}`);
  const [analysis, setAnalysis] = useState<CareerAnalysisDTO | null>(null);
  const [busy, setBusy] = useState(false); const [message, setMessage] = useState('');
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
      <button disabled={busy} onClick={() => void run(false)} className="bg-white text-black p-3 rounded-lg disabled:opacity-50">{busy ? 'Working…' : 'Analyze my skills'}</button>
      {analysis && <section className="glass-card p-6 rounded-xl space-y-4"><h2 className="text-2xl text-primary-400">{analysis.readinessScore}% ready</h2>
        <h3 className="text-white font-semibold">Skills to improve</h3>
        {analysis.gaps.length ? analysis.gaps.map(gap => <div key={gap.skillId} className="flex justify-between text-text-muted"><span>{gap.skillName}</span><span>{gap.current}% / {gap.required}% needed</span></div>) : <p className="text-text-muted">You meet all listed skill requirements.</p>}
        {analysis.gaps.length > 0 && <button disabled={busy} onClick={() => void run(true)} className="bg-primary-400 text-black p-3 rounded-lg disabled:opacity-50">Generate my roadmap</button>}
      </section>}
    </>}
  </div>;
}
