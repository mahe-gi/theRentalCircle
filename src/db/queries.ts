import * as schema from './schema';
import type {
  Listing,
  NewListing,
  ListingMedia,
  NewListingMedia,
  VerificationCheck,
  RentalRequest,
  NewRentalRequest,
} from './schema';
import { getDataStore, type StoredListing, type StoredRentalRequest } from '@/lib/data-store';

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

function mapStoredToExtendedListing(stored: StoredListing): ExtendedListing {
  return {
    id: stored.id,
    ownerId: stored.ownerId,
    slug: stored.slug,
    status: stored.status,
    cluster: stored.cluster,
    colonyOrSociety: stored.colonyOrSociety,
    landmark: stored.landmark || null,
    pincode: stored.pincode,
    encryptedExactAddress: null,
    title: stored.title,
    description: stored.description,
    propertyType: stored.propertyType,
    monthlyRent: stored.monthlyRent,
    securityDeposit: stored.securityDeposit,
    maintenanceCharges: stored.maintenanceCharges,
    isMaintenanceIncluded: stored.isMaintenanceIncluded,
    lockInMonths: stored.lockInMonths,
    noticeDays: stored.noticeDays,
    furnishingStatus: stored.furnishingStatus,
    carpetAreaSqFt: stored.carpetAreaSqFt,
    floorNumber: stored.floorNumber,
    totalFloors: stored.totalFloors,
    availableFrom: new Date(stored.availableFrom),
    petsAllowed: stored.petsAllowed,
    moderationNotes: stored.moderationNotes || null,
    rejectionReason: stored.rejectionReason || null,
    submittedAt: new Date(stored.submittedAt),
    publishedAt: stored.publishedAt ? new Date(stored.publishedAt) : null,
    lastAvailabilityConfirmedAt: new Date(stored.lastAvailabilityConfirmedAt),
    createdAt: new Date(stored.createdAt),
    updatedAt: new Date(stored.updatedAt),
    media: (stored.photos || []).map((p, idx) => ({
      id: `med_${stored.id}_${idx}`,
      listingId: stored.id,
      approvedR2Key: p.url,
      roomTag: (p.roomTag as any) || 'bedroom',
      caption: p.caption || '',
      displayOrder: idx,
      isCover: p.isCover ?? idx === 0,
      isApproved: true,
      width: 1200,
      height: 800,
      sizeBytes: 150000,
      createdAt: new Date(stored.createdAt),
    })),
    amenities: stored.amenities || [],
    verificationChecks: [
      {
        id: `chk_${stored.id}_call`,
        listingId: stored.id,
        checkType: 'listing_contact_call',
        status: stored.status === 'published' ? 'approved' : 'pending',
        evidenceType: 'phone_call',
        reviewedByUserId: null,
        reviewerNotes: null,
        verifiedAt: stored.publishedAt ? new Date(stored.publishedAt) : null,
        createdAt: new Date(stored.createdAt),
      },
    ],
    owner: {
      name: stored.ownerName,
      email: stored.ownerEmail,
      phone: stored.ownerPhone,
    },
  };
}

function mapStoredToExtendedRequest(stored: StoredRentalRequest): ExtendedRentalRequest {
  const store = getDataStore();
  const listing = store.getListingById(stored.listingId) || store.getListingBySlug(stored.listingId);
  return {
    id: stored.id,
    listingId: stored.listingId,
    renterId: stored.renterId,
    status: stored.status,
    intendedMoveInDate: new Date(stored.intendedMoveInDate),
    rentalDurationMonths: stored.rentalDurationMonths,
    occupantsCount: stored.occupantsCount,
    householdArrangement: stored.householdArrangement,
    employmentCategory: stored.employmentCategory,
    petsDescription: stored.petsDescription || null,
    optionalIntroduction: stored.optionalIntroduction || null,
    viewedAt: stored.viewedAt ? new Date(stored.viewedAt) : null,
    respondedAt: stored.respondedAt ? new Date(stored.respondedAt) : null,
    declineReason: stored.declineReason || null,
    createdAt: new Date(stored.createdAt),
    updatedAt: new Date(stored.updatedAt),
    listingTitle: listing?.title || 'Residential Property',
    listingSlug: listing?.slug || '',
    listingRent: listing?.monthlyRent || 0,
    ownerName: listing?.ownerName || 'Property Contact',
    ownerPhone: listing?.ownerPhone || undefined,
    renterName: stored.renterName,
    renterEmail: stored.renterEmail,
    renterPhone: stored.renterPhone,
  };
}

// Query Repository Functions
export async function getPublishedListings(filters: {
  cluster?: string;
  maxRent?: number;
  propertyType?: string;
  furnishing?: string;
  query?: string;
} = {}): Promise<ExtendedListing[]> {
  const store = getDataStore();
  const allListings = store.getListings();

  return allListings
    .filter(item => {
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
    })
    .map(mapStoredToExtendedListing);
}

