import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { getDb } from '@/db';
import * as schema from '@/db/schema';

export function getAuth(d1?: any, requestOrigin?: string, env?: any) {
  const db = d1 ? getDb(d1) : undefined;
  const baseURL = env?.BETTER_AUTH_URL || process.env.BETTER_AUTH_URL || requestOrigin || 'https://therentalcircle.in';
  const secret = env?.BETTER_AUTH_SECRET || process.env.BETTER_AUTH_SECRET || '381671bd7d7e64c78fa9955bfaf55ad1dd31340c80a09aaecaabbefcc5fe09b7';
  const googleClientId = env?.GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID || 'mock-google-client-id';
  const googleClientSecret = env?.GOOGLE_CLIENT_SECRET || process.env.GOOGLE_CLIENT_SECRET || 'mock-google-client-secret';

  return betterAuth({
    secret,
    baseURL,
    basePath: '/api/auth',
    trustedOrigins: [
      'https://therentalcircle.in',
      'https://www.therentalcircle.in',
      'https://therentalcircle.chmahesh997.workers.dev',
      'http://localhost:3000',
      ...(requestOrigin ? [requestOrigin] : []),
    ],
    database: db ? drizzleAdapter(db, {
      provider: 'sqlite',
      schema: {
        user: schema.user,
        session: schema.session,
        account: schema.account,
        verification: schema.verification,
      },
    }) : undefined,
    socialProviders: {
      google: {
        clientId: googleClientId,
        clientSecret: googleClientSecret,
      },
    },
    emailAndPassword: {
      enabled: false,
    },
    emailOTP: {
      enabled: true,
      async sendVerificationOTP({ email, otp, type }: { email: string; otp: string; type: string }) {
        console.log(`[Email OTP] Sending ${type} OTP to ${email}: ${otp}`);
      },
    },
    advanced: {
      useSecureCookies: true,
      defaultCookieAttributes: {
        secure: true,
        sameSite: 'lax',
        path: '/',
      },
    },
    user: {
      additionalFields: {
        role: { type: 'string', defaultValue: 'user' },
        phoneHash: { type: 'string', required: false },
        encryptedPhone: { type: 'string', required: false },
        phoneVerified: { type: 'boolean', defaultValue: false },
        phoneConfirmedAt: { type: 'date', required: false },
        phoneConfirmedBy: { type: 'string', required: false },
        phoneConfirmationMethod: { type: 'string', required: false },
        isBanned: { type: 'boolean', defaultValue: false },
      },
    },
  });
}
