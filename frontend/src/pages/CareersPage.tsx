import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useApi } from '../lib/useApi';
import type { CareerDTO } from '../lib/models';
import RequestState from '../components/RequestState';
import JobSources from '../components/JobSources';
import LiveJobs from '../components/LiveJobs';
import { ROLE_DETAILS } from '../data/jobBoards';
export default function CareersPage() {
  const { data, loading, error, reload } = useApi<CareerDTO[]>('/api/careers');
  const [query, setQuery] = useState('');
  const [jobRole, setJobRole] = useState('AI Engineer');
  const filtered = data?.filter(career => `${career.name} ${career.description}`.toLowerCase().includes(query.toLowerCase()));
  return <div className="space-y-6"><h1 className="text-3xl font-bold text-white">Career explorer</h1>
    <p className="text-text-muted">Understand each role, compare your skills, and explore opportunities across six job sites.</p>
    <div className="flex flex-wrap gap-4"><label className="flex-1 text-sm text-text-muted">Search careers<input value={query} onChange={event => setQuery(event.target.value)} placeholder="AI, full stack, cloud…" className="block mt-2 w-full bg-background-100 rounded-lg border border-white/10 p-3 text-white" /></label>
      <label className="text-sm text-text-muted">Search jobs for<select value={jobRole} onChange={event => setJobRole(event.target.value)} className="block mt-2 bg-background-100 rounded-lg border border-white/10 p-3 text-white">{Object.keys(ROLE_DETAILS).map(role => <option key={role}>{role}</option>)}</select></label></div>
    {import.meta.env.DEV || import.meta.env.MODE === 'demo' ? <LiveJobs role={jobRole} /> : <JobSources role={jobRole} />}
    <RequestState loading={loading} error={error} retry={reload} />
    {!loading && !error && !data?.length && <p className="text-text-muted">No careers are available yet.</p>}
    {!loading && !error && data?.length && !filtered?.length ? <p className="text-text-muted">No careers match your search.</p> : null}
    {!loading && !error && <div className="grid md:grid-cols-2 gap-4">{filtered?.map(career => <article key={career.id} className="glass-card p-6 rounded-xl border border-white/10">
      <h2 className="text-xl text-white font-bold">{career.name}</h2><p className="text-text-muted my-4">{career.description}</p>
      <div className="flex flex-wrap gap-2 mb-5">{career.requirements?.slice(0, 4).map(skill => <span key={skill.skillId} className="text-xs px-2 py-1 rounded-md bg-white/5 text-text-muted">{skill.skillName}</span>)}</div>
      <Link className="text-primary-400" to={`/careers/${career.id}`}>Role details & opportunities →</Link>
    </article>)}</div>}
  </div>;
}
