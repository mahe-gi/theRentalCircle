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

// Initial Seed Data for Hyderabad Pilot
const SEED_USERS: Record<string, User> = {
  'usr_admin_1': {
    id: 'usr_admin_1',
    name: 'Founder / Moderator',
    email: 'admin@therentalcircle.in',
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
  'usr_owner_1': {
    id: 'usr_owner_1',
    name: 'Suresh Reddy',
    email: 'owner1@therentalcircle.in',
    emailVerified: true,
    image: null,
    role: 'user',
    phoneHash: 'hash_owner_1',
    encryptedPhone: 'enc_9849012345',
    phoneVerified: true,
    phoneConfirmedAt: new Date(),
    phoneConfirmedBy: 'founder',
    phoneConfirmationMethod: 'founder_call',
    isBanned: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  'usr_renter_1': {
    id: 'usr_renter_1',
    name: 'Ananya Sharma',
    email: 'renter1@therentalcircle.in',
    emailVerified: true,
    image: null,
    role: 'user',
    phoneHash: 'hash_renter_1',
    encryptedPhone: 'enc_9988776655',
    phoneVerified: true,
    phoneConfirmedAt: new Date(),
    phoneConfirmedBy: 'system',
    phoneConfirmationMethod: 'whatsapp_check',
    isBanned: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
};

let MOCK_LISTINGS: ExtendedListing[] = [
  {
    id: 'lst_1rk_kondapur',
    ownerId: 'usr_owner_1',
    slug: '1rk-independent-kondapur-botanical',
    status: 'published',
    cluster: 'kondapur',
    colonyOrSociety: 'Near Botanical Garden Road',
    landmark: 'Behind Chirec School',
    pincode: '500084',
    encryptedExactAddress: 'Flat 204, Green Leaves Residency, Kondapur',
    title: '1 RK Independent Unit near Botanical Garden',
    description: 'Clean, well-ventilated 1 RK standalone floor with attached modular kitchenette and private balcony. Located 5 minutes from Botanical Garden and 15 mins from HITEC City Cyber Towers.',
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
    availableFrom: new Date('2026-09-01'),
    petsAllowed: false,
    moderationNotes: 'Phone call verified with owner Suresh. TSSPDCL consumer number matched.',
    rejectionReason: null,
    submittedAt: new Date('2026-08-16'),
    publishedAt: new Date('2026-08-18'),
    lastAvailabilityConfirmedAt: new Date('2026-08-18'),
    createdAt: new Date('2026-08-16'),
    updatedAt: new Date('2026-08-18'),
    media: [
      {
        id: 'med_1',
        listingId: 'lst_1rk_kondapur',
        approvedR2Key: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
        roomTag: 'bedroom',
        caption: 'Living and Sleeping Area',
        displayOrder: 0,
        isCover: true,
        isApproved: true,
        width: 1200,
        height: 800,
        sizeBytes: 150000,
        createdAt: new Date(),
      },
      {
        id: 'med_2',
        listingId: 'lst_1rk_kondapur',
        approvedR2Key: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80',
        roomTag: 'kitchen',
        caption: 'Modular Kitchenette',
        displayOrder: 1,
        isCover: false,
        isApproved: true,
        width: 800,
        height: 600,
        sizeBytes: 120000,
        createdAt: new Date(),
      },
      {
        id: 'med_3',
        listingId: 'lst_1rk_kondapur',
        approvedR2Key: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
        roomTag: 'bathroom',
        caption: 'Attached Bathroom',
        displayOrder: 2,
        isCover: false,
        isApproved: true,
        width: 800,
        height: 600,
        sizeBytes: 110000,
        createdAt: new Date(),
      },
    ],
    amenities: ['Power Backup', '24/7 Water', 'Geyser', 'Wardrobe', 'Bike Parking', 'Wi-Fi Ready'],
    verificationChecks: [
      {
        id: 'chk_1',
        listingId: 'lst_1rk_kondapur',
        checkType: 'listing_contact_call',
        status: 'approved',
        evidenceType: 'phone_call',
        reviewedByUserId: 'usr_admin_1',
        reviewerNotes: 'Spoke directly with owner Suresh Reddy. Confirmed lease terms.',
        verifiedAt: new Date('2026-08-18'),
        createdAt: new Date('2026-08-16'),
      },
      {
        id: 'chk_2',
        listingId: 'lst_1rk_kondapur',
        checkType: 'property_connection_evidence',
        status: 'approved',
        evidenceType: 'tgspdcl_bill',
        reviewedByUserId: 'usr_admin_1',
        reviewerNotes: 'TSSPDCL electricity connection record verified for Kondapur locality.',
        verifiedAt: new Date('2026-08-18'),
        createdAt: new Date('2026-08-16'),
      },
    ],
    owner: {
      name: 'Suresh Reddy',
      email: 'owner1@therentalcircle.in',
      phone: '+91 98490 12345',
    },
  },
  {
    id: 'lst_2bhk_madhapur',
    ownerId: 'usr_owner_1',
    slug: '2bhk-semi-furnished-madhapur-ayyyappa',
    status: 'published',
    cluster: 'madhapur',
    colonyOrSociety: 'Ayyappa Society, Mega Hills',
    landmark: 'Near D-Mart Madhapur',
    pincode: '500081',
    encryptedExactAddress: 'Flat 301, Sri Sai Heights, Ayyappa Society',
    title: '2 BHK Semi-Furnished near Ayyappa Society',
    description: 'Spacious 2 BHK on the 3rd floor with cross ventilation, wooden wardrobes in both bedrooms, covered car parking, and 100% power backup. 10 mins to Inorbit Mall.',
    propertyType: '2bhk',
    monthlyRent: 26000,
    securityDeposit: 52000,
    maintenanceCharges: 2500,
    isMaintenanceIncluded: false,
    lockInMonths: 6,
    noticeDays: 30,
    furnishingStatus: 'semi_furnished',
    carpetAreaSqFt: 1150,
    floorNumber: 3,
    totalFloors: 5,
    availableFrom: new Date('2026-08-25'),
    petsAllowed: true,
    moderationNotes: 'Phone call verified. GHMC property tax receipt checked.',
    rejectionReason: null,
    submittedAt: new Date('2026-08-17'),
    publishedAt: new Date('2026-08-19'),
    lastAvailabilityConfirmedAt: new Date('2026-08-19'),
    createdAt: new Date('2026-08-17'),
    updatedAt: new Date('2026-08-19'),
    media: [
      {
        id: 'med_2bhk_1',
        listingId: 'lst_2bhk_madhapur',
        approvedR2Key: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
        roomTag: 'main_room',
        caption: 'Living Room with Balcony',
        displayOrder: 0,
        isCover: true,
        isApproved: true,
        width: 1200,
        height: 800,
        sizeBytes: 160000,
        createdAt: new Date(),
      },
    ],
    amenities: ['Lift', 'Car Parking', 'Power Backup', 'Security Guard', 'Water Purifier', 'Wardrobes'],
    verificationChecks: [
      {
        id: 'chk_2bhk_1',
        listingId: 'lst_2bhk_madhapur',
        checkType: 'listing_contact_call',
        status: 'approved',
        evidenceType: 'phone_call',
        reviewedByUserId: 'usr_admin_1',
        reviewerNotes: 'Owner confirmed rent and deposit terms.',
        verifiedAt: new Date('2026-08-19'),
        createdAt: new Date('2026-08-17'),
      },
    ],
    owner: {
      name: 'Suresh Reddy',
      email: 'owner1@therentalcircle.in',
      phone: '+91 98490 12345',
    },
  },
  {
    id: 'lst_colive_gachibowli',
    ownerId: 'usr_owner_1',
    slug: 'private-room-colive-gachibowli',
    status: 'published',
    cluster: 'gachibowli',
    colonyOrSociety: 'Telecom Nagar',
    landmark: 'Near DLF Cyber City gate 3',
    pincode: '500032',
    encryptedExactAddress: 'House 45, Lane 2, Telecom Nagar',
    title: 'Private Room in Standalone Residential Building',
    description: 'Private AC bedroom with attached washroom in a standalone 3-floor building. Includes high-speed Wi-Fi, washing machine access, and daily common area housekeeping.',
    propertyType: 'private_room',
    monthlyRent: 8500,
    securityDeposit: 8500,
    maintenanceCharges: 0,
    isMaintenanceIncluded: true,
    lockInMonths: 3,
    noticeDays: 15,
    furnishingStatus: 'fully_furnished',
    carpetAreaSqFt: 220,
    floorNumber: 1,
    totalFloors: 3,
    availableFrom: new Date('2026-08-20'),
    petsAllowed: false,
    moderationNotes: 'Phone verified with owner.',
    rejectionReason: null,
    submittedAt: new Date('2026-08-15'),
    publishedAt: new Date('2026-08-17'),
    lastAvailabilityConfirmedAt: new Date('2026-08-17'),
    createdAt: new Date('2026-08-15'),
    updatedAt: new Date('2026-08-17'),
    media: [
      {
        id: 'med_colive_1',
        listingId: 'lst_colive_gachibowli',
        approvedR2Key: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1200&q=80',
        roomTag: 'bedroom',
        caption: 'Furnished Bedroom',
        displayOrder: 0,
        isCover: true,
        isApproved: true,
        width: 1200,
        height: 800,
        sizeBytes: 140000,
        createdAt: new Date(),
      },
    ],
    amenities: ['AC', 'Wi-Fi', 'Washing Machine', 'Refrigerator', 'Power Backup', 'Cleaning Service'],
    verificationChecks: [
      {
        id: 'chk_colive_1',
        listingId: 'lst_colive_gachibowli',
        checkType: 'listing_contact_call',
        status: 'approved',
        evidenceType: 'phone_call',
        reviewedByUserId: 'usr_admin_1',
        reviewerNotes: 'Verified contact and single room occupancy guideline.',
        verifiedAt: new Date('2026-08-17'),
        createdAt: new Date('2026-08-15'),
      },
    ],
    owner: {
      name: 'Suresh Reddy',
      email: 'owner1@therentalcircle.in',
      phone: '+91 98490 12345',
    },
  },
  {
    id: 'lst_1bhk_manikonda',
    ownerId: 'usr_owner_1',
    slug: '1bhk-manikonda-ou-colony',
    status: 'published',
    cluster: 'manikonda',
    colonyOrSociety: 'OU Colony, Shaikpet Main Road',
    landmark: 'Near Lanco Hills Road junction',
    pincode: '500089',
    encryptedExactAddress: 'Flat 202, Sri Venkateshwara Nilayam, OU Colony, Manikonda',
    title: '1 BHK Standalone Floor near OU Colony',
    description: 'Spacious, peaceful 1 BHK on 2nd floor with dedicated modular kitchen, east-facing balcony, two-wheeler parking, and round-the-clock water supply. Quick 10-minute commute to Raidurg and Manikonda IT corridor.',
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
    availableFrom: new Date('2026-09-01'),
    petsAllowed: false,
    moderationNotes: 'Phone call verified with owner Suresh Reddy. TSSPDCL consumer number checked.',
    rejectionReason: null,
    submittedAt: new Date('2026-08-14'),
    publishedAt: new Date('2026-08-16'),
    lastAvailabilityConfirmedAt: new Date('2026-08-16'),
    createdAt: new Date('2026-08-14'),
    updatedAt: new Date('2026-08-16'),
    media: [
      {
        id: 'med_manikonda_1',
        listingId: 'lst_1bhk_manikonda',
        approvedR2Key: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
        roomTag: 'main_room',
        caption: 'Living Hall with Natural Ventilation',
        displayOrder: 0,
        isCover: true,
        isApproved: true,
        width: 1200,
        height: 800,
        sizeBytes: 155000,
        createdAt: new Date(),
      },
      {
        id: 'med_manikonda_2',
        listingId: 'lst_1bhk_manikonda',
        approvedR2Key: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80',
        roomTag: 'bedroom',
        caption: 'Master Bedroom with Wardrobe Space',
        displayOrder: 1,
        isCover: false,
        isApproved: true,
        width: 800,
        height: 600,
        sizeBytes: 125000,
        createdAt: new Date(),
      },
      {
        id: 'med_manikonda_3',
        listingId: 'lst_1bhk_manikonda',
        approvedR2Key: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80',
        roomTag: 'kitchen',
        caption: 'Granite Counter Kitchenette',
        displayOrder: 2,
        isCover: false,
        isApproved: true,
        width: 800,
        height: 600,
        sizeBytes: 115000,
        createdAt: new Date(),
      },
    ],
    amenities: ['24/7 Water', 'Geyser', 'East-Facing Balcony', 'Bike Parking', 'CCTV Security', 'Inverter Wiring'],
    verificationChecks: [
      {
        id: 'chk_manikonda_1',
        listingId: 'lst_1bhk_manikonda',
        checkType: 'listing_contact_call',
        status: 'approved',
        evidenceType: 'phone_call',
        reviewedByUserId: 'usr_admin_1',
        reviewerNotes: 'Spoke directly with owner. Confirmed rent and terms.',
        verifiedAt: new Date('2026-08-16'),
        createdAt: new Date('2026-08-14'),
      },
      {
        id: 'chk_manikonda_2',
        listingId: 'lst_1bhk_manikonda',
        checkType: 'property_connection_evidence',
        status: 'approved',
        evidenceType: 'tgspdcl_bill',
        reviewedByUserId: 'usr_admin_1',
        reviewerNotes: 'TSSPDCL electricity bill consumer service number matched for OU Colony Manikonda.',
        verifiedAt: new Date('2026-08-16'),
        createdAt: new Date('2026-08-14'),
      },
    ],
    owner: {
      name: 'Suresh Reddy',
      email: 'owner1@therentalcircle.in',
      phone: '+91 98490 12345',
    },
  },
  {
    id: 'lst_3bhk_financial_district',
    ownerId: 'usr_owner_1',
    slug: '3bhk-financial-district-narsingi',
    status: 'published',
    cluster: 'financial_district',
    colonyOrSociety: 'Narsingi Outer Ring Road Enclave',
    landmark: 'Near Continental Hospital & Kokapet circle',
    pincode: '500075',
    encryptedExactAddress: 'Tower 4, Flat 802, Prestige High Fields Enclave, Narsingi',
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
    availableFrom: new Date('2026-09-10'),
    petsAllowed: true,
    moderationNotes: 'Phone call verified with owner. Society NOC and maintenance ledger confirmed.',
    rejectionReason: null,
    submittedAt: new Date('2026-08-13'),
    publishedAt: new Date('2026-08-15'),
    lastAvailabilityConfirmedAt: new Date('2026-08-15'),
    createdAt: new Date('2026-08-13'),
    updatedAt: new Date('2026-08-15'),
    media: [
      {
        id: 'med_fd_1',
        listingId: 'lst_3bhk_financial_district',
        approvedR2Key: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
        roomTag: 'main_room',
        caption: 'Expansive Living and Dining Area',
        displayOrder: 0,
        isCover: true,
        isApproved: true,
        width: 1200,
        height: 800,
        sizeBytes: 190000,
        createdAt: new Date(),
      },
      {
        id: 'med_fd_2',
        listingId: 'lst_3bhk_financial_district',
        approvedR2Key: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
        roomTag: 'bedroom',
        caption: 'Master Bedroom Suite with Attached Bath',
        displayOrder: 1,
        isCover: false,
        isApproved: true,
        width: 800,
        height: 600,
        sizeBytes: 145000,
        createdAt: new Date(),
      },
      {
        id: 'med_fd_3',
        listingId: 'lst_3bhk_financial_district',
        approvedR2Key: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80',
        roomTag: 'kitchen',
        caption: 'Modular Kitchen with Piped Gas Line',
        displayOrder: 2,
        isCover: false,
        isApproved: true,
        width: 800,
        height: 600,
        sizeBytes: 130000,
        createdAt: new Date(),
      },
    ],
    amenities: ['Clubhouse', 'Swimming Pool', '2 Car Parking', '100% Power Backup', '24/7 Security', 'Piped Gas', 'Children Play Area', 'Gymnasium'],
    verificationChecks: [
      {
        id: 'chk_fd_1',
        listingId: 'lst_3bhk_financial_district',
        checkType: 'listing_contact_call',
        status: 'approved',
        evidenceType: 'phone_call',
        reviewedByUserId: 'usr_admin_1',
        reviewerNotes: 'Spoke directly with owner Suresh Reddy. Terms confirmed.',
        verifiedAt: new Date('2026-08-15'),
        createdAt: new Date('2026-08-13'),
      },
      {
        id: 'chk_fd_2',
        listingId: 'lst_3bhk_financial_district',
        checkType: 'property_connection_evidence',
        status: 'approved',
        evidenceType: 'society_noc',
        reviewedByUserId: 'usr_admin_1',
        reviewerNotes: 'Society maintenance and ownership records verified.',
        verifiedAt: new Date('2026-08-15'),
        createdAt: new Date('2026-08-13'),
      },
    ],
    owner: {
      name: 'Suresh Reddy',
      email: 'owner1@therentalcircle.in',
      phone: '+91 98490 12345',
    },
  },
  {
    id: 'lst_shared_hitec',
    ownerId: 'usr_owner_1',
    slug: 'shared-room-hitec-city',
    status: 'published',
    cluster: 'hitec_city',
    colonyOrSociety: 'Vittal Rao Nagar, Madhapur-HITEC border',
    landmark: '500m from Cyber Towers',
    pincode: '500081',
    encryptedExactAddress: 'Plot 18, Flat 101, Sai Residency, Vittal Rao Nagar',
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
    availableFrom: new Date('2026-08-22'),
    petsAllowed: false,
    moderationNotes: 'Phone call verified with owner Suresh Reddy. Zero brokerage confirmed.',
    rejectionReason: null,
    submittedAt: new Date('2026-08-12'),
    publishedAt: new Date('2026-08-14'),
    lastAvailabilityConfirmedAt: new Date('2026-08-14'),
    createdAt: new Date('2026-08-12'),
    updatedAt: new Date('2026-08-14'),
    media: [
      {
        id: 'med_hitec_1',
        listingId: 'lst_shared_hitec',
        approvedR2Key: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
        roomTag: 'bedroom',
        caption: 'Dedicated Bed with Individual Storage',
        displayOrder: 0,
        isCover: true,
        isApproved: true,
        width: 1200,
        height: 800,
        sizeBytes: 140000,
        createdAt: new Date(),
      },
      {
        id: 'med_hitec_2',
        listingId: 'lst_shared_hitec',
        approvedR2Key: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80',
        roomTag: 'kitchen',
        caption: 'Common Kitchen with RO & Refrigerator',
        displayOrder: 1,
        isCover: false,
        isApproved: true,
        width: 800,
        height: 600,
        sizeBytes: 110000,
        createdAt: new Date(),
      },
    ],
    amenities: ['Air Conditioner', 'High-Speed Wi-Fi', 'RO Drinking Water', 'Washing Machine', 'Housekeeping', 'Geyser'],
    verificationChecks: [
      {
        id: 'chk_hitec_1',
        listingId: 'lst_shared_hitec',
        checkType: 'listing_contact_call',
        status: 'approved',
        evidenceType: 'phone_call',
        reviewedByUserId: 'usr_admin_1',
        reviewerNotes: 'Verified contact and shared coliving rules.',
        verifiedAt: new Date('2026-08-14'),
        createdAt: new Date('2026-08-12'),
      },
    ],
    owner: {
      name: 'Suresh Reddy',
      email: 'owner1@therentalcircle.in',
      phone: '+91 98490 12345',
    },
  },
];

let MOCK_REQUESTS: ExtendedRentalRequest[] = [
  {
    id: 'req_demo_1',
    listingId: 'lst_1rk_kondapur',
    renterId: 'usr_renter_1',
    status: 'submitted',
    intendedMoveInDate: new Date('2026-09-01'),
    rentalDurationMonths: 11,
    occupantsCount: 1,
    householdArrangement: 'individual',
    employmentCategory: 'salaried',
    petsDescription: null,
    optionalIntroduction: 'Hi Suresh, I am a frontend engineer working at Microsoft Gachibowli. Looking for a quiet 1 RK near Botanical Garden. Would love to schedule a visit.',
    viewedAt: null,
    respondedAt: null,
    declineReason: null,
    createdAt: new Date('2026-08-19'),
    updatedAt: new Date('2026-08-19'),
    listingTitle: '1 RK Independent Unit near Botanical Garden',
    listingSlug: '1rk-independent-kondapur-botanical',
    listingRent: 12000,
    ownerName: 'Suresh Reddy',
    ownerPhone: '+91 98490 12345',
    renterName: 'Ananya Sharma',
    renterEmail: 'renter1@therentalcircle.in',
    renterPhone: '+91 99887 76655',
  },
];

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
