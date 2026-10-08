import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { useApi } from '../lib/useApi';
import { apiFetch } from '../lib/api';
import type { RoadmapDTO, TaskStatus } from '../lib/models';
import RequestState from '../components/RequestState';
export default function RoadmapPage() {
  const { user } = useAuth();
  const { data, loading, error, reload } = useApi<RoadmapDTO | null>(`/api/students/${encodeURIComponent(user!.id)}/roadmaps/active`);
  const [busy, setBusy] = useState(false); const [message, setMessage] = useState('');
  async function update(taskId: string, status: TaskStatus) {
    setBusy(true); setMessage('');
    try { await apiFetch(`/api/roadmaps/${data!.id}/tasks/${taskId}`, { method: 'PATCH', body: JSON.stringify({ status }) }); reload(); }
    catch (err) { setMessage(err instanceof Error ? err.message : 'Unable to update task'); }
    finally { setBusy(false); }
  }
  return <div className="space-y-6"><h1 className="text-3xl font-bold text-white">My career roadmap</h1>
    <RequestState loading={loading} error={error} retry={reload} />
    {message && <p role="alert" className="text-red-400">{message}</p>}
    {!loading && !error && (data ? <>
      <section className="glass-card p-6 rounded-xl"><h2 className="text-xl text-white">{data.title}</h2><p className="text-text-muted my-3">{data.description}</p><p className="text-primary-400">{data.progress}% complete</p></section>
      {data.tasks.map(task => <article key={task.id} className="glass-card p-5 rounded-xl border border-white/10 space-y-3">
        <p className="text-primary-400 text-sm">Week {task.week} · {task.estimatedMinutes} minutes</p><h3 className="text-white font-semibold">{task.title}</h3><p className="text-text-muted">{task.description}</p>
        <label className="text-text-muted">Status <select aria-label={`Status for ${task.title}`} disabled={busy} value={task.status} onChange={e => void update(task.id, e.target.value as TaskStatus)} className="bg-background-100 text-white rounded-lg p-2 ml-3"><option value="todo">To do</option><option value="in_progress">In progress</option><option value="done">Done</option></select></label>
      </article>)}
    </> : <div className="glass-card p-6 rounded-xl"><p className="text-text-muted">You don't have a roadmap yet.</p><Link to="/careers" className="inline-block mt-4 text-primary-400">Choose a career →</Link></div>)}
  </div>;
}
