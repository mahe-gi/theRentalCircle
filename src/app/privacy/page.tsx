import React from 'react';
import Link from 'next/link';

export default function PrivacyPage() {
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
            Privacy Notice
          </h1>
          <p className="text-xs text-slate-500 font-mono">
            Last updated: August 19, 2026 • Digital Personal Data Protection Act 2023 (DPDP) Compliant
          </p>
        </div>
      </div>

      {/* Main Reading Column (720–800px) */}
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16 space-y-10 text-[15px] text-slate-600 leading-relaxed text-left font-normal">
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-midnight tracking-tight">1. Purpose of Processing</h2>
          <p>
            The Rental Circle processes personal data strictly for facilitating residential rental introductions between prospective tenants and property owners or authorized representatives in Hyderabad, India.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-midnight tracking-tight">2. Two-Sided Contact Release Architecture</h2>
          <p>
            Phone numbers are encrypted at rest and are never published on public web pages or search engines. Contact details are released directly to both parties only after the listing contact explicitly accepts a prospective renter’s structured application.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-midnight tracking-tight">3. Verification Evidence Minimization</h2>
          <p>
            Property connection evidence (such as electricity service records or society NOCs) submitted during onboarding is stored in an encrypted quarantine environment accessible only to authorized moderators. Evidence files are purged within 7 days of review completion, retaining only immutable audit timestamps.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-midnight tracking-tight">4. Rights of Data Principals</h2>
          <p>
            Under the Digital Personal Data Protection Act 2023, data principals have the right to access, correct, erase, and nominate representatives for their personal data. To exercise these rights, submit a request to our Grievance Officer.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-midnight tracking-tight">5. Grievance Officer Contact</h2>
          <div className="rounded-[2px] border border-border bg-surface-subtle p-6 space-y-1.5 text-xs font-mono text-slate-700 shadow-sm">
            <p><strong>Designation:</strong> Grievance Officer</p>
            <p><strong>Email:</strong> <a href="mailto:grievance@therentalcircle.in" className="text-cobalt underline font-bold">grievance@therentalcircle.in</a></p>
            <p><strong>Entity:</strong> The Rental Circle (Ethisyn Services Private Limited)</p>
            <p><strong>Location:</strong> Hyderabad, Telangana, India</p>
          </div>
        </section>
      </div>
    </div>
  );
}
