import { useState, type FormEvent } from 'react';
import { useAuth } from '../auth/AuthContext';
import { useApi } from '../lib/useApi';
import { apiFetch } from '../lib/api';
import type { ProfileDTO } from '../lib/models';
import RequestState from '../components/RequestState';

export default function ProfilePage() {
  const { user, refresh } = useAuth();
  const path = `/api/profiles/${encodeURIComponent(user!.id)}`;
  const { data, loading, error, reload } = useApi<ProfileDTO>(path);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setSaving(true); setMessage('');
    const form = new FormData(event.currentTarget);
    try {
      await apiFetch(path, { method: 'PATCH', body: JSON.stringify({
        name: form.get('name'), degree: form.get('degree') || null, university: form.get('university') || null,
        graduationYear: form.get('graduationYear') ? Number(form.get('graduationYear')) : null,
        cgpa: form.get('cgpa') ? Number(form.get('cgpa')) : null,
      }) });
      setMessage('Profile saved.'); reload(); await refresh();
    } catch (err) { setMessage(err instanceof Error ? err.message : 'Unable to save'); }
    finally { setSaving(false); }
  }
  return <div className="space-y-6 max-w-2xl"><h1 className="text-3xl font-bold text-white">My profile</h1>
    <RequestState loading={loading} error={error} retry={reload} />
    {message && <p role="status" className="text-primary-400">{message}</p>}
    {data && !loading && !error && <form onSubmit={save} className="glass-card p-6 rounded-xl space-y-5">
      <p className="text-text-muted">Google account: {data.student.email}</p>
      {(['name', 'degree', 'university', 'graduationYear', 'cgpa'] as const).map(field => <label key={field} className="block text-text-muted">
        {{ name: 'Full name', degree: 'Degree', university: 'University', graduationYear: 'Graduation year', cgpa: 'CGPA (0–10)' }[field]}
        <input name={field} required={field === 'name'} type={field === 'cgpa' || field === 'graduationYear' ? 'number' : 'text'}
          min={field === 'cgpa' ? 0 : field === 'graduationYear' ? 2000 : undefined} max={field === 'cgpa' ? 10 : field === 'graduationYear' ? 2100 : undefined}
          step={field === 'cgpa' ? '0.01' : undefined} maxLength={200} defaultValue={data.student[field] ?? ''}
          className="block mt-2 w-full bg-background-100 rounded-lg border border-white/10 p-3 text-white" />
      </label>)}
      <button disabled={saving} className="bg-white text-black rounded-lg px-5 py-3 disabled:opacity-50">{saving ? 'Saving…' : 'Save profile'}</button>
    </form>}
  </div>;
}
