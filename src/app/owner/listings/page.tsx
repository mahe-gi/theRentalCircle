'use client';

import { RouteGuard } from '@/components/auth/RouteGuard';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Building2, 
  PlusCircle, 
  RotateCcw, 
  Search, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  Users, 
  ArrowUpRight, 
  ShieldCheck, 
  Check, 
  AlertTriangle, 
  PauseCircle, 
  Home, 
  X,
  Calendar,
  Sparkles,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { formatINR } from '@/lib/utils';
import { getSessionUser } from '@/lib/session';

interface OwnerListingItem {
  id: string;
  slug: string;
  title: string;
  description: string;
  status: 'draft' | 'pending_review' | 'published' | 'paused' | 'rented' | 'rejected' | 'suspended';
  cluster: string;
  colonyOrSociety: string;
  landmark?: string;
  pincode: string;
  propertyType: string;
  monthlyRent: number;
  securityDeposit: number;
  maintenanceCharges: number;
  isMaintenanceIncluded: boolean;
  lockInMonths: number;
  noticeDays: number;
  furnishingStatus: string;
  carpetAreaSqFt: number;
  floorNumber: number;
  totalFloors: number;
  availableFrom: string;
  petsAllowed: boolean;
  amenities: string[];
  photos: {
    url: string;
    roomTag: string;
    isCover: boolean;
    caption?: string;
  }[];
  evidence?: {
    type: string;
    urlOrDoc: string;
    consumerNumber?: string;
    verified: boolean;
  };
  submittedAt: string;
  publishedAt?: string;
  lastAvailabilityConfirmedAt: string;
  requestsCount?: number;
  pendingRequestsCount?: number;
  acceptedRequestsCount?: number;
}

