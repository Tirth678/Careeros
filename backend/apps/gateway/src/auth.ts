import type { Request } from 'express';
import { createRemoteJWKSet, jwtVerify, errors } from 'jose';
import { prisma } from '@careeros/database';
import { config } from '@careeros/config';

const jwks = createRemoteJWKSet(new URL(config.NEON_AUTH_JWKS_URL));

type NeonUser = { id: string; email: string; name: string };

function bearer(req: Request): string | null {
  const raw = req.headers.authorization;
  const value = Array.isArray(raw) ? raw[0] : raw;
  const match = value ? /^Bearer\s+(.+)$/i.exec(value) : null;
  return match?.[1]?.trim() || null;
}

async function neonUser(userId: string): Promise<NeonUser | null> {
  const rows = await prisma.$queryRaw<NeonUser[]>`
    SELECT id, email, name
    FROM neon_auth."user"
    WHERE id::text = ${userId}
      AND COALESCE(banned, false) = false
    LIMIT 1
  `;
  return rows[0] ?? null;
}

async function ensureStudent(user: NeonUser): Promise<string> {
  const byId = await prisma.user.findUnique({ where: { id: user.id } });
  if (byId) return byId.id;

  const byEmail = await prisma.user.findUnique({ where: { email: user.email } });
  if (byEmail) return byEmail.id;

  return (await prisma.user.create({ data: { id: user.id, name: user.name, email: user.email } })).id;
}

/** Verify Neon Auth's signed JWT before mapping it to a CareerOS student. */
export async function studentIdOf(req: Request): Promise<string | undefined> {
  const token = bearer(req);
  if (!token) return undefined;
  let subject: string;
  try {
    const { payload } = await jwtVerify(token, jwks, { requiredClaims: ['sub', 'exp'] });
    if (typeof payload.sub !== 'string' || !payload.sub) return undefined;
    subject = payload.sub;
  } catch (error) {
    if (error instanceof errors.JWTExpired || error instanceof errors.JWTInvalid ||
        error instanceof errors.JWSInvalid || error instanceof errors.JWTClaimValidationFailed ||
        error instanceof errors.JWSSignatureVerificationFailed || error instanceof errors.JWKSNoMatchingKey) {
      return undefined;
    }
    throw error;
  }
  // Database and key-service failures must surface as server errors, not sign-outs.
  const user = await neonUser(subject);
  return user ? ensureStudent(user) : undefined;
}
