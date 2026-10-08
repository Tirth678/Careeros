import { Link } from 'react-router-dom';
import { useApi } from '../lib/useApi';
import type { DashboardDTO } from '../lib/models';
import RequestState from '../components/RequestState';

export default function DashboardPage() {
  const { data, loading, error, reload } = useApi<DashboardDTO>('/api/dashboard');
  return <div className="space-y-6">
    <h1 className="text-3xl font-bold text-white">{data ? `Welcome, ${data.student.name}.` : 'Your dashboard'}</h1>
    <RequestState loading={loading} error={error} retry={reload} />
    {!loading && !error && data && <>
      {!data.student.degree && <Link className="block glass-card p-5 rounded-xl text-primary-400" to="/profile">Complete your profile to get started →</Link>}
      <div className="grid md:grid-cols-3 gap-4">
        {[
          ['Career readiness', data.readiness.score === null ? 'Not analyzed yet' : `${data.readiness.score}%`],
          ['Current streak', `${data.streak.currentStreak} days`],
          ['Skills tracked', String(data.skills.length)],
        ].map(([title, value]) => <div key={title} className="glass-card p-6 rounded-xl border border-white/10"><p className="text-text-muted">{title}</p><p className="text-2xl font-bold text-white mt-2">{value}</p></div>)}
      </div>
      <section className="glass-card p-6 rounded-xl border border-white/10">
        <h2 className="text-xl text-white font-semibold">Your roadmap</h2>
        <p className="text-text-muted mt-3">{data.roadmap ? `${data.roadmap.title} · ${data.roadmap.progress}% complete` : 'Choose a career and generate your first roadmap.'}</p>
        {data.roadmap?.nextTask && <p className="text-white mt-3">Next: {data.roadmap.nextTask.title} · {data.roadmap.nextTask.estimatedMinutes} minutes</p>}
        <Link className="inline-block text-primary-400 mt-4" to={data.roadmap ? '/roadmap' : '/careers'}>{data.roadmap ? 'Continue roadmap' : 'Explore careers'} →</Link>
      </section>
      <section className="glass-card p-6 rounded-xl border border-white/10"><h2 className="text-xl text-white font-semibold">Your skills</h2>
        {data.skills.length ? data.skills.map(skill => <div key={skill.name} className="flex justify-between text-text-muted mt-3"><span>{skill.name}</span><span>{skill.level}%</span></div>) : <p className="text-text-muted mt-3">Add your first skill to calculate career matches.</p>}
        <Link to="/skills" className="inline-block text-primary-400 mt-4">Manage skills →</Link>
      </section>
    </>}
  </div>;
}
