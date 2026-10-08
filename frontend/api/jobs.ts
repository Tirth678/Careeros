import type { IncomingMessage, ServerResponse } from 'node:http';
import { fetchFeed } from '../server/jobs.ts';
import { ROLE_DETAILS } from '../src/data/jobBoards.ts';

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  res.setHeader('Content-Type', 'application/json');
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    res.statusCode = 405;
    res.end(JSON.stringify({ error: 'GET required' }));
    return;
  }
  const role = new URL(req.url ?? '/', 'https://localhost').searchParams.get('role') ?? 'AI Engineer';
  if (!Object.hasOwn(ROLE_DETAILS, role)) {
    res.statusCode = 400;
    res.end(JSON.stringify({ error: 'Select a supported role' }));
    return;
  }
  try {
    const feed = await fetchFeed(role);
    res.setHeader('Cache-Control', 'public, s-maxage=60');
    res.end(JSON.stringify(feed));
  } catch {
    res.statusCode = 502;
    res.end(JSON.stringify({ error: 'Job sources unavailable. Please retry.' }));
  }
}
