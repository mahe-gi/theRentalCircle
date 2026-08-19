import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export interface RouteResolution {
  type: 'redirect' | 'allow' | 'block';
  location?: string;
  statusCode?: number;
}

export function resolveHostRouting(hostname: string, pathname: string): RouteResolution {
  const host = hostname.toLowerCase().split(':')[0]; // strip port

  // 1. WWW redirect to Apex (Permanent 301)
  if (host === 'www.therentalcircle.in') {
    return {
      type: 'redirect',
      location: `https://therentalcircle.in${pathname}`,
      statusCode: 301,
    };
  }

  // 2. Media domain: Only allowed for image asset requests or health
  if (host === 'media.therentalcircle.in') {
    if (pathname.startsWith('/api/') || pathname === '/' || pathname === '/favicon.ico') {
      return { type: 'allow' };
    }
    // Block non-media page loads on media domain
    return {
      type: 'redirect',
      location: 'https://therentalcircle.in',
      statusCode: 302,
    };
  }

  // 3. Marketing Apex: therentalcircle.in
  if (host === 'therentalcircle.in') {
    // If accessing auth, app-specific dashboard/admin routes directly, redirect to app domain
    const appOnlyRoutes = ['/sign-in', '/owner', '/requests', '/admin'];
    if (appOnlyRoutes.some(route => pathname.startsWith(route))) {
      return {
        type: 'redirect',
        location: `https://app.therentalcircle.in${pathname}`,
        statusCode: 307,
      };
    }
    return { type: 'allow' };
  }

  // 4. App domain: app.therentalcircle.in
  if (host === 'app.therentalcircle.in') {
    return { type: 'allow' };
  }

  // 5. Development & Preview environments (localhost, workers.dev, 127.0.0.1)
  return { type: 'allow' };
}

export function middleware(req: NextRequest) {
  const hostname = req.headers.get('host') || req.nextUrl.hostname;
  const pathname = req.nextUrl.pathname;

  const resolution = resolveHostRouting(hostname, pathname);

  if (resolution.type === 'redirect' && resolution.location) {
    return NextResponse.redirect(new URL(resolution.location), resolution.statusCode || 307);
  }

  if (resolution.type === 'block') {
    return new NextResponse('Forbidden', { status: 403 });
  }

  // Security headers injection
  const response = NextResponse.next();
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
