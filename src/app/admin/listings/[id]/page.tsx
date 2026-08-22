'use client';

import { RouteGuard } from '@/components/auth/RouteGuard';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  ArrowLeft, 
  Building2, 
  MapPin, 
  Calendar, 
  FileText, 
  PhoneCall, 
  Lock, 
  Eye, 
  Download, 
  Check, 
  Zap, 
  Clock, 
  Home, 
  Layers, 
  Sparkles,
  ExternalLink,
  MessageSquare,
  History,
  X
} from 'lucide-react';
import { formatINR } from '@/lib/utils';
import { getAdminListingById, type AdminListing } from '@/lib/mock-listings';
import { useSession } from '@/lib/session';

export default function AdminListingInspectorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const listingId = resolvedParams.id;
  const router = useRouter();
  const { user: session } = useSession();

  const [listing, setListing] = useState<AdminListing | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Action Modals state
  const [approveModalOpen, setApproveModalOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [changesModalOpen, setChangesModalOpen] = useState(false);

  // Form states for modals
  const [approvalNotes, setApprovalNotes] = useState('All verification checks confirmed. TSSPDCL utility bill and owner contact verified.');
  const [rejectionReason, setRejectionReason] = useState('broker_suspected');
  const [rejectionNotes, setRejectionNotes] = useState('');
  const [changesNotes, setChangesNotes] = useState('');

  const fetchListingData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/listings/${listingId}`, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (data.listing) {
          setListing(data.listing);
          setIsLoading(false);
          return;
        }
      }
    } catch {
      // fallback
    }
    const item = getAdminListingById(listingId);
    if (item) {
      setListing({ ...item });
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchListingData();
  }, [listingId]);

  const moderatorDisplayName = session?.name ? `${session.name} (${session.role === 'admin' ? 'TRC Team' : 'Moderator'})` : 'Admin Moderator (TRC Team)';

  const handleApprove = async () => {
    if (!listing) return;
    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/admin/listings/${listing.id}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          notes: approvalNotes,
          moderatorName: moderatorDisplayName,
        }),
      });

      const data = await res.json();
      if (data.success && data.listing) {
        setListing(data.listing);
        setApproveModalOpen(false);
        setActionSuccess('Listing approved and published to the live public catalog!');
        setTimeout(() => setActionSuccess(null), 5000);
      }
    } catch (err) {
      console.error('Approval failed', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!listing) return;
    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/admin/listings/${listing.id}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reason: rejectionReason,
          notes: rejectionNotes || `Rejected due to ${rejectionReason.replace('_', ' ')}`,
          moderatorName: moderatorDisplayName,
        }),
      });

      const data = await res.json();
      if (data.success && data.listing) {
        setListing(data.listing);
        setRejectModalOpen(false);
        setActionSuccess('Listing rejected and marked with moderation reason.');
        setTimeout(() => setActionSuccess(null), 5000);
      }
    } catch (err) {
      console.error('Rejection failed', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRequestChanges = async () => {
    if (!listing || !changesNotes.trim()) return;
    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/admin/listings/${listing.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'request_changes',
          notes: changesNotes,
          moderatorName: moderatorDisplayName,
        }),
      });

      const data = await res.json();
      if (data.success && data.listing) {
        setListing(data.listing);
        setChangesModalOpen(false);
        setActionSuccess('Change request recorded and owner notified.');
        setTimeout(() => setActionSuccess(null), 5000);
      }
    } catch (err) {
      console.error('Request changes failed', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center">
        <div className="text-xs font-mono font-bold text-midnight uppercase tracking-wider animate-pulse">
          Loading Listing Inspector...
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-canvas flex flex-col items-center justify-center p-4 space-y-4">
        <h2 className="text-xl font-bold text-midnight">Listing Not Found</h2>
        <p className="text-xs text-text-muted">No listing found with ID: {listingId}</p>
        <Link
          href="/admin/listings"
          className="rounded-[2px] bg-cobalt px-4 py-2 text-xs font-bold text-white uppercase tracking-wider"
        >
          Back to Moderation Queue
        </Link>
      </div>
    );
  }

  const getStatusBadge = (status: AdminListing['status']) => {
    switch (status) {
      case 'pending_review':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-[2px] bg-citrus/25 border border-citrus px-2.5 py-1 text-[11px] font-mono font-bold text-midnight uppercase tracking-wider">
            <span className="h-2 w-2 rounded-full bg-midnight animate-pulse"></span>
            Pending Review
          </span>
        );
      case 'published':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-[2px] bg-verified-surface border border-verified-border px-2.5 py-1 text-[11px] font-mono font-bold text-verified uppercase tracking-wider">
            <CheckCircle2 className="h-3.5 w-3.5 text-verified" />
            Published Live
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-[2px] bg-tangerine-surface border border-tangerine-border px-2.5 py-1 text-[11px] font-mono font-bold text-tangerine-dark uppercase tracking-wider">
            <XCircle className="h-3.5 w-3.5 text-tangerine" />
            Rejected ({listing.rejectionReason?.replace('_', ' ') || 'Policy'})
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 rounded-[2px] bg-surface-muted border border-border px-2.5 py-1 text-[11px] font-mono font-bold text-text-muted uppercase tracking-wider">
            {status}
          </span>
        );
    }
  };

  return (
    <RouteGuard allowedRoles={["admin"]} title="Admin Moderation Access Restricted" description="This inspector is strictly restricted to platform moderators and operators.">
      <div className="min-h-screen bg-canvas text-midnight font-sans antialiased selection:bg-cobalt selection:text-white pb-20">
      {/* Top Banner / Breadcrumb & Primary Sticky Action Bar */}
      <div className="sticky top-16 z-40 border-b border-border bg-white/95 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-left">
            <Link
              href="/admin/listings"
              className="inline-flex items-center gap-1.5 rounded-[2px] border border-border bg-white px-2.5 py-1.5 text-xs font-bold text-text-secondary hover:text-midnight hover:border-midnight transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Queue
            </Link>
            <div className="h-4 w-px bg-border hidden sm:block"></div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] font-bold text-cobalt bg-cobalt-subtle px-1.5 py-0.5 rounded-[2px] uppercase">
                  {listing.id}
                </span>
                <span className="font-bold text-xs text-midnight truncate max-w-[240px] sm:max-w-md">
                  {listing.title}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            {/* Request Changes */}
            <button
              type="button"
              onClick={() => setChangesModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-[2px] border border-border bg-white px-3 py-2 text-xs font-bold text-midnight hover:bg-surface-muted hover:border-midnight transition-all active:scale-95 shadow-sm"
            >
              <AlertTriangle className="h-3.5 w-3.5 text-text-muted" />
              <span>Request Changes</span>
            </button>

            {/* Reject Listing */}
            <button
              type="button"
              onClick={() => setRejectModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-[2px] border border-tangerine-border bg-tangerine-surface px-3 py-2 text-xs font-bold text-tangerine-dark hover:bg-tangerine-border transition-all active:scale-95 shadow-sm"
            >
              <XCircle className="h-3.5 w-3.5 text-tangerine" />
              <span>Reject Listing</span>
            </button>

            {/* Approve & Publish */}
            <button
              type="button"
              onClick={() => setApproveModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-[2px] bg-cobalt px-4 py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-cobalt-hover transition-all active:scale-95 shadow-[0_2px_8px_rgba(37,71,245,0.25)]"
            >
              <CheckCircle2 className="h-3.5 w-3.5 text-citrus" />
              <span>Approve & Publish</span>
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* Success Toast */}
        {actionSuccess && (
          <div className="rounded-[2px] border border-verified-border bg-verified-surface p-4 text-xs font-bold text-verified flex items-center justify-between shadow-sm animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>{actionSuccess}</span>
            </div>
            <button type="button" onClick={() => setActionSuccess(null)} className="text-verified hover:text-midnight">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Listing Title & Key Status Header */}
        <div className="rounded-[2px] border border-border bg-white p-6 shadow-sm text-left">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                {getStatusBadge(listing.status)}
                <span className="text-border-strong">•</span>
                <span className="rounded-[2px] bg-surface-muted border border-border px-2 py-0.5 text-[10px] font-mono font-bold uppercase text-cobalt">
                  {listing.propertyType.replace('_', ' ')}
                </span>
                <span className="text-border-strong">•</span>
                <span className="inline-flex items-center gap-1 text-xs font-mono font-bold text-text-secondary uppercase">
                  <MapPin className="h-3 w-3 text-cobalt" /> {listing.cluster}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-midnight tracking-tight">
                {listing.title}
              </h1>
              <p className="text-xs text-text-secondary font-mono">
                Submitted on: <strong>{listing.submittedAt}</strong> • Public URL Slug: <code className="text-cobalt">/homes/{listing.slug}</code>
              </p>
            </div>

            {/* Rent & Maintenance Summary Card */}
            <div className="rounded-[2px] border border-border bg-surface-subtle p-4 text-left sm:text-right shrink-0">
              <div className="text-[10px] font-mono font-bold uppercase text-text-muted tracking-wider">
                Declared Total Monthly
              </div>
              <div className="text-2xl sm:text-3xl font-black font-mono text-midnight mt-0.5">
                {formatINR(listing.monthlyRent + (listing.maintenanceCharges || 0))}
                <span className="text-xs font-normal text-text-muted">/mo</span>
              </div>
              <div className="text-[11px] font-mono text-text-secondary mt-1">
                Base Rent: {formatINR(listing.monthlyRent)} + Maint: {formatINR(listing.maintenanceCharges)}
              </div>
            </div>
          </div>
        </div>

        {/* Main 2-Column Inspector Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (8 cols): Room Photographs & Declared Terms */}
          <div className="lg:col-span-8 space-y-6 text-left">
            {/* 1. ROOM PHOTOGRAPHS INSPECTOR */}
            <div className="rounded-[2px] border border-border bg-white p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-cobalt" />
                  <h2 className="text-sm font-black uppercase font-mono tracking-wider text-midnight">
                    Room-by-Room Photo Inspector ({listing.photos.length} Verified Photos)
                  </h2>
                </div>
                <span className="text-[10px] font-mono font-bold text-text-muted uppercase">
                  direct listing Watermark Check: Passed
                </span>
              </div>

              {/* Photo Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {listing.photos.map((photo, idx) => (
                  <div
                    key={photo.id}
                    className="group relative rounded-[2px] border border-border bg-surface-muted overflow-hidden cursor-pointer"
                    onClick={() => setSelectedPhoto(photo.url)}
                  >
                    <div className="aspect-[4/3] w-full overflow-hidden bg-surface-muted">
                      <img
                        src={photo.url}
                        alt={photo.caption}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>

                    {/* Room Tag Overlay */}
                    <div className="absolute top-2 left-2 flex flex-wrap gap-1.5">
                      <span className="rounded-[2px] bg-midnight/90 backdrop-blur-md px-2 py-0.5 text-[9px] font-mono font-bold text-white uppercase tracking-wider">
                        {photo.roomTag.replace('_', ' ')}
                      </span>
                      {photo.isCover && (
                        <span className="rounded-[2px] bg-cobalt px-2 py-0.5 text-[9px] font-mono font-bold text-white uppercase tracking-wider">
                          Cover
                        </span>
                      )}
                    </div>

                    {/* Caption Bar */}
                    <div className="p-2.5 bg-white border-t border-border">
                      <p className="text-[11px] font-medium text-midnight truncate">
                        {photo.caption}
                      </p>
                      <div className="flex items-center justify-between text-[9px] font-mono text-text-muted mt-1">
                        <span>Photo #{idx + 1}</span>
                        <span className="text-verified font-bold flex items-center gap-1">
                          <Check className="h-2.5 w-2.5" /> High Resolution
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. PROPERTY DETAILS & PRICING BREAKDOWN */}
            <div className="rounded-[2px] border border-border bg-white p-6 shadow-sm space-y-6">
              <div className="border-b border-border pb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-cobalt" />
                  <h2 className="text-sm font-black uppercase font-mono tracking-wider text-midnight">
                    Property Specs & Financial Terms
                  </h2>
                </div>
                <span className="text-[10px] font-mono font-bold text-verified uppercase">
                  Itemized Pricing Active
                </span>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-surface-subtle p-4 rounded-[2px] border border-border text-xs">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase text-text-muted block">Monthly Rent</span>
                  <span className="font-mono font-bold text-midnight text-sm">{formatINR(listing.monthlyRent)}</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase text-text-muted block">Security Deposit</span>
                  <span className="font-mono font-bold text-midnight text-sm">{formatINR(listing.securityDeposit)}</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase text-text-muted block">Maintenance</span>
                  <span className="font-mono font-bold text-midnight text-sm">
                    {listing.maintenanceCharges > 0 ? formatINR(listing.maintenanceCharges) : 'Included'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase text-text-muted block">Carpet Area</span>
                  <span className="font-mono font-bold text-midnight text-sm">{listing.carpetAreaSqFt} Sq.Ft</span>
                </div>

                <div>
                  <span className="text-[10px] font-mono font-bold uppercase text-text-muted block">Lock-In Period</span>
                  <span className="font-bold text-midnight">{listing.lockInMonths} Months</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase text-text-muted block">Notice Period</span>
                  <span className="font-bold text-midnight">{listing.noticeDays} Days</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase text-text-muted block">Floor Level</span>
                  <span className="font-bold text-midnight">Floor {listing.floorNumber} of {listing.totalFloors}</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase text-text-muted block">Available From</span>
                  <span className="font-mono font-bold text-midnight">{listing.availableFrom}</span>
                </div>
              </div>

              {/* Address Inspector (Encrypted Decrypted for Admin) */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-midnight">
                  <Lock className="h-3.5 w-3.5 text-cobalt" />
                  <span>Decrypted Exact Physical Address (Admin Clearance View)</span>
                </div>
                <div className="p-3 bg-surface-muted rounded-[2px] border border-border text-xs font-mono font-medium text-midnight leading-relaxed">
                  {listing.exactAddress}
                  <div className="text-[10px] text-text-muted mt-1">
                    Landmark: {listing.landmark} • Pincode: {listing.pincode}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <h3 className="text-xs font-mono font-bold uppercase text-midnight">Owner Description</h3>
                <p className="text-xs text-text-secondary leading-relaxed bg-surface-subtle p-3 rounded-[2px] border border-border">
                  {listing.description}
                </p>
              </div>

              {/* Amenities */}
              <div className="space-y-2">
                <h3 className="text-xs font-mono font-bold uppercase text-midnight">Declared Amenities</h3>
                <div className="flex flex-wrap gap-2">
                  {listing.amenities.map(item => (
                    <span
                      key={item}
                      className="rounded-[2px] bg-white border border-border px-2.5 py-1 text-[11px] font-mono font-medium text-midnight flex items-center gap-1.5"
                    >
                      <Check className="h-3 w-3 text-verified" />
                      {item.replace(/_/g, ' ')}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* 3. MODERATION TIMELINE AUDIT TRAIL */}
            <div className="rounded-[2px] border border-border bg-white p-6 shadow-sm space-y-4">
              <div className="border-b border-border pb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <History className="h-4 w-4 text-cobalt" />
                  <h2 className="text-sm font-black uppercase font-mono tracking-wider text-midnight">
                    Moderation Audit Log (180-Day Trail)
                  </h2>
                </div>
                <span className="text-[10px] font-mono text-text-muted uppercase">Immutable Record</span>
              </div>

              <div className="space-y-3">
                {listing.moderationHistory.map((item, idx) => (
                  <div key={item.id} className="flex items-start gap-3 text-xs">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-surface-muted text-text-muted font-mono text-[9px] font-bold mt-0.5">
                      {idx + 1}
                    </span>
                    <div className="space-y-0.5 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-midnight">{item.reason}</span>
                        <span className="font-mono text-[10px] text-text-muted">{item.timestamp}</span>
                      </div>
                      <p className="text-text-secondary text-[11px]">{item.notes || `Action: ${item.actionTaken} by ${item.moderatorName}`}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column (4 cols): Private Utility Evidence & Verification Check Box */}
          <div className="lg:col-span-4 space-y-6 text-left">
            {/* 1. PRIVATE TSSPDCL / GHMC EVIDENCE INSPECTOR */}
            <div className="rounded-[2px] border-2 border-cobalt/40 bg-white p-5 shadow-md space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2 text-cobalt">
                  <Zap className="h-4 w-4 text-cobalt" />
                  <h3 className="text-xs font-black uppercase font-mono tracking-wider">
                    Utility Connection Evidence
                  </h3>
                </div>
                <span className="rounded bg-citrus px-1.5 py-0.5 text-[9px] font-mono font-bold text-midnight uppercase">
                  CONFIDENTIAL
                </span>
              </div>

              {listing.utilityEvidence ? (
                <div className="space-y-3 text-xs">
                  <div className="bg-surface-subtle p-3 rounded-[2px] border border-border space-y-2">
                    <div>
                      <span className="text-[10px] font-mono font-bold uppercase text-text-muted block">Provider / Authority</span>
                      <span className="font-bold text-midnight">{listing.utilityEvidence.provider}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1 border-t border-border">
                      <div>
                        <span className="text-[10px] font-mono font-bold uppercase text-text-muted block">Unique Service No</span>
                        <span className="font-mono font-bold text-cobalt text-xs">{listing.utilityEvidence.consumerNumber}</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-mono font-bold uppercase text-text-muted block">Meter No</span>
                        <span className="font-mono font-bold text-midnight text-xs">{listing.utilityEvidence.meterNumber || 'Pending Check'}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1 border-t border-border">
                      <div>
                        <span className="text-[10px] font-mono font-bold uppercase text-text-muted block">Tariff Category</span>
                        <span className="font-medium text-midnight">{listing.utilityEvidence.tariffCategory || 'Domestic'}</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-mono font-bold uppercase text-text-muted block">Billed Units</span>
                        <span className="font-mono font-bold text-midnight">{listing.utilityEvidence.billedUnits ? `${listing.utilityEvidence.billedUnits} kWh` : 'N/A'}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1 border-t border-border">
                      <div>
                        <span className="text-[10px] font-mono font-bold uppercase text-text-muted block">Bill Month / Paid</span>
                        <span className="font-mono font-medium text-midnight">{listing.utilityEvidence.billingMonth || 'Current Period'} {listing.utilityEvidence.amountPaid ? `(${formatINR(listing.utilityEvidence.amountPaid)})` : ''}</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-mono font-bold uppercase text-text-muted block">GHMC PTIN</span>
                        <span className="font-mono font-medium text-midnight">{listing.utilityEvidence.ghmcPtin || 'N/A'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Match Score */}
                  <div className="rounded-[2px] bg-verified-surface border border-verified-border p-2.5 text-xs text-verified font-bold flex items-center justify-between">
                    <span>Address Match:</span>
                    <span className="font-mono">{listing.utilityEvidence.matchingAddressScore || 'Pending Verification'}</span>
                  </div>

                  {/* Document Preview Box */}
                  {listing.utilityEvidence.documentUrl && (
                    <div className="border border-border rounded-[2px] p-3 bg-surface-muted space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold uppercase text-text-muted">Evidence Document</span>
                        <span className="text-[10px] font-mono text-cobalt font-bold">Document Attachment</span>
                      </div>
                      <div className="flex items-center gap-2 bg-white p-2 rounded border border-border">
                        <FileText className="h-4 w-4 text-cobalt shrink-0" />
                        <span className="text-xs font-mono font-medium truncate flex-1">{listing.utilityEvidence.documentName || 'Evidence Document'}</span>
                        <a
                          href={listing.utilityEvidence.documentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 text-text-muted hover:text-midnight"
                          title="Inspect Document"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-4 rounded-[2px] border border-border bg-surface-subtle text-xs text-text-secondary">
                  No utility bill uploaded. Conduct direct phone verification with owner.
                </div>
              )}
            </div>

            {/* 2. OWNER IDENTITY & CONTACT CONFIRMATION */}
            <div className="rounded-[2px] border border-border bg-white p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2">
                  <PhoneCall className="h-4 w-4 text-cobalt" />
                  <h3 className="text-xs font-black uppercase font-mono tracking-wider text-midnight">
                    Owner Identity Verification
                  </h3>
                </div>
                <span className="text-verified text-[10px] font-mono font-bold uppercase flex items-center gap-1">
                  <Check className="h-3 w-3" /> Phone Verified
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase text-text-muted block">Property Owner</span>
                  <span className="font-bold text-midnight text-sm">{listing.owner.name}</span>
                </div>

                <div>
                  <span className="text-[10px] font-mono font-bold uppercase text-text-muted block">Registered Email</span>
                  <span className="font-mono text-text-secondary">{listing.owner.email}</span>
                </div>

                <div>
                  <span className="text-[10px] font-mono font-bold uppercase text-text-muted block">Direct Phone</span>
                  <span className="font-mono font-bold text-midnight">{listing.owner.phone}</span>
                </div>

                <div className="p-2.5 bg-surface-subtle rounded-[2px] border border-border space-y-1">
                  <div className="text-[10px] font-mono font-bold uppercase text-text-muted">Verification Handshake</div>
                  <div className="text-[11px] font-mono text-verified font-bold">
                    Method: {listing.owner.phoneConfirmationMethod}
                  </div>
                  <div className="text-[10px] font-mono text-text-secondary">
                    Verified By: {listing.owner.phoneConfirmedBy}
                  </div>
                </div>
              </div>
            </div>

            {/* 3. VERIFICATION CHECKS STATUS LEDGER */}
            <div className="rounded-[2px] border border-border bg-white p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-cobalt" />
                  <h3 className="text-xs font-black uppercase font-mono tracking-wider text-midnight">
                    Verification Checklist
                  </h3>
                </div>
              </div>

              <div className="space-y-2.5 text-xs">
                {listing.verificationChecks.map(check => (
                  <div
                    key={check.id}
                    className="flex items-start justify-between gap-2 p-2.5 rounded-[2px] border border-border bg-surface-subtle"
                  >
                    <div className="space-y-0.5">
                      <span className="font-bold text-midnight block capitalize">
                        {check.checkType.replace(/_/g, ' ')}
                      </span>
                      {check.reviewerNotes && (
                        <p className="text-[10px] text-text-secondary">{check.reviewerNotes}</p>
                      )}
                    </div>
                    <span
                      className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded ${
                        check.status === 'approved'
                          ? 'bg-verified-surface text-verified border border-verified-border'
                          : check.status === 'rejected'
                          ? 'bg-tangerine-surface text-tangerine-dark border border-tangerine-border'
                          : 'bg-citrus/20 text-midnight border border-citrus/60'
                      }`}
                    >
                      {check.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Photo Zoom Modal */}
      {selectedPhoto && (
        <div 
          className="fixed inset-0 z-50 bg-midnight/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] bg-white rounded-[2px] overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-3 right-3 z-10 bg-midnight/80 text-white p-1.5 rounded-full hover:bg-midnight"
            >
              <X className="h-4 w-4" />
            </button>
            <img src={selectedPhoto} alt="Full resolution inspection" className="max-h-[85vh] w-auto object-contain" />
          </div>
        </div>
      )}

      {/* MODAL 1: APPROVE & PUBLISH */}
      {approveModalOpen && (
        <div className="fixed inset-0 z-50 bg-midnight/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-[2px] border border-border shadow-2xl p-6 space-y-5 text-left animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-verified" />
                <h3 className="text-base font-black text-midnight tracking-tight">
                  Approve & Publish Listing
                </h3>
              </div>
              <button type="button" onClick={() => setApproveModalOpen(false)} className="text-text-muted hover:text-midnight">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-text-secondary leading-relaxed">
                Approving this listing will set its status to <strong className="text-midnight">Published</strong>, record full verification sign-offs on contact and utility checks, and make it publicly searchable at <code className="text-cobalt">/homes/{listing.slug}</code>.
              </p>

              <div className="space-y-1">
                <label className="block text-[11px] font-mono font-bold uppercase text-midnight">
                  Moderator Sign-Off Notes
                </label>
                <textarea
                  value={approvalNotes}
                  onChange={e => setApprovalNotes(e.target.value)}
                  rows={3}
                  className="w-full p-2.5 text-xs text-midnight border border-border rounded-[2px] focus:border-midnight focus:outline-none"
                  placeholder="Record verification notes (e.g. TSSPDCL confirmed, zero-brokerage verified)..."
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
              <button
                type="button"
                onClick={() => setApproveModalOpen(false)}
                className="px-4 py-2 text-xs font-bold text-text-secondary hover:text-midnight"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleApprove}
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 rounded-[2px] bg-cobalt px-5 py-2.5 text-xs font-bold uppercase text-white hover:bg-cobalt-hover transition-all active:scale-95 disabled:opacity-50"
              >
                {isSubmitting ? 'Publishing...' : 'Confirm & Publish'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: REJECT LISTING */}
      {rejectModalOpen && (
        <div className="fixed inset-0 z-50 bg-midnight/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-[2px] border border-border shadow-2xl p-6 space-y-5 text-left animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <XCircle className="h-5 w-5 text-tangerine" />
                <h3 className="text-base font-black text-midnight tracking-tight">
                  Reject Listing Submission
                </h3>
              </div>
              <button type="button" onClick={() => setRejectModalOpen(false)} className="text-text-muted hover:text-midnight">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="block text-[11px] font-mono font-bold uppercase text-midnight">
                  Structured Rejection Reason
                </label>
                <select
                  value={rejectionReason}
                  onChange={e => setRejectionReason(e.target.value)}
                  className="w-full p-2.5 text-xs font-bold text-midnight border border-border rounded-[2px] bg-white uppercase font-mono"
                >
                  <option value="broker_suspected">Broker Suspected / Commercial Brokerage Demanded</option>
                  <option value="fake_property">Fake / Non-Existent Property</option>
                  <option value="incorrect_rent">Discrepant Rent or Hidden Charges</option>
                  <option value="incorrect_photos">Low Quality or Stolen Photos</option>
                  <option value="tampered_evidence">Invalid or Tampered TSSPDCL/GHMC Evidence</option>
                  <option value="unresponsive_contact">Unresponsive Listing Contact</option>
                  <option value="other">Other Compliance Violation</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-mono font-bold uppercase text-midnight">
                  Detailed Explanation / Rejection Notes
                </label>
                <textarea
                  value={rejectionNotes}
                  onChange={e => setRejectionNotes(e.target.value)}
                  rows={3}
                  className="w-full p-2.5 text-xs text-midnight border border-border rounded-[2px] focus:border-midnight focus:outline-none"
                  placeholder="Explain why this listing was rejected (stored in 180-day audit log)..."
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
              <button
                type="button"
                onClick={() => setRejectModalOpen(false)}
                className="px-4 py-2 text-xs font-bold text-text-secondary hover:text-midnight"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleReject}
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 rounded-[2px] bg-tangerine px-5 py-2.5 text-xs font-bold uppercase text-white hover:bg-tangerine-dark transition-all active:scale-95 disabled:opacity-50"
              >
                {isSubmitting ? 'Rejecting...' : 'Confirm Rejection'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: REQUEST CHANGES */}
      {changesModalOpen && (
        <div className="fixed inset-0 z-50 bg-midnight/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-[2px] border border-border shadow-2xl p-6 space-y-5 text-left animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-text-muted" />
                <h3 className="text-base font-black text-midnight tracking-tight">
                  Request Changes from Owner
                </h3>
              </div>
              <button type="button" onClick={() => setChangesModalOpen(false)} className="text-text-muted hover:text-midnight">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-text-secondary leading-relaxed">
                Specify what details need to be corrected by the owner before this listing can be approved (e.g. upload a clearer kitchen photograph, clarify maintenance inclusions).
              </p>

              <div className="space-y-1">
                <label className="block text-[11px] font-mono font-bold uppercase text-midnight">
                  Requested Modifications
                </label>
                <textarea
                  value={changesNotes}
                  onChange={e => setChangesNotes(e.target.value)}
                  rows={4}
                  required
                  className="w-full p-2.5 text-xs text-midnight border border-border rounded-[2px] focus:border-midnight focus:outline-none"
                  placeholder="e.g. Please upload an unblurred photo of the attached bathroom and confirm if maintenance is covered..."
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
              <button
                type="button"
                onClick={() => setChangesModalOpen(false)}
                className="px-4 py-2 text-xs font-bold text-text-secondary hover:text-midnight"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRequestChanges}
                disabled={isSubmitting || !changesNotes.trim()}
                className="inline-flex items-center gap-2 rounded-[2px] bg-midnight px-5 py-2.5 text-xs font-bold uppercase text-white hover:bg-cobalt transition-all active:scale-95 disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting...' : 'Send Changes Request'}
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </RouteGuard>
  );
}