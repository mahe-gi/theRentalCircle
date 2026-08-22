export interface RoomPhoto {
  id: string;
  url: string;
  roomTag: 'main_room' | 'bedroom' | 'kitchen' | 'bathroom' | 'balcony_exterior' | 'other';
  caption: string;
  isCover: boolean;
  isApproved: boolean;
  width?: number;
  height?: number;
  sizeBytes?: number;
}

export interface VerificationCheckItem {
  id: string;
  checkType: 'listing_contact_call' | 'listing_reviewed' | 'property_connection_evidence' | 'representative_authorization_evidence';
  status: 'pending' | 'approved' | 'rejected';
  evidenceType?: 'phone_call' | 'tgspdcl_bill' | 'ghmc_tax_receipt' | 'society_noc' | 'authorization_letter' | 'other';
  reviewedByUserId?: string;
  reviewerNotes?: string;
  verifiedAt?: string;
}

export interface UtilityEvidenceDetails {
  provider: string;
  consumerNumber: string;
  sectionOffice?: string;
  tariffCategory?: string;
  meterNumber?: string;
  billingMonth?: string;
  billedUnits?: number;
  amountPaid?: number;
  paymentDate?: string;
  ghmcPtin?: string;
  ghmcAssessmentYear?: string;
  documentName?: string;
  documentUrl?: string;
  addressOnRecord?: string;
  matchingAddressScore?: string;
}

export interface ModerationTimelineEvent {
  id: string;
  timestamp: string;
  moderatorName: string;
  actionTaken: 'approve_listing' | 'request_changes' | 'reject_listing' | 'pause_listing' | 'submitted';
  reason: string;
  notes?: string;
}

export interface AdminListing {
  id: string;
  slug: string;
  title: string;
  description: string;
  status: 'draft' | 'pending_review' | 'published' | 'paused' | 'rented' | 'rejected' | 'suspended';
  cluster: 'gachibowli' | 'kondapur' | 'madhapur' | 'hitec_city' | 'manikonda' | 'financial_district';
  colonyOrSociety: string;
  landmark: string;
  pincode: string;
  exactAddress: string;
  propertyType: 'shared_room' | 'private_room' | '1rk' | '1bhk' | '2bhk' | '3plus_bhk' | 'independent_house' | 'penthouse';
  monthlyRent: number;
  securityDeposit: number;
  maintenanceCharges: number;
  isMaintenanceIncluded: boolean;
  lockInMonths: number;
  noticeDays: number;
  furnishingStatus: 'unfurnished' | 'semi_furnished' | 'fully_furnished';
  carpetAreaSqFt: number;
  floorNumber: number;
  totalFloors: number;
  availableFrom: string;
  petsAllowed: boolean;
  amenities: string[];
  submittedAt: string;
  publishedAt?: string;
  lastAvailabilityConfirmedAt?: string;
  moderationNotes?: string;
  rejectionReason?: string;
  owner: {
    id: string;
    name: string;
    email: string;
    phone: string;
    phoneVerified: boolean;
    phoneConfirmationMethod: 'founder_call' | 'whatsapp_check' | 'email_handshake';
    phoneConfirmedAt: string;
    phoneConfirmedBy: string;
  };
  photos: RoomPhoto[];
  verificationChecks: VerificationCheckItem[];
  utilityEvidence?: UtilityEvidenceDetails;
  moderationHistory: ModerationTimelineEvent[];
}

// 100% Clean Fresh Production Catalog (Empty by default)
export const INITIAL_MOCK_LISTINGS: AdminListing[] = [];

// Global in-memory mutable store for development & moderation workflows
let mutableListings: AdminListing[] = [...INITIAL_MOCK_LISTINGS];

export function getAllAdminListings(): AdminListing[] {
  return mutableListings;
}

export function getAdminListingById(idOrSlug: string): AdminListing | undefined {
  if (!idOrSlug) return undefined;
  const clean = decodeURIComponent(idOrSlug).trim().toLowerCase();
  return mutableListings.find(l => l.id.toLowerCase() === clean || l.slug.toLowerCase() === clean);
}

