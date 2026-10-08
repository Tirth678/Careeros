import { prisma } from "@careeros/database";

/**
 * Neon Auth owns identity for the whole platform (schema `neon_auth` in the
 * same Neon database). The browser talks to Neon Auth directly — over there it
 * gets a `__Secure-neon-auth.session_token` cookie plus the raw session token
 * in the JSON body. The browser then presents that token to this gateway as
 * `Authorization: Bearer <token>` and we confirm it against the row Neon Auth
 * wrote. Nothing downstream trusts a client-supplied `x-student-id`.
 */
export type AuthedUser = {
  neonUserId: string;
  email: string;
  name: string;
};

type SessionRow = {
  userId: string;
  email: string;
  name: string;
};

function bearer(headers: Headers | any): string | null {
  const raw = headers instanceof Headers ? headers.get("authorization") : headers?.["authorization"];
  if (!raw) return null;
  const value = Array.isArray(raw) ? raw[0] : raw;
  const match = /^Bearer\s+(.+)$/i.exec(value.trim());
  return match?.[1]?.trim() || null;
}

async function resolveNeonSession(token: string): Promise<AuthedUser | null> {
  const rows = await prisma.$queryRaw<SessionRow[]>`
    SELECT s."userId", u.email, u.name
    FROM neon_auth.session s
    JOIN neon_auth."user" u ON u.id = s."userId"
    WHERE s.token = ${token}
      AND s."expiresAt" > now()
      AND COALESCE(u.banned, false) = false
    LIMIT 1
  `;
  const row = rows[0];
  if (!row) return null;
  return { neonUserId: row.userId, email: row.email, name: row.name };
}

/**
 * Map the Neon Auth identity onto our domain `students` row. Neon Auth issues
 * uuids, so we adopt that uuid as the primary key on first sight; a student
 * that already exists (for example one created before Neon Auth was wired up)
 * is matched by email so nobody ends up with two profiles.
 */
async function ensureStudent(user: AuthedUser): Promise<string> {
  const byId = await prisma.user.findUnique({ where: { id: user.neonUserId } });
  if (byId) return byId.id;

  const byEmail = await prisma.user.findUnique({ where: { email: user.email } });
  if (byEmail) return byEmail.id;

  const created = await prisma.user.create({
    data: { id: user.neonUserId, name: user.name, email: user.email },
  });
  return created.id;
}

export async function studentIdOf(headers: Headers): Promise<string | undefined> {
  const token = bearer(headers);
  if (!token) return undefined;
  const user = await resolveNeonSession(token);
  if (!user) return undefined;
  return ensureStudent(user);
}

export async function authedUserOf(headers: Headers): Promise<AuthedUser | null> {
  const token = bearer(headers);
  if (!token) return null;
  return resolveNeonSession(token);
}
