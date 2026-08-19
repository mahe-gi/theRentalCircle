import React from 'react';
import Link from 'next/link';
import { Search, ArrowRight, ArrowUpRight, ShieldCheck, CheckCircle2, Lock, Building2, Check } from 'lucide-react';
import { formatINR } from '@/lib/utils';

const CORRIDORS = [
  {
    name: 'Kondapur & Botanical Garden',
    propertyCount: 'Independent units & 2-3 BHK flats',
    imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
    href: '/homes?cluster=kondapur',
  },
  {
    name: 'Madhapur & Ayyappa Society',
    propertyCount: 'Standalone apartments & private rooms',
    imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
    href: '/homes?cluster=madhapur',
  },
  {
    name: 'Gachibowli & Telecom Nagar',
    propertyCount: 'Residential floors & shared homes',
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    href: '/homes?cluster=gachibowli',
  },
  {
    name: 'Financial District & Narsingi',
    propertyCount: 'Gated community residences',
    imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
    href: '/homes?cluster=financial_district',
  },
];

export default function HomePage() {
  return (
    <div className="bg-white text-midnight font-sans antialiased selection:bg-cobalt selection:text-white">
      {/* 1. ASYMMETRIC SUNLIT EDITORIAL HERO (45/55 Split with First Row Peek) */}
      <section className="border-b border-border bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column (45% / 5 cols) */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-6 text-left">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 border border-border bg-surface-subtle px-2.5 py-1 text-[11px] font-mono font-bold uppercase tracking-wider text-cobalt rounded-[2px]">
                  <span className="h-1.5 w-1.5 rounded-full bg-citrus"></span>
                  Hyderabad • Verified Residential Rentals
                </div>
                <h1 className="text-4xl sm:text-5xl lg:text-[68px] font-black tracking-[-0.035em] text-midnight leading-[0.98]">
                  A clearer way to find your next home.
                </h1>
                <p className="text-[16px] text-text-secondary max-w-md leading-relaxed font-normal">
                  Browse human-reviewed rental listings, send a structured request and connect directly after the listing contact accepts.
                </p>
              </div>

              {/* Substantial Product Search Dock */}
              <div className="space-y-3 pt-2">
                <form
                  action="/homes"
                  method="GET"
                  className="flex flex-col sm:flex-row gap-2 border border-border-strong bg-white p-2 rounded-[3px] shadow-[0_2px_12px_rgba(11,21,55,0.04)] focus-within:border-midnight transition-colors"
                >
                  <div className="flex-1 flex items-center px-3 gap-2.5">
                    <Search className="h-4 w-4 text-text-faint shrink-0" />
                    <input
                      type="text"
                      name="q"
                      placeholder="Locality, colony or corridor (e.g. Kondapur)..."
                      className="w-full bg-transparent text-sm font-medium text-midnight placeholder:text-text-faint focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 rounded-[2px] bg-cobalt px-6 py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-cobalt-hover active:scale-[0.98] transition-all shadow-[0_2px_8px_rgba(37,71,245,0.25)] shrink-0"
                  >
                    Search Homes <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </form>

                {/* Corridor Links */}
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-text-muted">
                  <span className="font-bold text-midnight uppercase text-[10px] tracking-wider">Corridors:</span>
                  <Link href="/homes?cluster=kondapur" className="hover:text-cobalt hover:underline underline-offset-4 decoration-border">Kondapur</Link>
                  <span className="text-border-strong">•</span>
                  <Link href="/homes?cluster=madhapur" className="hover:text-cobalt hover:underline underline-offset-4 decoration-border">Madhapur</Link>
                  <span className="text-border-strong">•</span>
                  <Link href="/homes?cluster=gachibowli" className="hover:text-cobalt hover:underline underline-offset-4 decoration-border">Gachibowli</Link>
                  <span className="text-border-strong">•</span>
                  <Link href="/homes?cluster=hitec_city" className="hover:text-cobalt hover:underline underline-offset-4 decoration-border">HITEC City</Link>
                  <span className="text-border-strong">•</span>
                  <Link href="/homes?cluster=financial_district" className="hover:text-cobalt hover:underline underline-offset-4 decoration-border">Financial District</Link>
                </div>
              </div>
            </div>

            {/* Right Column (55% / 7 cols, Expansive Sunlit Photography) */}
            <div className="lg:col-span-7 relative min-h-[360px] lg:min-h-[460px] rounded-[2px] overflow-hidden border border-border bg-surface-muted group">
              <img
                src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1600&q=80"
                alt="Sunlit residential apartment living space in Hyderabad"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-102"
              />
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-midnight/95 via-midnight/50 to-transparent p-6 text-white">
                <div className="flex items-center justify-between gap-2 text-xs">
                  <span className="inline-flex items-center gap-1.5 font-bold text-citrus tracking-wide uppercase text-[11px]">
                    <ShieldCheck className="h-3.5 w-3.5" /> Direct Owner Verification
                  </span>
                  <span className="text-white/70 text-[11px] font-mono">West Hyderabad</span>
                </div>
                <div className="flex items-baseline justify-between pt-2 border-t border-white/10 mt-2">
                  <div>
                    <h3 className="text-xl font-bold text-white tracking-tight">Direct Owner Verified Homes</h3>
                    <p className="text-xs text-white/80 mt-0.5">Gachibowli, Kondapur, Madhapur & HITEC City</p>
                  </div>
                  <div className="text-right">
                    <Link
                      href="/homes"
                      className="inline-flex items-center gap-1 rounded-[2px] bg-citrus px-3.5 py-1.5 text-xs font-black text-midnight hover:bg-citrus/90 transition-colors"
                    >
                      Browse Homes &rarr;
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. TWO-SIDED VALUE PILLARS */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* For Renters */}
          <div className="border border-border bg-surface-subtle/50 p-8 rounded-[2px] space-y-4 text-left">
            <div className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase text-cobalt">
              <Search className="h-4 w-4" /> For Prospective Renters
            </div>
            <h3 className="text-2xl font-black text-midnight tracking-tight">
              Zero fake listings. Zero broker spam.
            </h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              Every home on The Rental Circle is human-reviewed. View transparent rents, maintenance charges, and real room photos. Send your application directly to the owner.
            </p>
            <div className="pt-2">
              <Link
                href="/homes"
                className="inline-flex items-center gap-2 rounded-[2px] bg-midnight px-5 py-2.5 text-xs font-bold text-white hover:bg-cobalt transition-colors"
              >
                Browse Reviewed Homes <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* For Property Owners */}
          <div className="border border-border bg-white p-8 rounded-[2px] space-y-4 text-left shadow-xs">
            <div className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase text-verified">
              <Building2 className="h-4 w-4" /> For Property Owners
            </div>
            <h3 className="text-2xl font-black text-midnight tracking-tight">
              Protect your phone number. Get qualified tenants.
            </h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              Never publish your phone number on public forums or get spam calls. Review tenant profiles and release contact details only to the tenant you approve.
            </p>
            <div className="pt-2">
              <Link
                href="/list-your-property"
                className="inline-flex items-center gap-2 rounded-[2px] border border-midnight bg-white px-5 py-2.5 text-xs font-bold text-midnight hover:bg-midnight hover:text-white transition-colors"
              >
                List Your Property <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FULL-WIDTH COBALT SECTION: TWO-SIDED CONTACT PRIVACY */}
      <section className="w-full bg-cobalt text-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-14">
          <div className="max-w-2xl text-left space-y-3">
            <span className="inline-block bg-white/15 px-2.5 py-1 text-[11px] font-mono font-bold uppercase tracking-widest text-citrus rounded-[2px]">
              Contact Privacy Architecture
            </span>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
              How contact privacy works
            </h2>
            <p className="text-base text-white/85 leading-relaxed font-normal">
              Phone numbers are not displayed publicly. Contact details are released directly only after the listing contact accepts your structured application.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/15 border-t border-b border-white/15">
            <div className="py-8 md:py-0 md:px-8 first:pl-0 space-y-4 text-left">
              <span className="text-4xl font-black text-citrus font-mono tracking-tight block">01</span>
              <h3 className="text-lg font-bold text-white">
                Search & Discovery
              </h3>
              <p className="text-sm text-white/85 leading-relaxed">
                Explore reviewed properties and transparent charges freely. Phone numbers are protected to eliminate telemarketing and spam.
              </p>
            </div>
            <div className="py-8 md:py-0 md:px-8 space-y-4 text-left">
              <span className="text-4xl font-black text-citrus font-mono tracking-tight block">02</span>
              <h3 className="text-lg font-bold text-white">
                Structured Request
              </h3>
              <p className="text-sm text-white/85 leading-relaxed">
                Send your move-in timeline and household composition directly to the property contact without broker call centers.
              </p>
            </div>
            <div className="py-8 md:py-0 md:px-8 last:pr-0 space-y-4 text-left">
              <span className="text-4xl font-black text-citrus font-mono tracking-tight block">03</span>
              <h3 className="text-lg font-bold text-white">
                Mutual Release
              </h3>
              <p className="text-sm text-white/85 leading-relaxed">
                When the listing contact accepts your application, contact details are released to both parties for direct viewing coordination.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. LOCALITY EXPLORATION */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 space-y-10">
        <div className="border-b border-border pb-5">
          <span className="text-[11px] font-bold uppercase tracking-widest text-cobalt font-mono">Hyderabad Corridors</span>
          <h2 className="text-3xl font-black text-midnight tracking-tight mt-1">
            Explore homes by locality
          </h2>
          <p className="text-sm text-text-muted mt-1 font-normal">
            Active residential clusters across West Hyderabad with human-reviewed inventory.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CORRIDORS.map(c => (
            <Link
              key={c.name}
              href={c.href}
              className="group relative aspect-[4/3] overflow-hidden border border-border bg-surface-muted block rounded-[2px] hover:border-midnight transition-colors"
            >
              <img
                src={c.imageUrl}
                alt={c.name}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-midnight/95 via-midnight/40 to-transparent flex flex-col justify-end p-5 text-white">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold tracking-tight text-white group-hover:text-citrus transition-colors">
                    {c.name}
                  </h3>
                  <ArrowUpRight className="h-4 w-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="text-xs text-white/80 mt-1">{c.propertyCount}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 5. VERIFICATION BOUNDARIES */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-20 space-y-10">
        <div className="border-b border-border pb-5">
          <span className="text-[11px] font-bold uppercase tracking-widest text-cobalt font-mono">Verification Boundaries</span>
          <h2 className="text-3xl font-black text-midnight tracking-tight mt-1">
            Know what has, and has not, been checked
          </h2>
          <p className="text-sm text-text-muted mt-1 font-normal">
            We perform documented baseline checks prior to publication. Clear boundaries help you inspect safely.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 border border-border divide-y md:divide-y-0 md:divide-x divide-border bg-white rounded-[2px]">
          <div className="p-8 sm:p-10 space-y-5 bg-verified-surface">
            <h3 className="text-sm font-bold text-verified uppercase tracking-wider flex items-center gap-2.5 font-mono">
              <CheckCircle2 className="h-5 w-5 shrink-0" /> What We Review Before Publication
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
                <span>Fixed monthly rent, security deposit and lock-in period declared</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-4 w-4 shrink-0 mt-0.5 text-verified" />
                <span>Photographs reviewed for room-by-room consistency</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-4 w-4 shrink-0 mt-0.5 text-verified" />
                <span>Availability confirmed on Aug 18, 2026 directly with listing contact</span>
              </li>
            </ul>
          </div>

          <div className="p-8 sm:p-10 space-y-5 bg-white">
            <h3 className="text-sm font-bold text-midnight uppercase tracking-wider flex items-center gap-2.5 font-mono">
              <Building2 className="h-5 w-5 text-text-faint shrink-0" /> What Requires Your In-Person Inspection
            </h3>
            <ul className="space-y-3.5 text-sm text-text-secondary font-normal">
              <li className="flex items-start gap-3">
                <span className="text-text-faint font-mono font-bold">-</span>
                <span>Physical condition of appliances, water pressure, and room ventilation</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-text-faint font-mono font-bold">-</span>
                <span>Independent neighborhood safety, commute times, and street noise</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-text-faint font-mono font-bold">-</span>
                <span>Society bylaws regarding parking, maintenance, and visitor guidelines</span>
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

      {/* 6. OWNER CONVERSION BLOCK */}
      <section className="border-t border-border bg-surface-subtle py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 bg-white border border-border p-8 sm:p-12 rounded-[2px] shadow-[0_2px_12px_rgba(11,21,55,0.03)]">
            <div className="max-w-2xl space-y-3 text-left">
              <span className="inline-block bg-surface-muted border border-border px-2.5 py-1 text-[11px] font-mono font-bold uppercase tracking-wider text-cobalt rounded-[2px]">
                For Property Owners & Reps
              </span>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-midnight">
                List your residential property in West Hyderabad
              </h2>
              <p className="text-base text-text-secondary leading-relaxed font-normal">
                Connect directly with verified renters without publishing your personal phone number. Zero brokerage commissions.
              </p>
            </div>
            <Link
              href="/list-your-property"
              className="inline-flex items-center justify-center gap-2 rounded-[3px] bg-midnight px-8 py-4 text-xs font-bold tracking-wider uppercase text-white hover:bg-cobalt active:scale-[0.98] transition-all shadow-[0_2px_8px_rgba(11,21,55,0.2)] shrink-0"
            >
              List Your Property <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
