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
  provider: string; // e.g. 'TSSPDCL / TGSPDCL (Southern Power)'
  consumerNumber: string; // USCNO e.g. '1029384756'
  sectionOffice: string;
  tariffCategory: string; // e.g. 'LT-I(A) Domestic'
  meterNumber: string;
  billingMonth: string;
  billedUnits: number;
  amountPaid: number;
  paymentDate: string;
  ghmcPtin?: string;
  ghmcAssessmentYear?: string;
  documentName: string;
  documentUrl: string;
  addressOnRecord: string;
  matchingAddressScore: string;
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
  utilityEvidence: UtilityEvidenceDetails;
  moderationHistory: ModerationTimelineEvent[];
}

export const INITIAL_MOCK_LISTINGS: AdminListing[] = [
  {
    id: 'lst_01_botanical',
    slug: '1rk-independent-kondapur-botanical',
    title: '1 RK Independent Unit near Botanical Garden',
    description: 'Clean, well-ventilated 1 RK independent floor unit with separate entry, attached kitchenette, private bath with geyser, and 24/7 dedicated water connection. Located 5 minutes walking from Botanical Garden main gate.',
    status: 'pending_review',
    cluster: 'kondapur',
    colonyOrSociety: 'Sri Ramnagar Colony, Block B',
    landmark: 'Opposite Botanical Garden Gate 2',
    pincode: '500084',
    exactAddress: 'Plot 42, Flat 102, Sri Ramnagar Colony Block B, Kondapur, Hyderabad 500084',
    propertyType: '1rk',
    monthlyRent: 12000,
    securityDeposit: 24000,
    maintenanceCharges: 1000,
    isMaintenanceIncluded: false,
    lockInMonths: 6,
    noticeDays: 30,
    furnishingStatus: 'semi_furnished',
    carpetAreaSqFt: 380,
    floorNumber: 1,
    totalFloors: 3,
    availableFrom: '2026-09-01',
    petsAllowed: false,
    amenities: ['water_247', 'power_backup', 'geyser', 'modular_kitchen', 'two_wheeler_parking'],
    submittedAt: '2026-08-18T14:30:00Z',
    owner: {
      id: 'usr_owner_01',
      name: 'Suresh Reddy',
      email: 'owner1@therentalcircle.in',
      phone: '+91 98490 12345',
      phoneVerified: true,
      phoneConfirmationMethod: 'founder_call',
      phoneConfirmedAt: '2026-08-18T16:00:00Z',
      phoneConfirmedBy: 'Admin Moderator (TRC Verified)',
    },
    photos: [
      {
        id: 'p1_1',
        url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
        roomTag: 'main_room',
        caption: 'Living & sleeping area with ventilation and light',
        isCover: true,
        isApproved: true,
        width: 1200,
        height: 800,
        sizeBytes: 420000,
      },
      {
        id: 'p1_2',
        url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80',
        roomTag: 'kitchen',
        caption: 'Granite counter kitchenette with sink and storage shelves',
        isCover: false,
        isApproved: true,
        width: 1200,
        height: 800,
        sizeBytes: 380000,
      },
      {
        id: 'p1_3',
        url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80',
        roomTag: 'bathroom',
        caption: 'Western toilet bathroom with 25L instant geyser installed',
        isCover: false,
        isApproved: true,
        width: 1200,
        height: 800,
        sizeBytes: 310000,
      },
      {
        id: 'p1_4',
        url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
        roomTag: 'balcony_exterior',
        caption: 'Front corridor and staircase entrance',
        isCover: false,
        isApproved: true,
        width: 1200,
        height: 800,
        sizeBytes: 490000,
      },
    ],
    verificationChecks: [
      {
        id: 'vc_01_contact',
        checkType: 'listing_contact_call',
        status: 'approved',
        evidenceType: 'phone_call',
        reviewedByUserId: 'usr_admin_01',
        reviewerNotes: 'Spoke directly with Suresh Reddy. Confirmed property ownership and availability from Sep 1.',
        verifiedAt: '2026-08-18T16:00:00Z',
      },
      {
        id: 'vc_01_utility',
        checkType: 'property_connection_evidence',
        status: 'pending',
        evidenceType: 'tgspdcl_bill',
        reviewerNotes: 'TSSPDCL electricity bill provided for July 2026. USCNO 1029384756 matches Sri Ramnagar Colony.',
      },
      {
        id: 'vc_01_review',
        checkType: 'listing_reviewed',
        status: 'pending',
        reviewerNotes: 'Awaiting moderation signoff on pricing breakdown and room photos.',
      },
    ],
    utilityEvidence: {
      provider: 'TSSPDCL / TGSPDCL (Southern Power Distribution)',
      consumerNumber: '1029384756 (USCNO)',
      sectionOffice: 'Kondapur Sub-Division (Circle 10 - Cybercity)',
      tariffCategory: 'LT-I(A) Domestic Residential',
      meterNumber: 'TSS-KD-99214',
      billingMonth: 'July 2026',
      billedUnits: 210,
      amountPaid: 1420,
      paymentDate: '2026-08-04',
      ghmcPtin: '1102938475',
      ghmcAssessmentYear: '2026-2027',
      documentName: 'TSSPDCL_Electric_Bill_July2026_Plot42.pdf',
      documentUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1200&q=80',
      addressOnRecord: 'Plot 42, Sri Ramnagar Colony, Kondapur, Serilingampally Mandal, Rangareddy Dist - 500084',
      matchingAddressScore: '100% Exact Locality & Door Match',
    },
    moderationHistory: [
      {
        id: 'mh_01',
        timestamp: '2026-08-18T14:30:00Z',
        moderatorName: 'System Intake',
        actionTaken: 'submitted',
        reason: 'Listing submitted by owner for review',
      },
      {
        id: 'mh_02',
        timestamp: '2026-08-18T16:00:00Z',
        moderatorName: 'Admin Moderator',
        actionTaken: 'submitted',
        reason: 'Phone handshake completed with property owner',
      },
    ],
  },
  {
    id: 'lst_02_madhapur',
    slug: '2bhk-semi-furnished-madhapur-ayyyappa',
    title: '2 BHK Semi-Furnished near Ayyappa Society',
    description: 'Spacious 2 BHK on the 2nd floor of a standalone gated building in Ayyappa Society. Two double bedrooms with floor-to-ceiling wardrobes, modular kitchen with chimney, and 2 modern bathrooms.',
    status: 'published',
    cluster: 'madhapur',
    colonyOrSociety: 'Ayyappa Society, Mega Hills',
    landmark: 'Near YSR Statue & Ratnadeep Supermarket',
    pincode: '500081',
    exactAddress: 'Flat 201, Srinivasa Nilayam, Road No 3, Mega Hills, Ayyappa Society, Madhapur, Hyderabad 500081',
    propertyType: '2bhk',
    monthlyRent: 26000,
    securityDeposit: 52000,
    maintenanceCharges: 2500,
    isMaintenanceIncluded: false,
    lockInMonths: 11,
    noticeDays: 30,
    furnishingStatus: 'semi_furnished',
    carpetAreaSqFt: 1150,
    floorNumber: 2,
    totalFloors: 5,
    availableFrom: '2026-08-25',
    petsAllowed: true,
    amenities: ['lift', 'power_backup', 'covered_parking', 'water_247', 'gated_security', 'modular_kitchen'],
    submittedAt: '2026-08-15T09:15:00Z',
    publishedAt: '2026-08-16T11:00:00Z',
    lastAvailabilityConfirmedAt: '2026-08-19T08:00:00Z',
    owner: {
      id: 'usr_owner_02',
      name: 'Kavitha Rao',
      email: 'kavitha.rao@gmail.com',
      phone: '+91 98499 87654',
      phoneVerified: true,
      phoneConfirmationMethod: 'founder_call',
      phoneConfirmedAt: '2026-08-15T14:20:00Z',
      phoneConfirmedBy: 'Admin Moderator (TRC Verified)',
    },
    photos: [
      {
        id: 'p2_1',
        url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
        roomTag: 'main_room',
        caption: 'Bright living and dining hall with vitrified tiles',
        isCover: true,
        isApproved: true,
      },
      {
        id: 'p2_2',
        url: 'https://images.unsplash.com/photo-1540518614846-7ede433c4ef7?auto=format&fit=crop&w=1200&q=80',
        roomTag: 'bedroom',
        caption: 'Master bedroom with built-in wooden wardrobes',
        isCover: false,
        isApproved: true,
      },
      {
        id: 'p2_3',
        url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80',
        roomTag: 'kitchen',
        caption: 'L-shaped modular kitchen with stainless steel sink',
        isCover: false,
        isApproved: true,
      },
    ],
    verificationChecks: [
      {
        id: 'vc_02_contact',
        checkType: 'listing_contact_call',
        status: 'approved',
        evidenceType: 'phone_call',
        verifiedAt: '2026-08-15T14:20:00Z',
        reviewerNotes: 'Verified owner identity and rent details.',
      },
      {
        id: 'vc_02_utility',
        checkType: 'property_connection_evidence',
        status: 'approved',
        evidenceType: 'tgspdcl_bill',
        verifiedAt: '2026-08-16T10:45:00Z',
        reviewerNotes: 'TSSPDCL record verified for Mega Hills building.',
      },
      {
        id: 'vc_02_review',
        checkType: 'listing_reviewed',
        status: 'approved',
        verifiedAt: '2026-08-16T11:00:00Z',
        reviewerNotes: 'Approved & published to public catalog.',
      },
    ],
    utilityEvidence: {
      provider: 'TSSPDCL / TGSPDCL',
      consumerNumber: '2049581729',
      sectionOffice: 'Madhapur Circle 11',
      tariffCategory: 'LT-I(A) Domestic',
      meterNumber: 'TSS-MD-44102',
      billingMonth: 'July 2026',
      billedUnits: 430,
      amountPaid: 3280,
      paymentDate: '2026-08-02',
      ghmcPtin: '1209384711',
      documentName: 'TSSPDCL_Madhapur_Ayyappa_July2026.pdf',
      documentUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1200&q=80',
      addressOnRecord: 'Flat 201, Srinivasa Nilayam, Mega Hills, Madhapur, Hyderabad 500081',
      matchingAddressScore: '100% Exact Match',
    },
    moderationHistory: [
      {
        id: 'mh_02_1',
        timestamp: '2026-08-15T09:15:00Z',
        moderatorName: 'System Intake',
        actionTaken: 'submitted',
        reason: 'Listing submitted',
      },
      {
        id: 'mh_02_2',
        timestamp: '2026-08-16T11:00:00Z',
        moderatorName: 'Admin Moderator',
        actionTaken: 'approve_listing',
        reason: 'All checks passed: TSSPDCL bill verified, owner verified',
      },
    ],
  },
  {
    id: 'lst_03_gachibowli',
    slug: 'private-room-colive-gachibowli',
    title: 'Private Room in Standalone Residential Building',
    description: 'Private furnished bedroom with attached bathroom and balcony in Telecom Nagar, Gachibowli. Ideal for working professionals commuting to DLF Cybercity or Financial District.',
    status: 'published',
    cluster: 'gachibowli',
    colonyOrSociety: 'Telecom Nagar, Lane 4',
    landmark: 'Behind Gachibowli Stadium',
    pincode: '500032',
    exactAddress: 'House 8-2/14, Telecom Nagar Lane 4, Gachibowli, Hyderabad 500032',
    propertyType: 'private_room',
    monthlyRent: 8500,
    securityDeposit: 17000,
    maintenanceCharges: 0,
    isMaintenanceIncluded: true,
    lockInMonths: 3,
    noticeDays: 30,
    furnishingStatus: 'fully_furnished',
    carpetAreaSqFt: 220,
    floorNumber: 3,
    totalFloors: 4,
    availableFrom: '2026-08-20',
    petsAllowed: false,
    amenities: ['water_247', 'power_backup', 'geyser', 'high_speed_wifi', 'two_wheeler_parking'],
    submittedAt: '2026-08-14T11:00:00Z',
    publishedAt: '2026-08-15T15:30:00Z',
    lastAvailabilityConfirmedAt: '2026-08-17T12:00:00Z',
    owner: {
      id: 'usr_owner_03',
      name: 'Venkat Raman',
      email: 'venkat.raman.hyd@gmail.com',
      phone: '+91 97000 11223',
      phoneVerified: true,
      phoneConfirmationMethod: 'founder_call',
      phoneConfirmedAt: '2026-08-14T15:00:00Z',
      phoneConfirmedBy: 'Admin Moderator (TRC Verified)',
    },
    photos: [
      {
        id: 'p3_1',
        url: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1200&q=80',
        roomTag: 'bedroom',
        caption: 'Furnished bedroom with single bed, mattress and wardrobe',
        isCover: true,
        isApproved: true,
      },
      {
        id: 'p3_2',
        url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80',
        roomTag: 'bathroom',
        caption: 'Ensuite private bathroom with geyser',
        isCover: false,
        isApproved: true,
      },
    ],
    verificationChecks: [
      {
        id: 'vc_03_contact',
        checkType: 'listing_contact_call',
        status: 'approved',
        evidenceType: 'phone_call',
        verifiedAt: '2026-08-14T15:00:00Z',
      },
      {
        id: 'vc_03_utility',
        checkType: 'property_connection_evidence',
        status: 'approved',
        evidenceType: 'tgspdcl_bill',
        verifiedAt: '2026-08-15T15:00:00Z',
      },
      {
        id: 'vc_03_review',
        checkType: 'listing_reviewed',
        status: 'approved',
        verifiedAt: '2026-08-15T15:30:00Z',
      },
    ],
    utilityEvidence: {
      provider: 'TSSPDCL / TGSPDCL',
      consumerNumber: '3094857123',
      sectionOffice: 'Gachibowli Section',
      tariffCategory: 'LT-I(A) Domestic',
      meterNumber: 'TSS-GB-77192',
      billingMonth: 'July 2026',
      billedUnits: 180,
      amountPaid: 1120,
      paymentDate: '2026-08-03',
      documentName: 'TSSPDCL_TelecomNagar_July2026.pdf',
      documentUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1200&q=80',
      addressOnRecord: 'House 8-2/14, Telecom Nagar, Gachibowli, Hyderabad 500032',
      matchingAddressScore: '100% Exact Match',
    },
    moderationHistory: [
      {
        id: 'mh_03_1',
        timestamp: '2026-08-14T11:00:00Z',
        moderatorName: 'System Intake',
        actionTaken: 'submitted',
        reason: 'Listing submitted',
      },
      {
        id: 'mh_03_2',
        timestamp: '2026-08-15T15:30:00Z',
        moderatorName: 'Admin Moderator',
        actionTaken: 'approve_listing',
        reason: 'All checks passed',
      },
    ],
  },
  {
    id: 'lst_04_manikonda',
    slug: '1bhk-manikonda-ou-colony',
    title: '1 BHK Standalone Floor near OU Colony',
    description: '1 BHK residential floor in a newly constructed standalone building. Modular kitchen, spacious hall, separate bedroom with balcony, 24/7 water supply and covered bike parking.',
    status: 'pending_review',
    cluster: 'manikonda',
    colonyOrSociety: 'OU Colony, Shaikpet border',
    landmark: 'Near Golden Temple Manikonda',
    pincode: '500089',
    exactAddress: 'Plot 88, Street 5, OU Colony, Manikonda, Hyderabad 500089',
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
    petsAllowed: true,
    amenities: ['lift', 'water_247', 'modular_kitchen', 'geyser', 'balcony'],
    submittedAt: '2026-08-19T06:45:00Z',
    owner: {
      id: 'usr_owner_04',
      name: 'Anand Kumar',
      email: 'anand.kumar.mkd@gmail.com',
      phone: '+91 99887 76655',
      phoneVerified: true,
      phoneConfirmationMethod: 'founder_call',
      phoneConfirmedAt: '2026-08-19T08:00:00Z',
      phoneConfirmedBy: 'Admin Moderator (TRC Verified)',
    },
    photos: [
      {
        id: 'p4_1',
        url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
        roomTag: 'main_room',
        caption: 'Spacious 1 BHK living room with French window balcony',
        isCover: true,
        isApproved: true,
      },
      {
        id: 'p4_2',
        url: 'https://images.unsplash.com/photo-1540518614846-7ede433c4ef7?auto=format&fit=crop&w=1200&q=80',
        roomTag: 'bedroom',
        caption: 'Bedroom with wardrobe and curtain rods',
        isCover: false,
        isApproved: true,
      },
    ],
    verificationChecks: [
      {
        id: 'vc_04_contact',
        checkType: 'listing_contact_call',
        status: 'approved',
        evidenceType: 'phone_call',
        verifiedAt: '2026-08-19T08:00:00Z',
        reviewerNotes: 'Confirmed owner listing details.',
      },
      {
        id: 'vc_04_utility',
        checkType: 'property_connection_evidence',
        status: 'pending',
        evidenceType: 'tgspdcl_bill',
        reviewerNotes: 'Pending verification of Manikonda section consumer ID.',
      },
      {
        id: 'vc_04_review',
        checkType: 'listing_reviewed',
        status: 'pending',
        reviewerNotes: 'Pending moderator final inspection.',
      },
    ],
    utilityEvidence: {
      provider: 'TSSPDCL / TGSPDCL',
      consumerNumber: '4091827364',
      sectionOffice: 'Manikonda Section Office',
      tariffCategory: 'LT-I(A) Domestic',
      meterNumber: 'TSS-MK-11029',
      billingMonth: 'July 2026',
      billedUnits: 260,
      amountPaid: 1840,
      paymentDate: '2026-08-06',
      ghmcPtin: '1409283719',
      documentName: 'TSSPDCL_Manikonda_OUColony_July.pdf',
      documentUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1200&q=80',
      addressOnRecord: 'Plot 88, Street 5, OU Colony, Manikonda, Hyderabad 500089',
      matchingAddressScore: '100% Exact Match',
    },
    moderationHistory: [
      {
        id: 'mh_04_1',
        timestamp: '2026-08-19T06:45:00Z',
        moderatorName: 'System Intake',
        actionTaken: 'submitted',
        reason: 'Listing submitted',
      },
    ],
  },
  {
    id: 'lst_05_financial',
    slug: '3bhk-financial-district-narsingi',
    title: '3 BHK Gated Residence near Financial District',
    description: '3 BHK luxury apartment in a high-rise gated community near Narsingi junction and Financial District. 100% power backup, clubhouse access, swimming pool, and 2 dedicated basement car parkings.',
    status: 'published',
    cluster: 'financial_district',
    colonyOrSociety: 'My Home Avatar / Narsingi Outer Ring Road',
    landmark: 'Near Narsingi Toll Plaza & Wipro Circle',
    pincode: '500075',
    exactAddress: 'Tower 14, Flat 1404, Puppalguda - Narsingi Main Rd, Hyderabad 500075',
    propertyType: '3plus_bhk',
    monthlyRent: 42000,
    securityDeposit: 84000,
    maintenanceCharges: 4000,
    isMaintenanceIncluded: false,
    lockInMonths: 11,
    noticeDays: 60,
    furnishingStatus: 'semi_furnished',
    carpetAreaSqFt: 1850,
    floorNumber: 14,
    totalFloors: 30,
    availableFrom: '2026-08-15',
    petsAllowed: true,
    amenities: ['lift', 'power_backup', 'covered_parking', 'water_247', 'gated_security', 'swimming_pool', 'gym'],
    submittedAt: '2026-08-12T10:00:00Z',
    publishedAt: '2026-08-13T14:00:00Z',
    lastAvailabilityConfirmedAt: '2026-08-15T10:00:00Z',
    owner: {
      id: 'usr_owner_05',
      name: 'Ramesh Chander',
      email: 'ramesh.chander.fd@gmail.com',
      phone: '+91 98480 99887',
      phoneVerified: true,
      phoneConfirmationMethod: 'founder_call',
      phoneConfirmedAt: '2026-08-12T16:00:00Z',
      phoneConfirmedBy: 'Admin Moderator (TRC Verified)',
    },
    photos: [
      {
        id: 'p5_1',
        url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
        roomTag: 'main_room',
        caption: 'Grand living room overlooking community gardens',
        isCover: true,
        isApproved: true,
      },
    ],
    verificationChecks: [
      {
        id: 'vc_05_contact',
        checkType: 'listing_contact_call',
        status: 'approved',
        evidenceType: 'phone_call',
        verifiedAt: '2026-08-12T16:00:00Z',
      },
      {
        id: 'vc_05_utility',
        checkType: 'property_connection_evidence',
        status: 'approved',
        evidenceType: 'society_noc',
        verifiedAt: '2026-08-13T12:00:00Z',
      },
      {
        id: 'vc_05_review',
        checkType: 'listing_reviewed',
        status: 'approved',
        verifiedAt: '2026-08-13T14:00:00Z',
      },
    ],
    utilityEvidence: {
      provider: 'TSSPDCL / TGSPDCL & Society NOC',
      consumerNumber: '5019283746',
      sectionOffice: 'Gachibowli Circle - Puppalguda Section',
      tariffCategory: 'LT-I(A) Domestic',
      meterNumber: 'TSS-PP-88201',
      billingMonth: 'July 2026',
      billedUnits: 580,
      amountPaid: 4620,
      paymentDate: '2026-08-01',
      ghmcPtin: '1902837461',
      documentName: 'Society_Maintenance_&_TSSPDCL_Avatar.pdf',
      documentUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1200&q=80',
      addressOnRecord: 'Tower 14, Flat 1404, Narsingi, Hyderabad 500075',
      matchingAddressScore: '100% Match',
    },
    moderationHistory: [
      {
        id: 'mh_05_1',
        timestamp: '2026-08-12T10:00:00Z',
        moderatorName: 'System Intake',
        actionTaken: 'submitted',
        reason: 'Listing submitted',
      },
      {
        id: 'mh_05_2',
        timestamp: '2026-08-13T14:00:00Z',
        moderatorName: 'Admin Moderator',
        actionTaken: 'approve_listing',
        reason: 'Gated community residence verified with maintenance receipts and utility bills',
      },
    ],
  },
  {
    id: 'lst_06_hiteccity_broker',
    slug: 'shared-room-hitec-city',
    title: 'Dedicated Bedspace in 2 BHK Coliving Floor',
    description: 'Shared accommodation bedspace in 2 BHK flat near Cyber Towers.',
    status: 'rejected',
    cluster: 'hitec_city',
    colonyOrSociety: 'Madhapur Village, near Cyber Towers',
    landmark: 'Behind Cyber Gateway',
    pincode: '500081',
    exactAddress: 'Building 12, Floor 4, Lane 2, HITEC City, Hyderabad 500081',
    propertyType: 'shared_room',
    monthlyRent: 6000,
    securityDeposit: 12000,
    maintenanceCharges: 500,
    isMaintenanceIncluded: false,
    lockInMonths: 1,
    noticeDays: 15,
    furnishingStatus: 'fully_furnished',
    carpetAreaSqFt: 180,
    floorNumber: 4,
    totalFloors: 5,
    availableFrom: '2026-08-14',
    petsAllowed: false,
    amenities: ['water_247', 'high_speed_wifi'],
    submittedAt: '2026-08-13T18:00:00Z',
    rejectionReason: 'broker_suspected',
    moderationNotes: 'Listing rejected: Representative attempted to charge a 15-day brokerage commission fee to applicant, which violates TRC Zero-Brokerage Policy.',
    owner: {
      id: 'usr_owner_06',
      name: 'Vikram Real Estate Agent',
      email: 'vikram.properties@gmail.com',
      phone: '+91 99112 23344',
      phoneVerified: true,
      phoneConfirmationMethod: 'founder_call',
      phoneConfirmedAt: '2026-08-14T10:00:00Z',
      phoneConfirmedBy: 'Admin Moderator',
    },
    photos: [
      {
        id: 'p6_1',
        url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
        roomTag: 'main_room',
        caption: 'Shared bedroom space',
        isCover: true,
        isApproved: false,
      },
    ],
    verificationChecks: [
      {
        id: 'vc_06_contact',
        checkType: 'listing_contact_call',
        status: 'rejected',
        evidenceType: 'phone_call',
        reviewerNotes: 'Contact admitted to operating commercial intermediary brokerage.',
      },
      {
        id: 'vc_06_utility',
        checkType: 'property_connection_evidence',
        status: 'rejected',
        evidenceType: 'tgspdcl_bill',
        reviewerNotes: 'No valid property ownership evidence submitted.',
      },
      {
        id: 'vc_06_review',
        checkType: 'listing_reviewed',
        status: 'rejected',
        reviewerNotes: 'Rejected under strict Zero-Brokerage policy.',
      },
    ],
    utilityEvidence: {
      provider: 'TSSPDCL / TGSPDCL',
      consumerNumber: '6029384711',
      sectionOffice: 'Madhapur Circle',
      tariffCategory: 'Commercial',
      meterNumber: 'TSS-MD-00912',
      billingMonth: 'June 2026',
      billedUnits: 120,
      amountPaid: 950,
      paymentDate: '2026-07-10',
      documentName: 'Commercial_Receipt.pdf',
      documentUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1200&q=80',
      addressOnRecord: 'Commercial Complex, HITEC City, Hyderabad',
      matchingAddressScore: 'Mismatch with residential declaration',
    },
    moderationHistory: [
      {
        id: 'mh_06_1',
        timestamp: '2026-08-13T18:00:00Z',
        moderatorName: 'System Intake',
        actionTaken: 'submitted',
        reason: 'Listing submitted',
      },
      {
        id: 'mh_06_2',
        timestamp: '2026-08-14T11:30:00Z',
        moderatorName: 'Admin Moderator',
        actionTaken: 'reject_listing',
        reason: 'Broker suspected / Commercial brokerage demanded',
        notes: 'Strict policy enforcement: No commercial brokers allowed on TRC.',
      },
    ],
  },
  {
    id: 'lst_07_kondapur_penthouse',
    slug: 'penthouse-kondapur-chirec',
    title: 'Duplex Penthouse near CHIREC International School',
    description: '3 BHK Duplex Penthouse with private terrace garden, wooden flooring in master suite, imported sanitary fittings, and panoramic views of Kondapur green zone. Direct owner listing.',
    status: 'pending_review',
    cluster: 'kondapur',
    colonyOrSociety: 'Raja Rajeshwari Nagar, CHIREC Avenue',
    landmark: 'Behind CHIREC International School',
    pincode: '500084',
    exactAddress: 'Penthouse 501 & 601, Skyview Heights, Road 4, Raja Rajeshwari Nagar, Kondapur, Hyderabad 500084',
    propertyType: 'penthouse',
    monthlyRent: 55000,
    securityDeposit: 110000,
    maintenanceCharges: 4500,
    isMaintenanceIncluded: false,
    lockInMonths: 11,
    noticeDays: 60,
    furnishingStatus: 'fully_furnished',
    carpetAreaSqFt: 2400,
    floorNumber: 5,
    totalFloors: 6,
    availableFrom: '2026-09-15',
    petsAllowed: true,
    amenities: ['lift', 'power_backup', 'covered_parking', 'water_247', 'gated_security', 'modular_kitchen', 'terrace_garden'],
    submittedAt: '2026-08-19T11:15:00Z',
    owner: {
      id: 'usr_owner_07',
      name: 'Dr. Srinivas Prasad',
      email: 'dr.sprasad.hyd@gmail.com',
      phone: '+91 98491 55667',
      phoneVerified: true,
      phoneConfirmationMethod: 'founder_call',
      phoneConfirmedAt: '2026-08-19T13:00:00Z',
      phoneConfirmedBy: 'Admin Moderator (TRC Verified)',
    },
    photos: [
      {
        id: 'p7_1',
        url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
        roomTag: 'main_room',
        caption: 'Double height ceiling penthouse living lounge',
        isCover: true,
        isApproved: true,
      },
      {
        id: 'p7_2',
        url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
        roomTag: 'balcony_exterior',
        caption: 'Private landscaped terrace garden',
        isCover: false,
        isApproved: true,
      },
    ],
    verificationChecks: [
      {
        id: 'vc_07_contact',
        checkType: 'listing_contact_call',
        status: 'approved',
        evidenceType: 'phone_call',
        verifiedAt: '2026-08-19T13:00:00Z',
        reviewerNotes: 'Verified owner identity and possession documents.',
      },
      {
        id: 'vc_07_utility',
        checkType: 'property_connection_evidence',
        status: 'pending',
        evidenceType: 'tgspdcl_bill',
        reviewerNotes: 'TSSPDCL bill submitted, awaiting inspector review.',
      },
      {
        id: 'vc_07_review',
        checkType: 'listing_reviewed',
        status: 'pending',
      },
    ],
    utilityEvidence: {
      provider: 'TSSPDCL / TGSPDCL & GHMC PTIN',
      consumerNumber: '7029184756',
      sectionOffice: 'Kondapur Circle 10',
      tariffCategory: 'LT-I(A) Domestic',
      meterNumber: 'TSS-KD-77401',
      billingMonth: 'July 2026',
      billedUnits: 620,
      amountPaid: 5120,
      paymentDate: '2026-08-05',
      ghmcPtin: '1702938481',
      ghmcAssessmentYear: '2026-2027',
      documentName: 'TSSPDCL_&_GHMC_SkyviewHeights.pdf',
      documentUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1200&q=80',
      addressOnRecord: 'Penthouse 501, Skyview Heights, Raja Rajeshwari Nagar, Kondapur, Hyderabad 500084',
      matchingAddressScore: '100% Exact Match',
    },
    moderationHistory: [
      {
        id: 'mh_07_1',
        timestamp: '2026-08-19T11:15:00Z',
        moderatorName: 'System Intake',
        actionTaken: 'submitted',
        reason: 'Listing submitted',
      },
    ],
  },
];

