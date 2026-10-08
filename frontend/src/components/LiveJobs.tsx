import { useEffect, useMemo, useState } from 'react';
import { ArrowUpRight, RefreshCw } from 'lucide-react';
import type { JobFeed } from '../types/jobs';
import { JOB_BOARDS } from '../data/jobBoards';

export default function LiveJobs({ role }: { role: string }) {
  const [feed, setFeed] = useState<JobFeed | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [version, setVersion] = useState(0);
  const [sort, setSort] = useState('newest');
  const [source, setSource] = useState('all');
  useEffect(() => {
    const controller = new AbortController();
    setFeed(null); setLoading(true); setError('');
    void fetch(`/__demo/jobs?${new URLSearchParams({ role })}`, { signal: controller.signal })
      .then(async response => { if (!response.ok) throw new Error('Unable to fetch jobs. Please retry.'); return response.json() as Promise<JobFeed>; })
      .then(data => { if (!controller.signal.aborted) setFeed(data); })
      .catch(err => { if (!controller.signal.aborted) setError(err instanceof Error ? err.message : 'Unable to fetch jobs.'); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [role, version]);
  const jobs = useMemo(() => (feed?.jobs ?? []).filter(job => source === 'all' || job.source === source).sort((a, b) =>
    sort === 'title' ? a.title.localeCompare(b.title) : sort === 'company' ? a.company.localeCompare(b.company)
      : (Date.parse(b.postedAt ?? '') || 0) - (Date.parse(a.postedAt ?? '') || 0)), [feed, sort, source]);
  return <section className="space-y-5 rounded-2xl border border-primary-400/30 bg-gradient-to-br from-primary-900/20 to-black p-6">
    <div className="flex flex-wrap gap-4 justify-between items-center"><div><h2 className="text-2xl font-bold text-white">Latest fetched opportunities</h2>
      <p className="text-text-muted text-sm mt-2">{role} · Public listings from available sources</p></div>
      <button disabled={loading} onClick={() => setVersion(value => value + 1)} className="inline-flex items-center gap-2 border border-white/15 rounded-lg p-3 text-white disabled:opacity-50"><RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />{loading ? 'Fetching sources…' : 'Refresh jobs'}</button>
    </div>
    {loading && <p role="status" className="text-primary-400">Checking LinkedIn, Indeed, Glassdoor, Wellfound, Naukri, and Foundit…</p>}
    {error && <p role="alert" className="text-red-400">{error}</p>}
    {feed && <>
      <p className="text-xs text-text-muted">Last checked: {new Date(feed.checkedAt).toLocaleString()} · Results cached for 60 seconds. Posting dates come from the source; this is not an exhaustive feed.</p>
      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3">{feed.sources.map(item => <a key={item.name} href={JOB_BOARDS.find(board => board.name === item.name)?.url(role)} target="_blank" rel="noopener noreferrer" title={item.message} className="rounded-lg border border-white/10 p-3 hover:border-primary-400/40">
        <span className="text-white text-sm">{item.name} ↗</span><span className={`block text-xs mt-1 ${item.count ? 'text-primary-400' : 'text-text-muted'}`}>{item.count ? `${item.count} listings fetched` : item.status === 'blocked' ? 'Access blocked · open source' : item.status === 'unavailable' ? 'Unavailable · open source' : 'No matching public listings'}</span>
      </a>)}</div>
      <div className="flex flex-wrap items-center gap-4"><p className="text-text-muted mr-auto">{jobs.length} jobs</p>
        <label className="text-sm text-text-muted">Source <select aria-label="Job source" value={source} onChange={e => setSource(e.target.value)} className="ml-2 bg-background-100 rounded-lg p-2 text-white"><option value="all">All sources</option>{JOB_BOARDS.map(board => <option key={board.name}>{board.name}</option>)}</select></label>
        <label className="text-sm text-text-muted">Sort <select aria-label="Sort jobs" value={sort} onChange={e => setSort(e.target.value)} className="ml-2 bg-background-100 rounded-lg p-2 text-white"><option value="newest">Newest posted</option><option value="title">Role A–Z</option><option value="company">Company A–Z</option></select></label>
      </div>
      {!jobs.length && <p className="text-text-muted">No listings available for this selection. Try another role or open a source above.</p>}
      <div className="grid md:grid-cols-2 gap-4">{jobs.map(job => <article key={job.id} className="rounded-xl border border-white/10 bg-white/[0.02] p-5 space-y-3">
        <div className="flex justify-between gap-3 text-xs text-text-muted"><span>{job.source}</span><span>{job.postedAt ? `Posted ${new Date(job.postedAt).toLocaleDateString()}` : 'Posting date unavailable'}</span></div>
        <h3 className="text-lg font-semibold text-white">{job.title}</h3><p className="text-text-muted">{job.company}</p><p className="text-sm text-text-muted">{job.location}</p>
        <a href={job.url} target="_blank" rel="noopener noreferrer" className="inline-flex gap-2 items-center text-primary-400">Read role details <ArrowUpRight className="w-4 h-4" /></a>
      </article>)}</div>
    </>}
  </section>;
}
