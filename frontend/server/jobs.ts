import { load } from 'cheerio';
import type { Plugin } from 'vite';
import { JOB_BOARDS, ROLE_DETAILS } from '../src/data/jobBoards.ts';
import type { JobFeed, LiveJob } from '../src/types/jobs.ts';

const cache = new Map<string, { expires: number; value: Promise<JobFeed> }>();
const clean = (text: string) => text.replace(/\s+/g, ' ').trim();
const date = (value: unknown): string | null => {
  if (typeof value !== 'string' && typeof value !== 'number') return null;
  const time = new Date(typeof value === 'number' ? value * 1000 : value);
  return Number.isFinite(time.getTime()) ? time.toISOString() : null;
};

export function parseJobs(name: string, html: string, role: string): LiveJob[] {
  const $ = load(html);
  const jobs: LiveJob[] = [];
  if (name === 'LinkedIn') {
    $('.base-search-card').each((_index, element) => {
      const card = $(element);
      const href = card.find('a.base-card__full-link').attr('href');
      if (!href) return;
      const url = new URL(href);
      if (url.protocol !== 'https:' || url.hostname !== 'www.linkedin.com') return;
      url.search = '';
      const title = clean(card.find('.base-search-card__title').text());
      if (!title) return;
      jobs.push({ id: url.href, url: url.href, title, source: name,
        company: clean(card.find('.base-search-card__subtitle').text()) || 'Not specified',
        location: clean(card.find('.job-search-card__location').text()) || 'Not specified',
        postedAt: date(card.find('time').attr('datetime')) });
    });
  } else if (name === 'Wellfound') {
    const script = $('#__NEXT_DATA__').text();
    if (!script) return jobs;
    const state = JSON.parse(script).props?.pageProps?.apolloState?.data ?? {};
    const terms: Record<string, RegExp> = {
      'AI Engineer': /\bAI\b|artificial intelligence|machine learning|\bML\b/i,
      'ML Engineer': /machine learning|\bML\b|\bAI\b|MLOps/i,
      'Full Stack Developer': /full.?stack|frontend|backend|software engineer/i,
      'Data Scientist': /data scien|data analy/i,
      'Cloud Engineer': /cloud|devops|infrastructure|platform engineer|\bSRE\b/i,
    };
    for (const raw of Object.values(state)) {
      const job = raw as Record<string, any>;
      if (job.__typename !== 'JobListing' || typeof job.title !== 'string' || !terms[role]?.test(job.title)) continue;
      // Only return listing links actually present in the public page.
      const path = `/jobs/${job.id}-${job.slug}`;
      if (!$('a').toArray().some(anchor => $(anchor).attr('href') === path)) continue;
      const employer = state[job.startup?.__ref];
      jobs.push({ id: `wellfound-${job.id}`, title: clean(job.title), source: name,
        company: typeof employer?.name === 'string' ? clean(employer.name) : 'Not specified',
        location: [...(job.remote ? ['Remote'] : []), ...(job.locationNames ?? [])].join(' · ') || 'Not specified',
        postedAt: date(job.liveStartAt), url: `https://wellfound.com${path}` });
    }
  }
  return jobs.slice(0, 30);
}

async function fetchFeed(role: string): Promise<JobFeed> {
  const results = await Promise.all(JOB_BOARDS.map(async board => {
    const url = board.name === 'LinkedIn'
      ? `https://www.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/search?${new URLSearchParams({ keywords: role, sortBy: 'DD', start: '0' })}`
      : board.url(role);
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(10000) });
      if (!response.ok) return { jobs: [] as LiveJob[], source: {
        name: board.name, status: (response.status === 403 || response.status === 429 ? 'blocked' : 'unavailable') as 'blocked' | 'unavailable',
        count: 0, message: `Public fetch unavailable (HTTP ${response.status}). Use the source link.`,
      } };
      const jobs = parseJobs(board.name, await response.text(), role);
      return { jobs, source: { name: board.name, status: (board.name === 'LinkedIn' || board.name === 'Wellfound' ? 'available' : 'unavailable') as 'available' | 'unavailable', count: jobs.length,
        message: board.name === 'Wellfound' ? 'Matching public featured jobs; not a complete search.'
          : board.name === 'LinkedIn' ? 'Public search results; sorted by supplied posting date.'
          : 'No readable public listings returned. Use the source link.',
      } };
    } catch {
      return { jobs: [] as LiveJob[], source: { name: board.name, status: 'unavailable' as const, count: 0, message: 'Could not retrieve listings. Use the source link.' } };
    }
  }));
  const jobs = [...new Map(results.flatMap(result => result.jobs).map(job => [job.url, job])).values()];
  jobs.sort((a, b) => (Date.parse(b.postedAt ?? '') || 0) - (Date.parse(a.postedAt ?? '') || 0));
  return { checkedAt: new Date().toISOString(), jobs, sources: results.map(result => result.source) };
}

// Local MVP endpoint; no credentials, database writes, or production auth changes.
export function liveJobsPlugin(): Plugin {
  return { name: 'live-mvp-jobs', configureServer(server) {
    server.middlewares.use('/__demo/jobs', async (req, res) => {
      res.setHeader('content-type', 'application/json');
      res.setHeader('cache-control', 'no-store');
      if (req.method !== 'GET') { res.statusCode = 405; res.end(JSON.stringify({ error: 'GET required' })); return; }
      const role = new URL(req.url ?? '/', 'http://localhost').searchParams.get('role') ?? 'AI Engineer';
      if (!Object.hasOwn(ROLE_DETAILS, role)) { res.statusCode = 400; res.end(JSON.stringify({ error: 'Select a supported role' })); return; }
      let entry = cache.get(role);
      if (!entry || entry.expires < Date.now()) {
        entry = { expires: Date.now() + 60000, value: fetchFeed(role) };
        cache.set(role, entry);
      }
      try { res.end(JSON.stringify(await entry.value)); }
      catch { res.statusCode = 502; res.end(JSON.stringify({ error: 'Job sources are unavailable. Please retry.' })); }
    });
  } };
}
