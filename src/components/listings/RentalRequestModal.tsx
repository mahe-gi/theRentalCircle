'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  X,
  Lock,
  Calendar,
  Users,
  Briefcase,
  Phone,
  FileText,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Building2,
  Check,
} from 'lucide-react';
import { formatINR } from '@/lib/utils';

export interface RentalRequestModalProps {
  listingId: string;
  listingTitle: string;
  monthlyRent: number;
  cluster?: string;
  isOpen: boolean;
  onClose: () => void;
}

export function RentalRequestModal({
  listingId,
  listingTitle,
  monthlyRent,
  cluster,
  isOpen,
  onClose,
}: RentalRequestModalProps) {
  const router = useRouter();
  const modalRef = useRef<HTMLDivElement>(null);

  // Form State
  const [intendedMoveInDate, setIntendedMoveInDate] = useState('');
  const [rentalDurationMonths, setRentalDurationMonths] = useState(11);
  const [occupantsCount, setOccupantsCount] = useState(1);
  const [householdArrangement, setHouseholdArrangement] = useState<'individual' | 'family' | 'working_professionals' | 'students'>('individual');
  const [employmentCategory, setEmploymentCategory] = useState<'salaried' | 'self_employed' | 'student' | 'other'>('salaried');
  const [phone, setPhone] = useState('+91 ');
  const [optionalIntroduction, setOptionalIntroduction] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submittedRequest, setSubmittedRequest] = useState<any | null>(null);

  // Set default min date to today
  const todayStr = new Date().toISOString().split('T')[0];

  // Dismiss on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleClose = () => {
    setErrorMessage(null);
    setSubmittedRequest(null);
    onClose();
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Basic Validation
    if (!intendedMoveInDate) {
      setErrorMessage('Please select your intended move-in date.');
      return;
    }

    const cleanPhone = phone.replace(/[^0-9+]/g, '');
    if (cleanPhone.length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile phone number.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          listingId,
          intendedMoveInDate,
          rentalDurationMonths: Number(rentalDurationMonths),
          occupantsCount: Number(occupantsCount),
          householdArrangement,
          employmentCategory,
          phone: cleanPhone,
          optionalIntroduction: optionalIntroduction.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || data.error || 'Failed to submit rental request');
      }

      // Transition to success state with direct tracking CTA
      setSubmittedRequest(data.request || { id: 'submitted', listingTitle, intendedMoveInDate, rentalDurationMonths });
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred while submitting your request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDateDisplay = (dateString?: string) => {
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

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-midnight/70 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="rental-request-title"
      onClick={e => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-2xl rounded-[3px] bg-white border border-border shadow-[0_12px_40px_rgba(11,21,55,0.18)] overflow-hidden text-left my-8"
      >
        {/* ========================================================================= */}
        {/* SUCCESS STATE SCREEN */}
        {/* ========================================================================= */}
        {submittedRequest ? (
          <div className="p-6 sm:p-8 space-y-6 animate-in fade-in duration-300">
            <div className="text-center space-y-3">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[2px] bg-verified-surface border border-verified-border text-verified">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 rounded-[2px] bg-verified px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider text-white">
                  <ShieldCheck className="h-3 w-3" /> Application Received
                </div>
                <h2 id="rental-request-title" className="text-2xl font-black text-midnight tracking-tight">
                  Move-in Application Submitted!
                </h2>
                <p className="text-xs text-text-secondary max-w-md mx-auto">
                  Your structured rental application for <strong>{listingTitle}</strong> has been routed directly to the property contact.
                </p>
              </div>
            </div>

            {/* Application Summary Card */}
            <div className="rounded-[2px] border border-border bg-surface-subtle p-4 sm:p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-border pb-3 text-xs">
                <span className="text-text-muted font-medium">Reference Code</span>
                <span className="font-mono font-bold text-midnight bg-white px-2 py-0.5 rounded-[2px] border border-border">
                  #{submittedRequest.id || 'REQ-SUCCESS'}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-text-muted text-[11px] block font-medium">Target Move-in</span>
                  <span className="font-bold text-midnight">{formatDateDisplay(intendedMoveInDate)}</span>
                </div>
                <div>
                  <span className="text-text-muted text-[11px] block font-medium">Agreement Duration</span>
                  <span className="font-bold text-midnight">{rentalDurationMonths} Months</span>
                </div>
              </div>
            </div>

            {/* Mutual Consent Info Callout */}
            <div className="rounded-[2px] border border-verified-border bg-[#F0FDF4] p-4 text-xs text-verified space-y-1">
              <div className="flex items-center gap-2 font-bold font-mono">
                <Lock className="h-3.5 w-3.5" /> Mutual Consent & Zero Spam Protection
              </div>
              <p className="text-[11px] text-text-secondary leading-relaxed">
                Your phone number is securely shielded. As soon as the owner accepts your application on their dashboard, verified contact details and direct WhatsApp connect will be unlocked for both parties.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-2 border-t border-border">
              <button
                type="button"
                onClick={handleClose}
                className="rounded-[3px] border border-border bg-white px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-text-secondary hover:bg-surface-muted hover:text-midnight transition-colors"
              >
                Close
              </button>
              <Link
                href="/requests"
                onClick={handleClose}
                className="inline-flex items-center justify-center gap-2 rounded-[3px] bg-cobalt px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-cobalt-hover active:scale-[0.98] transition-all shadow-[0_2px_8px_rgba(37,71,245,0.25)]"
              >
                <span>Track Application in Portal</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        ) : (
          /* ========================================================================= */
          /* APPLICATION FORM SCREEN */
          /* ========================================================================= */
          <>
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-border bg-surface-subtle p-5 sm:p-6">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 border border-border bg-white px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider text-cobalt rounded-[2px]">
                  <Lock className="h-3 w-3" /> Structured Move-in Application
                </div>
                <h2 id="rental-request-title" className="text-xl sm:text-2xl font-black tracking-tight text-midnight">
                  Apply to Rent this Home
                </h2>
                <p className="text-xs text-text-muted font-normal">
                  {listingTitle} • <span className="font-bold text-midnight">{formatINR(monthlyRent)}/mo</span>
                  {cluster ? ` • ${cluster}` : ''}
                </p>
              </div>
              <button
                type="button"
                onClick={handleClose}
                aria-label="Close modal"
                className="rounded-[2px] p-1.5 text-text-faint hover:bg-surface-muted hover:text-midnight transition-colors focus-visible:outline-none"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-6 max-h-[calc(85vh-120px)] overflow-y-auto">
              {errorMessage && (
                <div className="rounded-[2px] border border-tangerine-border bg-tangerine-surface p-3.5 text-xs text-tangerine-dark flex items-start gap-2.5">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-tangerine-dark" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Grid of Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Field 1: Intended Move-in Date */}
                <div className="space-y-1.5">
                  <label htmlFor="intendedMoveInDate" className="block text-[11px] font-mono font-bold uppercase tracking-wider text-midnight">
                    Intended Move-in Date <span className="text-tangerine">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="intendedMoveInDate"
                      type="date"
                      min={todayStr}
                      required
                      value={intendedMoveInDate}
                      onChange={e => setIntendedMoveInDate(e.target.value)}
                      className="w-full rounded-[2px] border border-border-strong bg-white px-3 py-2.5 text-xs font-medium text-midnight focus:border-cobalt focus:outline-none transition-colors shadow-sm"
                    />
                  </div>
                </div>

                {/* Field 2: Lease Duration (Months) */}
                <div className="space-y-1.5">
                  <label htmlFor="rentalDurationMonths" className="block text-[11px] font-mono font-bold uppercase tracking-wider text-midnight">
                    Lease Duration (Months) <span className="text-tangerine">*</span>
                  </label>
                  <select
                    id="rentalDurationMonths"
                    value={rentalDurationMonths}
                    onChange={e => setRentalDurationMonths(Number(e.target.value))}
                    className="w-full rounded-[2px] border border-border-strong bg-white px-3 py-2.5 text-xs font-medium text-midnight focus:border-cobalt focus:outline-none transition-colors shadow-sm"
                  >
                    <option value={6}>6 Months</option>
                    <option value={11}>11 Months (Standard Agreement)</option>
                    <option value={12}>12 Months (1 Year)</option>
                    <option value={24}>24 Months (2 Years)</option>
                    <option value={36}>36 Months (Long Term)</option>
                  </select>
                </div>

                {/* Field 3: Occupants Count */}
                <div className="space-y-1.5">
                  <label htmlFor="occupantsCount" className="block text-[11px] font-mono font-bold uppercase tracking-wider text-midnight">
                    Occupants Count <span className="text-tangerine">*</span>
                  </label>
                  <select
                    id="occupantsCount"
                    value={occupantsCount}
                    onChange={e => setOccupantsCount(Number(e.target.value))}
                    className="w-full rounded-[2px] border border-border-strong bg-white px-3 py-2.5 text-xs font-medium text-midnight focus:border-cobalt focus:outline-none transition-colors shadow-sm"
                  >
                    <option value={1}>1 Person (Single Occupancy)</option>
                    <option value={2}>2 People</option>
                    <option value={3}>3 People</option>
                    <option value={4}>4 People</option>
                    <option value={5}>5+ People</option>
                  </select>
                </div>

                {/* Field 4: Household Arrangement */}
                <div className="space-y-1.5">
                  <label htmlFor="householdArrangement" className="block text-[11px] font-mono font-bold uppercase tracking-wider text-midnight">
                    Household Arrangement <span className="text-tangerine">*</span>
                  </label>
                  <select
                    id="householdArrangement"
                    value={householdArrangement}
                    onChange={e => setHouseholdArrangement(e.target.value as any)}
                    className="w-full rounded-[2px] border border-border-strong bg-white px-3 py-2.5 text-xs font-medium text-midnight focus:border-cobalt focus:outline-none transition-colors shadow-sm"
                  >
                    <option value="individual">Individual / Bachelor</option>
                    <option value="family">Family</option>
                    <option value="working_professionals">Working Professionals (Roommates)</option>
                    <option value="students">Students</option>
                  </select>
                </div>

                {/* Field 5: Employment Category */}
                <div className="space-y-1.5">
                  <label htmlFor="employmentCategory" className="block text-[11px] font-mono font-bold uppercase tracking-wider text-midnight">
                    Employment Category <span className="text-tangerine">*</span>
                  </label>
                  <select
                    id="employmentCategory"
                    value={employmentCategory}
                    onChange={e => setEmploymentCategory(e.target.value as any)}
                    className="w-full rounded-[2px] border border-border-strong bg-white px-3 py-2.5 text-xs font-medium text-midnight focus:border-cobalt focus:outline-none transition-colors shadow-sm"
                  >
                    <option value="salaried">Salaried Professional</option>
                    <option value="self_employed">Self-Employed / Business</option>
                    <option value="student">Student</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Field 6: Phone Number */}
                <div className="space-y-1.5">
                  <label htmlFor="phone" className="block text-[11px] font-mono font-bold uppercase tracking-wider text-midnight">
                    Contact Phone Number <span className="text-tangerine">*</span>
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    required
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full rounded-[2px] border border-border-strong bg-white px-3 py-2.5 text-xs font-medium text-midnight focus:border-cobalt focus:outline-none transition-colors shadow-sm"
                  />
                  <p className="text-[10px] text-text-muted">
                    Protected by mutual consent. Revealed only when accepted.
                  </p>
                </div>
              </div>

              {/* Field 7: Optional Introduction */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="optionalIntroduction" className="block text-[11px] font-mono font-bold uppercase tracking-wider text-midnight">
                    Introduction & Profile (Optional)
                  </label>
                  <span className="text-[10px] font-mono text-text-faint">
                    {optionalIntroduction.length}/1000
                  </span>
                </div>
                <textarea
                  id="optionalIntroduction"
                  rows={3}
                  maxLength={1000}
                  value={optionalIntroduction}
                  onChange={e => setOptionalIntroduction(e.target.value)}
                  placeholder="e.g. Senior engineer at IT corridor looking for a clean, peaceful home. Non-smoker, prompt with rent payments."
                  className="w-full rounded-[2px] border border-border-strong bg-white p-3 text-xs font-medium text-midnight placeholder:text-text-faint focus:border-cobalt focus:outline-none transition-colors shadow-sm resize-none"
                />
              </div>

              {/* Two-Sided Privacy Notice Callout */}
              <div className="rounded-[2px] border border-verified-border bg-verified-surface p-3.5 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-verified font-mono">
                  <ShieldCheck className="h-4 w-4 shrink-0" /> Mutual Contact Protection
                </div>
                <p className="text-[11px] text-verified leading-relaxed">
                  By submitting this request, you consent to sharing your phone number with the property owner only after they review and accept your application.
                </p>
              </div>

              {/* Modal Footer Actions */}
              <div className="flex items-center justify-end gap-3 pt-2 border-t border-border">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="rounded-[3px] border border-border bg-white px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-text-secondary hover:bg-surface-muted hover:text-midnight transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 rounded-[3px] bg-cobalt px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-cobalt-hover active:scale-[0.98] transition-all shadow-[0_2px_8px_rgba(37,71,245,0.25)] disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Submitting Application...</span>
                  ) : (
                    <>
                      <span>Submit Application</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
