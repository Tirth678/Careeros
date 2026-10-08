import { test, after } from 'node:test';
import assert from 'node:assert/strict';

Object.assign(process.env, {
  NODE_ENV: 'test', DATABASE_URL: 'postgresql://test:test@127.0.0.1:5432/test',
  AUTH_SECRET: 'a'.repeat(64), INTERNAL_SERVICE_SECRET: 'b'.repeat(64),
  AUTH_GOOGLE_ID: '', AUTH_GOOGLE_SECRET: '', APP_URL: 'http://localhost:5173',
  CORS_ORIGINS: 'http://localhost:5173', RATE_LIMIT_MAX: '1000',
});
const { app } = await import('../apps/gateway/src/index');
const { authConfig } = await import('../apps/gateway/src/auth');
const { resolveStudentId, createServiceApp } = await import('../packages/http/src/index');
const { resolveTarget, forward } = await import('../apps/gateway/src/proxy');
const { roadmapService } = await import('../apps/career-service/src/services/roadmap');
const { roadmapRepository } = await import('../apps/career-service/src/repositories/roadmap');
const { projectService } = await import('../apps/profile-service/src/services/project');
const { projectRepository } = await import('../apps/profile-service/src/repositories/project');
const server = app.listen(0, '127.0.0.1');
await new Promise<void>(resolve => server.once('listening', resolve));
const address = server.address() as { port: number };
const base = `http://127.0.0.1:${address.port}`;
after(() => new Promise<void>(resolve => server.close(() => resolve())));

test('API rejects anonymous and spoofed identity requests, with CORS headers', async () => {
  for (const path of ['/api/dashboard', '/api/profiles/victim', '/api/roadmaps/private']) {
    const response = await fetch(base + path, { headers: { origin: 'http://localhost:5173', 'x-student-id': 'victim' } });
    assert.equal(response.status, 401);
    assert.equal(response.headers.get('access-control-allow-origin'), 'http://localhost:5173');
  }
});
test('unsafe requests require a trusted browser origin', async () => {
  for (const origin of ['', 'https://attacker.example']) {
    const response = await fetch(base + '/api/roadmaps/generate', { method: 'POST', headers: origin ? { origin } : {} });
    assert.equal(response.status, 403);
  }
});
test('Auth.js session and CSRF endpoints work on Express 5', async () => {
  assert.equal(await fetch(base + '/api/auth/session').then(r => r.json()), null);
  const response = await fetch(base + '/api/auth/csrf');
  assert.equal(response.status, 200);
  assert.ok((await response.json()).csrfToken);
  assert.match(response.headers.get('set-cookie') ?? '', /HttpOnly/i);
});
test('Auth.js reads a database session and sign-out revokes it', async () => {
  const adapter = authConfig.adapter!;
  const originalGet = adapter.getSessionAndUser;
  const originalDelete = adapter.deleteSession;
  let active = true;
  const user = { id: 'student-1', name: 'Test student', email: 'test@example.com', emailVerified: new Date() };
  adapter.getSessionAndUser = async token => token === 'test-session' && active ? {
    user, session: { sessionToken: token, userId: user.id, expires: new Date(Date.now() + 7 * 86400_000) },
  } : null;
  adapter.deleteSession = async () => { active = false; };
  try {
    const cookie = 'authjs.session-token=test-session';
    const session = await fetch(base + '/api/auth/session', { headers: { cookie } }).then(r => r.json());
    assert.equal(session.user.id, user.id);
    assert.equal(session.sessionToken, undefined);
    const csrf = await fetch(base + '/api/auth/csrf');
    const csrfCookies = csrf.headers.getSetCookie().map(value => value.split(';')[0]).join('; ');
    const { csrfToken } = await csrf.json();
    const result = await fetch(base + '/api/auth/signout', {
      method: 'POST', headers: { origin: 'http://localhost:5173', cookie: `${cookie}; ${csrfCookies}`, 'content-type': 'application/x-www-form-urlencoded', 'X-Auth-Return-Redirect': '1' },
      body: new URLSearchParams({ csrfToken, callbackUrl: 'http://localhost:5173/login' }),
    });
    assert.equal(result.status, 200); assert.equal(active, false);
    assert.equal(await fetch(base + '/api/auth/session', { headers: { cookie } }).then(r => r.json()), null);
  } finally { adapter.getSessionAndUser = originalGet; adapter.deleteSession = originalDelete; }
});
test('student identity cannot come from a client body or mismatched path', () => {
  assert.throws(() => resolveStudentId({ headers: {}, params: { studentId: 'victim' }, body: {}, query: {} }));
  assert.throws(() => resolveStudentId({ headers: { 'x-student-id': 'self' }, params: { studentId: 'victim' }, body: {}, query: {} }));
});
test('proxy rejects internal paths and traversal, and strips forged identity', async () => {
  for (const path of ['internal/students/x', 'profiles/%2e%2e/internal', 'profiles/%2f..%2finternal', 'profiles/%zz']) assert.equal(resolveTarget(path), null);
  const original = globalThis.fetch;
  globalThis.fetch = async (_input, init) => {
    const headers = new Headers(init?.headers);
    assert.equal(headers.get('x-student-id'), 'self');
    assert.equal(headers.get('x-service-secret'), 'b'.repeat(64));
    assert.equal(headers.get('cookie'), null);
    assert.equal(headers.get('authorization'), null);
    return new Response('{}');
  };
  try { await forward({ baseUrl: 'http://localhost', path: 'profiles/self', search: '', method: 'GET', body: null, studentId: 'self', headers: new Headers({ 'x-student-id': 'victim', 'x-service-secret': 'forged', cookie: 'secret', authorization: 'secret' }) }); }
  finally { globalThis.fetch = original; }
});
test('internal services reject direct callers', async () => {
  const service = createServiceApp({ name: 'profile-test' });
  service.get('/private', (_req, res) => res.json({ ok: true }));
  const local = service.listen(0, '127.0.0.1');
  await new Promise<void>(resolve => local.once('listening', resolve));
  const url = `http://127.0.0.1:${(local.address() as { port: number }).port}/private`;
  try {
    assert.equal((await fetch(url)).status, 401);
    assert.equal((await fetch(url, { headers: { 'x-service-secret': 'b'.repeat(64) } })).status, 200);
  } finally { await new Promise<void>(resolve => local.close(() => resolve())); }
});
test('private roadmaps and projects reject another owner', async () => {
  const oldRoadmap = roadmapRepository.findById;
  const oldProject = projectRepository.findById;
  roadmapRepository.findById = async () => ({ studentId: 'victim' }) as never;
  projectRepository.findById = async () => ({ studentId: 'victim' }) as never;
  try {
    await assert.rejects(roadmapService.get('private', 'attacker'), /does not exist/);
    await assert.rejects(projectService.get('private', 'attacker'), /does not exist/);
  } finally { roadmapRepository.findById = oldRoadmap; projectRepository.findById = oldProject; }
});
