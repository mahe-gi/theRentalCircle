import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { getDb } from '@/db';
import * as schema from '@/db/schema';

export function getAuth(d1?: any) {
  const db = d1 ? getDb(d1) : undefined;
  
  return betterAuth({
    baseURL: process.env.BETTER_AUTH_URL || 'https://app.therentalcircle.in',
    basePath: '/api/auth',
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
        clientId: process.env.GOOGLE_CLIENT_ID || 'mock-client-id',
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'mock-client-secret',
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
      cookiePrefix: '__Host-',
      useSecureCookies: true,
      defaultCookieAttributes: {
        secure: true,
        sameSite: 'lax',
        path: '/',
        domain: undefined, // Strictly NO domain attribute per RFC 6265bis for __Host- cookies
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