export function addAdminListing(listing: AdminListing): AdminListing {
  const existingIdx = mutableListings.findIndex(l => l.id === listing.id || l.slug === listing.slug);
  if (existingIdx >= 0) {
    mutableListings[existingIdx] = listing;
  } else {
    mutableListings.unshift(listing);
  }
  return listing;
}

export function approveAdminListing(
  id: string,
  moderatorName: string = 'Founder Moderator',
  notes?: string
): AdminListing | null {
  const listingIndex = mutableListings.findIndex(l => l.id === id || l.slug === id);
  if (listingIndex === -1) return null;

  const now = new Date().toISOString();
  const current = mutableListings[listingIndex];

  const updatedChecks = current.verificationChecks.map(check => ({
    ...check,
    status: 'approved' as const,
    verifiedAt: now,
    reviewedByUserId: moderatorName,
    reviewerNotes: check.reviewerNotes || 'Approved by Founder moderation',
  }));

  const updatedHistory: ModerationTimelineEvent[] = [
    ...current.moderationHistory,
    {
      id: `mh_${Date.now()}`,
      timestamp: now,
      moderatorName,
      actionTaken: 'approve_listing',
      reason: 'All checks verified: Owner identity, TSSPDCL connection evidence, and photo quality approved.',
      notes: notes || 'Listing approved & published to public catalog.',
    },
  ];

  const updated: AdminListing = {
    ...current,
    status: 'published',
    publishedAt: now,
    lastAvailabilityConfirmedAt: now,
    moderationNotes: notes || current.moderationNotes,
    rejectionReason: undefined,
    verificationChecks: updatedChecks,
    moderationHistory: updatedHistory,
  };

  mutableListings[listingIndex] = updated;

  try {
    const { getDataStore } = require('./data-store');
    getDataStore().approveListing(current.id);
  } catch {
    // ignore
  }

  return updated;
}

export function rejectAdminListing(
  id: string,
  reason: string,
  notes?: string,
  moderatorName: string = 'Founder Moderator'
): AdminListing | null {
  const listingIndex = mutableListings.findIndex(l => l.id === id || l.slug === id);
  if (listingIndex === -1) return null;

  const now = new Date().toISOString();
  const current = mutableListings[listingIndex];

  const updatedChecks = current.verificationChecks.map(check => ({
    ...check,
    status: (check.status === 'approved' ? 'approved' : 'rejected') as 'pending' | 'approved' | 'rejected',
    verifiedAt: now,
    reviewedByUserId: moderatorName,
  }));

  const updatedHistory: ModerationTimelineEvent[] = [
    ...current.moderationHistory,
    {
      id: `mh_${Date.now()}`,
      timestamp: now,
      moderatorName,
      actionTaken: 'reject_listing',
      reason,
      notes: notes || reason,
    },
  ];

  const updated: AdminListing = {
    ...current,
    status: 'rejected',
    rejectionReason: reason,
    moderationNotes: notes || reason,
    verificationChecks: updatedChecks,
    moderationHistory: updatedHistory,
  };

  mutableListings[listingIndex] = updated;

  try {
    const { getDataStore } = require('./data-store');
    getDataStore().rejectListing(current.id, reason);
  } catch {
    // ignore
  }

  return updated;
}

export function requestChangesAdminListing(
  id: string,
  changesDescription: string,
  moderatorName: string = 'Founder Moderator'
): AdminListing | null {
  const listingIndex = mutableListings.findIndex(l => l.id === id || l.slug === id);
  if (listingIndex === -1) return null;

  const now = new Date().toISOString();
  const current = mutableListings[listingIndex];

  const updatedHistory: ModerationTimelineEvent[] = [
    ...current.moderationHistory,
    {
      id: `mh_${Date.now()}`,
      timestamp: now,
      moderatorName,
      actionTaken: 'request_changes',
      reason: 'Changes requested before approval',
      notes: changesDescription,
    },
  ];

  const updated: AdminListing = {
    ...current,
    status: 'pending_review',
    moderationNotes: `Changes requested: ${changesDescription}`,
    moderationHistory: updatedHistory,
  };

  mutableListings[listingIndex] = updated;
  return updated;
}
