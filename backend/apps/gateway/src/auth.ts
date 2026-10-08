import { getSession, type ExpressAuthConfig } from '@auth/express';
import Google from '@auth/express/providers/google';
import { PrismaAdapter } from '@auth/prisma-adapter';
import type { Request } from 'express';
import { prisma } from '@careeros/database';
import { config } from '@careeros/config';

export const authConfig: ExpressAuthConfig = {
  adapter: PrismaAdapter(prisma),
  secret: config.AUTH_SECRET,
  basePath: '/api/auth',
  trustHost: true,
  useSecureCookies: config.NODE_ENV === 'production',
  session: { strategy: 'database', maxAge: 7 * 24 * 60 * 60 },
  providers: config.AUTH_GOOGLE_ID && config.AUTH_GOOGLE_SECRET
    ? [Google({ clientId: config.AUTH_GOOGLE_ID, clientSecret: config.AUTH_GOOGLE_SECRET })] : [],
  pages: { signIn: '/login', error: '/login' },
  callbacks: {
    signIn: ({ account, profile }) => account?.provider === 'google' && profile?.email_verified === true,
    session: ({ session, user }) => ({ expires: session.expires, user: { id: user.id, name: user.name, email: user.email, image: user.image } }),
    redirect: ({ url }) => {
      const origin = new URL(config.APP_URL).origin;
      const target = new URL(url, origin);
      return target.origin === origin ? target.href : `${origin}/dashboard`;
    },
  },
};

export async function studentIdOf(req: Request): Promise<string | undefined> {
  return (await getSession(req, authConfig))?.user?.id;
}
