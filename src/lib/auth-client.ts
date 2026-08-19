import { createAuthClient } from 'better-auth/react';
import { emailOTPClient, inferAdditionalFields } from 'better-auth/client/plugins';
import type { getAuth } from './auth';

export const authClient = createAuthClient({
  baseURL: typeof window !== 'undefined' ? window.location.origin : 'https://therentalcircle.in',
  plugins: [
    emailOTPClient(),
    inferAdditionalFields<ReturnType<typeof getAuth>>(),
  ],
});

export const { signIn, signOut, useSession } = authClient;