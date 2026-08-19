import { PiiProtector } from './crypto';

export interface StoredListing {
  id: string;
  slug: string;
  ownerId: string;
  ownerName: string;
  ownerPhone: string;
  ownerEmail: string;
  status: 'draft' | 'pending_review' | 'published' | 'paused' | 'rented' | 'rejected' | 'suspended';
  cluster: 'gachibowli' | 'kondapur' | 'madhapur' | 'hitec_city' | 'manikonda' | 'financial_district';
  colonyOrSociety: string;
  landmark: string;
  pincode: string;
  title: string;
  description: string;
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
  photos: {
    url: string;
    roomTag: 'main_room' | 'bedroom' | 'kitchen' | 'bathroom' | 'balcony_exterior' | 'other';
    isCover: boolean;
    caption?: string;
  }[];
  evidence?: {
    type: 'phone_call' | 'tgspdcl_bill' | 'ghmc_tax_receipt' | 'society_noc' | 'authorization_letter' | 'other';
    urlOrDoc: string;
    consumerNumber?: string;
    verified: boolean;
  };
  submittedAt: string;
  publishedAt?: string;
  lastAvailabilityConfirmedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface StoredRentalRequest {
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
}

export interface StoredContactUnlock {
  id: string;
  rentalRequestId: string;
  unlockedAt: string;
}

// Clean Fresh Production Store (Empty by default)
const INITIAL_LISTINGS: StoredListing[] = [];
const INITIAL_REQUESTS: StoredRentalRequest[] = [];
const INITIAL_UNLOCKS: StoredContactUnlock[] = [];

// In-Memory Database Store singleton across invocations
class InMemoryStore {
  private listings: Map<string, StoredListing> = new Map();
  private requests: Map<string, StoredRentalRequest> = new Map();
  private contactUnlocks: Map<string, StoredContactUnlock> = new Map();

  constructor() {
    for (const l of INITIAL_LISTINGS) {
      this.listings.set(l.id, { ...l });
    }
    for (const r of INITIAL_REQUESTS) {
      this.requests.set(r.id, { ...r });
    }
    for (const u of INITIAL_UNLOCKS) {
      this.contactUnlocks.set(u.rentalRequestId, { ...u });
    }
  }

  // --- LISTINGS ---
  public getListings(): StoredListing[] {
    return Array.from(this.listings.values());
  }

  public getListingById(id: string): StoredListing | undefined {
    if (!id) return undefined;
    const cleanId = decodeURIComponent(id).trim().toLowerCase();
    const direct = this.listings.get(id) || Array.from(this.listings.values()).find(
      l => l.id.toLowerCase() === cleanId || l.slug.toLowerCase() === cleanId
    );
    if (direct) return direct;

    // Cross-reference common seed ID aliases
    const aliases: Record<string, string> = {
      'lst_1rk_kondapur': '1rk-independent-kondapur-botanical',
      'lst_room_gachibowli': 'private-room-colive-gachibowli',
      'lst_2bhk_madhapur': '2bhk-semi-furnished-madhapur-ayyyappa',
      'lst_3bhk_manikonda': '3bhk-family-apartment-manikonda',
      'lst_2bhk_fd': '2bhk-gated-financial-district',
      'lst_1bhk_hitec': '1bhk-serviced-hitec-city',
      'listing-hyd-01': '1rk-independent-kondapur-botanical',
      'listing-hyd-02': 'private-room-colive-gachibowli',
      'listing-hyd-03': '2bhk-semi-furnished-madhapur-ayyyappa',
      'listing-hyd-04': '3bhk-family-apartment-manikonda',
      'listing-hyd-05': '2bhk-gated-financial-district',
      'listing-hyd-06': '1bhk-serviced-hitec-city',
    };

    const targetSlug = aliases[cleanId];
    if (targetSlug) {
      return this.getListingBySlug(targetSlug);
    }

    return Array.from(this.listings.values()).find(l =>
      cleanId.includes(l.cluster.toLowerCase()) || cleanId.includes(l.propertyType.toLowerCase())
    );
  }

  public getListingBySlug(slug: string): StoredListing | undefined {
    if (!slug) return undefined;
    const cleanSlug = decodeURIComponent(slug).trim().toLowerCase();
    return Array.from(this.listings.values()).find(
      l => l.slug.toLowerCase() === cleanSlug || l.id.toLowerCase() === cleanSlug
    );
  }

  public getOwnerListings(ownerId?: string): StoredListing[] {
    if (!ownerId) {
      return Array.from(this.listings.values());
    }
    return Array.from(this.listings.values()).filter(l => l.ownerId === ownerId);
  }

  public createListing(data: Omit<StoredListing, 'id' | 'createdAt' | 'updatedAt' | 'submittedAt' | 'lastAvailabilityConfirmedAt'> & {
    id?: string;
  }): StoredListing {
    const id = data.id || `listing-${Date.now()}`;
    const now = new Date().toISOString();
    const newListing: StoredListing = {
      ...data,
      id,
      submittedAt: now,
      lastAvailabilityConfirmedAt: now,
      createdAt: now,
      updatedAt: now,
    };
    this.listings.set(id, newListing);
    return newListing;
  }

