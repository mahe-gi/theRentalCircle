'use client';

import { RouteGuard } from '@/components/auth/RouteGuard';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Building2, 
  MapPin, 
  Calendar, 
  Clock, 
  Users, 
  Briefcase, 
  MessageSquare, 
  CheckCircle2, 
  XCircle, 
  Phone, 
  Mail, 
  ShieldCheck, 
  Lock, 
  Unlock, 
  MessageCircle, 
  Check, 
  X, 
  RotateCcw,
  Sparkles,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { formatINR } from '@/lib/utils';

interface ApplicantRequest {
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
  listing?: {
    id: string;
    title: string;
    cluster: string;
    colonyOrSociety: string;
    propertyType: string;
    monthlyRent: number;
    securityDeposit: number;
  };
}

interface ListingSummary {
  id: string;
  slug: string;
  title: string;
  cluster: string;
  colonyOrSociety: string;
  propertyType: string;
  monthlyRent: number;
  securityDeposit: number;
  status: string;
  photos: { url: string; isCover: boolean }[];
}

export default function OwnerListingRequestsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const listingId = params?.id || '';

  const [requests, setRequests] = useState<ApplicantRequest[]>([]);
  const [listing, setListing] = useState<ListingSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'accepted' | 'declined'>('all');
  
  // Action states
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [declineModalReq, setDeclineModalReq] = useState<ApplicantRequest | null>(null);
  const [declineReason, setDeclineReason] = useState('Property is no longer available or occupant profile does not match.');
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  const fetchListingAndRequests = async () => {
    if (!listingId) return;
    setIsLoading(true);
    try {
      // 1. Fetch listing details
      const listingRes = await fetch(`/api/owner/listings/${listingId}`);
      if (listingRes.ok) {
        const listingData = await listingRes.json();
        if (listingData.success && listingData.listing) {
          setListing(listingData.listing);
        }
      }

      // 2. Fetch requests for this listing
      const reqRes = await fetch(`/api/requests?listingId=${listingId}`);
      if (reqRes.ok) {
        const reqData = await reqRes.json();
        if (reqData.success && Array.isArray(reqData.requests)) {
          setRequests(reqData.requests);
        }
      }
    } catch (err) {
      console.error('Failed to load listing requests', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchListingAndRequests();
  }, [listingId]);

  // Handle Accept Request
  const handleAcceptRequest = async (requestId: string) => {
    setProcessingId(requestId);
    setActionSuccessMsg(null);
    try {
      const res = await fetch(`/api/requests/${requestId}/accept`, {
        method: 'POST',
      });
      const data = await res.json();
      if (res.ok && data.success) {
        // Update request in state
        setRequests(prev =>
          prev.map(r => (r.id === requestId ? { ...r, status: 'accepted', respondedAt: new Date().toISOString() } : r))
        );
        setActionSuccessMsg('Application accepted! Mutual contact details are now unlocked below.');
        setTimeout(() => setActionSuccessMsg(null), 5000);
      }
    } catch (err) {
      console.error('Failed to accept request', err);
    } finally {
      setProcessingId(null);
    }
  };

  // Handle Decline Request
  const handleDeclineRequest = async () => {
    if (!declineModalReq) return;
    const requestId = declineModalReq.id;
    setProcessingId(requestId);
    try {
      const res = await fetch(`/api/requests/${requestId}/decline`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: declineReason }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setRequests(prev =>
          prev.map(r =>
            r.id === requestId
              ? { ...r, status: 'declined', declineReason, respondedAt: new Date().toISOString() }
              : r
          )
        );
        setDeclineModalReq(null);
      }
    } catch (err) {
      console.error('Failed to decline request', err);
    } finally {
      setProcessingId(null);
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

  const getInitials = (name: string) => {
    if (!name) return 'R';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Filter requests
  const filteredRequests = requests.filter(r => {
    if (activeTab === 'pending') {
      return r.status === 'submitted' || r.status === 'viewed';
    }
    if (activeTab === 'accepted') {
      return r.status === 'accepted';
    }
    if (activeTab === 'declined') {
      return r.status === 'declined';
    }
    return true;
  });

  const totalCount = requests.length;
  const pendingCount = requests.filter(r => r.status === 'submitted' || r.status === 'viewed').length;
  const acceptedCount = requests.filter(r => r.status === 'accepted').length;
  const declinedCount = requests.filter(r => r.status === 'declined').length;

  return (
    <RouteGuard allowedRoles={["owner","admin"]} title="Owner Applicant Review Inbox" description="This portal allows property owners to review incoming tenant applications and unlock contact.">
      <div className="min-h-screen bg-canvas text-midnight font-sans antialiased selection:bg-cobalt selection:text-white pb-20">
      {/* Top Header with Property Context */}
      <div className="border-b border-border bg-white shadow-xs">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6 space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-text-muted">
              <Link href="/owner/listings" className="hover:text-midnight flex items-center gap-1">
                <ArrowLeft className="h-3.5 w-3.5" /> Owner Dashboard
              </Link>
              <span>/</span>
              <span className="text-cobalt">Applicant Review Inbox</span>
            </div>

            <button
              type="button"
              onClick={fetchListingAndRequests}
              className="inline-flex items-center gap-1.5 rounded-[2px] border border-border bg-white px-3 py-1.5 text-xs font-mono font-bold text-midnight hover:border-midnight hover:bg-surface-subtle transition-all"
            >
              <RotateCcw className="h-3 w-3 text-text-muted" />
              <span>Refresh Inbox</span>
            </button>
          </div>

          {/* Property Context Banner */}
          {listing ? (
            <div className="p-4 rounded-[2px] border border-border bg-surface-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="rounded-[2px] bg-cobalt px-2 py-0.5 text-[9px] font-mono font-bold text-white uppercase tracking-wider">
                    {listing.propertyType.replace('_', ' ')}
                  </span>
                  <span className="text-xs font-mono font-bold text-midnight uppercase flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-cobalt" /> {listing.colonyOrSociety}, {listing.cluster.toUpperCase()}
                  </span>
                </div>
                <h1 className="text-lg sm:text-xl font-black text-midnight tracking-tight">
                  {listing.title}
                </h1>
              </div>

              <div className="text-left sm:text-right shrink-0">
                <div className="text-lg font-black font-mono text-midnight">
                  {formatINR(listing.monthlyRent)}
                  <span className="text-xs font-normal text-text-muted">/mo</span>
                </div>
                <div className="text-[10px] font-mono text-text-muted">
                  Security Deposit: {formatINR(listing.securityDeposit)}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-1 text-left">
              <h1 className="text-2xl font-black text-midnight">Applicant Review Inbox</h1>
              <p className="text-xs text-text-secondary">Review prospective renter profiles and choose who connects with you.</p>
            </div>
          )}

          {/* 4 Summary Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pt-2">
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className={`px-3.5 py-2 text-xs font-mono uppercase tracking-wider rounded-[2px] transition-all whitespace-nowrap ${
                activeTab === 'all'
                  ? 'bg-midnight text-white font-bold shadow-xs'
                  : 'bg-white border border-border text-text-secondary hover:border-midnight hover:text-midnight'
              }`}
            >
              All Applicants ({totalCount})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('pending')}
              className={`px-3.5 py-2 text-xs font-mono uppercase tracking-wider rounded-[2px] transition-all whitespace-nowrap ${
                activeTab === 'pending'
                  ? 'bg-midnight text-white font-bold shadow-xs'
                  : 'bg-white border border-border text-text-secondary hover:border-midnight hover:text-midnight'
              }`}
            >
              Pending Review ({pendingCount})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('accepted')}
              className={`px-3.5 py-2 text-xs font-mono uppercase tracking-wider rounded-[2px] transition-all whitespace-nowrap ${
                activeTab === 'accepted'
                  ? 'bg-verified text-white font-bold shadow-xs'
                  : 'bg-white border border-border text-verified hover:border-verified'
              }`}
            >
              Accepted & Unlocked ({acceptedCount})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('declined')}
              className={`px-3.5 py-2 text-xs font-mono uppercase tracking-wider rounded-[2px] transition-all whitespace-nowrap ${
                activeTab === 'declined'
                  ? 'bg-tangerine text-white font-bold shadow-xs'
                  : 'bg-white border border-border text-text-secondary hover:border-midnight hover:text-midnight'
              }`}
            >
              Declined ({declinedCount})
            </button>
          </div>
        </div>
      </div>

      {/* Main Applicants List */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {actionSuccessMsg && (
          <div className="p-4 rounded-[2px] bg-verified-surface border border-verified-border text-verified flex items-center gap-2.5 text-xs font-mono font-bold animate-in fade-in slide-in-from-top-2 duration-200">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>{actionSuccessMsg}</span>
          </div>
        )}

        {isLoading ? (
          <div className="py-20 text-center space-y-3">
            <div className="h-6 w-6 border-2 border-cobalt border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-mono text-text-muted uppercase tracking-wider">Loading applicants...</p>
          </div>
        ) : filteredRequests.length > 0 ? (
          <div className="space-y-4">
            {filteredRequests.map(req => {
              const isAccepted = req.status === 'accepted';
              const isDeclined = req.status === 'declined';
              const isPending = req.status === 'submitted' || req.status === 'viewed';

              return (
                <div
                  key={req.id}
                  className={`rounded-[2px] border bg-white p-5 sm:p-7 space-y-5 transition-all text-left shadow-xs ${
                    isAccepted
                      ? 'border-verified-border ring-1 ring-verified-border'
                      : isDeclined
                      ? 'border-border opacity-75'
                      : 'border-border hover:border-midnight/50'
                  }`}
                >
                  {/* Top Bar: Renter Identity & Status Badge */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-border/70 pb-4">
                    <div className="flex items-center gap-3.5">
                      {/* Avatar */}
                      <div className="h-11 w-11 rounded-full bg-midnight text-white flex items-center justify-center font-mono text-xs font-bold shrink-0 ring-1 ring-border">
                        {getInitials(req.renterName)}
                      </div>

                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-black text-midnight tracking-tight">
                            {req.renterName}
                          </h3>
                          <span className="rounded-[2px] bg-surface-muted border border-border px-1.5 py-0.2 text-[9px] font-mono font-bold uppercase text-cobalt">
                            Verified Tenant Profile
                          </span>
                        </div>
                        <p className="text-[11px] font-mono text-text-muted">
                          Applied on {formatDate(req.createdAt)}
                        </p>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="shrink-0 self-start sm:self-auto">
                      {isAccepted && (
                        <span className="inline-flex items-center gap-1.5 rounded-[2px] bg-verified-surface border border-verified-border px-3 py-1 text-[10px] font-mono font-bold text-verified uppercase tracking-wider">
                          <Unlock className="h-3 w-3" /> Mutual Contact Unlocked
                        </span>
                      )}
                      {isDeclined && (
                        <span className="inline-flex items-center gap-1.5 rounded-[2px] bg-tangerine-surface border border-tangerine-border px-3 py-1 text-[10px] font-mono font-bold text-tangerine-dark uppercase tracking-wider">
                          <XCircle className="h-3 w-3" /> Declined
                        </span>
                      )}
                      {isPending && (
                        <span className="inline-flex items-center gap-1.5 rounded-[2px] bg-citrus/20 border border-citrus/60 px-3 py-1 text-[10px] font-mono font-bold text-midnight uppercase tracking-wider">
                          <span className="h-1.5 w-1.5 rounded-full bg-midnight animate-pulse"></span>
                          Awaiting Your Decision
                        </span>
                      )}
                    </div>
                  </div>

                  {/* 4 Structured Dossier Spec Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {/* Intended Move-in */}
                    <div className="p-3 rounded-[2px] bg-surface-subtle border border-border space-y-1">
                      <span className="text-[9px] font-mono uppercase tracking-wider text-text-muted flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-cobalt" /> Move-in Date
                      </span>
                      <strong className="text-xs font-mono text-midnight block">
                        {formatDate(req.intendedMoveInDate)}
                      </strong>
                    </div>

                    {/* Lease Duration */}
                    <div className="p-3 rounded-[2px] bg-surface-subtle border border-border space-y-1">
                      <span className="text-[9px] font-mono uppercase tracking-wider text-text-muted flex items-center gap-1">
                        <Clock className="h-3 w-3 text-cobalt" /> Lease Duration
                      </span>
                      <strong className="text-xs font-mono text-midnight block">
                        {req.rentalDurationMonths} Months
                      </strong>
                    </div>

                    {/* Occupants & Household */}
                    <div className="p-3 rounded-[2px] bg-surface-subtle border border-border space-y-1">
                      <span className="text-[9px] font-mono uppercase tracking-wider text-text-muted flex items-center gap-1">
                        <Users className="h-3 w-3 text-cobalt" /> Occupants
                      </span>
                      <strong className="text-xs font-mono text-midnight block capitalize">
                        {req.occupantsCount} {req.occupantsCount === 1 ? 'person' : 'people'} ({req.householdArrangement.replace('_', ' ')})
                      </strong>
                    </div>

                    {/* Employment Category */}
                    <div className="p-3 rounded-[2px] bg-surface-subtle border border-border space-y-1">
                      <span className="text-[9px] font-mono uppercase tracking-wider text-text-muted flex items-center gap-1">
                        <Briefcase className="h-3 w-3 text-cobalt" /> Employment
                      </span>
                      <strong className="text-xs font-mono text-midnight block capitalize">
                        {req.employmentCategory.replace('_', ' ')}
                      </strong>
                    </div>
                  </div>

                  {/* Applicant Introduction Message */}
                  {req.optionalIntroduction && (
                    <div className="p-3.5 rounded-[2px] bg-surface-muted/60 border border-border/80 space-y-1">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-text-muted flex items-center gap-1">
                        <MessageSquare className="h-3 w-3 text-cobalt" /> Applicant Introduction
                      </span>
                      <p className="text-xs text-midnight leading-relaxed font-normal">
                        "{req.optionalIntroduction}"
                      </p>
                    </div>
                  )}

                  {/* If Accepted: Mutual Contact Unlock Box */}
                  {isAccepted && (
                    <div className="p-4 sm:p-5 rounded-[2px] border border-verified-border bg-verified-surface space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-verified-border/60 pb-2.5">
                        <div className="flex items-center gap-2 text-xs font-mono font-black uppercase text-verified">
                          <CheckCircle2 className="h-4 w-4" /> Mutual Contact Information Unlocked
                        </div>
                        <span className="text-[10px] font-mono text-text-muted">
                          Unlocked on {formatDate(req.respondedAt || req.createdAt)}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {/* Phone with WhatsApp & Call link */}
                        <div className="p-3 rounded-[2px] bg-white border border-verified-border/80 flex items-center justify-between gap-3">
                          <div className="space-y-0.5">
                            <span className="text-[9px] font-mono text-text-muted uppercase block">Direct Phone</span>
                            <span className="text-sm font-mono font-bold text-midnight">{req.renterPhone}</span>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <a
                              href={`https://wa.me/${req.renterPhone.replace(/[^0-9]/g, '')}?text=Hi%20${encodeURIComponent(req.renterName)},%20I%20accepted%20your%20rental%20application%20on%20The%20Rental%20Circle.`}
                              target="_blank"
                              rel="noreferrer"
                              className="p-2 rounded-[2px] bg-emerald-50 border border-emerald-300 text-emerald-700 hover:bg-emerald-100 transition-colors"
                              title="Chat on WhatsApp"
                            >
                              <MessageCircle className="h-4 w-4" />
                            </a>
                            <a
                              href={`tel:${req.renterPhone}`}
                              className="p-2 rounded-[2px] bg-cobalt/10 border border-cobalt/30 text-cobalt hover:bg-cobalt/20 transition-colors"
                              title="Call Applicant"
                            >
                              <Phone className="h-4 w-4" />
                            </a>
                          </div>
                        </div>

                        {/* Email */}
                        <div className="p-3 rounded-[2px] bg-white border border-verified-border/80 flex items-center justify-between gap-3">
                          <div className="space-y-0.5 truncate">
                            <span className="text-[9px] font-mono text-text-muted uppercase block">Email Address</span>
                            <span className="text-xs font-mono font-bold text-midnight truncate block">{req.renterEmail}</span>
                          </div>
                          <a
                            href={`mailto:${req.renterEmail}?subject=The%20Rental%20Circle%20Application%20Accepted`}
                            className="p-2 rounded-[2px] bg-surface-muted border border-border text-midnight hover:bg-surface-subtle transition-colors shrink-0"
                            title="Send Email"
                          >
                            <Mail className="h-4 w-4" />
                          </a>
                        </div>
                      </div>

                      <p className="text-[10px] font-mono text-text-secondary">
                        Tip: Reach out to schedule a property visit or discuss agreement dates.
                      </p>
                    </div>
                  )}

                  {/* If Declined: Reason Box */}
                  {isDeclined && req.declineReason && (
                    <div className="p-3 rounded-[2px] bg-surface-subtle border border-border text-xs font-mono text-text-muted">
                      <span>Reason provided: <strong>{req.declineReason}</strong></span>
                    </div>
                  )}

                  {/* Decision Action Buttons for Pending Requests */}
                  {isPending && (
                    <div className="flex flex-wrap items-center justify-end gap-3 pt-3 border-t border-border">
                      <button
                        type="button"
                        onClick={() => setDeclineModalReq(req)}
                        disabled={processingId === req.id}
                        className="inline-flex items-center gap-1.5 rounded-[2px] border border-border bg-white px-4 py-2.5 text-xs font-mono font-bold uppercase tracking-wider text-tangerine-dark hover:border-tangerine hover:bg-tangerine-surface transition-all active:scale-98"
                      >
                        <X className="h-3.5 w-3.5 text-tangerine" />
                        <span>Decline Application</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleAcceptRequest(req.id)}
                        disabled={processingId === req.id}
                        className="inline-flex items-center gap-2 rounded-[2px] bg-midnight px-6 py-2.5 text-xs font-mono font-black uppercase tracking-wider text-white hover:bg-cobalt transition-all active:scale-98 shadow-sm"
                      >
                        {processingId === req.id ? (
                          <>
                            <span className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Unlocking Contacts...</span>
                          </>
                        ) : (
                          <>
                            <Check className="h-4 w-4 text-citrus" />
                            <span>Accept Application & Unlock Contact</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="rounded-[2px] border border-border bg-white p-12 text-center space-y-4 shadow-xs">
            <div className="h-12 w-12 rounded-full bg-surface-muted flex items-center justify-center mx-auto text-text-muted">
              <Users className="h-6 w-6" />
            </div>
            <div className="space-y-1 max-w-md mx-auto">
              <h3 className="text-base font-bold text-midnight">No applications in this view</h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                {activeTab !== 'all'
                  ? 'No applications match the selected status filter. Switch to "All Applicants" to view all incoming inquiries.'
                  : 'No prospective tenants have submitted an application for this property yet. Make sure your listing is published and reconfirm availability regularly.'}
              </p>
            </div>
            {activeTab !== 'all' && (
              <button
                type="button"
                onClick={() => setActiveTab('all')}
                className="mt-2 text-xs font-mono font-bold text-cobalt hover:underline uppercase"
              >
                Show All Applicants
              </button>
            )}
          </div>
        )}
      </div>

      {/* DECLINE APPLICATION MODAL */}
      {declineModalReq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-midnight/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-[2px] border border-border bg-white p-6 shadow-2xl space-y-4 text-left">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-tangerine-dark">
                <XCircle className="h-4 w-4 text-tangerine" />
                <span>Decline Rental Application</span>
              </div>
              <button
                type="button"
                onClick={() => setDeclineModalReq(null)}
                className="p-1 text-text-muted hover:text-midnight rounded-[2px]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-2">
              <p className="text-xs text-midnight">
                Declining application from <strong>{declineModalReq.renterName}</strong>.
              </p>
              <p className="text-[11px] text-text-secondary leading-relaxed">
                Select or provide a polite reason for declining so the applicant is informed transparently:
              </p>

              <div className="space-y-1.5 pt-1">
                {[
                  'Property is no longer available / leased.',
                  'Intended move-in date does not match availability.',
                  'Occupancy count exceeds guideline limit.',
                  'Household arrangement does not match property guidelines.',
                ].map(reason => (
                  <button
                    key={reason}
                    type="button"
                    onClick={() => setDeclineReason(reason)}
                    className={`w-full text-left p-2 rounded-[2px] border text-[11px] font-mono transition-all ${
                      declineReason === reason
                        ? 'border-midnight bg-surface-muted font-bold text-midnight'
                        : 'border-border bg-white text-text-secondary hover:border-midnight/50'
                    }`}
                  >
                    {reason}
                  </button>
                ))}
              </div>

              <div className="pt-2">
                <label className="block text-[10px] font-mono font-bold uppercase text-text-muted mb-1">
                  Custom Decline Note
                </label>
                <textarea
                  rows={2}
                  value={declineReason}
                  onChange={e => setDeclineReason(e.target.value)}
                  className="w-full rounded-[2px] border border-border bg-white p-2 text-xs text-midnight focus:border-cobalt focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
              <button
                type="button"
                onClick={() => setDeclineModalReq(null)}
                className="px-4 py-2 text-xs font-mono font-bold uppercase rounded-[2px] border border-border text-text-secondary hover:text-midnight"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeclineRequest}
                disabled={processingId === declineModalReq.id}
                className="px-5 py-2 text-xs font-mono font-bold uppercase rounded-[2px] bg-tangerine text-white hover:bg-tangerine-dark transition-all shadow-xs"
              >
                {processingId === declineModalReq.id ? 'Declining...' : 'Confirm Decline'}
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </RouteGuard>
  );
}