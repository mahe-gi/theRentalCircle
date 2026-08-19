'use client';

import { RouteGuard } from '@/components/auth/RouteGuard';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  Eye,
  XCircle,
  Calendar,
  Users,
  Briefcase,
  Phone,
  Mail,
  MapPin,
  ArrowRight,
  ArrowUpRight,
  Search,
  RotateCcw,
  Building2,
  Lock,
  AlertCircle,
  MessageCircle,
  Sparkles,
  Info,
  ChevronRight,
} from 'lucide-react';
import { formatINR } from '@/lib/utils';
import { getSessionUser, type SessionUser } from '@/lib/session';

interface RentalListingSummary {
  id: string;
  slug: string;
  title: string;
  cluster: string;
  colonyOrSociety: string;
  landmark?: string;
  propertyType: string;
  monthlyRent: number;
  securityDeposit: number;
  maintenanceCharges: number;
  isMaintenanceIncluded?: boolean;
  carpetAreaSqFt?: number;
  furnishingStatus?: string;
  availableFrom?: string;
  coverImage?: string;
}

interface OwnerContact {
  name: string;
  phone: string;
  email?: string;
}

interface RentalRequestItem {
  id: string;
  listingId: string;
  renterId: string;
  renterName: string;
  renterPhone: string;
  renterEmail: string;
  status: 'submitted' | 'viewed' | 'accepted' | 'declined' | 'withdrawn' | 'expired' | 'cancelled';
  intendedMoveInDate: string;
  rentalDurationMonths: number;
  occupantsCount: number;
  householdArrangement: 'individual' | 'family' | 'working_professionals' | 'students';
  employmentCategory: 'salaried' | 'self_employed' | 'student' | 'other';
  petsDescription?: string;
  optionalIntroduction?: string;
  viewedAt?: string;
  respondedAt?: string;
  declineReason?: string;
  createdAt: string;
  updatedAt: string;
  listing?: RentalListingSummary;
  ownerContact?: OwnerContact;
}

type StatusFilter = 'all' | 'accepted' | 'pending' | 'declined';

