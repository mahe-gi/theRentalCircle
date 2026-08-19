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

// Demo initial listings
const INITIAL_LISTINGS: StoredListing[] = [
  {
    id: 'listing-hyd-01',
    slug: '1rk-independent-kondapur-botanical',
    ownerId: 'owner-raghu-01',
    ownerName: 'Raghu Varma',
    ownerPhone: '+919849012345',
    ownerEmail: 'raghu.varma@example.com',
    status: 'published',
    cluster: 'kondapur',
    colonyOrSociety: 'Silpa Park Colony, near Botanical Garden',
    landmark: 'Opposite Chirec International School',
    pincode: '500084',
    title: '1 RK Independent Unit near Botanical Garden',
    description: 'Quiet, sunlit residential 1 RK with attached bathroom, modular kitchenette, and 24/7 water supply. Ideal for working professionals in HITEC City / Kondapur.',
    propertyType: '1rk',
    monthlyRent: 12000,
    securityDeposit: 24000,
    maintenanceCharges: 1000,
    isMaintenanceIncluded: false,
    lockInMonths: 6,
    noticeDays: 30,
    furnishingStatus: 'semi_furnished',
    carpetAreaSqFt: 380,
    floorNumber: 2,
    totalFloors: 4,
    availableFrom: '2026-09-01',
    petsAllowed: false,
    amenities: ['24/7 Water', 'Geyser', 'Balcony', 'Two-Wheeler Parking', 'Security CCTV'],
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
        roomTag: 'main_room',
        isCover: true,
        caption: 'Living and sleeping space',
      },
      {
        url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80',
        roomTag: 'kitchen',
        isCover: false,
        caption: 'Modular kitchenette',
      },
      {
        url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
        roomTag: 'bathroom',
        isCover: false,
        caption: 'Attached bathroom',
      },
    ],
    evidence: {
      type: 'tgspdcl_bill',
      urlOrDoc: 'evidence/listing-hyd-01/tgspdcl-verified.pdf',
      consumerNumber: 'TG-10293847',
      verified: true,
    },
    submittedAt: '2026-08-10T10:00:00.000Z',
    publishedAt: '2026-08-12T14:30:00.000Z',
    lastAvailabilityConfirmedAt: '2026-08-18T09:15:00.000Z',
    createdAt: '2026-08-10T10:00:00.000Z',
    updatedAt: '2026-08-18T09:15:00.000Z',
  },
  {
    id: 'listing-hyd-02',
    slug: '2bhk-semi-furnished-madhapur-ayyyappa',
    ownerId: 'owner-raghu-01',
    ownerName: 'Raghu Varma',
    ownerPhone: '+919849012345',
    ownerEmail: 'raghu.varma@example.com',
    status: 'published',
    cluster: 'madhapur',
    colonyOrSociety: 'Ayyappa Society, 100 Feet Road',
    landmark: 'Near Madhapur Metro Station',
    pincode: '500081',
    title: '2 BHK Semi-Furnished near Ayyappa Society',
    description: 'Spacious 2 BHK with 2 balconies, modular kitchen with chimney, covered car parking, and power backup.',
    propertyType: '2bhk',
    monthlyRent: 26000,
    securityDeposit: 52000,
    maintenanceCharges: 2500,
    isMaintenanceIncluded: false,
    lockInMonths: 11,
    noticeDays: 30,
    furnishingStatus: 'semi_furnished',
    carpetAreaSqFt: 1150,
    floorNumber: 3,
    totalFloors: 5,
    availableFrom: '2026-09-15',
    petsAllowed: true,
    amenities: ['Lift', 'Power Backup', 'Covered Car Parking', '24/7 Water', 'Security Guard', 'Balcony'],
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
        roomTag: 'main_room',
        isCover: true,
        caption: 'Sunlit living hall',
      },
      {
        url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80',
        roomTag: 'bedroom',
        isCover: false,
        caption: 'Master bedroom with wardrobe',
      },
    ],
    evidence: {
      type: 'tgspdcl_bill',
      urlOrDoc: 'evidence/listing-hyd-02/tgspdcl-madhapur.pdf',
      consumerNumber: 'TG-99482711',
      verified: true,
    },
    submittedAt: '2026-08-14T11:20:00.000Z',
    publishedAt: '2026-08-15T16:00:00.000Z',
    lastAvailabilityConfirmedAt: '2026-08-19T08:30:00.000Z',
    createdAt: '2026-08-14T11:20:00.000Z',
    updatedAt: '2026-08-19T08:30:00.000Z',
  },
  {
    id: 'listing-hyd-03',
    slug: 'private-room-colive-gachibowli',
    ownerId: 'owner-suresh-02',
    ownerName: 'Suresh Reddy',
    ownerPhone: '+919701234567',
    ownerEmail: 'suresh.reddy@example.com',
    status: 'published',
    cluster: 'gachibowli',
    colonyOrSociety: 'Telecom Nagar',
    landmark: 'Behind DLF Cyber City',
    pincode: '500032',
    title: 'Private Room in Standalone Residential Building',
    description: 'Fully furnished private room with attached bathroom, study table, high-speed Wi-Fi, and washing machine access.',
    propertyType: 'private_room',
    monthlyRent: 8500,
    securityDeposit: 17000,
    maintenanceCharges: 0,
    isMaintenanceIncluded: true,
    lockInMonths: 3,
    noticeDays: 15,
    furnishingStatus: 'fully_furnished',
    carpetAreaSqFt: 220,
    floorNumber: 1,
    totalFloors: 3,
    availableFrom: '2026-09-01',
    petsAllowed: false,
    amenities: ['High-Speed Wi-Fi', 'Washing Machine', 'Geyser', 'Air Conditioner', 'Daily Housekeeping'],
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1200&q=80',
        roomTag: 'bedroom',
        isCover: true,
        caption: 'Private room with ergonomic desk',
      },
    ],
    evidence: {
      type: 'ghmc_tax_receipt',
      urlOrDoc: 'evidence/listing-hyd-03/ghmc-receipt.pdf',
      consumerNumber: 'GHMC-44820',
      verified: true,
    },
    submittedAt: '2026-08-12T09:00:00.000Z',
    publishedAt: '2026-08-13T12:00:00.000Z',
    lastAvailabilityConfirmedAt: '2026-08-17T11:00:00.000Z',
    createdAt: '2026-08-12T09:00:00.000Z',
    updatedAt: '2026-08-17T11:00:00.000Z',
  },
  {
    id: 'listing-hyd-04',
    slug: '1bhk-manikonda-ou-colony',
    ownerId: 'owner-raghu-01',
    ownerName: 'Raghu Varma',
    ownerPhone: '+919849012345',
    ownerEmail: 'raghu.varma@example.com',
    status: 'published',
    cluster: 'manikonda',
    colonyOrSociety: 'OU Colony, Shaikpet Main Road',
    landmark: 'Near Lanco Hills Road junction',
    pincode: '500089',
    title: '1 BHK Standalone Floor near OU Colony',
    description: 'Spacious, peaceful 1 BHK on 2nd floor with dedicated modular kitchen, east-facing balcony, two-wheeler parking, and round-the-clock water supply.',
    propertyType: '1bhk',
    monthlyRent: 15000,
    securityDeposit: 30000,
    maintenanceCharges: 1200,
    isMaintenanceIncluded: false,
    lockInMonths: 6,
    noticeDays: 30,
    furnishingStatus: 'semi_furnished',
    carpetAreaSqFt: 580,
    floorNumber: 2,
    totalFloors: 4,
    availableFrom: '2026-09-01',
    petsAllowed: false,
    amenities: ['24/7 Water', 'Geyser', 'East-Facing Balcony', 'Bike Parking', 'CCTV Security', 'Inverter Wiring'],
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
        roomTag: 'main_room',
        isCover: true,
        caption: 'Living Hall with Natural Ventilation',
      },
      {
        url: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80',
        roomTag: 'bedroom',
        isCover: false,
        caption: 'Master Bedroom with Wardrobe Space',
      },
      {
        url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80',
        roomTag: 'kitchen',
        isCover: false,
        caption: 'Granite Counter Kitchenette',
      },
    ],
    evidence: {
      type: 'tgspdcl_bill',
      urlOrDoc: 'evidence/listing-hyd-04/tgspdcl-manikonda.pdf',
      consumerNumber: 'TG-77881122',
      verified: true,
    },
    submittedAt: '2026-08-14T08:00:00.000Z',
    publishedAt: '2026-08-16T10:00:00.000Z',
    lastAvailabilityConfirmedAt: '2026-08-16T10:00:00.000Z',
    createdAt: '2026-08-14T08:00:00.000Z',
    updatedAt: '2026-08-16T10:00:00.000Z',
  },
  {
    id: 'listing-hyd-05',
    slug: '3bhk-financial-district-narsingi',
    ownerId: 'owner-raghu-01',
    ownerName: 'Raghu Varma',
    ownerPhone: '+919849012345',
    ownerEmail: 'raghu.varma@example.com',
    status: 'published',
    cluster: 'financial_district',
    colonyOrSociety: 'Narsingi Outer Ring Road Enclave',
    landmark: 'Near Continental Hospital & Kokapet circle',
    pincode: '500075',
    title: '3 BHK Gated Residence near Financial District',
    description: 'Premium 3 BHK apartment in a gated residential community near Financial District and Kokapet SEZ. Features 3 bathrooms, 2 expansive balconies, modular kitchen with chimney, covered tandem parking for 2 cars, and 100% DG power backup.',
    propertyType: '3plus_bhk',
    monthlyRent: 42000,
    securityDeposit: 84000,
    maintenanceCharges: 4000,
    isMaintenanceIncluded: false,
    lockInMonths: 11,
    noticeDays: 60,
    furnishingStatus: 'unfurnished',
    carpetAreaSqFt: 1850,
    floorNumber: 8,
    totalFloors: 14,
    availableFrom: '2026-09-10',
    petsAllowed: true,
    amenities: ['Clubhouse', 'Swimming Pool', '2 Car Parking', '100% Power Backup', '24/7 Security', 'Piped Gas', 'Children Play Area', 'Gymnasium'],
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
        roomTag: 'main_room',
        isCover: true,
        caption: 'Expansive Living and Dining Area',
      },
      {
        url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
        roomTag: 'bedroom',
        isCover: false,
        caption: 'Master Bedroom Suite with Attached Bath',
      },
      {
        url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80',
        roomTag: 'kitchen',
        isCover: false,
        caption: 'Modular Kitchen with Piped Gas Line',
      },
    ],
    evidence: {
      type: 'society_noc',
      urlOrDoc: 'evidence/listing-hyd-05/society-noc.pdf',
      consumerNumber: 'NOC-9921',
      verified: true,
    },
    submittedAt: '2026-08-13T07:30:00.000Z',
    publishedAt: '2026-08-15T12:00:00.000Z',
    lastAvailabilityConfirmedAt: '2026-08-15T12:00:00.000Z',
    createdAt: '2026-08-13T07:30:00.000Z',
    updatedAt: '2026-08-15T12:00:00.000Z',
  },
  {
    id: 'listing-hyd-06',
    slug: 'shared-room-hitec-city',
    ownerId: 'owner-suresh-02',
    ownerName: 'Suresh Reddy',
    ownerPhone: '+919701234567',
    ownerEmail: 'suresh.reddy@example.com',
    status: 'published',
    cluster: 'hitec_city',
    colonyOrSociety: 'Vittal Rao Nagar, Madhapur-HITEC border',
    landmark: '500m from Cyber Towers',
    pincode: '500081',
    title: 'Dedicated Bedspace in 2 BHK Coliving Floor',
    description: 'Comfortable single bedspace in a shared 2 BHK apartment for working professionals. Walkable to Cyber Towers and Mindspace IT park. Includes high-speed Wi-Fi, air conditioning, RO water purifier, and weekly housekeeping.',
    propertyType: 'shared_room',
    monthlyRent: 6000,
    securityDeposit: 6000,
    maintenanceCharges: 500,
    isMaintenanceIncluded: false,
    lockInMonths: 3,
    noticeDays: 15,
    furnishingStatus: 'fully_furnished',
    carpetAreaSqFt: 180,
    floorNumber: 2,
    totalFloors: 4,
    availableFrom: '2026-08-22',
    petsAllowed: false,
    amenities: ['Air Conditioner', 'High-Speed Wi-Fi', 'RO Drinking Water', 'Washing Machine', 'Housekeeping', 'Geyser'],
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
        roomTag: 'bedroom',
        isCover: true,
        caption: 'Dedicated Bed with Individual Storage',
      },
      {
        url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80',
        roomTag: 'kitchen',
        isCover: false,
        caption: 'Common Kitchen with RO & Refrigerator',
      },
    ],
    evidence: {
      type: 'phone_call',
      urlOrDoc: 'evidence/listing-hyd-06/phone-verification.pdf',
      consumerNumber: 'VER-4402',
      verified: true,
    },
    submittedAt: '2026-08-12T10:00:00.000Z',
    publishedAt: '2026-08-14T11:00:00.000Z',
    lastAvailabilityConfirmedAt: '2026-08-14T11:00:00.000Z',
    createdAt: '2026-08-12T10:00:00.000Z',
    updatedAt: '2026-08-14T11:00:00.000Z',
  },
];