export default function OwnerListingsDashboardPage() {
  const [listings, setListings] = useState<OwnerListingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Reconfirm Availability Modal State
  const [reconfirmModalListing, setReconfirmModalListing] = useState<OwnerListingItem | null>(null);
  const [isReconfirming, setIsReconfirming] = useState(false);
  const [reconfirmSuccessId, setReconfirmSuccessId] = useState<string | null>(null);

  const fetchListings = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/owner/listings');
      const data = await res.json();
      if (data.success && Array.isArray(data.listings)) {
        setListings(data.listings);
      }
    } catch (err) {
      console.error('Failed to load owner listings', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  // Handle reconfirm availability API call
  const handleReconfirmAvailability = async (listingId: string) => {
    setIsReconfirming(true);
    try {
      const res = await fetch(`/api/owner/listings/${listingId}/reconfirm`, {
        method: 'POST',
      });
      const data = await res.json();
      if (res.ok && data.success) {
        // Update local state with new timestamp
        setListings(prev =>
          prev.map(l =>
            l.id === listingId
              ? { ...l, lastAvailabilityConfirmedAt: new Date().toISOString() }
              : l
          )
        );
        setReconfirmSuccessId(listingId);
        setTimeout(() => {
          setReconfirmSuccessId(null);
        }, 4000);
      }
    } catch (err) {
      console.error('Failed to reconfirm availability', err);
    } finally {
      setIsReconfirming(false);
      setReconfirmModalListing(null);
    }
  };

  // Status Badge Component
  const getStatusBadge = (status: OwnerListingItem['status']) => {
    switch (status) {
      case 'published':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-[2px] bg-verified-surface border border-verified-border px-2.5 py-0.5 text-[10px] font-mono font-bold text-verified uppercase tracking-wider">
            <CheckCircle2 className="h-3 w-3 text-verified" />
            Published Live
          </span>
        );
      case 'pending_review':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-[2px] bg-citrus/20 border border-citrus/60 px-2.5 py-0.5 text-[10px] font-mono font-bold text-midnight uppercase tracking-wider">
            <span className="h-1.5 w-1.5 rounded-full bg-midnight animate-pulse"></span>
            Pending Review
          </span>
        );
      case 'draft':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-[2px] bg-surface-muted border border-border px-2.5 py-0.5 text-[10px] font-mono font-bold text-text-muted uppercase tracking-wider">
            Draft
          </span>
        );
      case 'paused':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-[2px] bg-amber-50 border border-amber-200 px-2.5 py-0.5 text-[10px] font-mono font-bold text-amber-800 uppercase tracking-wider">
            <PauseCircle className="h-3 w-3" />
            Paused
          </span>
        );
      case 'rented':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-[2px] bg-blue-50 border border-blue-200 px-2.5 py-0.5 text-[10px] font-mono font-bold text-blue-700 uppercase tracking-wider">
            <Home className="h-3 w-3" />
            Rented Out
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-[2px] bg-tangerine-surface border border-tangerine-border px-2.5 py-0.5 text-[10px] font-mono font-bold text-tangerine-dark uppercase tracking-wider">
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 rounded-[2px] bg-surface-muted border border-border px-2.5 py-0.5 text-[10px] font-mono font-bold text-text-muted uppercase tracking-wider">
            {status}
          </span>
        );
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return new Intl.DateTimeFormat('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }).format(d);
    } catch {
      return dateStr;
    }
  };

  // Filter listings
  const filteredListings = listings.filter(item => {
    if (activeTab !== 'all' && item.status !== activeTab) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = (item.title || '').toLowerCase().includes(q);
      const matchColony = (item.colonyOrSociety || '').toLowerCase().includes(q);
      const matchCluster = (item.cluster || '').toLowerCase().includes(q);
      if (!matchTitle && !matchColony && !matchCluster) return false;
    }
    return true;
  });

  const totalCount = listings.length;
  const publishedCount = listings.filter(l => l.status === 'published').length;
  const pendingCount = listings.filter(l => l.status === 'pending_review').length;
  const totalApplicants = listings.reduce((acc, curr) => acc + (curr.requestsCount || 0), 0);

  return (
    <RouteGuard allowedRoles={["owner","admin"]} title="Owner Property Portal" description="This area is reserved for property owners to manage listings and review move-in requests.">
      <div className="min-h-screen bg-canvas text-midnight font-sans antialiased selection:bg-cobalt selection:text-white pb-20">
      {/* Top Header & Metrics */}
      <div className="border-b border-border bg-white shadow-xs">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1.5 text-left">
              <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-text-muted">
                <Link href="/" className="hover:text-midnight">Home</Link>
                <span>/</span>
                <span className="text-cobalt">Owner Desk</span>
              </div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-black text-midnight tracking-tight">
                  Owner Properties Dashboard
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1 rounded-[2px] bg-surface-muted border border-border px-2 py-0.5 text-[10px] font-mono font-bold text-midnight uppercase">
                  Direct Listing Control
                </span>
              </div>
              <p className="text-xs sm:text-sm text-text-secondary max-w-2xl">
                Manage your residential properties in West Hyderabad, track pending verification reviews, reconfirm availability, and review structured tenant applications.
              </p>
            </div>

            {/* Top Action CTA: List New Property */}
            <div className="flex items-center gap-3 shrink-0 self-start sm:self-auto">
              <button
                type="button"
                onClick={fetchListings}
                className="inline-flex items-center justify-center gap-1.5 rounded-[2px] border border-border bg-white px-3.5 py-2.5 text-xs font-mono font-bold text-midnight hover:border-midnight hover:bg-surface-subtle transition-all active:scale-98"
                title="Refresh Dashboard"
              >
                <RotateCcw className="h-3.5 w-3.5 text-text-muted" />
                <span className="hidden sm:inline">Refresh</span>
              </button>

              <Link
                href="/owner/listings/new"
                className="inline-flex items-center justify-center gap-2 rounded-[2px] bg-cobalt px-5 py-2.5 text-xs font-mono font-black uppercase tracking-wider text-white hover:bg-cobalt-hover transition-all active:scale-98 shadow-sm"
              >
                <PlusCircle className="h-4 w-4" />
                <span>List New Property</span>
              </Link>
            </div>
          </div>

          {/* 4 Summary Metric Counters */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 pt-2">
            {/* Total Properties */}
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className={`p-4 rounded-[2px] border text-left transition-all ${
                activeTab === 'all'
                  ? 'border-midnight bg-white shadow-sm ring-1 ring-midnight'
                  : 'border-border bg-white hover:border-midnight/50'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-mono font-bold uppercase tracking-wider text-text-muted">
                <span>Total Properties</span>
                <Building2 className="h-4 w-4 text-text-muted" />
              </div>
              <div className="text-3xl font-black text-midnight font-mono mt-2">{totalCount}</div>
              <p className="text-[11px] text-text-secondary mt-0.5">In your owner portfolio</p>
            </button>

            {/* Published Live */}
            <button
              type="button"
              onClick={() => setActiveTab('published')}
              className={`p-4 rounded-[2px] border text-left transition-all ${
                activeTab === 'published'
                  ? 'border-verified bg-white shadow-sm ring-1 ring-verified'
                  : 'border-border bg-white hover:border-midnight/50'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-mono font-bold uppercase tracking-wider text-verified">
                <span>Published Live</span>
                <CheckCircle2 className="h-4 w-4 text-verified" />
              </div>
              <div className="text-3xl font-black text-verified font-mono mt-2">{publishedCount}</div>
              <p className="text-[11px] text-text-secondary mt-0.5">Active in public catalog</p>
            </button>

            {/* Pending Review */}
            <button
              type="button"
              onClick={() => setActiveTab('pending_review')}
              className={`p-4 rounded-[2px] border text-left transition-all ${
                activeTab === 'pending_review'
                  ? 'border-midnight bg-white shadow-sm ring-1 ring-midnight'
                  : 'border-border bg-white hover:border-midnight/50'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-mono font-bold uppercase tracking-wider text-midnight">
                <span>Pending Review</span>
                <Clock className="h-4 w-4 text-citrus" />
              </div>
              <div className="text-3xl font-black text-midnight font-mono mt-2">{pendingCount}</div>
              <p className="text-[11px] text-text-secondary mt-0.5">Awaiting phone handshake</p>
            </button>

            {/* Total Inquiries */}
            <div className="p-4 rounded-[2px] border border-border bg-white text-left">
              <div className="flex items-center justify-between text-xs font-mono font-bold uppercase tracking-wider text-cobalt">
                <span>Applicant Inquiries</span>
                <Users className="h-4 w-4 text-cobalt" />
              </div>
              <div className="text-3xl font-black text-cobalt font-mono mt-2">{totalApplicants}</div>
              <p className="text-[11px] text-text-secondary mt-0.5">Direct renter applications</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Reconfirm Success Notification Toast */}
        {reconfirmSuccessId && (
          <div className="p-4 rounded-[2px] bg-verified-surface border border-verified-border text-verified flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-center gap-2.5 text-xs font-bold font-mono">
              <CheckCircle2 className="h-4 w-4 text-verified" />
              <span>Availability successfully reconfirmed! Your listing timestamp has been refreshed.</span>
            </div>
            <span className="text-[10px] font-mono font-bold uppercase text-verified">Freshly Confirmed</span>
          </div>
        )}

        {/* Filter and Search Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
          {/* Status Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            {[
              { id: 'all', label: 'All', count: totalCount },
              { id: 'published', label: 'Published', count: publishedCount },
              { id: 'pending_review', label: 'Pending Review', count: pendingCount },
              { id: 'rented', label: 'Rented', count: listings.filter(l => l.status === 'rented').length },
              { id: 'paused', label: 'Paused', count: listings.filter(l => l.status === 'paused').length },
              { id: 'draft', label: 'Draft', count: listings.filter(l => l.status === 'draft').length },
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wider rounded-[2px] transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-midnight text-white font-bold shadow-xs'
                    : 'bg-white border border-border text-text-secondary hover:border-midnight hover:text-midnight'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative min-w-[240px] sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-text-faint" />
            <input
              type="text"
              placeholder="Search by title, colony, or corridor..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs font-medium text-midnight border border-border rounded-[2px] bg-white focus:border-cobalt focus:outline-none shadow-xs"
            />
          </div>
        </div>

        {/* Listings Grid / Cards */}
        {isLoading ? (
          <div className="py-20 text-center space-y-3">
            <div className="h-6 w-6 border-2 border-cobalt border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-mono text-text-muted uppercase tracking-wider">Loading your properties...</p>
          </div>
        ) : filteredListings.length > 0 ? (
          <div className="space-y-4">
            {filteredListings.map(listing => {
              const coverPhoto = listing.photos.find(p => p.isCover) || listing.photos[0];
              const applicantsCount = listing.requestsCount || 0;
              const pendingApps = listing.pendingRequestsCount || 0;

              return (
                <div
                  key={listing.id}
                  className="rounded-[2px] border border-border bg-white p-5 sm:p-6 transition-all hover:border-midnight/50 hover:shadow-sm space-y-4 text-left group"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-5">
                    {/* Left Column: Photo & Core Details */}
                    <div className="flex items-start gap-4 grow">
                      {/* Cover Photo */}
                      <div className="h-24 w-28 sm:h-28 sm:w-36 rounded-[2px] overflow-hidden border border-border bg-surface-muted shrink-0 relative">
                        {coverPhoto ? (
                          <img
                            src={coverPhoto.url}
                            alt={listing.title}
                            className="h-full w-full object-cover group-hover:scale-102 transition-transform duration-300"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-text-faint">
                            <Building2 className="h-6 w-6" />
                          </div>
                        )}
                        <span className="absolute bottom-1 right-1 bg-midnight/90 text-white font-mono text-[8px] font-bold px-1 rounded-[2px]">
                          {listing.photos.length} Photos
                        </span>
                      </div>

                      {/* Main Property Info */}
                      <div className="space-y-2 grow">
                        <div className="flex flex-wrap items-center gap-2">
                          {getStatusBadge(listing.status)}
                          <span className="rounded-[2px] bg-surface-muted border border-border px-2 py-0.5 text-[9px] font-mono font-bold uppercase text-cobalt">
                            {listing.propertyType.replace('_', ' ')}
                          </span>
                          <span className="text-[10px] font-mono text-text-muted">
                            &bull; {listing.carpetAreaSqFt} sq.ft
                          </span>
                          <span className="text-[10px] font-mono text-text-muted capitalize">
                            &bull; {listing.furnishingStatus.replace('_', ' ')}
                          </span>
                        </div>

                        <div>
                          <h3 className="text-base sm:text-lg font-black text-midnight tracking-tight group-hover:text-cobalt transition-colors">
                            {listing.title}
                          </h3>
                          <p className="text-xs text-text-secondary font-mono flex items-center gap-1 mt-0.5">
                            <MapPin className="h-3.5 w-3.5 text-cobalt shrink-0" />
                            <span>{listing.colonyOrSociety}, {listing.cluster.toUpperCase()}</span>
                          </p>
                        </div>

                        {/* Financial Breakdown Pill */}
                        <div className="flex flex-wrap items-center gap-4 text-xs font-mono pt-1">
                          <div>
                            <span className="text-[10px] text-text-muted uppercase">Rent: </span>
                            <strong className="text-midnight text-sm font-bold">{formatINR(listing.monthlyRent)}</strong>
                            <span className="text-[10px] text-text-muted">/mo</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-text-muted uppercase">Deposit: </span>
                            <strong className="text-midnight">{formatINR(listing.securityDeposit)}</strong>
                          </div>
                          <div>
                            <span className="text-[10px] text-text-muted uppercase">Maintenance: </span>
                            <strong className="text-midnight">
                              {listing.isMaintenanceIncluded
                                ? 'Included'
                                : listing.maintenanceCharges > 0
                                ? formatINR(listing.maintenanceCharges)
                                : 'Nil'}
                            </strong>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Actions & Applicant Metrics */}
                    <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-center gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-border shrink-0">
                      {/* Applicants Indicator */}
                      <Link
                        href={`/owner/listings/${listing.id}/requests`}
                        className={`inline-flex items-center gap-2 rounded-[2px] border px-4 py-2 text-xs font-mono font-bold uppercase transition-all ${
                          pendingApps > 0
                            ? 'bg-citrus/20 border-midnight text-midnight ring-1 ring-midnight hover:bg-citrus/40'
                            : 'bg-surface-subtle border-border text-midnight hover:border-midnight hover:bg-white'
                        }`}
                      >
                        <Users className="h-3.5 w-3.5 text-cobalt" />
                        <span>
                          {applicantsCount} {applicantsCount === 1 ? 'Applicant' : 'Applicants'}
                        </span>
                        {pendingApps > 0 && (
                          <span className="rounded-full bg-midnight text-white text-[9px] px-1.5 py-0.2 font-bold">
                            {pendingApps} New
                          </span>
                        )}
                        <ChevronRight className="h-3 w-3 text-text-muted" />
                      </Link>

                      {/* Quick Action: Reconfirm Availability Button */}
                      <button
                        type="button"
                        onClick={() => setReconfirmModalListing(listing)}
                        className="inline-flex items-center gap-1.5 rounded-[2px] border border-border bg-white px-3.5 py-2 text-xs font-mono font-bold uppercase tracking-wider text-midnight hover:border-midnight hover:bg-surface-subtle transition-all active:scale-98"
                      >
                        <RotateCcw className="h-3 w-3 text-cobalt" />
                        <span>Reconfirm Availability</span>
                      </button>
                    </div>
                  </div>

                  {/* Card Bottom Meta Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border/70 pt-3 text-[11px] font-mono text-text-muted">
                    <div className="flex items-center gap-3">
                      <span>Submitted: {formatDate(listing.submittedAt)}</span>
                      <span>&bull;</span>
                      <span>
                        Last confirmed: <strong>{formatDate(listing.lastAvailabilityConfirmedAt)}</strong>
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      {listing.status === 'published' && (
                        <Link
                          href={`/homes/${listing.slug}`}
                          target="_blank"
                          className="text-cobalt font-bold hover:underline flex items-center gap-1"
                        >
                          <span>View Public Page</span>
                          <ExternalLink className="h-2.5 w-2.5" />
                        </Link>
                      )}
                      <Link
                        href={`/owner/listings/${listing.id}/requests`}
                        className="text-midnight font-bold hover:underline flex items-center gap-1"
                      >
                        <span>View Applicant Inbox ({applicantsCount})</span>
                        <ArrowUpRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="rounded-[2px] border border-border bg-white p-12 text-center space-y-4 shadow-xs">
            <div className="h-12 w-12 rounded-full bg-surface-muted flex items-center justify-center mx-auto text-text-muted">
              <Building2 className="h-6 w-6" />
            </div>
            <div className="space-y-1 max-w-md mx-auto">
              <h3 className="text-base font-bold text-midnight">No properties found</h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                {searchQuery || activeTab !== 'all'
                  ? 'No listings matched your active filter or search criteria. Try resetting your search.'
                  : 'You have not listed any properties on The Rental Circle yet. Start your first zero-brokerage listing now.'}
              </p>
            </div>
            <div className="pt-2">
              <Link
                href="/owner/listings/new"
                className="inline-flex items-center gap-2 rounded-[2px] bg-midnight px-6 py-3 text-xs font-mono font-bold uppercase tracking-wider text-white hover:bg-cobalt transition-all shadow-sm"
              >
                <PlusCircle className="h-4 w-4" />
                <span>List Your First Property</span>
              </Link>
            </div>
          </div>
        )}

        {/* Verification Policy Ledger Callout */}
        <div className="rounded-[2px] border border-border bg-surface-subtle p-5 sm:p-6 text-left space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-cobalt">
            <ShieldCheck className="h-4 w-4 text-cobalt" /> The Rental Circle Verification Protocol
          </div>
          <p className="text-xs text-text-secondary leading-relaxed max-w-3xl">
            Listed properties undergo private TSSPDCL / government utility inspection and a founder verification handshake before publication. When a prospective renter applies, you retain 100% control to accept or decline. Your phone number is only shared upon mutual acceptance.
          </p>
        </div>
      </div>

      {/* RECONFIRM AVAILABILITY MODAL */}
      {reconfirmModalListing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-midnight/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-[2px] border border-border bg-white p-6 shadow-2xl space-y-5 text-left">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-midnight">
                <RotateCcw className="h-4 w-4 text-cobalt" />
                <span>Reconfirm Property Availability</span>
              </div>
              <button
                type="button"
                onClick={() => setReconfirmModalListing(null)}
                className="p-1 text-text-muted hover:text-midnight rounded-[2px]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-[2px] bg-surface-subtle border border-border space-y-1">
                <p className="text-xs font-bold text-midnight line-clamp-1">{reconfirmModalListing.title}</p>
                <p className="text-[11px] font-mono text-text-muted">
                  {reconfirmModalListing.colonyOrSociety}, {reconfirmModalListing.cluster.toUpperCase()} &bull; {formatINR(reconfirmModalListing.monthlyRent)}/mo
                </p>
              </div>

              <p className="text-xs text-text-secondary leading-relaxed">
                By reconfirming availability, you verify to prospective renters and moderators that this property is <strong>currently vacant and ready for lease inquiries</strong>.
              </p>

              <div className="p-3 rounded-[2px] bg-verified-surface border border-verified-border text-[11px] font-mono text-verified leading-tight">
                ✓ Reconfirming availability refreshes your listing rank in search results and signals high active responsiveness to quality applicants.
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-border">
              <button
                type="button"
                onClick={() => setReconfirmModalListing(null)}
                disabled={isReconfirming}
                className="px-4 py-2 text-xs font-mono font-bold uppercase rounded-[2px] border border-border text-text-secondary hover:border-midnight hover:text-midnight"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleReconfirmAvailability(reconfirmModalListing.id)}
                disabled={isReconfirming}
                className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-mono font-bold uppercase rounded-[2px] bg-midnight text-white hover:bg-cobalt transition-all shadow-xs"
              >
                {isReconfirming ? (
                  <>
                    <span className="h-3 w-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Updating...</span>
                  </>
                ) : (
                  <>
                    <Check className="h-3.5 w-3.5 text-citrus" />
                    <span>Confirm Still Available</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </RouteGuard>
  );
}