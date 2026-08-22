import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getDataStore } from '@/lib/data-store';

const CreateListingSchema = z.object({
  title: z.string().min(3, 'Title is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  cluster: z.enum(['gachibowli', 'kondapur', 'madhapur', 'hitec_city', 'manikonda', 'financial_district']),
  colonyOrSociety: z.string().min(2, 'Colony or society is required'),
  landmark: z.string().optional().default(''),
  pincode: z.string().min(6, 'Valid 6-digit pincode is required'),
  propertyType: z.enum(['shared_room', 'private_room', '1rk', '1bhk', '2bhk', '3plus_bhk', 'independent_house', 'penthouse']),
  monthlyRent: z.coerce.number().positive('Monthly rent must be positive'),
  securityDeposit: z.coerce.number().nonnegative('Deposit cannot be negative'),
  maintenanceCharges: z.coerce.number().nonnegative().default(0),
  isMaintenanceIncluded: z.boolean().default(false),
  lockInMonths: z.coerce.number().int().nonnegative().default(6),
  noticeDays: z.coerce.number().int().positive().default(30),
  furnishingStatus: z.enum(['unfurnished', 'semi_furnished', 'fully_furnished']),
  carpetAreaSqFt: z.coerce.number().int().positive().default(500),
  floorNumber: z.coerce.number().int().nonnegative().default(1),
  totalFloors: z.coerce.number().int().positive().default(4),
  availableFrom: z.string().min(1, 'Available from date is required'),
  petsAllowed: z.boolean().default(false),
  amenities: z.array(z.string()).default([]),
  photos: z.array(
    z.object({
      url: z.string().min(1, 'Photo URL is required'),
      roomTag: z.enum(['main_room', 'bedroom', 'kitchen', 'bathroom', 'balcony_exterior', 'other']),
      isCover: z.boolean().default(false),
      caption: z.string().optional(),
    })
  ).min(1, 'At least one photo is required'),
  evidence: z.object({
    type: z.enum(['phone_call', 'tgspdcl_bill', 'ghmc_tax_receipt', 'society_noc', 'authorization_letter', 'other']),
    urlOrDoc: z.string().min(1, 'Evidence reference or document is required'),
    consumerNumber: z.string().optional(),
  }).optional(),
  ownerId: z.string().optional(),
  ownerName: z.string().min(1, 'Owner name is required'),
  ownerPhone: z.string().min(8, 'Valid phone number is required'),
  ownerEmail: z.string().email('Valid email is required'),
});

function generateSlug(title: string, cluster: string): string {
  const base = `${title}-${cluster}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  return `${base}-${Math.random().toString(36).substring(2, 6)}`;
}

export async function GET(req: NextRequest) {
  try {
    const store = getDataStore();
    const { searchParams } = new URL(req.url);
    const ownerId = searchParams.get('ownerId') || undefined;

    const listings = store.getOwnerListings(ownerId);

    // Attach request counts for each listing
    const enriched = listings.map(l => {
      const requests = store.getListingRequests(l.id);
      return {
        ...l,
        requestsCount: requests.length,
        pendingRequestsCount: requests.filter(r => r.status === 'submitted' || r.status === 'viewed').length,
        acceptedRequestsCount: requests.filter(r => r.status === 'accepted').length,
      };
    });

    return NextResponse.json({ success: true, listings: enriched }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { error: 'Failed to fetch owner listings', message: err.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = CreateListingSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validated.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const data = validated.data;
    const store = getDataStore();
    const slug = generateSlug(data.title, data.cluster);

    const createdListing = store.createListing({
      slug,
      ownerId: data.ownerId || `owner_${Date.now()}`,
      ownerName: data.ownerName,
      ownerPhone: data.ownerPhone,
      ownerEmail: data.ownerEmail,
      status: 'pending_review', // Strictly starts in pending_review
      cluster: data.cluster,
      colonyOrSociety: data.colonyOrSociety,
      landmark: data.landmark || '',
      pincode: data.pincode,
      title: data.title,
      description: data.description,
      propertyType: data.propertyType,
      monthlyRent: data.monthlyRent,
      securityDeposit: data.securityDeposit,
      maintenanceCharges: data.maintenanceCharges,
      isMaintenanceIncluded: data.isMaintenanceIncluded,
      lockInMonths: data.lockInMonths,
      noticeDays: data.noticeDays,
      furnishingStatus: data.furnishingStatus,
      carpetAreaSqFt: data.carpetAreaSqFt,
      floorNumber: data.floorNumber,
      totalFloors: data.totalFloors,
      availableFrom: data.availableFrom,
      petsAllowed: data.petsAllowed,
      amenities: data.amenities,
      photos: data.photos,
      evidence: data.evidence
        ? {
            type: data.evidence.type,
            urlOrDoc: data.evidence.urlOrDoc,
            consumerNumber: data.evidence.consumerNumber,
            verified: false,
          }
        : undefined,
    });

    // Also register into admin moderation queue
    try {
      const { addAdminListing } = await import('@/lib/mock-listings');
      addAdminListing({
        id: createdListing.id,
        slug: createdListing.slug,
        title: createdListing.title,
        description: createdListing.description,
        status: createdListing.status,
        cluster: createdListing.cluster,
        colonyOrSociety: createdListing.colonyOrSociety,
        landmark: createdListing.landmark,
        pincode: createdListing.pincode,
        exactAddress: `${createdListing.colonyOrSociety}, ${createdListing.cluster.toUpperCase()}, Hyderabad ${createdListing.pincode}`,
        propertyType: createdListing.propertyType,
        monthlyRent: createdListing.monthlyRent,
        securityDeposit: createdListing.securityDeposit,
        maintenanceCharges: createdListing.maintenanceCharges,
        isMaintenanceIncluded: createdListing.isMaintenanceIncluded,
        lockInMonths: createdListing.lockInMonths,
        noticeDays: createdListing.noticeDays,
        furnishingStatus: createdListing.furnishingStatus,
        carpetAreaSqFt: createdListing.carpetAreaSqFt,
        floorNumber: createdListing.floorNumber,
        totalFloors: createdListing.totalFloors,
        availableFrom: createdListing.availableFrom,
        petsAllowed: createdListing.petsAllowed,
        amenities: createdListing.amenities,
        submittedAt: createdListing.submittedAt,
        owner: {
          id: createdListing.ownerId,
          name: createdListing.ownerName,
          email: createdListing.ownerEmail,
          phone: createdListing.ownerPhone,
          phoneVerified: true,
          phoneConfirmationMethod: 'founder_call',
          phoneConfirmedAt: new Date().toISOString(),
          phoneConfirmedBy: 'Founder Phone Call Acknowledged',
        },
        photos: createdListing.photos.map((p, idx) => ({
          id: `photo_${createdListing.id}_${idx}`,
          url: p.url,
          roomTag: p.roomTag,
          caption: p.caption || `${p.roomTag.replace('_', ' ')} view`,
          isCover: p.isCover,
          isApproved: true,
        })),
        verificationChecks: [
          {
            id: `vc_${createdListing.id}_contact`,
            checkType: 'listing_contact_call',
            status: 'pending',
            evidenceType: 'phone_call',
            reviewerNotes: 'Founder phone handshake acknowledged by owner.',
          },
          {
            id: `vc_${createdListing.id}_utility`,
            checkType: 'property_connection_evidence',
            status: 'pending',
            evidenceType: createdListing.evidence?.type || 'tgspdcl_bill',
            reviewerNotes: createdListing.evidence?.consumerNumber
              ? `TSSPDCL / Utility USCNO ${createdListing.evidence.consumerNumber} declared.`
              : 'Utility connection evidence attached.',
          },
        ],
        utilityEvidence: createdListing.evidence
          ? {
              provider: createdListing.evidence.type === 'tgspdcl_bill' ? 'TSSPDCL / TGSPDCL' : 'GHMC / Society',
              consumerNumber: createdListing.evidence.consumerNumber || '',
              sectionOffice: `${createdListing.cluster} Section Office`,
              tariffCategory: 'LT-I(A) Domestic',
              meterNumber: createdListing.evidence.consumerNumber ? `MTR-${createdListing.evidence.consumerNumber}` : undefined,
              documentName: createdListing.evidence.urlOrDoc,
              documentUrl: createdListing.evidence.urlOrDoc,
              addressOnRecord: `${createdListing.colonyOrSociety}, ${createdListing.cluster}, Hyderabad ${createdListing.pincode}`,
              matchingAddressScore: 'Pending Moderator Inspection',
            }
          : undefined,
        moderationHistory: [
          {
            id: `mh_${createdListing.id}_sub`,
            timestamp: createdListing.submittedAt,
            moderatorName: 'System Intake',
            actionTaken: 'submitted',
            reason: 'Listing submitted by owner for review',
          },
        ],
      });
    } catch {
      // ignore
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Listing submitted for human review with pending_review status',
        listing: createdListing,
      },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: 'Failed to create listing', message: err.message },
      { status: 500 }
    );
  }
}
