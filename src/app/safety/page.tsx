import React from 'react';
import Link from 'next/link';
import { AlertTriangle, ShieldCheck, CheckCircle2, Building2, Flag, Lock, Check } from 'lucide-react';

export default function SafetyPage() {
  return (
    <div className="min-h-screen bg-white text-midnight font-sans antialiased selection:bg-cobalt selection:text-white">
      {/* Hero Section */}
      <section className="border-b border-border bg-white py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 max-w-3xl text-left space-y-4">
          <div className="inline-flex items-center gap-2 border border-border bg-surface-subtle px-2.5 py-1 text-[11px] font-mono font-bold uppercase tracking-wider text-cobalt rounded-[2px]">
            <span className="h-1.5 w-1.5 rounded-full bg-citrus"></span>
            Trust & Safety Framework
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-midnight leading-[1.04]">
            What we check, and what you should confirm yourself.
          </h1>
          <p className="text-base text-text-secondary leading-relaxed font-normal">
            We establish baseline documentation and contact confirmation to minimize ambiguity. Clear boundaries empower you to inspect safely.
          </p>
        </div>
      </section>

      {/* Primary Safety Warning Banner (Tangerine) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="rounded-[2px] border border-tangerine-border bg-tangerine-surface p-8 text-midnight flex flex-col sm:flex-row items-start sm:items-center gap-6 shadow-sm text-left">
          <div className="p-3 bg-tangerine text-white rounded-[2px] shrink-0">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div className="space-y-1 text-sm">
            <h3 className="font-bold text-tangerine-dark text-base">
              Essential Safety Rule: Never pay advance deposits online
            </h3>
            <p className="text-text-secondary leading-relaxed font-normal">
              Never transfer a token or security deposit before visiting the property in person and meeting the owner or authorized representative.
            </p>
          </div>
        </div>
      </section>

      {/* Verification Scope Comparison Ledger */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 border border-border divide-y md:divide-y-0 md:divide-x divide-border bg-white rounded-[2px] shadow-sm text-left">
          <div className="p-8 sm:p-10 space-y-5 bg-verified-surface">
            <h3 className="text-sm font-bold text-verified uppercase tracking-wider flex items-center gap-2.5 font-mono">
              <CheckCircle2 className="h-5 w-5 shrink-0" /> What The Rental Circle Checks
            </h3>
            <ul className="space-y-3.5 text-sm text-verified font-medium">
              <li className="flex items-start gap-3">
                <Check className="h-4 w-4 shrink-0 mt-0.5 text-verified" />
                <span>Listing contact confirmed via founder phone conversation</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-4 w-4 shrink-0 mt-0.5 text-verified" />
                <span>Property connection evidence reviewed (electricity service record verified against locality)</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-4 w-4 shrink-0 mt-0.5 text-verified" />
                <span>Fixed monthly rent, security deposit, and lock-in period declared</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-4 w-4 shrink-0 mt-0.5 text-verified" />
                <span>Photographs reviewed for room-by-room consistency</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-4 w-4 shrink-0 mt-0.5 text-verified" />
                <span>Availability confirmed directly with listing contact</span>
              </li>
            </ul>
          </div>

          <div className="p-8 sm:p-10 space-y-5 bg-white">
            <h3 className="text-sm font-bold text-midnight uppercase tracking-wider flex items-center gap-2.5 font-mono">
              <Building2 className="h-5 w-5 text-text-faint shrink-0" /> What Renters Must Confirm
            </h3>
            <ul className="space-y-3.5 text-sm text-text-secondary font-normal">
              <li className="flex items-start gap-3">
                <span className="text-text-faint font-mono font-bold">-</span>
                <span>Physical condition of appliances, water supply, and electrical fixtures</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-text-faint font-mono font-bold">-</span>
                <span>Neighborhood safety, commute convenience, and ambient noise levels</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-text-faint font-mono font-bold">-</span>
                <span>Society bylaws, maintenance dues, and parking allocation</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-text-faint font-mono font-bold">-</span>
                <span>Tenancy agreement execution and physical key handover</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-text-faint font-mono font-bold">-</span>
                <span>In-person meeting with property owner or authorized representative</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Reporting Suspicious Activity */}
      <section className="border-t border-border bg-surface-subtle py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-6 text-left">
          <span className="text-[11px] font-bold uppercase tracking-widest text-cobalt font-mono">Community Integrity</span>
          <h2 className="text-2xl sm:text-3xl font-black text-midnight tracking-tight mt-1">
            Reporting Suspicious Activity
          </h2>
          <p className="text-sm text-text-secondary leading-relaxed font-normal">
            If you encounter inaccurate rental pricing, unannounced broker representation, or any party requesting online token payments prior to physical viewing, report it immediately to our moderation team at{' '}
            <a href="mailto:grievance@therentalcircle.in" className="text-cobalt font-bold underline decoration-border hover:decoration-cobalt">
              grievance@therentalcircle.in
            </a>
            .
          </p>
        </div>
      </section>
    </div>
  );
}
