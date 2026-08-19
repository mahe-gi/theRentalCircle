import { getAuth } from '@/lib/auth';
import type { NextRequest } from 'next/server';

async function resolveCloudflareEnv() {
  try {
    const { getCloudflareContext } = await import('@opennextjs/cloudflare');
    const { env } = await getCloudflareContext({ async: true });
    return env as any;
  } catch {
    return (process as any).env || {};
  }
}

export async function GET(req: NextRequest) {
  const env = await resolveCloudflareEnv();
  const origin = req.nextUrl.origin;
  const auth = getAuth(env?.DB, origin, env);
  return auth.handler(req);
}

export async function POST(req: NextRequest) {
  const env = await resolveCloudflareEnv();
  const origin = req.nextUrl.origin;
  const auth = getAuth(env?.DB, origin, env);
  return auth.handler(req);
}