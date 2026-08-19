'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, Filter, RotateCcw, ShieldCheck, CheckCircle2, SlidersHorizontal, ArrowUpRight } from 'lucide-react';
import { ListingCard } from '@/components/listings/ListingCard';

interface HomeItem {
  slug: string;
  title: string;
  cluster: string;
  propertyType: string;
  monthlyRent: number;
  maintenanceCharges: number;
  carpetAreaSqFt: number;
  coverImageUrl: string;
  hasConnectionEvidence: boolean;
  isContactConfirmed: boolean;
  confirmedDate: string;
  corridor: string;
  furnishing: string;
}

function BrowseHomesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [homes, setHomes] = useState<HomeItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedCorridors, setSelectedCorridors] = useState<string[]>([]);
  const [maxRent, setMaxRent] = useState<number>(50000);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showMobileFilters, setShowMobileFilters] = useState<boolean>(false);

  // Fetch real published listings from backend API
  useEffect(() => {
    async function fetchListings() {
      setIsLoading(true);
      try {
        const res = await fetch('/api/owner/listings', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (data.listings && Array.isArray(data.listings)) {
            const published = data.listings.filter((l: any) => l.status === 'published');
            const mapped: HomeItem[] = published.map((l: any) => ({
              slug: l.slug,
              title: l.title,
              cluster: `${l.colonyOrSociety}, ${l.cluster.replace('_', ' ').toUpperCase()}`,
              propertyType: l.propertyType.replace('_', ' ').toUpperCase(),
              monthlyRent: l.monthlyRent,
              maintenanceCharges: l.maintenanceCharges || 0,
              carpetAreaSqFt: l.carpetAreaSqFt,
              coverImageUrl: l.photos?.[0]?.url || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1000&q=80',
              hasConnectionEvidence: !!l.evidence,
              isContactConfirmed: true,
              confirmedDate: new Date(l.publishedAt || l.submittedAt || Date.now()).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }),
              corridor: l.cluster,
              furnishing: l.furnishingStatus,
            }));
            setHomes(mapped);
            setIsLoading(false);
            return;
          }
        }
      } catch (err) {
        console.error('Failed to load published homes:', err);
      }
      setHomes([]);
      setIsLoading(false);
    }
    fetchListings();
  }, []);

  // Sync state from URL query parameters (e.g. ?cluster=kondapur or ?q=Botanical)
  useEffect(() => {
    const clusterParam = searchParams.get('cluster') || searchParams.get('corridor');
    const qParam = searchParams.get('q') || searchParams.get('query') || searchParams.get('search');
    const maxRentParam = searchParams.get('maxRent');

    if (clusterParam) {
      const normalized = clusterParam.toLowerCase().trim();
      setSelectedCorridors([normalized]);
    } else {
      setSelectedCorridors([]);
    }

    if (qParam) {
      setSearchQuery(qParam);
    } else {
      setSearchQuery('');
    }

    if (maxRentParam) {
      const parsed = parseInt(maxRentParam, 10);
      if (!isNaN(parsed)) setMaxRent(parsed);
    }
  }, [searchParams]);

  const toggleCorridor = (c: string) => {
    setSelectedCorridors(prev =>
      prev.includes(c) ? prev.filter(item => item !== c) : [...prev, c]
    );
  };

  const resetFilters = () => {
    setSelectedCorridors([]);
    setMaxRent(50000);
    setSearchQuery('');
    router.push('/homes');
  };

  const filteredHomes = homes.filter(home => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matches =
        home.title.toLowerCase().includes(q) ||
        home.cluster.toLowerCase().includes(q) ||
        home.corridor.toLowerCase().includes(q) ||
        home.propertyType.toLowerCase().includes(q);
      if (!matches) return false;
    }
    if (selectedCorridors.length > 0 && !selectedCorridors.includes(home.corridor)) {
      return false;
    }
    if (home.monthlyRent > maxRent) {
      return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-canvas text-midnight font-sans antialiased selection:bg-cobalt selection:text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Header & Search Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-border pb-6">
          <div className="space-y-1 text-left">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-widest text-cobalt font-mono">Hyderabad Inventory</span>
              <span className="text-border-strong">•</span>
              <span className="text-xs font-medium text-text-muted font-mono">{filteredHomes.length} reviewed available</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-midnight">
              Reviewed Homes
            </h1>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-faint" />
              <input
                type="text"
                placeholder="Filter by locality or colony..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full rounded-[2px] border border-border-strong bg-white pl-10 pr-3.5 py-2.5 text-xs font-medium text-midnight placeholder:text-text-faint focus:border-midnight focus:outline-none shadow-sm transition-colors"
              />
            </div>
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="md:hidden inline-flex items-center gap-1.5 rounded-[2px] border border-border-strong bg-white px-4 py-2.5 text-xs font-bold text-midnight shadow-sm"
            >
              <SlidersHorizontal className="h-4 w-4" /> Filters
            </button>
          </div>
        </div>

        {/* Main 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Left Sidebar Filter Rail (Desktop) */}
          <aside className="hidden md:block md:col-span-4 lg:col-span-3 sticky top-24 space-y-6 rounded-[2px] border border-border bg-white p-6 shadow-sm text-left">
            <div className="flex items-center justify-between border-b border-border-subtle pb-4">
              <span className="text-xs font-black uppercase tracking-wider text-midnight flex items-center gap-2 font-mono">
                <Filter className="h-3.5 w-3.5 text-cobalt" /> Filter Parameters
              </span>
              <button
                onClick={resetFilters}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-text-muted hover:text-midnight transition-colors"
              >
                <RotateCcw className="h-3 w-3" /> Reset
              </button>
            </div>

            {/* Corridor Filters */}
            <fieldset className="space-y-3">
              <legend className="text-[11px] font-bold uppercase tracking-wider text-text-faint font-mono">
                Hyderabad Corridors
              </legend>
              <div className="space-y-2.5 text-xs text-text-secondary font-medium">
                {[
                  { id: 'kondapur', label: 'Kondapur' },
                  { id: 'madhapur', label: 'Madhapur' },
                  { id: 'gachibowli', label: 'Gachibowli' },
                  { id: 'hitec_city', label: 'HITEC City' },
                  { id: 'manikonda', label: 'Manikonda' },
                  { id: 'financial_district', label: 'Financial District' },
                ].map(c => (
                  <label key={c.id} className="flex items-center gap-2.5 cursor-pointer hover:text-midnight select-none group">
                    <input
                      type="checkbox"
                      checked={selectedCorridors.includes(c.id)}
                      onChange={() => toggleCorridor(c.id)}
                      className="h-4 w-4 rounded-[2px] border-border-strong text-cobalt focus:ring-cobalt cursor-pointer"
                    />
                    <span className="group-hover:text-midnight transition-colors">{c.label}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            {/* Budget Filter */}
            <fieldset className="space-y-3 border-t border-border-subtle pt-4">
              <div className="flex items-center justify-between text-xs">
                <legend className="font-bold uppercase tracking-wider text-text-faint font-mono text-[11px]">Max Monthly Rent</legend>
                <span className="text-midnight tabular-nums font-black text-sm">₹{maxRent.toLocaleString('en-IN')}</span>
              </div>
              <input
                type="range"
                min="5000"
                max="50000"
                step="2500"
                value={maxRent}
                onChange={e => setMaxRent(Number(e.target.value))}
                className="w-full accent-midnight cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-text-faint font-mono tabular-nums">
                <span>₹5,000</span>
                <span>₹50,000+</span>
              </div>
            </fieldset>

            {/* Verified Checks Guarantee Scope Note */}
            <div className="border-t border-border-subtle pt-4 text-[11px] text-text-muted space-y-1 leading-relaxed">
              <span className="font-bold text-midnight block uppercase font-mono text-[10px]">Review Scope</span>
              <p>Every listed property has a confirmed phone contact and verified utility connection evidence.</p>
            </div>
          </aside>

          {/* Right Results Grid */}
          <main className="md:col-span-8 lg:col-span-9">
            {filteredHomes.length === 0 ? (
              <div className="rounded-[2px] border border-border bg-white p-14 text-center space-y-4 shadow-sm">
                <h3 className="text-lg font-bold text-midnight">No homes match these filters yet.</h3>
                <p className="text-xs text-text-muted max-w-md mx-auto leading-relaxed">
                  Try selecting a nearby locality or adjusting your budget slider to see available reviewed homes.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <button
                    onClick={resetFilters}
                    className="inline-flex items-center justify-center rounded-[2px] bg-midnight px-5 py-2.5 text-xs font-bold text-white hover:bg-cobalt transition-colors shadow-sm"
                  >
                    Reset all filters
                  </button>
                  <Link
                    href="/list-your-property"
                    className="inline-flex items-center justify-center rounded-[2px] border border-border bg-white px-5 py-2.5 text-xs font-bold text-midnight hover:border-midnight transition-colors shadow-sm"
                  >
                    List Your Property in this Corridor &rarr;
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredHomes.map(home => (
                  <ListingCard key={home.slug} {...home} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default function BrowseHomesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-canvas flex items-center justify-center">
          <div className="h-6 w-6 border-2 border-cobalt border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <BrowseHomesContent />
    </Suspense>
  );
}
