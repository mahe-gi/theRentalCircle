import React from 'react';
import Link from 'next/link';

export default function GrievancePage() {
  return (
    <div className="min-h-screen bg-white text-midnight font-sans antialiased selection:bg-cobalt selection:text-white">
      {/* Top Header */}
      <div className="border-b border-border bg-white py-16 lg:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 space-y-4 text-left">
          <div className="inline-flex items-center gap-2 border border-slate-200 bg-surface-subtle px-2.5 py-1 text-[11px] font-mono font-bold uppercase tracking-wider text-cobalt rounded-[2px]">
            <span className="h-1.5 w-1.5 rounded-full bg-citrus"></span>
            Statutory Redressal
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-midnight tracking-tight leading-[1.04]">
            Grievance Redressal
          </h1>
          <p className="text-xs text-slate-500 font-mono">
            In accordance with IT Rules 2021 and Digital Personal Data Protection Act 2023
          </p>
        </div>
      </div>

      {/* Main Reading Column */}
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16 space-y-10 text-[15px] text-slate-600 leading-relaxed text-left font-normal">
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-midnight tracking-tight">1. Grievance Redressal Framework</h2>
          <p>
            The Rental Circle has appointed a designated Grievance Officer to address user complaints, privacy inquiries, and content grievances arising under the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021 and the Digital Personal Data Protection Act, 2023.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-midnight tracking-tight">2. Designated Officer Details</h2>
          <div className="rounded-[2px] border border-border bg-surface-subtle p-8 space-y-3 text-xs font-mono text-slate-700 shadow-sm">
            <p><strong>Designation:</strong> Grievance Officer</p>
            <p><strong>Platform:</strong> The Rental Circle (Ethisyn Services Private Limited)</p>
            <p><strong>Email:</strong> <a href="mailto:grievance@therentalcircle.in" className="text-cobalt underline font-bold">grievance@therentalcircle.in</a></p>
            <p><strong>Location:</strong> Hyderabad, Telangana, India</p>
            <p><strong>Acknowledgement SLA:</strong> Within 24 hours</p>
            <p><strong>Resolution SLA:</strong> Within 15 calendar days</p>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-midnight tracking-tight">3. Escalation Procedure</h2>
          <p>
            If you wish to report inaccurate property information, suspected fraud, or exercise data principal rights (access, correction, erasure), email our Grievance Officer with the relevant listing ID or account details.
          </p>
        </section>
      </div>
    </div>
  );
}