// Initial demo requests
const INITIAL_REQUESTS: StoredRentalRequest[] = [
  {
    id: 'req-001',
    listingId: 'listing-hyd-01',
    renterId: 'renter-ananya-01',
    renterName: 'Ananya Sharma',
    renterPhone: '+919876543210',
    renterEmail: 'ananya.sharma@example.com',
    status: 'accepted',
    intendedMoveInDate: '2026-09-05',
    rentalDurationMonths: 11,
    occupantsCount: 1,
    householdArrangement: 'individual',
    employmentCategory: 'salaried',
    optionalIntroduction: 'Hi Raghu, I am a senior software engineer at Microsoft Gachibowli looking for a quiet 1 RK close to the campus. Non-smoker, clean and punctual with rent.',
    viewedAt: '2026-08-18T10:00:00.000Z',
    respondedAt: '2026-08-18T14:30:00.000Z',
    createdAt: '2026-08-18T08:15:00.000Z',
    updatedAt: '2026-08-18T14:30:00.000Z',
  },
  {
    id: 'req-002',
    listingId: 'listing-hyd-02',
    renterId: 'renter-ananya-01',
    renterName: 'Ananya Sharma',
    renterPhone: '+919876543210',
    renterEmail: 'ananya.sharma@example.com',
    status: 'submitted',
    intendedMoveInDate: '2026-09-15',
    rentalDurationMonths: 12,
    occupantsCount: 2,
    householdArrangement: 'working_professionals',
    employmentCategory: 'salaried',
    optionalIntroduction: 'Looking to rent this 2 BHK with my colleague. Both working in IT with standard hybrid schedules.',
    createdAt: '2026-08-19T09:45:00.000Z',
    updatedAt: '2026-08-19T09:45:00.000Z',
  },
  {
    id: 'req-003',
    listingId: 'listing-hyd-01',
    renterId: 'renter-vikram-02',
    renterName: 'Vikram Mehta',
    renterPhone: '+919811223344',
    renterEmail: 'vikram.mehta@example.com',
    status: 'viewed',
    intendedMoveInDate: '2026-09-01',
    rentalDurationMonths: 6,
    occupantsCount: 1,
    householdArrangement: 'individual',
    employmentCategory: 'self_employed',
    optionalIntroduction: 'Product designer working remotely. Need a well-lit space with reliable high-speed internet connectivity.',
    viewedAt: '2026-08-19T11:00:00.000Z',
    createdAt: '2026-08-18T16:20:00.000Z',
    updatedAt: '2026-08-19T11:00:00.000Z',
  },
  {
    id: 'req-004',
    listingId: 'listing-hyd-03',
    renterId: 'renter-karthik-03',
    renterName: 'Karthik Nair',
    renterPhone: '+919944332211',
    renterEmail: 'karthik.nair@example.com',
    status: 'declined',
    intendedMoveInDate: '2026-08-25',
    rentalDurationMonths: 3,
    occupantsCount: 2,
    householdArrangement: 'students',
    employmentCategory: 'student',
    declineReason: 'Property only accommodates single occupancy for this room type.',
    respondedAt: '2026-08-18T18:00:00.000Z',
    createdAt: '2026-08-18T15:00:00.000Z',
    updatedAt: '2026-08-18T18:00:00.000Z',
  },
];

const INITIAL_UNLOCKS: StoredContactUnlock[] = [
  {
    id: 'unlock-001',
    rentalRequestId: 'req-001',
    unlockedAt: '2026-08-18T14:30:00.000Z',
  },
];

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
