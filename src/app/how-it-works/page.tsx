import React from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, ShieldCheck, Lock, Building2, HelpCircle } from 'lucide-react';

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-white text-midnight font-sans antialiased selection:bg-cobalt selection:text-white">
      {/* Hero Section */}
      <section className="border-b border-border bg-white py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 max-w-3xl text-left space-y-4">
          <div className="inline-flex items-center gap-2 border border-border bg-surface-subtle px-2.5 py-1 text-[11px] font-mono font-bold uppercase tracking-wider text-cobalt rounded-[2px]">
            <span className="h-1.5 w-1.5 rounded-full bg-citrus"></span>
            Operational Workflow
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-midnight leading-[1.04]">
            How residential leasing works on The Rental Circle.
          </h1>
          <p className="text-base text-text-secondary leading-relaxed font-normal">
            A transparent workflow designed for Hyderabad renters and property owners, eliminating telemarketing spam and advance-deposit scams.
          </p>
        </div>
      </section>

      {/* Dual Journey Rails */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 space-y-20">
        {/* Renter Journey */}
        <div className="space-y-10 text-left">
          <div className="border-b border-border pb-5">
            <span className="text-[11px] font-bold uppercase tracking-widest text-cobalt font-mono">For Prospective Renters</span>
            <h2 className="text-2xl sm:text-3xl font-black text-midnight tracking-tight mt-1">
              The Renter Journey
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-8 border border-border rounded-[2px] bg-white space-y-4 shadow-sm">
              <span className="text-4xl font-black text-cobalt font-mono tracking-tight block">01</span>
              <h3 className="text-base font-bold text-midnight">Browse Publicly</h3>
              <p className="text-sm text-text-secondary leading-relaxed font-normal">
                Explore reviewed properties freely across Hyderabad corridors. Transparent rents, maintenance, and deposit terms are disclosed upfront.
              </p>
            </div>

            <div className="p-8 border border-border rounded-[2px] bg-white space-y-4 shadow-sm">
              <span className="text-4xl font-black text-cobalt font-mono tracking-tight block">02</span>
              <h3 className="text-base font-bold text-midnight">Structured Application</h3>
              <p className="text-sm text-text-secondary leading-relaxed font-normal">
                Sign in, confirm your phone number, and send a structured move-in timeline directly to the listing contact with mutual consent.
              </p>
            </div>

            <div className="p-8 border border-border rounded-[2px] bg-white space-y-4 shadow-sm">
              <span className="text-4xl font-black text-cobalt font-mono tracking-tight block">03</span>
              <h3 className="text-base font-bold text-midnight">Mutual Contact Release</h3>
              <p className="text-sm text-text-secondary leading-relaxed font-normal">
                When the listing contact accepts, phone details are released to both parties for direct WhatsApp viewing coordination and lease signing.
              </p>
            </div>
          </div>
        </div>

        {/* Listing Contact Journey */}
        <div className="space-y-10 border-t border-border pt-20 text-left">
          <div className="border-b border-border pb-5">
            <span className="text-[11px] font-bold uppercase tracking-widest text-cobalt font-mono">For Property Owners & Reps</span>
            <h2 className="text-2xl sm:text-3xl font-black text-midnight tracking-tight mt-1">
              The Listing Contact Journey
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-8 border border-border rounded-[2px] bg-white space-y-4 shadow-sm">
              <span className="text-4xl font-black text-cobalt font-mono tracking-tight block">01</span>
              <h3 className="text-base font-bold text-midnight">Create Listing</h3>
              <p className="text-sm text-text-secondary leading-relaxed font-normal">
                Enter property details, room configurations, declared rental charges, and submit room photographs with private utility evidence.
              </p>
            </div>

            <div className="p-8 border border-border rounded-[2px] bg-white space-y-4 shadow-sm">
              <span className="text-4xl font-black text-cobalt font-mono tracking-tight block">02</span>
              <h3 className="text-base font-bold text-midnight">Baseline Review</h3>
              <p className="text-sm text-text-secondary leading-relaxed font-normal">
                Our team conducts a founder phone check and verifies submitted utility connection records against locality data before publication.
              </p>
            </div>

            <div className="p-8 border border-border rounded-[2px] bg-white space-y-4 shadow-sm">
              <span className="text-4xl font-black text-cobalt font-mono tracking-tight block">03</span>
              <h3 className="text-base font-bold text-midnight">Review Applications</h3>
              <p className="text-sm text-text-secondary leading-relaxed font-normal">
                Receive structured applications from prospective tenants. Accept matching profiles to release mutual contacts and arrange in-person visits.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Accessible FAQ Section */}
      <section className="border-t border-border bg-surface-subtle py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-10 text-left">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-cobalt font-mono">Questions & Answers</span>
            <h2 className="text-2xl sm:text-3xl font-black text-midnight tracking-tight mt-1">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            <details className="group rounded-[2px] border border-border bg-white p-6 text-sm [&_summary::-webkit-details-marker]:hidden cursor-pointer shadow-sm">
              <summary className="flex items-center justify-between font-bold text-midnight text-[15px]">
                <span>Is The Rental Circle free during the pilot?</span>
                <span className="transition-transform group-open:rotate-180 text-text-faint font-mono">▼</span>
              </summary>
              <p className="mt-3 text-text-secondary leading-relaxed font-normal text-sm">
                Yes. During our Hyderabad pilot, The Rental Circle is free for both renters and property owners. We never charge brokerage commissions or unlock fees.
              </p>
            </details>

            <details className="group rounded-[2px] border border-border bg-white p-6 text-sm [&_summary::-webkit-details-marker]:hidden cursor-pointer shadow-sm">
              <summary className="flex items-center justify-between font-bold text-midnight text-[15px]">
                <span>Why are phone numbers not displayed publicly?</span>
                <span className="transition-transform group-open:rotate-180 text-text-faint font-mono">▼</span>
              </summary>
              <p className="mt-3 text-text-secondary leading-relaxed font-normal text-sm">
                Public phone numbers get scraped by call centers and broker syndicates, leading to relentless spam. Private contact release ensures only approved parties connect directly.
              </p>
            </details>

            <details className="group rounded-[2px] border border-border bg-white p-6 text-sm [&_summary::-webkit-details-marker]:hidden cursor-pointer shadow-sm">
              <summary className="flex items-center justify-between font-bold text-midnight text-[15px]">
                <span>What verification checks are conducted?</span>
                <span className="transition-transform group-open:rotate-180 text-text-faint font-mono">▼</span>
              </summary>
              <p className="mt-3 text-text-secondary leading-relaxed font-normal text-sm">
                We conduct direct phone confirmation with listing contacts and review submitted utility connection records (e.g. electricity service accounts) to confirm locality connection before issuing evidence badges.
              </p>
            </details>
          </div>
        </div>
      </section>
    </div>
  );
}
