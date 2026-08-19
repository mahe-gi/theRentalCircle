import React from 'react';
import Link from 'next/link';
import { ShieldCheck, CheckCircle2, Lock, ArrowRight, Building2, FileText, PhoneCall, Check } from 'lucide-react';

export default function ListYourPropertyPage() {
  return (
    <div className="min-h-screen bg-white text-midnight font-sans antialiased selection:bg-cobalt selection:text-white">
      {/* Hero Section */}
      <section className="border-b border-border bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Heading & Positioning */}
            <div className="lg:col-span-6 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 border border-border bg-surface-subtle px-2.5 py-1 text-[11px] font-mono font-bold uppercase tracking-wider text-cobalt rounded-[2px]">
                <span className="h-1.5 w-1.5 rounded-full bg-citrus"></span>
                For Property Owners & Authorized Representatives
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-[58px] font-black tracking-[-0.03em] text-midnight leading-[1.02]">
                List your residential property in West Hyderabad.
              </h1>
              <p className="text-[16px] text-text-secondary max-w-lg leading-relaxed font-normal">
                Create a clear listing, complete the review process and receive structured requests without publishing your phone number.
              </p>
              <div className="pt-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <Link
                  href="/sign-in"
                  className="inline-flex items-center justify-center gap-2 rounded-[3px] bg-midnight px-8 py-4 text-xs font-bold tracking-wider uppercase text-white hover:bg-cobalt active:scale-[0.98] transition-all shadow-[0_2px_8px_rgba(11,21,55,0.2)]"
                >
                  Start Listing Details <ArrowRight className="h-4 w-4" />
                </Link>
                <span className="text-xs text-text-muted font-mono text-center sm:text-left">
                  Free during the Hyderabad pilot.
                </span>
              </div>
            </div>

            {/* Right Column: Architectural Property Photography */}
            <div className="lg:col-span-6 relative aspect-[4/3] rounded-[2px] overflow-hidden border border-border bg-surface-muted group shadow-sm">
              <img
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
                alt="Modern residential apartment building in Hyderabad"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-102"
              />
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-midnight/95 via-midnight/40 to-transparent p-6 text-white text-left">
                <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-citrus">
                  <Lock className="h-3.5 w-3.5" /> Two-Sided Contact Protection
                </div>
                <p className="text-xs text-white/80 mt-1 font-normal">
                  Your personal phone number is never displayed on public pages or search engines.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3-Step Review Process */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 space-y-14">
        <div className="border-b border-border pb-5 max-w-2xl text-left">
          <span className="text-[11px] font-bold uppercase tracking-widest text-cobalt font-mono">How Publication Works</span>
          <h2 className="text-3xl font-black text-midnight tracking-tight mt-1">
            The three-step listing and review cycle
          </h2>
          <p className="text-sm text-text-muted mt-1 font-normal leading-relaxed">
            We review every property before making it publicly visible to maintain high trust and clear pricing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border border-t border-b border-border">
          <div className="py-8 md:py-0 md:px-8 first:pl-0 space-y-3 text-left">
            <span className="text-4xl font-black text-cobalt font-mono tracking-tight block">01</span>
            <h3 className="text-lg font-bold text-midnight">
              Create Listing Details
            </h3>
            <p className="text-sm text-text-secondary leading-relaxed font-normal">
              Provide transparent rent, security deposit, maintenance terms, room specifications, and house guidelines.
            </p>
          </div>

          <div className="py-8 md:py-0 md:px-8 space-y-3 text-left">
            <span className="text-4xl font-black text-cobalt font-mono tracking-tight block">02</span>
            <h3 className="text-lg font-bold text-midnight">
              Submit Photos & Evidence
            </h3>
            <p className="text-sm text-text-secondary leading-relaxed font-normal">
              Upload clear room-by-room photographs and private connection evidence (e.g. utility record) for moderation review.
            </p>
          </div>

          <div className="py-8 md:py-0 md:px-8 last:pr-0 space-y-3 text-left">
            <span className="text-4xl font-black text-cobalt font-mono tracking-tight block">03</span>
            <h3 className="text-lg font-bold text-midnight">
              Review & Publication
            </h3>
            <p className="text-sm text-text-secondary leading-relaxed font-normal">
              Our team verifies submitted details and confirms availability with you directly before publishing the listing.
            </p>
          </div>
        </div>
      </section>

      {/* Trust & Boundary Notice Ledger */}
      <section className="border-t border-border bg-surface-subtle py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="max-w-2xl text-left">
            <span className="text-[11px] font-bold uppercase tracking-widest text-cobalt font-mono">Operational Principles</span>
            <h2 className="text-3xl font-black text-midnight tracking-tight mt-1">
              Important details about listing on The Rental Circle
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-[2px] border border-border bg-white p-8 space-y-3 shadow-sm text-left">
              <h3 className="text-base font-bold text-midnight flex items-center gap-2">
                <Lock className="h-4 w-4 text-cobalt" /> Private Supporting Evidence
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed font-normal">
                Utility records and ownership documents submitted during onboarding are strictly private. They are reviewed only by moderators and are never published publicly.
              </p>
            </div>

            <div className="rounded-[2px] border border-border bg-white p-8 space-y-3 shadow-sm text-left">
              <h3 className="text-base font-bold text-midnight flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-verified" /> You Decide Who Connects
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed font-normal">
                Prospective renters submit structured applications detailing move-in dates and household composition. Contact details are released only after you choose to accept.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