export default function RenterRequestsDashboardPage() {
  const [requests, setRequests] = useState<RentalRequestItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<StatusFilter>('all');
  const [session, setSession] = useState<SessionUser | null>(null);

  // Fetch requests from backend API
  const fetchRequests = async (isManualRefresh = false) => {
    if (isManualRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setErrorMessage(null);

    try {
      const user = getSessionUser();
      setSession(user);

      // Fetch requests: if user is logged in, optionally query or fetch all
      const res = await fetch('/api/requests', { cache: 'no-store' });
      if (!res.ok) {
        throw new Error(`Failed to load rental applications (${res.status})`);
      }
      const data = await res.json();
      if (data.success && Array.isArray(data.requests)) {
        setRequests(data.requests);
      } else {
        throw new Error(data.message || 'Invalid server response structure');
      }
    } catch (err: any) {
      console.error('Failed to fetch rental requests:', err);
      setErrorMessage(err.message || 'Could not load your rental applications.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // Format phone to WhatsApp Click-to-Chat URL
  const getWhatsAppUrl = (phone: string, listingTitle?: string) => {
    let digits = phone.replace(/[^0-9]/g, '');
    if (digits.length === 10) {
      digits = `91${digits}`;
    } else if (digits.startsWith('0') && digits.length === 11) {
      digits = `91${digits.slice(1)}`;
    }
    const text = `Hi, I saw your property on The Rental Circle (${listingTitle || 'your listing'}). My move-in application was accepted. Would love to schedule a visit.`;
    return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
  };

  // Human-readable labels
  const formatCluster = (cluster?: string) => {
    if (!cluster) return 'Hyderabad';
    const mapping: Record<string, string> = {
      gachibowli: 'Gachibowli, Hyderabad',
      kondapur: 'Kondapur, Hyderabad',
      madhapur: 'Madhapur, Hyderabad',
      hitec_city: 'HITEC City, Hyderabad',
      manikonda: 'Manikonda, Hyderabad',
      financial_district: 'Financial District, Hyderabad',
    };
    return mapping[cluster] || `${cluster.replace(/_/g, ' ')}, Hyderabad`;
  };

  const formatHousehold = (arrangement: string, count: number) => {
    const arrangementMap: Record<string, string> = {
      individual: 'Individual',
      family: 'Family',
      working_professionals: 'Working Professionals',
      students: 'Students',
    };
    const label = arrangementMap[arrangement] || arrangement;
    return `${label} (${count} ${count === 1 ? 'Occupant' : 'Occupants'})`;
  };

  const formatEmployment = (category: string) => {
    const map: Record<string, string> = {
      salaried: 'Salaried Professional',
      self_employed: 'Self-Employed / Business',
      student: 'Student',
      other: 'Other',
    };
    return map[category] || category;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'TBD';
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }).format(date);
    } catch {
      return dateString;
    }
  };

  const formatTime = (dateString?: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }).format(date);
    } catch {
      return dateString;
    }
  };

  // Filter requests
  const filteredRequests = useMemo(() => {
    return requests.filter(req => {
      // Status filter
      if (activeFilter === 'accepted' && req.status !== 'accepted') {
        return false;
      }
      if (activeFilter === 'pending' && req.status !== 'submitted' && req.status !== 'viewed') {
        return false;
      }
      if (activeFilter === 'declined' && req.status !== 'declined') {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const titleMatch = req.listing?.title.toLowerCase().includes(q);
        const colonyMatch = req.listing?.colonyOrSociety.toLowerCase().includes(q);
        const clusterMatch = req.listing?.cluster.toLowerCase().includes(q);
        const idMatch = req.id.toLowerCase().includes(q);
        const ownerMatch = req.ownerContact?.name.toLowerCase().includes(q);
        if (!titleMatch && !colonyMatch && !clusterMatch && !idMatch && !ownerMatch) {
          return false;
        }
      }

      return true;
    });
  }, [requests, activeFilter, searchQuery]);

  // Counts for tabs
  const countAll = requests.length;
  const countAccepted = requests.filter(r => r.status === 'accepted').length;
  const countPending = requests.filter(r => r.status === 'submitted' || r.status === 'viewed').length;
  const countDeclined = requests.filter(r => r.status === 'declined').length;

  return (
    <RouteGuard allowedRoles={["renter","admin"]} title="Renter Applications Portal" description="This portal allows prospective renters to track their move-in applications and view unlocked owner contacts.">
      <div className="min-h-screen bg-canvas pb-20">
      {/* Top Banner / Header */}
      <div className="border-b border-border bg-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 rounded-[2px] border border-border bg-surface-subtle px-2.5 py-1 text-[11px] font-mono font-bold uppercase tracking-wider text-cobalt">
                <Lock className="h-3 w-3" />
                Renter Application Portal
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-midnight">
                My Rental Applications
              </h1>
              <p className="text-sm sm:text-base text-text-secondary max-w-2xl font-normal leading-relaxed">
                Track your move-in requests. When a property owner accepts your profile, direct contact details and instant WhatsApp connect are unlocked.
              </p>
            </div>

            {/* Quick Action Button */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => fetchRequests(true)}
                disabled={isRefreshing || isLoading}
                className="inline-flex items-center gap-2 rounded-[2px] border border-border bg-white px-3.5 py-2 text-xs font-semibold text-midnight hover:bg-surface-subtle hover:border-border-strong transition-colors disabled:opacity-50"
                title="Refresh application status"
              >
                <RotateCcw className={`h-3.5 w-3.5 text-text-muted ${isRefreshing ? 'animate-spin' : ''}`} />
                <span>{isRefreshing ? 'Syncing...' : 'Refresh Status'}</span>
              </button>

              <Link
                href="/homes"
                className="inline-flex items-center gap-2 rounded-[2px] bg-cobalt px-4 py-2 text-xs font-bold text-white hover:bg-cobalt-hover transition-colors shadow-sm"
              >
                <Building2 className="h-3.5 w-3.5" />
                <span>Browse Reviewed Homes</span>
              </Link>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-border">
            <div className="rounded-[2px] border border-border bg-white p-3.5 sm:p-4">
              <p className="text-[11px] font-mono uppercase tracking-wider text-text-muted">Total Sent</p>
              <p className="mt-1 text-2xl font-black text-midnight tabular-nums">{countAll}</p>
            </div>

            <div className="rounded-[2px] border border-verified-border bg-verified-surface/60 p-3.5 sm:p-4">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-mono uppercase tracking-wider text-verified font-bold">Accepted</p>
                <span className="h-2 w-2 rounded-full bg-verified animate-pulse"></span>
              </div>
              <p className="mt-1 text-2xl font-black text-verified tabular-nums">{countAccepted}</p>
            </div>

            <div className="rounded-[2px] border border-border bg-white p-3.5 sm:p-4">
              <p className="text-[11px] font-mono uppercase tracking-wider text-cobalt font-medium">Under Review</p>
              <p className="mt-1 text-2xl font-black text-midnight tabular-nums">{countPending}</p>
            </div>

            <div className="rounded-[2px] border border-border bg-white p-3.5 sm:p-4">
              <p className="text-[11px] font-mono uppercase tracking-wider text-text-muted">Declined</p>
              <p className="mt-1 text-2xl font-black text-text-muted tabular-nums">{countDeclined}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-8">
        {/* Controls: Tabs & Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
          {/* Tabs */}
          <div className="flex items-center overflow-x-auto border border-border bg-white p-1 rounded-[2px] shadow-sm">
            <button
              type="button"
              onClick={() => setActiveFilter('all')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-[2px] transition-all whitespace-nowrap flex items-center gap-2 ${
                activeFilter === 'all'
                  ? 'bg-midnight text-white shadow-sm'
                  : 'text-text-secondary hover:text-midnight hover:bg-surface-subtle'
              }`}
            >
              <span>All Applications</span>
              <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-[2px] ${
                activeFilter === 'all' ? 'bg-white/20 text-white' : 'bg-surface-muted text-text-muted'
              }`}>
                {countAll}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveFilter('accepted')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-[2px] transition-all whitespace-nowrap flex items-center gap-2 ${
                activeFilter === 'accepted'
                  ? 'bg-verified text-white shadow-sm'
                  : 'text-text-secondary hover:text-verified hover:bg-verified-surface/40'
              }`}
            >
              <span>Accepted</span>
              <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-[2px] ${
                activeFilter === 'accepted' ? 'bg-white/20 text-white' : 'bg-verified-surface text-verified font-bold'
              }`}>
                {countAccepted}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveFilter('pending')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-[2px] transition-all whitespace-nowrap flex items-center gap-2 ${
                activeFilter === 'pending'
                  ? 'bg-cobalt text-white shadow-sm'
                  : 'text-text-secondary hover:text-cobalt hover:bg-surface-subtle'
              }`}
            >
              <span>Under Review</span>
              <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-[2px] ${
                activeFilter === 'pending' ? 'bg-white/20 text-white' : 'bg-surface-muted text-text-muted'
              }`}>
                {countPending}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveFilter('declined')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-[2px] transition-all whitespace-nowrap flex items-center gap-2 ${
                activeFilter === 'declined'
                  ? 'bg-text-secondary text-white shadow-sm'
                  : 'text-text-secondary hover:text-midnight hover:bg-surface-subtle'
              }`}
            >
              <span>Declined</span>
              <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-[2px] ${
                activeFilter === 'declined' ? 'bg-white/20 text-white' : 'bg-surface-muted text-text-muted'
              }`}>
                {countDeclined}
              </span>
            </button>
          </div>

          {/* Search Input */}
          <div className="relative min-w-[240px] sm:w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by property or locality..."
              className="w-full rounded-[2px] border border-border bg-white py-1.5 pl-9 pr-3 text-xs text-midnight placeholder:text-text-faint focus:border-cobalt focus:outline-none focus:ring-1 focus:ring-cobalt"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-midnight text-[11px] font-mono"
              >
                clear
              </button>
            )}
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-6 rounded-[2px] border border-tangerine-border bg-tangerine-surface p-4 text-xs text-tangerine-dark flex items-start justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-tangerine-dark" />
              <div>
                <p className="font-bold">Error loading applications</p>
                <p className="mt-0.5">{errorMessage}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => fetchRequests(true)}
              className="underline font-bold hover:text-midnight"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Loading State */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div
                key={i}
                className="rounded-[3px] border border-border bg-white p-6 shadow-sm animate-pulse space-y-4"
              >
                <div className="flex justify-between items-center">
                  <div className="h-5 w-32 bg-slate-200 rounded-[2px]"></div>
                  <div className="h-4 w-24 bg-slate-100 rounded-[2px]"></div>
                </div>
                <div className="h-6 w-3/4 bg-slate-200 rounded-[2px]"></div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div className="h-4 bg-slate-100 rounded-[2px]"></div>
                  <div className="h-4 bg-slate-100 rounded-[2px]"></div>
                  <div className="h-4 bg-slate-100 rounded-[2px]"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredRequests.length === 0 ? (
          /* Empty State */
          <div className="rounded-[3px] border border-border bg-white p-10 sm:p-14 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[2px] bg-surface-subtle border border-border text-cobalt mb-4">
              <Building2 className="h-7 w-7" />
            </div>

            <h3 className="text-lg sm:text-xl font-black text-midnight tracking-tight">
              {requests.length === 0 ? 'No Rental Applications Yet' : 'No Applications Matched'}
            </h3>

            <p className="mt-2 text-xs sm:text-sm text-text-secondary max-w-md mx-auto leading-relaxed">
              {requests.length === 0
                ? 'You have not submitted any move-in requests yet. Explore human-reviewed residential listings across Hyderabad and apply directly with no brokerage fees.'
                : 'No applications match your active search or filter selection. Clear your filters or browse available reviewed homes.'}
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              {requests.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setActiveFilter('all');
                    setSearchQuery('');
                  }}
                  className="inline-flex items-center gap-2 rounded-[2px] border border-border bg-white px-4 py-2.5 text-xs font-bold text-midnight hover:bg-surface-subtle transition-colors"
                >
                  <RotateCcw className="h-3.5 w-3.5 text-text-muted" />
                  <span>Reset Filters</span>
                </button>
              )}

              <Link
                href="/homes"
                className="inline-flex items-center gap-2 rounded-[2px] bg-cobalt px-5 py-2.5 text-xs font-bold text-white hover:bg-cobalt-hover transition-colors shadow-sm"
              >
                <span>Browse Reviewed Homes</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        ) : (
          /* Applications List */
          <div className="space-y-6">
            {filteredRequests.map(req => {
              const isAccepted = req.status === 'accepted';
              const isViewed = req.status === 'viewed';
              const isSubmitted = req.status === 'submitted';
              const isDeclined = req.status === 'declined';
              const listing = req.listing;

              return (
                <div
                  key={req.id}
                  className={`rounded-[3px] border bg-white shadow-sm overflow-hidden transition-all duration-200 ${
                    isAccepted
                      ? 'border-verified-border shadow-[0_4px_20px_rgba(14,111,75,0.08)] ring-1 ring-verified/20'
                      : 'border-border hover:border-cobalt/30 hover:shadow-md'
                  }`}
                >
                  {/* Top Status Header */}
                  <div
                    className={`flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 border-b ${
                      isAccepted
                        ? 'bg-verified-surface border-verified-border'
                        : isViewed
                        ? 'bg-[#FEF9C3]/50 border-[#FDE047]/60'
                        : isDeclined
                        ? 'bg-tangerine-surface/40 border-tangerine-border'
                        : 'bg-surface-subtle border-border'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Live Status Badge */}
                      {isAccepted && (
                        <span className="inline-flex items-center gap-1.5 rounded-[2px] bg-verified px-2.5 py-1 text-[11px] font-mono font-bold text-white uppercase tracking-wider shadow-xs">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Accepted • Contact Unlocked
                        </span>
                      )}

                      {isViewed && (
                        <span className="inline-flex items-center gap-1.5 rounded-[2px] bg-[#FEF08A] border border-[#EAB308] px-2.5 py-1 text-[11px] font-mono font-bold text-[#854D0E] uppercase tracking-wider">
                          <Eye className="h-3.5 w-3.5 text-[#854D0E]" />
                          Viewed by Owner
                        </span>
                      )}

                      {isSubmitted && (
                        <span className="inline-flex items-center gap-1.5 rounded-[2px] bg-cobalt-subtle border border-cobalt/20 px-2.5 py-1 text-[11px] font-mono font-bold text-cobalt uppercase tracking-wider">
                          <Clock className="h-3.5 w-3.5 text-cobalt" />
                          Submitted • Under Owner Review
                        </span>
                      )}

                      {isDeclined && (
                        <span className="inline-flex items-center gap-1.5 rounded-[2px] bg-tangerine-surface border border-tangerine-border px-2.5 py-1 text-[11px] font-mono font-bold text-tangerine-dark uppercase tracking-wider">
                          <XCircle className="h-3.5 w-3.5 text-tangerine-dark" />
                          Declined
                        </span>
                      )}

                      <span className="text-[11px] font-mono text-text-muted">
                        Ref: <strong className="text-midnight">#{req.id}</strong>
                      </span>
                    </div>

                    <div className="text-[11px] font-mono text-text-muted">
                      Applied: <span className="font-semibold text-midnight">{formatDate(req.createdAt)}</span>
                    </div>
                  </div>

                  {/* Main Card Content */}
                  <div className="p-5 sm:p-6 space-y-5">
                    {/* Top Row: Listing Details & Pricing */}
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2 text-xs font-semibold text-text-muted">
                          <MapPin className="h-3.5 w-3.5 text-cobalt shrink-0" />
                          <span>
                            {listing ? listing.colonyOrSociety : 'Residential Unit'}, {formatCluster(listing?.cluster)}
                          </span>
                        </div>

                        <h2 className="text-lg sm:text-xl font-black text-midnight tracking-tight hover:text-cobalt transition-colors">
                          {listing ? (
                            <Link href={`/homes/${listing.slug}`} className="inline-flex items-center gap-1.5 group">
                              <span>{listing.title}</span>
                              <ArrowUpRight className="h-4 w-4 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all text-cobalt" />
                            </Link>
                          ) : (
                            <span>Listing Reference #{req.listingId}</span>
                          )}
                        </h2>
                      </div>

                      {/* Rent Info */}
                      <div className="sm:text-right border-t sm:border-t-0 pt-3 sm:pt-0 border-border">
                        <div className="flex items-baseline sm:justify-end gap-1">
                          <span className="text-2xl font-black text-midnight tabular-nums">
                            {formatINR(listing?.monthlyRent || 0)}
                          </span>
                          <span className="text-xs text-text-muted font-medium">/ month</span>
                        </div>
                        {listing && (
                          <p className="text-[11px] text-text-muted mt-0.5">
                            {listing.isMaintenanceIncluded
                              ? 'Maintenance included'
                              : `+ ${formatINR(listing.maintenanceCharges)} maintenance`}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Move-in Application Details Grid */}
                    <div className="rounded-[2px] border border-border bg-surface-subtle/70 p-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                      <div className="space-y-1">
                        <span className="inline-flex items-center gap-1.5 text-text-muted font-medium">
                          <Calendar className="h-3.5 w-3.5 text-cobalt" />
                          Intended Move-in Date
                        </span>
                        <p className="font-bold text-midnight font-mono text-[13px]">
                          {formatDate(req.intendedMoveInDate)}
                        </p>
                      </div>

                      <div className="space-y-1">
                        <span className="inline-flex items-center gap-1.5 text-text-muted font-medium">
                          <Users className="h-3.5 w-3.5 text-cobalt" />
                          Household Composition
                        </span>
                        <p className="font-bold text-midnight">
                          {formatHousehold(req.householdArrangement, req.occupantsCount)}
                        </p>
                      </div>

                      <div className="space-y-1">
                        <span className="inline-flex items-center gap-1.5 text-text-muted font-medium">
                          <Briefcase className="h-3.5 w-3.5 text-cobalt" />
                          Profile & Lease Period
                        </span>
                        <p className="font-bold text-midnight">
                          {formatEmployment(req.employmentCategory)} • {req.rentalDurationMonths} Months
                        </p>
                      </div>
                    </div>

                    {/* Optional Renter Intro Message */}
                    {req.optionalIntroduction && (
                      <div className="rounded-[2px] border-l-2 border-cobalt bg-cobalt-subtle/50 px-3.5 py-2.5 text-xs text-text-secondary">
                        <span className="font-bold text-midnight">Your note to owner: </span>
                        <span className="italic">“{req.optionalIntroduction}”</span>
                      </div>
                    )}

                    {/* ========================================================================= */}
                    {/* ACCEPTED STATE: Decrypted Owner Contact + WhatsApp Button + Consent Note */}
                    {/* ========================================================================= */}
                    {isAccepted && req.ownerContact && (
                      <div className="rounded-[2px] border border-verified-border bg-[#F0FDF4] p-5 sm:p-6 space-y-5 animate-in fade-in duration-300">
                        {/* Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-verified-border/70 pb-4">
                          <div className="flex items-center gap-2.5">
                            <div className="flex h-8 w-8 items-center justify-center rounded-[2px] bg-verified text-white">
                              <ShieldCheck className="h-5 w-5" />
                            </div>
                            <div>
                              <h3 className="text-sm sm:text-base font-black text-midnight">
                                Property Owner Contact Unlocked
                              </h3>
                              <p className="text-[11px] text-verified font-bold uppercase tracking-wider font-mono">
                                Mutual Consent Verified & Approved
                              </p>
                            </div>
                          </div>

                          <span className="text-[11px] font-mono text-text-muted">
                            Unlocked: {formatTime(req.respondedAt || req.updatedAt)}
                          </span>
                        </div>

                        {/* Contact Information Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="rounded-[2px] border border-verified-border bg-white p-3.5 flex items-center gap-3">
                            <div className="h-8 w-8 rounded-[2px] bg-verified-surface flex items-center justify-center text-verified font-black text-xs font-mono">
                              {req.ownerContact.name.slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <p className="text-[10px] font-mono uppercase tracking-wider text-text-muted">
                                Owner Name
                              </p>
                              <p className="text-sm font-black text-midnight">{req.ownerContact.name}</p>
                            </div>
                          </div>

                          <div className="rounded-[2px] border border-verified-border bg-white p-3.5 flex items-center gap-3">
                            <div className="h-8 w-8 rounded-[2px] bg-verified-surface flex items-center justify-center text-verified">
                              <Phone className="h-4 w-4" />
                            </div>
                            <div>
                              <p className="text-[10px] font-mono uppercase tracking-wider text-text-muted">
                                Verified Phone
                              </p>
                              <p className="text-sm font-black text-midnight font-mono tabular-nums">
                                {req.ownerContact.phone}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* CTAs: WhatsApp + Phone Call */}
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
                          {/* High-visibility green WhatsApp CTA button */}
                          <a
                            href={getWhatsAppUrl(req.ownerContact.phone, listing?.title)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 inline-flex items-center justify-center gap-2.5 rounded-[2px] bg-[#0E6F4B] hover:bg-[#0A5237] text-white px-5 py-3 text-xs sm:text-sm font-bold tracking-wide transition-all shadow-[0_2px_10px_rgba(14,111,75,0.25)] hover:shadow-[0_4px_16px_rgba(14,111,75,0.35)]"
                          >
                            <MessageCircle className="h-4 w-4" />
                            <span>Connect on WhatsApp</span>
                          </a>

                          {/* Direct Phone Call Button */}
                          <a
                            href={`tel:${req.ownerContact.phone.replace(/[^0-9+]/g, '')}`}
                            className="inline-flex items-center justify-center gap-2 rounded-[2px] border border-border bg-white hover:bg-surface-subtle text-midnight px-4 py-3 text-xs sm:text-sm font-bold transition-colors"
                          >
                            <Phone className="h-4 w-4 text-cobalt" />
                            <span>Call Directly</span>
                          </a>
                        </div>

                        {/* Mutual Consent Disclosure */}
                        <div className="rounded-[2px] border border-verified-border bg-white/80 p-3.5 text-left">
                          <div className="flex items-start gap-2.5">
                            <Info className="h-4 w-4 shrink-0 mt-0.5 text-verified" />
                            <div className="text-[11px] leading-relaxed text-text-secondary">
                              <strong className="text-midnight font-bold">Mutual Consent Disclosure: </strong>
                              Property owner contact details are released exclusively to you because both parties have consented to direct communication for this specific residence. Under The Rental Circle Zero-Spam Policy, phone numbers remain private and are never sold or published publicly.
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* ========================================================================= */}
                    {/* DECLINED STATE: Reason and Exploration CTA */}
                    {/* ========================================================================= */}
                    {isDeclined && (
                      <div className="rounded-[2px] border border-tangerine-border bg-tangerine-surface/50 p-4 space-y-3">
                        <div className="flex items-start gap-2.5">
                          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-tangerine-dark" />
                          <div className="text-xs text-text-secondary">
                            <p className="font-bold text-midnight">Application Not Accepted by Owner</p>
                            <p className="mt-1 text-text-secondary">
                              {req.declineReason ||
                                'The property owner was unable to accommodate this move-in timeline or occupant configuration.'}
                            </p>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-tangerine-border/60 flex items-center justify-between">
                          <span className="text-[11px] text-text-muted">
                            Explore similar reviewed homes in {formatCluster(listing?.cluster)}:
                          </span>
                          <Link
                            href="/homes"
                            className="inline-flex items-center gap-1 text-xs font-bold text-cobalt hover:underline"
                          >
                            <span>Browse Locality Homes</span>
                            <ChevronRight className="h-3.5 w-3.5" />
                          </Link>
                        </div>
                      </div>
                    )}

                    {/* ========================================================================= */}
                    {/* PENDING / VIEWED HELPER NOTE */}
                    {/* ========================================================================= */}
                    {(isSubmitted || isViewed) && (
                      <div className="rounded-[2px] border border-border bg-surface-subtle p-3.5 text-xs text-text-muted flex items-start gap-2.5">
                        <Lock className="h-4 w-4 shrink-0 mt-0.5 text-cobalt" />
                        <div className="leading-relaxed">
                          {isViewed ? (
                            <span>
                              <strong className="text-midnight font-semibold">Application Viewed: </strong>
                              The property owner has reviewed your occupant profile and move-in timeline. Once they accept your application, their verified contact details and direct WhatsApp connect will be unlocked here.
                            </span>
                          ) : (
                            <span>
                              <strong className="text-midnight font-semibold">Privacy Protected: </strong>
                              Your phone number remains securely encrypted until the property owner reviews and accepts your structured application. No broker intermediaries will contact you.
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Bottom Educational Banner: How Requests Work */}
        <div className="mt-12 rounded-[3px] border border-border bg-white p-6 sm:p-8">
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-cobalt mb-3">
            <Sparkles className="h-3.5 w-3.5" />
            The Rental Circle Protocol
          </div>
          <h3 className="text-lg sm:text-xl font-black text-midnight tracking-tight">
            How The Rental Circle Protects Both Renters & Owners
          </h3>
          <p className="text-xs sm:text-sm text-text-secondary mt-1 max-w-3xl leading-relaxed">
            Unlike classified portals that broadcast your phone number to dozens of brokers, The Rental Circle uses structured mutual consent to maintain privacy and quality.
          </p>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-border">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-[2px] bg-cobalt text-white text-[11px] font-mono font-bold">
                  1
                </span>
                <h4 className="text-xs font-black text-midnight">Structured Application</h4>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">
                You send your intended move-in date, lease period, and household arrangement without exposing unencrypted contact data publicly.
              </p>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-[2px] bg-cobalt text-white text-[11px] font-mono font-bold">
                  2
                </span>
                <h4 className="text-xs font-black text-midnight">Human Owner Review</h4>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">
                The reviewed home owner reviews your criteria to ensure alignment before any direct personal communication begins.
              </p>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-[2px] bg-verified text-white text-[11px] font-mono font-bold">
                  3
                </span>
                <h4 className="text-xs font-black text-midnight">Instant Mutual Unlock</h4>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">
                Upon owner acceptance, verified phone numbers are unlocked to both parties with 1-click WhatsApp and direct phone connection.
              </p>
            </div>
          </div>
        </div>
      </div>
      </div>
    </RouteGuard>
  );
}