  public reconfirmListingAvailability(listingId: string): StoredListing | undefined {
    const listing = this.listings.get(listingId);
    if (!listing) return undefined;
    const now = new Date().toISOString();
    listing.lastAvailabilityConfirmedAt = now;
    listing.updatedAt = now;
    this.listings.set(listingId, listing);
    return listing;
  }

  public approveListing(listingId: string): StoredListing | undefined {
    let listing = this.listings.get(listingId);
    if (!listing) {
      listing = Array.from(this.listings.values()).find(l => l.slug === listingId);
    }
    if (!listing) return undefined;
    const now = new Date().toISOString();
    listing.status = 'published';
    listing.publishedAt = now;
    listing.lastAvailabilityConfirmedAt = now;
    listing.updatedAt = now;
    if (listing.evidence) {
      listing.evidence.verified = true;
    }
    this.listings.set(listing.id, listing);
    return listing;
  }

  public rejectListing(listingId: string, reason?: string): StoredListing | undefined {
    let listing = this.listings.get(listingId);
    if (!listing) {
      listing = Array.from(this.listings.values()).find(l => l.slug === listingId);
    }
    if (!listing) return undefined;
    const now = new Date().toISOString();
    listing.status = 'rejected';
    listing.updatedAt = now;
    this.listings.set(listing.id, listing);
    return listing;
  }

  // --- RENTAL REQUESTS ---
  public getRequests(): StoredRentalRequest[] {
    return Array.from(this.requests.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  public getRenterRequests(renterId?: string): StoredRentalRequest[] {
    if (!renterId) {
      return this.getRequests();
    }
    return Array.from(this.requests.values())
      .filter(r => r.renterId === renterId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public getListingRequests(listingId: string): StoredRentalRequest[] {
    if (!listingId) return [];
    const cleanId = decodeURIComponent(listingId).trim().toLowerCase();
    const listing = this.getListingById(listingId) || this.getListingBySlug(listingId);
    const targetId = listing ? listing.id.toLowerCase() : cleanId;
    const targetSlug = listing ? listing.slug.toLowerCase() : cleanId;

    return Array.from(this.requests.values())
      .filter(r => {
        const reqListingId = r.listingId.toLowerCase();
        return (
          reqListingId === targetId ||
          reqListingId === targetSlug ||
          reqListingId === cleanId ||
          (listing && reqListingId === 'lst_1rk_kondapur' && targetSlug.includes('1rk-independent')) ||
          (listing && reqListingId === 'listing-hyd-01' && targetSlug.includes('1rk-independent'))
        );
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public getRequestById(id: string): StoredRentalRequest | undefined {
    return this.requests.get(id);
  }

  public createRequest(data: Omit<StoredRentalRequest, 'id' | 'createdAt' | 'updatedAt' | 'status'> & {
    id?: string;
    status?: StoredRentalRequest['status'];
  }): StoredRentalRequest {
    const id = data.id || `req-${Date.now()}`;
    const now = new Date().toISOString();
    const newRequest: StoredRentalRequest = {
      ...data,
      id,
      status: data.status || 'submitted',
      createdAt: now,
      updatedAt: now,
    };
    this.requests.set(id, newRequest);
    return newRequest;
  }

  public acceptRequest(requestId: string): { request: StoredRentalRequest; unlock: StoredContactUnlock } | undefined {
    const req = this.requests.get(requestId);
    if (!req) return undefined;

    const now = new Date().toISOString();
    req.status = 'accepted';
    req.respondedAt = now;
    req.updatedAt = now;
    this.requests.set(requestId, req);

    let unlock = this.contactUnlocks.get(requestId);
    if (!unlock) {
      unlock = {
        id: `unlock-${Date.now()}`,
        rentalRequestId: requestId,
        unlockedAt: now,
      };
      this.contactUnlocks.set(requestId, unlock);
    }

    return { request: req, unlock };
  }

  public declineRequest(requestId: string, reason?: string): StoredRentalRequest | undefined {
    const req = this.requests.get(requestId);
    if (!req) return undefined;

    const now = new Date().toISOString();
    req.status = 'declined';
    req.respondedAt = now;
    req.declineReason = reason || 'Property is no longer available or does not match occupant criteria.';
    req.updatedAt = now;
    this.requests.set(requestId, req);
    return req;
  }

  public isContactUnlocked(requestId: string): boolean {
    return this.contactUnlocks.has(requestId);
  }
}

// Global store instance attached to globalThis to persist across Fast Refresh in dev
const globalForStore = globalThis as unknown as { __TRC_STORE__?: InMemoryStore };

export function getDataStore(): InMemoryStore {
  if (!globalForStore.__TRC_STORE__) {
    globalForStore.__TRC_STORE__ = new InMemoryStore();
  }
  return globalForStore.__TRC_STORE__;
}
