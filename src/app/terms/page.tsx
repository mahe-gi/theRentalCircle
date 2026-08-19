import React from 'react';
import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white text-midnight font-sans antialiased selection:bg-cobalt selection:text-white">
      {/* Top Header */}
      <div className="border-b border-border bg-white py-16 lg:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 space-y-4 text-left">
          <div className="inline-flex items-center gap-2 border border-slate-200 bg-surface-subtle px-2.5 py-1 text-[11px] font-mono font-bold uppercase tracking-wider text-cobalt rounded-[2px]">
            <span className="h-1.5 w-1.5 rounded-full bg-citrus"></span>
            Legal & Compliance
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-midnight tracking-tight leading-[1.04]">
            Terms of Service
          </h1>
          <p className="text-xs text-slate-500 font-mono">
            Last updated: August 19, 2026 • Hyderabad Pilot Terms
          </p>
        </div>
      </div>

      {/* Main Reading Column */}
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16 space-y-10 text-[15px] text-slate-600 leading-relaxed text-left font-normal">
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-midnight tracking-tight">1. Platform Role & Limitations</h2>
          <p>
            The Rental Circle operates as an introduction and discovery platform for residential leasing in Hyderabad. We perform documented baseline checks on listing contacts and connection records prior to publication. However, platform review does not constitute legal title certification, tenant background checking, or a guarantee of tenancy performance.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-midnight tracking-tight">2. Direct Tenancy & Inspection Responsibility</h2>
          <p>
            Prospective tenants and property owners are solely responsible for conducting physical in-person property inspections, negotiating lease terms, executing formal tenancy agreements, and verifying identity documents prior to monetary transactions.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-midnight tracking-tight">3. Prohibited Conduct</h2>
          <p>
            Users are strictly prohibited from submitting misleading rental pricing, misrepresenting broker affiliation as direct ownership, demanding advance token payments prior to physical property inspection, or harvesting contact details for unsolicited marketing.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-midnight tracking-tight">4. Termination & Moderation</h2>
          <p>
            The Rental Circle reserves the right to suspend or remove listings and accounts that violate these terms, fail availability confirmation cycles, or receive verified fraud reports.
          </p>
        </section>
      </div>
    </div>
  );
}
