import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { generateKeyPairSync, sign } from 'node:crypto';
import type { Request } from 'express';

const { privateKey, publicKey } = generateKeyPairSync('rsa', { modulusLength: 2048 });
const keyServer = createServer((_req, res) => {
  res.setHeader('content-type', 'application/json');
  res.end(JSON.stringify({ keys: [{ ...publicKey.export({ format: 'jwk' }), kid: 'test', alg: 'RS256' }] }));
}).listen(0, '127.0.0.1');
await new Promise<void>(resolve => keyServer.once('listening', resolve));
const keyPort = (keyServer.address() as { port: number }).port;
after(() => new Promise<void>(resolve => keyServer.close(() => resolve())));

function signedToken(expires: number) {
  const header = Buffer.from(JSON.stringify({ alg: 'RS256', kid: 'test' })).toString('base64url');
  const payload = Buffer.from(JSON.stringify({ sub: '00000000-0000-0000-0000-000000000001', exp: expires })).toString('base64url');
  const input = `${header}.${payload}`;
  return `${input}.${sign('RSA-SHA256', Buffer.from(input), privateKey).toString('base64url')}`;
}

Object.assign(process.env, {
  NODE_ENV: 'test', DATABASE_URL: 'postgresql://test:test@127.0.0.1:5432/test',
  INTERNAL_SERVICE_SECRET: 'b'.repeat(64), APP_URL: 'http://localhost:5173',
  NEON_AUTH_URL: 'https://auth.example.test/auth',
  NEON_AUTH_JWKS_URL: `http://127.0.0.1:${keyPort}/jwks`,
  CORS_ORIGINS: 'http://localhost:5173', RATE_LIMIT_MAX: '1000',
});
const { app } = await import('../apps/gateway/src/index');
const { studentIdOf } = await import('../apps/gateway/src/auth');
const { prisma } = await import('../packages/database/src/index');
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

test('signed Neon identity resolves a student; database failures do not become sign-outs', async () => {
  const originalQuery = prisma.$queryRaw;
  const originalFind = prisma.user.findUnique;
  const id = '00000000-0000-0000-0000-000000000001';
  prisma.$queryRaw = (async (sql: TemplateStringsArray) => {
    assert.match(sql.join('?'), /id::text =/);
    return [{ id, email: 'test@example.com', name: 'Test' }];
  }) as typeof prisma.$queryRaw;
  prisma.user.findUnique = (async () => ({ id })) as unknown as typeof prisma.user.findUnique;
  const req = { headers: { authorization: `Bearer ${signedToken(Math.floor(Date.now() / 1000) + 60)}` } } as Request;
  try {
    assert.equal(await studentIdOf(req), id);
    prisma.$queryRaw = (async () => { throw new Error('database unavailable'); }) as typeof prisma.$queryRaw;
    await assert.rejects(studentIdOf(req), /database unavailable/);
    const expired = { headers: { authorization: `Bearer ${signedToken(1)}` } } as Request;
    assert.equal(await studentIdOf(expired), undefined);
    assert.equal(await studentIdOf({ headers: { authorization: 'Bearer malformed' } } as Request), undefined);
  } finally {
    prisma.$queryRaw = originalQuery;
    prisma.user.findUnique = originalFind;
  }
});

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
