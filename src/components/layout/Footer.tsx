import React from 'react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-border bg-white text-midnight py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-border pb-8">
          <div className="flex items-center gap-3">
            <img
              src="/the-rental-circle-logo-mark-black.svg"
              alt="The Rental Circle Logo"
              className="h-5 w-5"
              width={20}
              height={20}
            />
            <span className="text-sm font-black tracking-tight text-midnight uppercase">
              The Rental Circle
            </span>
          </div>

          <nav className="flex flex-wrap items-center gap-x-8 gap-y-2 text-xs font-semibold text-text-secondary">
            <Link href="/homes" className="hover:text-midnight transition-colors">Browse Homes</Link>
            <Link href="/how-it-works" className="hover:text-midnight transition-colors">How It Works</Link>
            <Link href="/safety" className="hover:text-midnight transition-colors">Trust & Safety</Link>
            <Link href="/privacy" className="hover:text-midnight transition-colors">Privacy Notice</Link>
            <Link href="/terms" className="hover:text-midnight transition-colors">Terms of Service</Link>
            <Link href="/grievance" className="hover:text-midnight transition-colors">Grievance Redressal</Link>
          </nav>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-text-muted font-normal">
          <p>© 2026 The Rental Circle. Residential leasing infrastructure for Hyderabad.</p>
          <p className="text-[11px] font-mono text-text-muted">
            Grievance Officer: grievance@therentalcircle.in • Hyderabad, Telangana
          </p>
        </div>
      </div>
    </footer>
  );
}
