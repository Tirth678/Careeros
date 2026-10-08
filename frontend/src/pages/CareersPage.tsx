import { Link } from 'react-router-dom';
import { useApi } from '../lib/useApi';
import type { CareerDTO } from '../lib/models';
import RequestState from '../components/RequestState';
export default function CareersPage() {
  const { data, loading, error, reload } = useApi<CareerDTO[]>('/api/careers');
  return <div className="space-y-6"><h1 className="text-3xl font-bold text-white">Career explorer</h1>
    <p className="text-text-muted">Choose a career to analyze against your saved skills.</p>
    <RequestState loading={loading} error={error} retry={reload} />
    {!loading && !error && !data?.length && <p className="text-text-muted">No careers are available yet.</p>}
    {!loading && !error && <div className="grid md:grid-cols-2 gap-4">{data?.map(career => <article key={career.id} className="glass-card p-6 rounded-xl border border-white/10">
      <h2 className="text-xl text-white font-bold">{career.name}</h2><p className="text-text-muted my-4">{career.description}</p>
      <Link className="text-primary-400" to={`/careers/${career.id}`}>View analysis →</Link>
    </article>)}</div>}
  </div>;
}
