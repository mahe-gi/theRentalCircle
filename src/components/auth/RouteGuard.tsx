'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { ShieldAlert, Lock, ArrowRight, Building2, ShieldCheck, User } from 'lucide-react';
import { useSession } from '@/lib/session';

interface RouteGuardProps {
  children: React.ReactNode;
  allowedRoles: ('admin' | 'owner' | 'renter')[];
  title?: string;
  description?: string;
}

export function RouteGuard({
  children,
  allowedRoles,
  title = 'Access Restricted',
  description = 'This section requires specific permissions for your account type.',
}: RouteGuardProps) {
  const { user, isLoading } = useSession();
  const pathname = usePathname();

  const userRole = user?.role === 'admin' || user?.userType === 'admin' 
    ? 'admin' 
    : user?.userType === 'owner' 
    ? 'owner' 
    : 'renter';

  const isAuthorized = user && allowedRoles.includes(userRole);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-canvas">
        <div className="flex flex-col items-center gap-3">
          <div className="h-6 w-6 border-2 border-cobalt border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-mono text-text-muted">Verifying permissions...</span>
        </div>
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-canvas px-4 py-12">
        <div className="max-w-md w-full rounded-[2px] border border-border bg-white p-8 text-center space-y-6 shadow-sm">
          <div className="mx-auto w-12 h-12 rounded-full bg-cobalt/10 flex items-center justify-center text-cobalt">
            <Lock className="h-6 w-6" />
          </div>
          <div className="space-y-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-cobalt">
              Authentication Required
            </span>
            <h2 className="text-2xl font-black text-midnight tracking-tight">
              Please Sign In
            </h2>
            <p className="text-xs text-text-secondary leading-relaxed">
              You must be signed in to access this portal. Please sign in with your verified account or select a test persona.
            </p>
          </div>

          <div className="pt-2 flex flex-col gap-2.5">
            <Link
              href={"/sign-in?redirect=" + encodeURIComponent(pathname)}
              className="inline-flex items-center justify-center gap-2 rounded-[2px] bg-midnight px-5 py-2.5 text-xs font-bold text-white hover:bg-cobalt transition-colors"
            >
              Sign In to Continue <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-[2px] border border-border bg-white px-5 py-2.5 text-xs font-bold text-midnight hover:bg-surface-muted transition-colors"
            >
              Return to Homepage
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Logged in but not authorized for this specific portal
  if (!isAuthorized) {
    const roleLabel = userRole === 'admin' ? 'Admin / Moderator' : userRole === 'owner' ? 'Property Owner' : 'Renter';
    const targetUrl = userRole === 'admin' ? '/admin/listings' : userRole === 'owner' ? '/owner/listings' : '/homes';
    const targetLabel = userRole === 'admin' ? 'Admin Moderation Desk' : userRole === 'owner' ? 'Owner Property Dashboard' : 'Browse Homes';

    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-canvas px-4 py-12">
        <div className="max-w-md w-full rounded-[2px] border border-tangerine-border bg-white p-8 text-center space-y-6 shadow-sm">
          <div className="mx-auto w-12 h-12 rounded-full bg-tangerine-surface flex items-center justify-center text-tangerine-dark">
            <ShieldAlert className="h-6 w-6 text-tangerine" />
          </div>
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-surface-muted border border-border text-[10px] font-mono font-bold uppercase text-midnight">
              <User className="h-3 w-3 text-text-muted" /> Active Role: {roleLabel}
            </div>
            <h2 className="text-2xl font-black text-midnight tracking-tight">
              {title}
            </h2>
            <p className="text-xs text-text-secondary leading-relaxed">
              {description} This area is restricted to {allowedRoles.map(r => r.toUpperCase()).join(' or ')}.
            </p>
          </div>

          <div className="pt-2 flex flex-col gap-2.5">
            <Link
              href={targetUrl}
              className="inline-flex items-center justify-center gap-2 rounded-[2px] bg-midnight px-5 py-2.5 text-xs font-bold text-white hover:bg-cobalt transition-colors"
            >
              Go to {targetLabel} <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <Link
              href="/sign-in"
              className="inline-flex items-center justify-center rounded-[2px] border border-border bg-white px-5 py-2.5 text-xs font-bold text-text-secondary hover:text-midnight hover:bg-surface-muted transition-colors"
            >
              Switch Account / Role
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
