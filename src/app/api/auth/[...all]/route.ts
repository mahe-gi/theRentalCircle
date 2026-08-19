import { getAuth } from '@/lib/auth';
import type { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const env = (process as any).env;
  const auth = getAuth(env?.DB);
  return auth.handler(req);
}

export async function POST(req: NextRequest) {
  const env = (process as any).env;
  const auth = getAuth(env?.DB);
  return auth.handler(req);
}