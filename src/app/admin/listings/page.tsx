'use client';

import { RouteGuard } from '@/components/auth/RouteGuard';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Clock, 
  Eye, 
  ArrowUpRight, 
  Building2, 
  PhoneCall, 
  FileText, 
  Check, 
  RotateCcw,
  Sparkles,
  MapPin
} from 'lucide-react';
import { formatINR } from '@/lib/utils';
import { getAllAdminListings, type AdminListing } from '@/lib/mock-listings';

type StatusFilter = 'all' | 'pending_review' | 'published' | 'rejected';

export default function AdminModerationQueuePage() {
  const [listings, setListings] = useState<AdminListing[]>([]);
  const [activeTab, setActiveTab] = useState<StatusFilter>('pending_review');
  const [searchQuery, setSearchQuery] = useState('');
  const [clusterFilter, setClusterFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  const fetchListings = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/listings', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (data.listings && Array.isArray(data.listings)) {
          setListings(data.listings);
          setIsLoading(false);
          return;
        }
      }
    } catch {
      // fallback
    }
    const data = getAllAdminListings();
    setListings([...data]);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchListings();
  }, []);

  // Filter listings based on tab, cluster, and search query
  const filteredListings = listings.filter(item => {
    // Tab filter
    if (activeTab !== 'all' && item.status !== activeTab) {
      return false;
    }

    // Cluster filter
    if (clusterFilter !== 'all' && item.cluster !== clusterFilter) {
      return false;
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchColony = item.colonyOrSociety.toLowerCase().includes(q);
      const matchOwner = item.owner.name.toLowerCase().includes(q) || item.owner.email.toLowerCase().includes(q);
      const matchId = item.id.toLowerCase().includes(q);
      const matchCluster = item.cluster.toLowerCase().includes(q);
      if (!matchTitle && !matchColony && !matchOwner && !matchId && !matchCluster) {
        return false;
      }
    }

    return true;
  });

  const pendingCount = listings.filter(l => l.status === 'pending_review').length;
  const publishedCount = listings.filter(l => l.status === 'published').length;
  const rejectedCount = listings.filter(l => l.status === 'rejected').length;
  const totalCount = listings.length;

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return new Intl.DateTimeFormat('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }).format(date);
    } catch {
      return isoString;
    }
  };

  const getStatusBadge = (status: AdminListing['status']) => {
    switch (status) {
      case 'pending_review':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-[2px] bg-citrus/20 border border-citrus/60 px-2.5 py-1 text-[10px] font-mono font-bold text-midnight uppercase tracking-wider">
            <span className="h-1.5 w-1.5 rounded-full bg-midnight animate-pulse"></span>
            Pending Review
          </span>
        );
      case 'published':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-[2px] bg-verified-surface border border-verified-border px-2.5 py-1 text-[10px] font-mono font-bold text-verified uppercase tracking-wider">
            <CheckCircle2 className="h-3 w-3 text-verified" />
            Published
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-[2px] bg-tangerine-surface border border-tangerine-border px-2.5 py-1 text-[10px] font-mono font-bold text-tangerine-dark uppercase tracking-wider">
            <XCircle className="h-3 w-3 text-tangerine" />
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 rounded-[2px] bg-surface-muted border border-border px-2.5 py-1 text-[10px] font-mono font-bold text-text-muted uppercase tracking-wider">
            {status}
          </span>
        );
    }
  };

  return (
    <RouteGuard allowedRoles={["admin"]} title="Admin Moderation Access Restricted" description="This portal is strictly restricted to platform moderators and operators.">
      <div className="min-h-screen bg-canvas text-midnight font-sans antialiased selection:bg-cobalt selection:text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header Breadcrumb & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
          <div className="space-y-1.5 text-left">
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-text-muted">
              <Link href="/" className="hover:text-midnight">Home</Link>
              <span>/</span>
              <span className="text-cobalt">Admin Moderation</span>
            </div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-black text-midnight tracking-tight">
                Admin Moderation Queue
              </h1>
              <span className="inline-flex items-center gap-1 rounded-[2px] bg-cobalt px-2.5 py-0.5 text-[10px] font-mono font-black uppercase text-white tracking-widest">
                <ShieldCheck className="h-3 w-3 text-citrus" /> TRUST DESK
              </span>
            </div>
            <p className="text-xs sm:text-sm text-text-secondary">
              Review owner declarations, inspect room photographs, and verify private TSSPDCL / GHMC utility records before publishing.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchListings}
            className="inline-flex items-center justify-center gap-2 rounded-[2px] border border-border bg-white px-3.5 py-2 text-xs font-bold text-midnight hover:border-midnight hover:bg-surface-subtle transition-all active:scale-95 shadow-sm shrink-0 self-start sm:self-auto"
          >
            <RotateCcw className="h-3.5 w-3.5 text-text-muted" />
            <span>Refresh Queue</span>
          </button>
        </div>

        {/* 4 Summary Metric Counters */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Pending Review */}
          <button
            type="button"
            onClick={() => setActiveTab('pending_review')}
            className={`p-4 rounded-[2px] border text-left transition-all ${
              activeTab === 'pending_review'
                ? 'border-midnight bg-white shadow-md ring-1 ring-midnight'
                : 'border-border bg-white hover:border-midnight/50'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-mono font-bold uppercase tracking-wider text-text-muted">
              <span>Pending Review</span>
              <span className="h-2 w-2 rounded-full bg-citrus ring-2 ring-midnight"></span>
            </div>
            <div className="text-3xl font-black text-midnight font-mono mt-2">{pendingCount}</div>
            <p className="text-[11px] text-text-secondary mt-1">Requires evidence inspection</p>
          </button>

          {/* Published */}
          <button
            type="button"
            onClick={() => setActiveTab('published')}
            className={`p-4 rounded-[2px] border text-left transition-all ${
              activeTab === 'published'
                ? 'border-verified bg-white shadow-md ring-1 ring-verified'
                : 'border-border bg-white hover:border-midnight/50'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-mono font-bold uppercase tracking-wider text-verified">
              <span>Published Live</span>
              <CheckCircle2 className="h-3.5 w-3.5 text-verified" />
            </div>
            <div className="text-3xl font-black text-verified font-mono mt-2">{publishedCount}</div>
            <p className="text-[11px] text-text-secondary mt-1">Live in public catalog</p>
          </button>

          {/* Rejected */}
          <button
            type="button"
            onClick={() => setActiveTab('rejected')}
            className={`p-4 rounded-[2px] border text-left transition-all ${
              activeTab === 'rejected'
                ? 'border-tangerine bg-white shadow-md ring-1 ring-tangerine'
                : 'border-border bg-white hover:border-midnight/50'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-mono font-bold uppercase tracking-wider text-tangerine-dark">
              <span>Rejected / Policy</span>
              <XCircle className="h-3.5 w-3.5 text-tangerine" />
            </div>
            <div className="text-3xl font-black text-tangerine-dark font-mono mt-2">{rejectedCount}</div>
            <p className="text-[11px] text-text-secondary mt-1">Broker suspicion / bad data</p>
          </button>

          {/* All Listings */}
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`p-4 rounded-[2px] border text-left transition-all ${
              activeTab === 'all'
                ? 'border-cobalt bg-white shadow-md ring-1 ring-cobalt'
                : 'border-border bg-white hover:border-midnight/50'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-mono font-bold uppercase tracking-wider text-cobalt">
              <span>Total Submissions</span>
              <Building2 className="h-3.5 w-3.5 text-cobalt" />
            </div>
            <div className="text-3xl font-black text-midnight font-mono mt-2">{totalCount}</div>
            <p className="text-[11px] text-text-secondary mt-1">All pipeline records</p>
          </button>
        </div>

        {/* Filter and Search Bar */}
        <div className="space-y-4">
          {/* Status Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-3">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
              <button
                type="button"
                onClick={() => setActiveTab('pending_review')}
                className={`touch-target px-4 py-2 text-xs font-bold uppercase tracking-wider font-mono rounded-[2px] transition-all ${
                  activeTab === 'pending_review'
                    ? 'bg-midnight text-white shadow-sm'
                    : 'bg-white border border-border text-text-secondary hover:text-midnight hover:border-midnight'
                }`}
              >
                Pending Review ({pendingCount})
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('published')}
                className={`touch-target px-4 py-2 text-xs font-bold uppercase tracking-wider font-mono rounded-[2px] transition-all ${
                  activeTab === 'published'
                    ? 'bg-midnight text-white shadow-sm'
                    : 'bg-white border border-border text-text-secondary hover:text-midnight hover:border-midnight'
                }`}
              >
                Published ({publishedCount})
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('rejected')}
                className={`touch-target px-4 py-2 text-xs font-bold uppercase tracking-wider font-mono rounded-[2px] transition-all ${
                  activeTab === 'rejected'
                    ? 'bg-midnight text-white shadow-sm'
                    : 'bg-white border border-border text-text-secondary hover:text-midnight hover:border-midnight'
                }`}
              >
                Rejected ({rejectedCount})
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('all')}
                className={`touch-target px-4 py-2 text-xs font-bold uppercase tracking-wider font-mono rounded-[2px] transition-all ${
                  activeTab === 'all'
                    ? 'bg-midnight text-white shadow-sm'
                    : 'bg-white border border-border text-text-secondary hover:text-midnight hover:border-midnight'
                }`}
              >
                All Records ({totalCount})
              </button>
            </div>

            <span className="text-xs font-mono text-text-muted">
              Showing <strong>{filteredListings.length}</strong> listings
            </span>
          </div>

          {/* Search & Cluster Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            <div className="sm:col-span-8 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-faint" />
              <input
                type="text"
                placeholder="Search by title, owner name, email, colony or ID..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs font-medium text-midnight border border-border rounded-[2px] bg-white focus:border-midnight focus:outline-none shadow-sm"
              />
            </div>

            <div className="sm:col-span-4">
              <select
                value={clusterFilter}
                onChange={e => setClusterFilter(e.target.value)}
                className="w-full py-2.5 px-3 text-xs font-bold text-midnight border border-border rounded-[2px] bg-white focus:border-midnight focus:outline-none shadow-sm uppercase font-mono"
              >
                <option value="all">All Corridors / Clusters</option>
                <option value="kondapur">Kondapur</option>
                <option value="madhapur">Madhapur</option>
                <option value="gachibowli">Gachibowli</option>
                <option value="hitec_city">HITEC City</option>
                <option value="manikonda">Manikonda</option>
                <option value="financial_district">Financial District</option>
              </select>
            </div>
          </div>
        </div>

        {/* Listings Queue Table */}
        <div className="border border-border rounded-[2px] bg-white shadow-sm overflow-hidden">
          {filteredListings.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border bg-surface-muted/60 text-[10px] font-mono font-bold uppercase tracking-wider text-text-muted">
                    <th className="py-3 px-4">Property & Type</th>
                    <th className="py-3 px-4">Cluster / Colony</th>
                    <th className="py-3 px-4">Rent & Charges</th>
                    <th className="py-3 px-4">Owner Contact</th>
                    <th className="py-3 px-4">Verification Evidence</th>
                    <th className="py-3 px-4">Submitted Date</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-xs">
                  {filteredListings.map(listing => {
                    const coverPhoto = listing.photos.find(p => p.isCover) || listing.photos[0];
                    const contactApproved = listing.verificationChecks.find(c => c.checkType === 'listing_contact_call')?.status === 'approved';
                    const utilityApproved = listing.verificationChecks.find(c => c.checkType === 'property_connection_evidence')?.status === 'approved';

                    return (
                      <tr 
                        key={listing.id} 
                        className="hover:bg-surface-subtle/70 transition-colors group"
                      >
                        {/* 1. Property Title & Type */}
                        <td className="py-4 px-4 min-w-[220px]">
                          <div className="flex items-center gap-3">
                            <div className="h-14 w-14 rounded-[2px] overflow-hidden border border-border bg-surface-muted shrink-0 relative">
                              {coverPhoto ? (
                                <img
                                  src={coverPhoto.url}
                                  alt={listing.title}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="h-full w-full flex items-center justify-center text-text-faint">
                                  <Building2 className="h-5 w-5" />
                                </div>
                              )}
                              <span className="absolute bottom-0 right-0 bg-midnight/90 text-white font-mono text-[8px] font-bold px-1 py-0.2">
                                {listing.photos.length}P
                              </span>
                            </div>

                            <div className="space-y-1">
                              <Link
                                href={`/admin/listings/${listing.id}`}
                                className="font-bold text-midnight group-hover:text-cobalt transition-colors line-clamp-1 block text-sm"
                              >
                                {listing.title}
                              </Link>
                              <div className="flex items-center gap-1.5">
                                <span className="rounded bg-surface-muted px-1.5 py-0.5 text-[9px] font-mono font-bold uppercase text-cobalt border border-border">
                                  {listing.propertyType.replace('_', ' ')}
                                </span>
                                <span className="text-[10px] font-mono text-text-muted">
                                  {listing.carpetAreaSqFt} sq.ft
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* 2. Cluster / Colony */}
                        <td className="py-4 px-4 min-w-[150px]">
                          <div className="space-y-0.5">
                            <div className="inline-flex items-center gap-1 font-bold text-midnight uppercase text-[11px] font-mono">
                              <MapPin className="h-3 w-3 text-cobalt" />
                              {listing.cluster.replace('_', ' ')}
                            </div>
                            <p className="text-[11px] text-text-secondary line-clamp-1">
                              {listing.colonyOrSociety}
                            </p>
                          </div>
                        </td>

                        {/* 3. Rent & Charges */}
                        <td className="py-4 px-4 whitespace-nowrap">
                          <div className="space-y-0.5">
                            <div className="font-mono font-bold text-sm text-midnight">
                              {formatINR(listing.monthlyRent)}
                              <span className="text-[10px] font-normal text-text-muted">/mo</span>
                            </div>
                            <div className="text-[10px] font-mono text-text-muted">
                              {listing.maintenanceCharges > 0 
                                ? `+ ${formatINR(listing.maintenanceCharges)} maint` 
                                : 'Maint included'}
                            </div>
                          </div>
                        </td>

                        {/* 4. Owner Contact */}
                        <td className="py-4 px-4 min-w-[150px]">
                          <div className="space-y-0.5">
                            <div className="font-bold text-midnight">{listing.owner.name}</div>
                            <div className="text-[10px] font-mono text-text-muted truncate">
                              {listing.owner.email}
                            </div>
                            <div className="inline-flex items-center gap-1 text-[9px] font-mono font-bold text-verified">
                              <Check className="h-2.5 w-2.5" /> Handshake Verified
                            </div>
                          </div>
                        </td>

                        {/* 5. Verification Evidence */}
                        <td className="py-4 px-4 min-w-[160px]">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5">
                              <span
                                className={`h-2 w-2 rounded-full ${
                                  utilityApproved ? 'bg-verified' : 'bg-citrus animate-pulse'
                                }`}
                              ></span>
                              <span className="text-[11px] font-mono font-bold text-midnight">
                                {listing.utilityEvidence?.provider ? listing.utilityEvidence.provider.split(' ')[0] : 'Phone Check'}
                              </span>
                            </div>
                            <p className="text-[10px] font-mono text-text-muted truncate">
                              {listing.utilityEvidence?.consumerNumber ? `USCNO: ${listing.utilityEvidence.consumerNumber.split(' ')[0]}` : 'Handshake Pending'}
                            </p>
                          </div>
                        </td>

                        {/* 6. Submitted Date */}
                        <td className="py-4 px-4 whitespace-nowrap">
                          <div className="text-[11px] font-mono text-text-secondary">
                            {formatDate(listing.submittedAt)}
                          </div>
                        </td>

                        {/* 7. Status Badge */}
                        <td className="py-4 px-4 whitespace-nowrap">
                          {getStatusBadge(listing.status)}
                        </td>

                        {/* 8. Action Link */}
                        <td className="py-4 px-4 text-right whitespace-nowrap">
                          <Link
                            href={`/admin/listings/${listing.id}`}
                            className="inline-flex items-center justify-center gap-1.5 rounded-[2px] bg-midnight px-3.5 py-2 text-xs font-bold text-white uppercase tracking-wider hover:bg-cobalt transition-all shadow-sm active:scale-95"
                          >
                            <span>Inspect & Review</span>
                            <ArrowUpRight className="h-3.5 w-3.5" />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-16 text-center space-y-3">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-surface-muted text-text-muted">
                <Filter className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-midnight">No listings match current criteria</h3>
              <p className="text-xs text-text-muted max-w-sm mx-auto">
                Try switching the status filter or clearing your search term to see other properties in the moderation queue.
              </p>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('all');
                  setSearchQuery('');
                  setClusterFilter('all');
                }}
                className="mt-2 inline-flex items-center gap-1.5 rounded-[2px] bg-cobalt px-4 py-2 text-xs font-bold uppercase text-white hover:bg-cobalt-hover transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>

        {/* Moderation Policy Callout */}
        <div className="rounded-[2px] border border-border bg-surface-subtle p-4 sm:p-6 text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-cobalt">
                <ShieldCheck className="h-4 w-4" /> Moderation Protocol (Zero-Brokerage Mandate)
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">
                Ensure each property meets the minimum standard: (1) Verified direct owner/representative, (2) Authentic room-by-room photographs without broker agency stamps, (3) Valid TSSPDCL domestic power connection / GHMC receipt, and (4) Clear itemized maintenance declarations.
              </p>
            </div>
            <Link
              href="/safety"
              className="inline-flex items-center gap-1 text-xs font-bold text-midnight hover:text-cobalt underline underline-offset-4 whitespace-nowrap"
            >
              Review Safety Guidelines <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>
      </div>
    </RouteGuard>
  );
}