export async function getListingBySlug(slug: string): Promise<ExtendedListing | null> {
  const store = getDataStore();
  const item = store.getListingBySlug(slug) || store.getListingById(slug);
  return item ? mapStoredToExtendedListing(item) : null;
}

export async function getListingById(id: string): Promise<ExtendedListing | null> {
  const store = getDataStore();
  const item = store.getListingById(id) || store.getListingBySlug(id);
  return item ? mapStoredToExtendedListing(item) : null;
}

export async function getOwnerListings(ownerId: string): Promise<ExtendedListing[]> {
  const store = getDataStore();
  return store.getOwnerListings(ownerId).map(mapStoredToExtendedListing);
}

export async function createListing(
  listingData: Partial<NewListing> & {
    title: string;
    cluster: any;
    propertyType: any;
    monthlyRent: number;
    ownerName?: string;
    ownerPhone?: string;
    ownerEmail?: string;
  },
  mediaItems: Partial<NewListingMedia>[] = [],
  amenityList: string[] = []
): Promise<ExtendedListing> {
  const store = getDataStore();
  const slug = listingData.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') + '-' + Math.random().toString(36).substring(2, 6);

  const created = store.createListing({
    slug,
    ownerId: listingData.ownerId || 'owner_user',
    ownerName: listingData.ownerName || 'Property Owner',
    ownerPhone: listingData.ownerPhone || '',
    ownerEmail: listingData.ownerEmail || '',
    status: 'pending_review',
    cluster: listingData.cluster,
    colonyOrSociety: listingData.colonyOrSociety || 'Hyderabad',
    landmark: listingData.landmark || '',
    pincode: listingData.pincode || '500081',
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
    availableFrom: typeof listingData.availableFrom === 'string' ? listingData.availableFrom : new Date().toISOString().split('T')[0],
    petsAllowed: listingData.petsAllowed || false,
    amenities: amenityList,
    photos: mediaItems.map((m, idx) => ({
      url: m.approvedR2Key || '',
      roomTag: (m.roomTag as any) || 'main_room',
      caption: m.caption || '',
      isCover: m.isCover ?? idx === 0,
    })).filter(p => !!p.url),
  });

  return mapStoredToExtendedListing(created);
}

export async function createRentalRequest(
  data: Partial<NewRentalRequest> & {
    listingId: string;
    renterId: string;
    intendedMoveInDate: Date;
    householdArrangement: any;
    employmentCategory: any;
    renterName?: string;
    renterEmail?: string;
    renterPhone?: string;
  }
): Promise<ExtendedRentalRequest> {
  const store = getDataStore();
  const created = store.createRequest({
    listingId: data.listingId,
    renterId: data.renterId,
    renterName: data.renterName || 'Prospective Renter',
    renterPhone: data.renterPhone || '',
    renterEmail: data.renterEmail || '',
    intendedMoveInDate: data.intendedMoveInDate.toISOString().split('T')[0],
    rentalDurationMonths: data.rentalDurationMonths || 11,
    occupantsCount: data.occupantsCount || 1,
    householdArrangement: data.householdArrangement,
    employmentCategory: data.employmentCategory,
    petsDescription: data.petsDescription || undefined,
    optionalIntroduction: data.optionalIntroduction || undefined,
  });

  return mapStoredToExtendedRequest(created);
}

export async function getRenterRequests(renterId: string): Promise<ExtendedRentalRequest[]> {
  const store = getDataStore();
  return store.getRenterRequests(renterId).map(mapStoredToExtendedRequest);
}

export async function getOwnerListingRequests(listingId: string): Promise<ExtendedRentalRequest[]> {
  const store = getDataStore();
  return store.getListingRequests(listingId).map(mapStoredToExtendedRequest);
}

export async function acceptRentalRequest(requestId: string): Promise<ExtendedRentalRequest | null> {
  const store = getDataStore();
  const result = store.acceptRequest(requestId);
  return result ? mapStoredToExtendedRequest(result.request) : null;
}

export async function declineRentalRequest(requestId: string, reason?: string): Promise<ExtendedRentalRequest | null> {
  const store = getDataStore();
  const req = store.declineRequest(requestId, reason);
  return req ? mapStoredToExtendedRequest(req) : null;
}

export async function getAdminModerationQueue(status?: string): Promise<ExtendedListing[]> {
  const store = getDataStore();
  const listings = store.getListings();
  if (!status || status === 'all') return listings.map(mapStoredToExtendedListing);
  return listings.filter(l => l.status === status).map(mapStoredToExtendedListing);
}

export async function approveListing(listingId: string, moderatorId: string): Promise<ExtendedListing | null> {
  const store = getDataStore();
  const approved = store.approveListing(listingId, `Approved by ${moderatorId}`);
  return approved ? mapStoredToExtendedListing(approved) : null;
}

export async function rejectListing(listingId: string, moderatorId: string, reason: string): Promise<ExtendedListing | null> {
  const store = getDataStore();
  const rejected = store.rejectListing(listingId, reason);
  return rejected ? mapStoredToExtendedListing(rejected) : null;
}

