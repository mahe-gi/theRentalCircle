import * as schema from './schema';
import type {
  Listing,
  NewListing,
  ListingMedia,
  NewListingMedia,
  VerificationCheck,
  RentalRequest,
  NewRentalRequest,
  User,
} from './schema';

// In-Memory Fallback Store for Local Development & Immediate Client-Side Interactivity
export interface ExtendedListing extends Listing {
  media: ListingMedia[];
  amenities: string[];
  verificationChecks: VerificationCheck[];
  owner?: {
    name: string;
    email: string;
    phone?: string;
  };
}

export interface ExtendedRentalRequest extends RentalRequest {
  listingTitle?: string;
  listingSlug?: string;
  listingRent?: number;
  ownerName?: string;
  ownerPhone?: string;
  renterName?: string;
  renterEmail?: string;
  renterPhone?: string;
}

// Seed Admin Users
const SEED_USERS: Record<string, User> = {
  'usr_admin_mahesh': {
    id: 'usr_admin_mahesh',
    name: 'Mahesh (Founder / Admin)',
    email: 'chmahesh997@gmail.com',
    emailVerified: true,
    image: null,
    role: 'admin',
    phoneHash: 'hash_admin_mahesh',
    encryptedPhone: 'enc_9999900000',
    phoneVerified: true,
    phoneConfirmedAt: new Date(),
    phoneConfirmedBy: 'system',
    phoneConfirmationMethod: 'founder_call',
    isBanned: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  'usr_admin_1': {
    id: 'usr_admin_1',
    name: 'Founder / Moderator',
    email: 'admin.trc@therentalcircle.in',
    emailVerified: true,
    image: null,
    role: 'admin',
    phoneHash: 'hash_admin_1',
    encryptedPhone: 'enc_9876543210',
    phoneVerified: true,
    phoneConfirmedAt: new Date(),
    phoneConfirmedBy: 'system',
    phoneConfirmationMethod: 'founder_call',
    isBanned: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
};

// 100% Clean Fresh Production Catalog (Empty by Default)
let MOCK_LISTINGS: ExtendedListing[] = [];
let MOCK_REQUESTS: ExtendedRentalRequest[] = [];

// Query Repository Functions
export async function getPublishedListings(filters: {
  cluster?: string;
  maxRent?: number;
  propertyType?: string;
  furnishing?: string;
  query?: string;
} = {}): Promise<ExtendedListing[]> {
  return MOCK_LISTINGS.filter(item => {
    if (item.status !== 'published') return false;
    if (filters.cluster && item.cluster !== filters.cluster) return false;
    if (filters.maxRent && (item.monthlyRent || 0) > filters.maxRent) return false;
    if (filters.propertyType && item.propertyType !== filters.propertyType) return false;
    if (filters.furnishing && item.furnishingStatus !== filters.furnishing) return false;
    if (filters.query) {
      const q = filters.query.toLowerCase();
      const match =
        (item.title || '').toLowerCase().includes(q) ||
        (item.cluster || '').toLowerCase().includes(q) ||
        (item.colonyOrSociety || '').toLowerCase().includes(q) ||
        (item.description || '').toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });
}

export async function getListingBySlug(slug: string): Promise<ExtendedListing | null> {
  const cleanSlug = decodeURIComponent(slug).trim().toLowerCase();
  const item = MOCK_LISTINGS.find(l => l.slug.toLowerCase() === cleanSlug || l.id.toLowerCase() === cleanSlug);
  return item || null;
}

export async function getListingById(id: string): Promise<ExtendedListing | null> {
  const cleanId = decodeURIComponent(id).trim().toLowerCase();
  const item = MOCK_LISTINGS.find(l => l.id.toLowerCase() === cleanId || l.slug.toLowerCase() === cleanId);
  return item || null;
}

export async function getOwnerListings(ownerId: string): Promise<ExtendedListing[]> {
  return MOCK_LISTINGS.filter(l => l.ownerId === ownerId);
}

export async function createListing(
  listingData: Partial<NewListing> & {
    title: string;
    cluster: any;
    propertyType: any;
    monthlyRent: number;
  },
  mediaItems: Partial<NewListingMedia>[] = [],
  amenityList: string[] = []
): Promise<ExtendedListing> {
  const id = 'lst_' + Math.random().toString(36).substring(2, 9);
  const slug = listingData.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') + '-' + id.slice(-4);

  const newListing: ExtendedListing = {
    id,
    ownerId: listingData.ownerId || 'usr_owner_1',
    slug,
    status: 'pending_review',
    cluster: listingData.cluster,
    colonyOrSociety: listingData.colonyOrSociety || 'West Hyderabad',
    landmark: listingData.landmark || null,
    pincode: listingData.pincode || '500081',
    encryptedExactAddress: listingData.encryptedExactAddress || null,
    title: listingData.title,
    description: listingData.description || '',
    propertyType: listingData.propertyType,
    monthlyRent: listingData.monthlyRent,
    securityDeposit: listingData.securityDeposit || listingData.monthlyRent * 2,
    maintenanceCharges: listingData.maintenanceCharges || 0,
    isMaintenanceIncluded: listingData.isMaintenanceIncluded || false,
    lockInMonths: listingData.lockInMonths || 6,
    noticeDays: listingData.noticeDays || 30,
    furnishingStatus: listingData.furnishingStatus || 'semi_furnished',
    carpetAreaSqFt: listingData.carpetAreaSqFt || 500,
    floorNumber: listingData.floorNumber || 1,
    totalFloors: listingData.totalFloors || 4,
    availableFrom: listingData.availableFrom || new Date(),
    petsAllowed: listingData.petsAllowed || false,
    moderationNotes: null,
    rejectionReason: null,
    submittedAt: new Date(),
    publishedAt: null,
    lastAvailabilityConfirmedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    media: mediaItems.map((m, idx) => ({
      id: 'med_' + Math.random().toString(36).substring(2, 9),
      listingId: id,
      approvedR2Key: m.approvedR2Key || 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
      roomTag: (m.roomTag as any) || 'bedroom',
      caption: m.caption || 'Property view',
      displayOrder: idx,
      isCover: idx === 0,
      isApproved: false,
      width: 1200,
      height: 800,
      sizeBytes: 150000,
      createdAt: new Date(),
    })),
    amenities: amenityList.length > 0 ? amenityList : ['24/7 Water', 'Power Backup', 'Bike Parking'],
    verificationChecks: [
      {
        id: 'chk_' + Math.random().toString(36).substring(2, 9),
        listingId: id,
        checkType: 'listing_contact_call',
        status: 'pending',
        evidenceType: 'phone_call',
        reviewedByUserId: null,
        reviewerNotes: null,
        verifiedAt: null,
        createdAt: new Date(),
      },
    ],
    owner: {
      name: 'Owner',
      email: 'owner@therentalcircle.in',
      phone: '+91 98490 00000',
    },
  };

  MOCK_LISTINGS.unshift(newListing);
  return newListing;
}

export async function createRentalRequest(
  data: Partial<NewRentalRequest> & {
    listingId: string;
    renterId: string;
    intendedMoveInDate: Date;
    householdArrangement: any;
    employmentCategory: any;
  }
): Promise<ExtendedRentalRequest> {
  const id = 'req_' + Math.random().toString(36).substring(2, 9);
  const targetListing = MOCK_LISTINGS.find(l => l.id === data.listingId);

  const newReq: ExtendedRentalRequest = {
    id,
    listingId: data.listingId,
    renterId: data.renterId,
    status: 'submitted',
    intendedMoveInDate: data.intendedMoveInDate,
    rentalDurationMonths: data.rentalDurationMonths || 11,
    occupantsCount: data.occupantsCount || 1,
    householdArrangement: data.householdArrangement,
    employmentCategory: data.employmentCategory,
    petsDescription: data.petsDescription || null,
    optionalIntroduction: data.optionalIntroduction || null,
    viewedAt: null,
    respondedAt: null,
    declineReason: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    listingTitle: targetListing?.title || 'Residential Unit',
    listingSlug: targetListing?.slug || '',
    listingRent: targetListing?.monthlyRent || 0,
    ownerName: targetListing?.owner?.name || 'Property Contact',
    ownerPhone: targetListing?.owner?.phone || '+91 98490 12345',
    renterName: 'Renter',
    renterEmail: 'renter@therentalcircle.in',
    renterPhone: '+91 99887 76655',
  };

  MOCK_REQUESTS.unshift(newReq);
  return newReq;
}

export async function getRenterRequests(renterId: string): Promise<ExtendedRentalRequest[]> {
  return MOCK_REQUESTS.filter(r => r.renterId === renterId);
}

export async function getOwnerListingRequests(listingId: string): Promise<ExtendedRentalRequest[]> {
  return MOCK_REQUESTS.filter(r => r.listingId === listingId);
}

export async function acceptRentalRequest(requestId: string): Promise<ExtendedRentalRequest | null> {
  const req = MOCK_REQUESTS.find(r => r.id === requestId);
  if (!req) return null;
  req.status = 'accepted';
  req.respondedAt = new Date();
  req.updatedAt = new Date();
  return req;
}

export async function declineRentalRequest(requestId: string, reason?: string): Promise<ExtendedRentalRequest | null> {
  const req = MOCK_REQUESTS.find(r => r.id === requestId);
  if (!req) return null;
  req.status = 'declined';
  req.declineReason = reason || 'Property no longer available or mismatched criteria.';
  req.respondedAt = new Date();
  req.updatedAt = new Date();
  return req;
}

export async function getAdminModerationQueue(status?: string): Promise<ExtendedListing[]> {
  if (!status || status === 'all') return MOCK_LISTINGS;
  return MOCK_LISTINGS.filter(l => l.status === status);
}

export async function approveListing(listingId: string, moderatorId: string): Promise<ExtendedListing | null> {
  const listing = MOCK_LISTINGS.find(l => l.id === listingId);
  if (!listing) return null;
  listing.status = 'published';
  listing.publishedAt = new Date();
  listing.lastAvailabilityConfirmedAt = new Date();
  listing.updatedAt = new Date();
  listing.verificationChecks.forEach(c => {
    c.status = 'approved';
    c.reviewedByUserId = moderatorId;
    c.verifiedAt = new Date();
  });
  return listing;
}

export async function rejectListing(listingId: string, moderatorId: string, reason: string): Promise<ExtendedListing | null> {
  const listing = MOCK_LISTINGS.find(l => l.id === listingId);
  if (!listing) return null;
  listing.status = 'rejected';
  listing.rejectionReason = reason;
  listing.updatedAt = new Date();
  return listing;
}