// Global in-memory mutable store for development & mock API routes
let mutableListings: AdminListing[] = [...INITIAL_MOCK_LISTINGS];

export function getAllAdminListings(): AdminListing[] {
  return mutableListings;
}

export function getAdminListingById(idOrSlug: string): AdminListing | undefined {
  if (!idOrSlug) return undefined;
  const clean = decodeURIComponent(idOrSlug).trim().toLowerCase();
  
  // 1. Direct match
  const direct = mutableListings.find(l => l.id.toLowerCase() === clean || l.slug.toLowerCase() === clean);
  if (direct) return direct;

  // 2. Map aliases
  const aliasMap: Record<string, string> = {
    "admin_lst_001": "lst_01_botanical",
    "admin_lst_002": "lst_02_ayyappa",
    "admin_lst_003": "lst_03_gachibowli",
    "admin_lst_004": "lst_04_manikonda",
    "admin_lst_005": "lst_05_financial_district",
    "admin_lst_006": "lst_06_ou_colony",
    "admin_lst_007": "lst_07_gated_hitec",
    "listing-hyd-01": "lst_01_botanical",
    "listing-hyd-02": "lst_03_gachibowli",
    "listing-hyd-03": "lst_02_ayyappa",
    "listing-hyd-04": "lst_04_manikonda",
    "listing-hyd-05": "lst_05_financial_district",
    "listing-hyd-06": "lst_07_gated_hitec",
    "lst_1rk_kondapur": "lst_01_botanical",
    "lst_room_gachibowli": "lst_03_gachibowli",
    "lst_2bhk_madhapur": "lst_02_ayyappa",
    "lst_3bhk_manikonda": "lst_04_manikonda",
    "lst_2bhk_fd": "lst_05_financial_district",
    "lst_1bhk_hitec": "lst_07_gated_hitec"
  };

  const targetId = aliasMap[clean];
  if (targetId) {
    const found = mutableListings.find(l => l.id === targetId);
    if (found) return found;
  }

  // 3. Fallback: match by partial slug or cluster
  return mutableListings.find(l => clean.includes(l.cluster) || l.title.toLowerCase().includes(clean));
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
  moderatorName: string = 'Admin Moderator',
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
    reviewedByUserId: 'usr_admin_01',
    reviewerNotes: check.reviewerNotes || 'Approved by admin moderation',
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
  moderatorName: string = 'Admin Moderator'
): AdminListing | null {
  const listingIndex = mutableListings.findIndex(l => l.id === id || l.slug === id);
  if (listingIndex === -1) return null;

  const now = new Date().toISOString();
  const current = mutableListings[listingIndex];

  const updatedChecks = current.verificationChecks.map(check => ({
    ...check,
    status: (check.status === 'approved' ? 'approved' : 'rejected') as 'pending' | 'approved' | 'rejected',
    verifiedAt: now,
    reviewedByUserId: 'usr_admin_01',
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
  moderatorName: string = 'Admin Moderator'
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
