import { useState, type FormEvent } from 'react';
import { useAuth } from '../auth/AuthContext';
import { useApi } from '../lib/useApi';
import { apiFetch } from '../lib/api';
import type { StudentSkillDTO } from '../lib/models';
import RequestState from '../components/RequestState';
import SkillsChart from '../components/SkillsChart';

export default function SkillsPage() {
  const { user } = useAuth();
  const path = `/api/profiles/${encodeURIComponent(user!.id)}/skills`;
  const { data, loading, error, reload } = useApi<StudentSkillDTO[]>(path);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [sort, setSort] = useState('strongest');
  const skills = [...(data ?? [])].sort((a, b) => sort === 'name' ? a.name.localeCompare(b.name) : sort === 'growth' ? a.proficiency - b.proficiency : b.proficiency - a.proficiency);
  const average = skills.length ? Math.round(skills.reduce((sum, skill) => sum + skill.proficiency, 0) / skills.length) : 0;
  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); const form = event.currentTarget; const values = new FormData(form);
    setBusy(true); setMessage('');
    try { await apiFetch(path, { method: 'PUT', body: JSON.stringify({ name: values.get('name'), proficiency: Number(values.get('proficiency')), source: 'self' }) }); form.reset(); reload(); }
    catch (err) { setMessage(err instanceof Error ? err.message : 'Unable to save skill'); }
    finally { setBusy(false); }
  }
  return <div className="space-y-6"><h1 className="text-3xl font-bold text-white">My skills</h1>
    <p className="text-text-muted">Know your strengths. Find your next area to grow.</p>
    {!loading && !error && <section className="glass-card rounded-2xl p-4 md:p-6" aria-labelledby="skills-overview">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div><h2 id="skills-overview" className="text-xl font-semibold text-white">Skill proficiency</h2><p className="mt-2 text-sm text-text-muted">{skills.length} skills tracked · {average}% average proficiency</p></div>
        <label className="flex items-center gap-2 text-sm text-text-muted">Sort by
          <select aria-label="Sort skills" value={sort} onChange={event => setSort(event.target.value)} className="rounded-lg border border-white/10 bg-background-100 px-3 py-2 text-white">
            <option value="strongest">Strongest first</option><option value="growth">Growth areas first</option><option value="name">Name A–Z</option>
          </select>
        </label>
      </div>
      {skills.length ? <SkillsChart skills={skills} /> : <p className="py-12 text-center text-text-muted">Add your first skill below to see your chart.</p>}
    </section>}
    <p className="text-sm text-text-muted">Add a skill or enter an existing skill name to update its proficiency.</p>
    <form onSubmit={save} className="glass-card rounded-xl p-5 flex gap-4 flex-wrap items-end">
      <label className="text-text-muted">Skill name<input name="name" required maxLength={80} placeholder="e.g. TypeScript" className="block bg-background-100 p-3 rounded-lg text-white mt-2" /></label>
      <label className="text-text-muted">Proficiency (0–100)<input name="proficiency" type="number" required min={0} max={100} defaultValue={50} className="block bg-background-100 p-3 rounded-lg text-white mt-2" /></label>
      <button disabled={busy} className="bg-primary-600 text-white p-3 rounded-lg hover:bg-primary-500 disabled:opacity-50">{busy ? 'Saving…' : 'Save skill'}</button>
    </form>
    {message && <p role="alert" className="text-red-400">{message}</p>}
    <RequestState loading={loading} error={error} retry={reload} />
    {!loading && !error && <><h2 className="text-lg font-semibold text-white">Your skill library</h2><div className="grid md:grid-cols-3 gap-4">{skills.map(skill => <div key={skill.id} className="glass-card p-5 rounded-xl border border-white/10">
      <h2 className="text-white font-semibold">{skill.name}</h2><p className="text-text-muted my-3">{skill.proficiency}% proficiency</p>
      <progress aria-label={`${skill.name} proficiency`} value={skill.proficiency} max={100} className="skill-proficiency w-full accent-primary-500" />
      <button disabled={busy} className="text-red-400 text-sm mt-4" onClick={async () => {
        setBusy(true); setMessage('');
        try { await apiFetch(`${path}/${encodeURIComponent(skill.name)}`, { method: 'DELETE' }); reload(); }
        catch (err) { setMessage(err instanceof Error ? err.message : 'Unable to remove skill'); }
        finally { setBusy(false); }
      }}>Remove skill</button>
    </div>)}</div></>}
  </div>;
}
